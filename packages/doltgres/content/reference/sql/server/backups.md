---
title: Backups
---

# Backups

There are several ways to safely backup Doltgres databases. If you are using [Hosted
Doltgres(https://hosted.doltdb.com), then you get automatic backups without having to configure
anything. If you are running your own Doltgres SQL server, then you need to handle your own backups
using one of the approaches below.

Backing up through [point-in-time snapshots at a block device
level](#point-in-time-snapshots-on-block-devices) is often the easiest approach and what we
recommended if this works for your setup. Backing up by [copying files at a file system
level](#copying-files-on-file-systems) can also work in some cases, but requires that no Doltgres
processes are reading or writing any data while the file copy operation is in progress. You can also
roll your own custom solutions by [pushing to remotes](#pushing-to-remotes) or using the [Doltgres
backup command](#dolt-backup-command). Make sure you include [all additional configuration
files](#additional-sql-server-configuration) needed to fully restore your Doltgres SQL server
environment. As with any backup solution, it is important that you regularly test your backup and
restore processes.

## Point-in-Time Snapshots on Block Devices

If you are running a Doltgres SQL server with the data directory (i.e. the directory where your
databases are stored) on a block device that supports point-in-time snapshots, such as AWS Elastic
Block Store (EBS), then you can take advantage of these snapshots for backing up your databases and
configuration. In most cases, this will handle the versioned content of your databases as well as
[all additional configuration files](#additional-sql-server-configuration). Because of how
point-in-time snapshots work, this operation is consistent and safe to perform, even when the
Doltgres SQL server is running. Because of its simplicity and safety, this is our recommended
approach for backing up your Doltgres SQL server.

## Copying Files on File Systems

Unlike block devices that support point-in-time snapshots, you **cannot** rely on the same safety
and consistency guarantees at the file system layer. This is true whether you are using a local file
system or a file system service such as AWS Elastic File System. You cannot rely on copying the
contents of a file system for a safe backup. It is possible that the file system copy operation will
not capture a consistent set of files and you risk being unable to restore the backup. However, if
you are able to fully stop the Doltgres SQL server and ensure no Doltgres processes are using the
file system data, then you can safely copy the files at the file system level for a backup. This is
only safe if no Doltgres processes are using the data, so you should use extra caution to ensure
that Doltgres is not running if you want to pursue this approach. Otherwise, if you are not able to
stop the Doltgres SQL Server to perform a backup, you should rely on one of the backup approaches
described below.

## Pushing to Remotes

Using remotes for backups is suitable for some use cases, but be aware that using remotes for
backups only backs up to the current commit of a branch, not the working set or other
branches. Pushing to a remote creates an off server copy of the branch being pushed. Frequently
pushing to a remote can serve as a backup for some use cases.

### Configure a remote

This example uses DoltHub as a remote, but you can use Doltgres with [other remotes like
filesystem, AWS S3, and GCS](https://www.dolthub.com/blog/2021-07-19-remotes/).

```sql
select dolt_remote('add', 'backup', 'file:///var/share/backup/');
```

### Backup by Pushing a Branch

```sql
use backup_example;
create table test (pk int, c1 int, primary key(pk));
insert into test values (0,0);
select dolt_add('test');
select dolt_commit('-m', 'Created table and inserted values to be backed up');
+----------------------------------+
| hash                             |
+----------------------------------+
| slm5cql6ri8l4vd7uemvqhj6p2e2g98k |
+----------------------------------+
select dolt_push('backup', 'main');
+---------+
| success |
+---------+
| 1       |
+---------+
```

## Full Server Backups

Full server backups are not yet supported but are coming soon.
