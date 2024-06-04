---
title: Version Control in Doltgres
---

Unlike other relational databases, Doltgres has multiple branches and stores all data in a commit
graph, like git. This makes it possible to efficiently diff any two commits, as well as merge one
branch into another. All the git-like version control functionality is exposed as system tables,
system variables, functions, and stored procedures.

# Version control overview

- [Using Branches](./branches.md) explains how to work with different
  branches in a running server.
- [Merges](./merges.md) explains how to merge branches into one
  another and resolve merge conflicts using SQL.
- [Querying History](./querying-history.md) describes how to query
  past revisions or different branches of a database.
- [Using Remotes](./remotes.md) describes how to use remotes to
  coordinate between Doltgres clones.
- [Stored procedures](./dolt-sql-procedures.md) documents all the
  stored procedures that implement version control operations such as
  `DOLT_COMMIT`, `DOLT_CHECKOUT`, `DOLT_MERGE`, etc.
- [Functions](./dolt-sql-functions.md) documents Doltgres-provided
  functions that aren't part of standard Postgres, including table
  functions that produce diffs of any table at two points in its
  history.
- [System tables](./dolt-system-tables.md) describes the system tables
  that provide read access to version control information, such as
  branches, commit log, diffs, and conflicts.
- [System variables](./dolt-sysvars.md) documents all the
  Doltgres-provided system variables that expose and control various
  aspects of Doltgres's behavior.
- [Saved Queries](./saved-queries.md) documents a Doltgres feature to save
  queries for later execution.
