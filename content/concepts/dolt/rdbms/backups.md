---
title: Backups
---

# Backups

## What is a Backup?

A backup is a copy of your database. You can restore the state of the database as it existed at the time of the backup.

## How to use Backups

Backups are used for disaster recovery. When you create a backup it is wise to copy the backup to a different host. If you lose access to the host that houses your database, you restore the database from a backup on another host. 

Backups have additional uses. Taking a backup of a database is often the easiest way to get a copy of the database. You can use this copy for development, testing, or analytics.

## Difference between MySQL Backups and Dolt Backups

Dolt does not support any of the [MySQL backup methods](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html) except the `mysqldump` method. Dolt can create a dump using the [`dolt dump` command](../../../reference/cli.md#dolt-dump) or `mysqldump` connected to the running Dolt server. 

## Interaction with Dolt Version Control

Dolt supports different methods of backup that leverage Dolt's git-style features.

Dolt databases contain the entire history of the database, meaning Dolt has backups built in to the running server. To restore to a previous point on a running server, you checkout the database at the commit you would like to restore to.

To replicate your database off host so you can restore if you lose the host, Dolt supports two different concepts: remotes and backups. 

Using a [remote](../git/remotes.md) for backup allows you to back up all committed changes. You add a remote using the [`dolt remote` command](../../../reference/cli.md#dolt-remote). Then you push a branch to a remote using the [`dolt push` command](../../../reference/cli.md#dolt-push) or [`dolt_push()` procedure](../../../reference/sql/version-control/dolt-sql-procedures.md#doltpush).

Dolt has an additional backup functionality beyond remotes. Using `dolt backup` backs up uncommitted changes as well. Backups are accessed via the [`dolt backup` command](../../../reference/cli.md#dolt-backup) or [dolt_backup() procedure](../../../reference/sql/version-control/dolt-sql-procedures.md#doltbackup). 

Interestingly, you can trigger backups from your application using the `dolt_backup()` procedure. If you hit a weird edge case you can create a backup of the state of your database for debugging.

## Example

### Create a new backup
```
%% dolt backup add backup1 file://../backups/backup1
/ Tree Level: 1, Percent Buffered: 0.00% Files Written: 0, Files Uploaded: 1
```

### Updating a backup
```
$ dolt backup sync backup1
```

### Restoring from a backup
```
$ dolt backup restore file://./backups/backup1 repo2
$ dolt branch -a
* main
$ dolt status
```