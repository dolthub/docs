---
title: Remotes
---

# Remotes

## What is a remote?

A remote is a Doltgres database in another location, usually on a different, network accessible
host. A Doltgres remote is the coordination mechanism between many local copies of Doltgres. A
Doltgres database can have multiple remotes.

You configure a storage location as a remote. Once configured, you can perform Doltgres's
distributed operations using that remote: clone, fetch, push, and pull.

Clone creates a copy of remote database in your current directory. In the case of clone, the remote
you cloned from is automatically configured as the `origin` remote.

Fetch gathers all the changes made to the remote since you last fetched.

Push performs a merge of your current branch and the remote branch you are pushing to. It sends all
the associated changed data and schema to the remote and updates the commit log to reflect the push.

Pull performs a fetch then a merge of the remote branch to your local branch. Essentially pull
merges the changes on the remote branch into your local branch.

## DoltHub remotes

[DoltHub](https://www.dolthub.com/) remotes aren't currently supported for Doltgres databases. Only
self-hosted remotes using local file stores or cloud storage are currently supported.

## How to use remotes

A remote is the basis for all the distributed collaboration features of Doltgres.

If you would like to make sure your local database can survive a destructive local operation, you
create a remote on another machine and push your local Doltgres database to it.

If you would like a Doltgres database to be used by more than one person, you create and configure a
remote and then push your local Doltgres database to that remote. That person then can clone or pull
the remote.

## Difference between Git remotes and Doltgres remotes

Doltgres and Git remotes are conceptually the same. Practically, in Git you can set your own local
Git directory up as a remote. In Doltgres, this is not supported. You must configure a dedicated
location for your Doltgres remote.

## Example

```sql
call dolt_clone('file:///var/share/doltgres-remotes/docs');
\c docs;
select * from docs;
+----+----+
| pk | c1 |
+----+----+
+----+----+
insert into docs values (0,0),(1,1),(2,2);
select * from docs;
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
+----+----+
call dolt_commit('-m', 'Committing inserts so I can push it to my remote');
call dolt_push('origin', 'main');
```
