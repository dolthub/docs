---
title: Backups
---

# Backups

Dolt has two options for [backups](../../../concepts/dolt/rdbms/backups.md): remotes and backups.

## Remotes

Using remotes for backups should be suitable for some use cases. Using remotes for backups only backs up to the current commit of a branch, not the working set. Pushing to a remote creates an off server copy of the branch being pushed. Frequently pushing to a remote can serve as a reasonable backup.

### Configure a remote

Currently you can only add and remove remotes from the [Dolt CLI](../../cli.md). The example uses DoltHub as a remote but you can use Dolt with [other remotes like filesystem, AWS S3, and GCS](https://www.dolthub.com/blog/2021-07-19-remotes/). I created an empty database on DoltHub and [configured the appropriate read and write credentials on this host](../../../introduction/getting-started/data-sharing.md#dolt-login).

```bash
% dolt remote add backup https://doltremoteapi.dolthub.com/timsehn/backup-example
$ dolt remote -v
backup https://doltremoteapi.dolthub.com/timsehn/backup-example 
```

### Backup by Pushing a Branch

```sql
mysql> use backup_example;
mysql> create table test (pk int, c1 int, primary key(pk));
mysql> insert into test values (0,0);
mysql> call dolt_add('test');    
mysql> call dolt_commit('-m', "Created table and inserted values to be backed up");
+----------------------------------+
| hash                             |
+----------------------------------+
| slm5cql6ri8l4vd7uemvqhj6p2e2g98k |
+----------------------------------+
mysql> call dolt_push('backup', 'main');
+---------+
| success |
+---------+
| 1       |
+---------+
```

Using DoltHub or DoltLab as a remote provides a web UI to your backups.

![DoltHub Backup Example](../../../.gitbook/assets/backup-example.png)

## Backups

Dolt also has backups, accessed with the [`dolt backup` command](../../cli.md#dolt-backup). These backups look more like traditional database backups. The entire state of the database, including uncommitted changes on all branches, are copied to another location.

### Create a backup

To create a backup you first configure a backup using syntax similar to the [remote](../../../concepts/dolt/git/remotes.md) syntax.

```bash
$ mkdir -p /Users/timsehn/liquidata/dolt/backups/backup-example
$ dolt backup add local-backup file:///Users/timsehn/liquidata/dolt/backups/backup-example
$ dolt backup sync local-backup
Uploaded 3.1 kB of 3.1 kB @ 0 B/s.
$ 
```

### Sync a backup from SQL

```sql
mysql> use backup_example;
mysql> insert into test values (1,1);
mysql> call dolt_backup('sync', 'local-backup');
+---------+
| success |
+---------+
| 1       |
+---------+
```

### Restore from a backup

The backup command called with the restore option looks a lot like the [dolt clone command](../../cli.md#dolt-clone).

```bash
$ dolt backup restore file:///Users/timsehn/liquidata/dolt/backups/backup-example backup-restore
Downloaded 14 chunks, 3.5 kB @ 0 B/s.

$ cd backup-restore/
backup-restore $ dolt sql -q "select * from test"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
+----+----+
```

Note the working set changes were also restored.

Configuration and [users/grants](../../../concepts/dolt/sql/users-grants.md) are not backed up and restored as these are not stored in the versioned part of Dolt.