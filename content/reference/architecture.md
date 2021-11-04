---
title: Architecture
---

# Architecture

## Overview

Dolt presents familiar interfaces insofar as users consider Git and SQL familiar. The command line interface \(CLI\) is Git-like, and the query interface is SQL. When we say Dolt is a SQL database, we mean that Dolt can run a server that presents SQL semantics. In particular we aim to implement a superset of the MySQL dialect standard by standing up a MySQL compatible server written in Go. This greatly reduces the overhead of integrating Dolt with existing database infrastructure. This document explores the design decisions that were made in order for Dolt to be feasibly present these two interfaces. You can can read more about the particulars of our SQL interface in this [document](../interfaces/sql/). In that document we layout the current and planned scope of our MySQL support, and the unique functions implemented to interact with Dolt's version control model.

Traditional database systems have a single and centralized version of "truth", namely the value of any given datapoint is its value when the most recent transaction committed. The presented data structure offers no concept of versions. This is fine for many application backing stores, but it is not good for facilitating distribution and collaboration. Distributed version control systems, exemplified by Git, recognize independent and concurrent collaborators can be independently be making changes to data. They also recognize that users want to be able to efficiently incorporate the changes of collaborators and upstream suppliers. One of the primary design goals of Dolt is to provide robust tools for such workflows with tabular data.

Query performance for single-source-of-truth tabular data is a well understood problem, with many excellent solutions. MySQL and Postgres are examples. Dolt makes a different set of design decisions as it attempts to trade query performance off against storage footprint of the database at various commits. Perhaps the most pressing design consideration is how to balance acceptable query performance for a given commit against the need to store the state, schema and values, of the database at every commit. In this way each commit is itself can be thought of as a database in the sense that it can be queried as one. To make this more concrete, consider following schematic of a Dolt commit graph:

![Dolt Commit Graph](../.gitbook/assets/dolt-commit-graph.png)

The tables have different values at different commits, but one could treat each commit as a database in the traditional RDBMS sense. This makes the design challenge of architect Dolt pretty clear: how do we efficiently serve data out to a SQL query engine while storing the value and schema of every table at every commit? Let's visualize a table value at a commit:

![Dolt Table Value](../.gitbook/assets/dolt-table-value.png)

