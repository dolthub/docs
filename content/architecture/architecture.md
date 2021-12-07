---
title: Architecture
---

# Architecture

Dolt is written from the storage engine up to provide Git-style version control to schema and data. Dolt does not contain Git code. 

Dolt is MySQL compatible but contains no MySQL code. Dolt is a standalone database.

Dolt is architected to provide version control features like diff and merge on large databases while also maintaining query performance you expect from a SQL database. 

When discussing architecture, Dolt has two distinct pieces:

1. [The Storage Engine](storage-engine/storage.md)
2. [The SQL Implementation](sql/sql.md)

Combining these two concepts allows for the first SQL database you can clone, branch, and merge.