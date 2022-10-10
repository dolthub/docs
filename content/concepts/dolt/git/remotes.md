---
title: Remotes
---

# Remotes

## What is a remote?

A remote is a Dolt database in another location, usually on a different, network accessible host. A Dolt remote is the coordination mechanism between many local copies of Dolt. A Dolt database can have multiple remotes.

DoltHub is a hosted Dolt remote with an additional discovery and management user interface. [DoltLab](https://www.dolthub.com/blog/2022-01-14-announcing-doltlab/) is a self-hosted version of DoltHub. [Dolt also supports filesystem, HTTPS, AWS, and GCS remotes](https://www.dolthub.com/blog/2021-07-19-remotes/).

You configure a storage location as a remote. Once configured, you can perform Dolt's distributed operations using that remote: clone, fetch, push, and pull. 

Clone creates a copy of remote database in your current directory. In the case of clone, the remote you cloned from is automatically configured as the `origin` remote.

Fetch gathers all the changes made to the remote since you last fetched.

Push performs a merge of your current branch and the remote branch you are pushing to. It sends all the associated changed data and schema to the remote and updates the commit log to reflect the push.

Pull performs a fetch then a merge of the remote branch to your local branch. Essentially pull merges the changes on the remote branch into your local branch.
 
## How to use remotes

A remote is the basis for all the distributed collaboration features of Dolt.

If you would like to make sure your local database can survive a destructive local operation, you create a remote on another machine and push your local Dolt database to it.

If you would like a Dolt database to be used by more than one person, you create and configure a remote and then push your local Dolt database to that remote. That person then can clone or pull the remote.

## Difference between Git remotes and Dolt remotes

Dolt and Git remotes are conceptually the same. Practically, in Git you can set your own local Git directory up as a remote. In Dolt, this is not supported. You must configure a dedicated location for your Dolt remote.

## Example

```
dolt $ dolt clone timsehn/docs
cloning https://doltremoteapi.dolthub.com/timsehn/docs
29 of 29 chunks complete. 0 chunks being downloaded currently.
dolt $ cd docs/
docs $ dolt ls
Tables in working set:
	 docs

docs $ dolt sql -q "select * from docs"
+----+----+
| pk | c1 |
+----+----+
+----+----+
docs $ dolt sql -q "insert into docs values (0,0),(1,1),(2,2)"
Query OK, 3 rows affected
docs $ dolt sql -q "select * from docs"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
+----+----+
docs $ dolt add docs
docs $ dolt commit -m "Committing inserts so I can push it to my remote"
commit uhumidn2e7ucan59jk9vuabm7r5osggs
Author: Tim Sehn <tim@dolthub.com>
Date:   Mon Dec 06 17:14:46 -0800 2021

	Committing inserts so I can push it to my remote

docs $ dolt remote
origin
docs $ dolt remote -v
origin https://doltremoteapi.dolthub.com/timsehn/docs 
docs $ dolt push origin main
\ Tree Level: 1, Percent Buffered: 0.00% Files Written: 0, Files Uploaded: 1
```