The design goal is relatively clear: we want to find a way to efficiently serve queries against the database at a given commit, possibly across the query graph \(see Dolt's system tables\) while not storing the entire database at every commit. In other words we want to share values repeated across values of tables in the commit graph, while preserving acceptable query performance at a given value, and possibly across many values. In the sections that follow we review some of the technologies and concepts we used to build Dolt to achieve these design goals.

### Noms

Dolt is built on top of Noms, in the words of the authors a "decentralized database philosophically descendant from Git." You can read more about Noms on the [GitHub page](https://github.com/attic-labs/noms). In the previous discussion we talked about making design tradeoffs to deliver a Git-like version control model for tabular data. Noms does this for objects, exposing a simple but rich type system for modeling non-relational data. The top level abstraction in Noms is a database, similar to repository in Git or Dolt. Noms databases can have zero or more datasets. A dataset is a named pointer to the root value of that dataset at a node in the DAG formed by the commit graph. While Noms does not provide a SQL interface for tabular data, it shares many of Dolt's design goals around the efficient storage of changes to a data structure encoded in a commit graph.

In particular Noms provides a novel tree data structure called a Prolly Tree for representing large collections. Dolt uses Prolly trees to represent tables, as we saw in the schematic diagram of a table value in the Overview.

### Prolly Trees

In this section we explore how Dolt uses Prolly Trees, a data structure novel to Noms for efficiently storing many versions of collections, to implement tables. We draw on a [blog post](https://www.dolthub.com/blog/2020-04-01-how-dolt-stores-table-data/) we published about Prolly Trees, and an excellent [write up](https://github.com/attic-labs/noms/blob/master/doc/intro.md#prolly-trees-probabilistic-b-trees) by the Noms team. In the Overview we put forth the design challenge in building Dolt: we needed to store the state of a database, consisting of tables at N points in time \(i.e. commits\) without simply storing N copies of the database, and at the same time providing acceptable query performance. Noms set forth to do something similar for object storage, thus we built on top of Noms, using Noms data structures to implement tables.

One key data structure that Noms employs is the Prolly Tree, used for storing collections. A Prolly Tree combines ideas of from [B-Trees](https://en.wikipedia.org/wiki/B-tree) and [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree). B-Trees are block oriented data structures with sorted key-value pairs stored at leaf nodes, and internal nodes that store pointers to child nodes and ranges of keys which those child nodes provide access to. Reading from a B-Tree index for a given set of keys involves locating a range in which the desired key is located and following the pointers down the tree until arriving at a leaf node that stores the sorted range of keys containing the desired key and seeking the value out. Prolly Trees resemble B-Trees in that they store all key-value data in leaf nodes, exactly like a B-tree, and internal nodes with key delimiters and pointers to their children, exactly like a B-tree.

The point of difference is where Prolly Trees draw on ideas from Merkle Trees, widely used in distributed protocols such as Bitcoin and IPFS. Instead of internal nodes storing pointers to child nodes, and leaf nodes storing key value pairs \(or pointers to key value pairs\), both the leaf nodes and the internal nodes are variable-length and content-addressed. The child pointers of the internal nodes are the content addresses of the leaf or internal nodes that they point to. This means the actual values themselves can be stored in an immutable content-addressed chunk store, and the content addresses used as the "pointers" in the Prolly Tree. The benefit of this architecture is it facilitates structural sharing. When only a few values in a table, stored as a Prolly Tree, change, then we need only write the new values to a content addressed chunk, and recompute the nodes that lead to content addresses to the updated values. The rest of the tree still consists of content addresses \(i.e. pointers\) to the same chunks. The result of this is that the storage footprint of different versions of a table is proportional to the size of the changes between the two versions. This is called structural sharing, and it's an important mechanism for making Dolt feasible.

Before going into greater detail about the structural sharing that the design of a Prolly Tree facilitates, let's first dive a little deeper into the specifics of how Prolly Trees can be used to represent tables, and the "variable length" of Prolly Tree blocks, as this was one of the points of distinction from a traditional B-Tree.

In the near future we will add more detail on the rolling hash function used for allocating block sizes.

### Structural Sharing

In the last section we discussed Prolly Trees, a B-Tree like data structure whose nodes are "variable-length and content addressed." One motivation for the nodes being content-addressed was that two different Prolly Tree roots could share many nodes in common by "pointing" to them via their content addresses. When Prolly Tree roots correspond to a given table at different commits this facilitates what we call "structural sharing", namely a two versions of a data structure reference much of the same content \(in the form of chunks on disk\) to reduce the footprint of storing them both.

To see how this works in practice, let's examine a couple of scenarios for updating a table to see how that manifest in a Prolly Tree and facilitates structural sharing:

* The absolute smallest overhead for any mutation to a table is, on average, a little larger than 4KB times the depth of the tree. Typically changing the value in a chunk won't change the chunk boundary, and you'll need to store complete new chunk values for the new leaf chunk and all the new internal chunks up to the root. The best case scenario looks like:

![Single Value Edit](../.gitbook/assets/single-value-edit.png)

* Adding rows to a table whose primary keys are lexicographically larger than any of the existing rows in the table results in an append at the end of Prolly-tree for the table value. The last leaf node in the tree will necessarily change, and new chunks will be created for all of the new rows. Expected duplicate storage overhead is going to be the 4KB chunk at the end of the table's leaf nodes and the spline of the internal nodes of the map leading up to the root node. This kind of table might represent naturally append-only data or time-series data, and the storage overhead is very small. This looks like:

![Append Edit](../.gitbook/assets/append-edit.png)

* Adding rows to a table whose primary keys are lexicographically smaller than any of the existing rows is very similar to the case where they are all larger. It's expected to rewrite the first chunks in the table, and the probabilistic rolling hash will quickly resynchronize with the existing table data. It might look like:

![Prepend Edit](../.gitbook/assets/prepend-edit.png)

* Adding a run of data whose primary keys fall lexicographically within two existing rows is very similar to the prefix or postfix case. The run of data gets interpolated between the existing chunks of row data:

![Middle Run Edit](../.gitbook/assets/middle-run-edit.png)

Thus a table at a commit can is a Prolly Tree root, but will likely point to many of the same immutable chunks as the same table at other commits. Thus the commit graph consists of pointers to different Prolly Tree roots that represent tables, but internally those Prolly Trees will point to many of the same chunks since their pointers in the tree are content addressed to immutable chunks, facilitating structural sharing. Much of the content for this section came from a post we wrote on [structural sharing](https://www.dolthub.com/blog/2020-05-13-dolt-commit-graph-and-structural-sharing/) in Dolt and surrounding trade-offs.

### Noms Block Store \(NBS\)

In the previous section we described Prolly Trees as a novel tree implementation drawing inspiration from B-Trees and Merkle Trees where internal nodes are stored as chunks of content addressed pointers to child nodes, and leaf nodes are stored as content addressed chunks of content. The use of content addressing is crucial for detecting changes in the tree and efficiently diffing two versions. Noms uses Noms Block Store, a storage layer optimized for storage of content-addressed prolly tree nodes. It supports only three operations, `insert`, `update root` and `garbage collect`. Since Dolt implements tables on top of Noms, underlying chunks are stored using the NBS.

## Go MySQL Server

We made a decision to implement SQL as the query interface for Dolt.

We have [blogged](https://www.dolthub.com/blog/2020-05-04-adopting-go-mysql-server/) about our decision to adopt the project via a hard fork. The maintainers ultimately moved onto to focus on other things, and we needed the owner of the project to be fully engaged with what has become a crucial element of our architecture.

The motivation for implementing MySQL, as opposed to say Postgres, is relatively straight forward. Firstly, there was a relatively mature open source project implement the MySQL Server standard. MySQL also makes a distinction between query engine and storage engine, whereas no such distinction exists in Postgres. While we could have implemented the Postgres wire format and SQL syntax, we would have had to write a parser from scratch. With Go MySQL Server, we were able to build on top of existing art in the language that Dolt is written in.

Go MySQL Server implements parsing and query execution for the MySQL dialect. The idea is that folks with their own underlying storage engines can wire those into the interfaces provided by Go MySQL Server, and take advantage of a production grade parsing and execution, but plug in a custom storage engine. We found many issues that needed resolving in Go MySQL Server, thus our work is split across fixing and improving the Go MySQL Server itself, and providing the required interface on top of Dolt's storage to correctly execute SQL queries against Dolt data.

