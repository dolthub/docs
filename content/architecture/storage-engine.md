---
title: Storage Engine
---

# Storage Engine

Dolt's storage engine is based on code and ideas in [Noms](https://github.com/attic-labs/noms). Noms is a "decentralized database philosophically descendant from Git."

Dolt's fork of Noms is included in Dolt's code, as this was easier to manage. Dolt's Noms fork has been heavily modified since. We thank the Noms team for laying the groundwork for Dolt and helping us envision what was possible.

## Tables

Dolt implements tables on top of Noms as a map of primary keys to values.

The top level abstraction in Noms is a database. Noms databases can have zero or more datasets. 

A dataset is a named pointer to the root value of one or more [Prolly Trees](./storage-engine/prolly-tree.md), a content-addressed binary tree. Prolly trees can be compared in time proportional to the difference between the two trees, a necessary performance characteristic for version control operations. 

![](../.gitbook/assets/dolt-table-value.png)

## Commit Graph

The roots of the prolly trees are stored in a [Merkle Directed Acyclic Graph (DAG)](https://docs.ipfs.io/concepts/merkle-dag/). This structure allows Noms to share the storage of data across versions, a key to scalability. 

![](../.gitbook/assets/dolt-commit-graph.png)


