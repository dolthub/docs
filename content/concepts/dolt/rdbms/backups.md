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

Dolt does not support any of the [MySQL backup methods](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html) except the `mysqldump` method. Dolt can create a dump using the [`dolt dump` command](../../../reference/cli.md#dolt-dump). 

## Interaction with Dolt Version Control

Dolt supports different methods of backup that leverage Dolt's git-style features. Because of the way data is stored in Dolt, Dolt only has to calculate and copy the differences between the current requested backup and previous backups. Also, Dolt backups contain the entire history of the database, meaning Dolt has backups built in to the running server.

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