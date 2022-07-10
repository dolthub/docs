---
title: Relational Database Management System
---

Dolt is can be used as a Relational Database Management System or RDMS. Dolt ships with [a MySQL compatible server](./server.md) built in, accessed via the [`dolt sql-server` command](../../../reference/cli.md#dolt-sql-server).

Dolt supports [backups](./backups.md) via the [`dolt backup` command](../../../reference/cli.md#dolt-backup). Backups can also be triggered by a client using the [dolt_backup() procedure](../../../reference/sql/version-control/dolt-sql-procedures.md#doltbackup).

Dolt leverages Git-style [remotes](../git/remotes.md) to facilitate replication. The master and replicas configure the same remote. On the master, you configure "push on write" and on the replicas you configure "pull on read". 