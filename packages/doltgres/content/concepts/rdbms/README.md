---
title: Relational Database Management System
---

Doltgres can be used as a Relational Database Management System or RDBMS. Doltgres ships with [a
Postgres compatible server](./server.md) built in, accessed via the `doltgres`
command.

Doltgres supports [backups](./backups.md). There are two options for backups:
[remotes](../git/remotes.md) or [backups](./backups.md). Pushing to a remote only backs up committed
changes. Using `dolt backup` backs up uncommitted changes as well. Backups are accessed via the
[dolt_backup() procedure](../../reference/sql/version-control/dolt-sql-procedures.md#doltbackup).

Doltgres leverages Git-style [remotes](../git/remotes.md) to facilitate replication. The master and
replicas configure the same remote. On the master, you configure "push on write" and on the replicas
you configure "pull on read".
