# Storage Engine

## Storage Engine

Dolt's storage engine is based on code and ideas in [Noms](https://github.com/attic-labs/noms). Noms is a "decentralized database philosophically descendant from Git."

Dolt's fork of Noms is included in Dolt's code, as this was easier to manage. Dolt's Noms fork has been heavily modified since. We thank the Noms team for laying the groundwork for Dolt and helping us envision what was possible.

### Tables

Dolt implements tables on top of Noms as a map of primary keys to values.

The top level abstraction in Noms is a database. Noms databases can have zero or more datasets.

A dataset is a named pointer to the root value of one or more [Prolly Trees](prolly-tree.md), a content-addressed binary tree. Prolly trees can be compared in time proportional to the difference between the two trees, a necessary performance characteristic for version control operations.

![](../../.gitbook/assets/dolt-table-value.png)

### Commit Graph

The roots of the prolly trees are stored in a [Merkle Directed Acyclic Graph (DAG)](https://docs.ipfs.io/concepts/merkle-dag/). This structure allows Noms to share the storage of data across versions, a key to scalability.

![](../../.gitbook/assets/dolt-commit-graph.png)

## How Dolt Works Blog Series

The best deep dive into how the Dolt storage engine works is a series of blog posts by Aaron Son.

1. [How Dolt Stores Table Data](https://www.dolthub.com/blog/2020-04-01-how-dolt-stores-table-data/)
2. [The Dolt Commit Graph and Structural Sharing](https://www.dolthub.com/blog/2020-05-13-dolt-commit-graph-and-structural-sharing/)
3. [Efficient Diff on Prolly Trees](https://www.dolthub.com/blog/2020-06-16-efficient-diff-on-prolly-trees/)
4. [Cell-level Three-way Merge in Dolt](https://www.dolthub.com/blog/2020-07-15-three-way-merge/)
5. [Dolt Implementation Notes — Push And Pull On a Merkle DAG](https://www.dolthub.com/blog/2020-09-09-push-pull-on-a-merkle-dag/)
