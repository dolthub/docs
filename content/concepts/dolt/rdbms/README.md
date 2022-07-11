---
title: Relational Database Management System
---

Dolt can be used as a Relational Database Management System or RDMS. Dolt ships with [a MySQL compatible server](./server.md) built in, accessed via the [`dolt sql-server` command](../../../reference/cli.md#dolt-sql-server).

Dolt supports [backups](./backups.md). There are two options for backups: [remotes](../git/remotes.md) or [backups](./backups.md). Pushing to a remote only backs up committed changes. Using `dolt backup` backs up uncommitted changes as well. Backups are accessed via the [`dolt backup` command](../../../reference/cli.md#dolt-backup) or [dolt_backup() procedure](../../../reference/sql/version-control/dolt-sql-procedures.md#doltbackup).

Dolt leverages Git-style [remotes](../git/remotes.md) to facilitate replication. The master and replicas configure the same remote. On the master, you configure "push on write" and on the replicas you configure "pull on read". 