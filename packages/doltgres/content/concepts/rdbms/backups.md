---
title: Backups
---

# Backups

## What is a Backup?

A backup is a copy of your database. You can restore the state of the database as it existed at the
time of the backup.

## How to use Backups

Backups are used for disaster recovery. When you create a backup it is wise to copy the backup to a
different host. If you lose access to the host that houses your database, you restore the database
from a backup on another host.

Backups have additional uses. Taking a backup of a database is often the easiest way to get a copy
of the database. You can use this copy for development, testing, or analytics.

## Difference between Postgres Backups and Doltgres Backups

Doltgres does not support any of the [Postgres backup
methods](https://www.postgresql.org/docs/current/backup.html) except the `pg_dump` method. Doltgres
can create a dump `pg_dump` connected to the running Doltgres server.

## Interaction with Doltgres Version Control

Doltgres supports different methods of backup that leverage Doltgres's git-style features.

Doltgres databases contain the entire history of the database, meaning Doltgres has backups built in
to the running server. To restore to a previous point on a running server, you checkout the database
at the commit you would like to restore to.

To replicate your database off host so you can restore if you lose the host, Doltgres supports two
different concepts: remotes and backups.

Using a [remote](../git/remotes.md) for backup allows you to back up all committed changes. You add
a remote using the [`select dolt_remote()`
procedure](../../reference/sql/version-control/dolt-sql-procedures.md#dolt_remote). Then you push a
branch to a remote using the [`dolt_push()`
procedure](../../reference/sql/version-control/dolt-sql-procedures.md#dolt_push).

## Not yet supported: non-remote backups

The `backup` command supported in Dolt is not yet available in doltgres. Check back for updates.
