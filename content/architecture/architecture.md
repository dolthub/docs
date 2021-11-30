---
title: Architecture
---

# Architecture

Dolt is written from the storage engine up to provide Git-style version control to schema and data. Dolt is MySQL compatible but contains no MySQL code. Dolt is a standalone database.

When discussing architecture, Dolt has two distinct pieces:

1. [The Storage Engine](storage-engine/storage.md)
2. [The SQL Implementation](sql/sql.md)

