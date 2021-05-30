---
title: Scalability
---

Dolt is currently constrained to the hard drive size of single machine. Like any relational database once the storage footprint goes past a single machine the only solution is sharding. We have not implemented sharding in Dolt, though it is on our long term roadmap.

Like a relational database, as data grows, non-indexed read performance degrades. Unlike a relational database, Dolt is effectively append-only, though it still looks like a relational database. The larger the history grows, the larger the storage footprint is. There are offline utilities for pruning history when needed.
