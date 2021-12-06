---
title: Branch
---

# Branch

## What is a Branch?

A branch adds non-distributed, write isolation to Dolt. A branch can be thought of as a long running transaction. If you have a set of database changes that logically should be grouped together or reviewed together, you make those changes on a branch. 

A branch is a named reference that starts with a parent commit. When creating a branch you define it's parent commit and then effectively you have created a new copy of the Dolt database. Changes to the branch only effect that branch. As you commit to the branch the head of the branch changes to the new commit. 

You can merge two branches together using the merge command. This creates a commit in the graph with two parents.

You Dolt database starts with one named branch, `main`. The name is configurable.

Branches differ from tags which is a named commit that does not change.

## How to use Branches

Branches can be used on a running Dolt server for write isolation or parallelism. Writes to a branch do not effect another branch until a merge. 

In traditional SQL databases, transactions are designed to be short lived. The rows you change in a transaction are essentially locked for the duration of the transaction. Because Dolt allows for merge and more complex conflict resolution than traditional SQL databases, Dolt can essentially support long running transactions on branches.

## Difference between Git branch and Dolt branch

Conceptually Git branches and Dolt branches are the same.

In Dolt, branches become a slightly more important concept is server mode. In Git, you often are working on a clone of your repository locally. Thus, you're write isolation can be at the clone level. With Dolt in server mode, your application will be coordinating writes to a single server through branches. 

## Example

### Create a branch

```
docs $ dolt branch new-branch
docs $ dolt branch
* main                                          	
  new-branch                                    	
docs $ dolt checkout -b check-out-new-branch
Switched to branch 'check-out-new-branch'
docs $ dolt branch
* check-out-new-branch                          	
  main                                          	
  new-branch                                    	
docs $ dolt sql -q "select * from dolt_branches"
+----------------------+----------------------------------+------------------+------------------------+-----------------------------------+------------------------------+
| name                 | hash                             | latest_committer | latest_committer_email | latest_commit_date                | latest_commit_message        |
+----------------------+----------------------------------+------------------+------------------------+-----------------------------------+------------------------------+
| check-out-new-branch | f0ga78jrh4llc0uus8h2refopp6n870m | Tim Sehn         | tim@dolthub.com        | 2021-12-06 13:39:57.705 -0800 PST | Removed row from no_pk table |
| main                 | f0ga78jrh4llc0uus8h2refopp6n870m | Tim Sehn         | tim@dolthub.com        | 2021-12-06 13:39:57.705 -0800 PST | Removed row from no_pk table |
| new-branch           | f0ga78jrh4llc0uus8h2refopp6n870m | Tim Sehn         | tim@dolthub.com        | 2021-12-06 13:39:57.705 -0800 PST | Removed row from no_pk table |
+----------------------+----------------------------------+------------------+------------------------+-----------------------------------+------------------------------+
```

### Merge a branch

```
docs $ dolt sql -q "insert into docs values (10,10)"
Query OK, 1 row affected
docs $ dolt diff
diff --dolt a/docs b/docs
--- a/docs @ 2lcu9e49ia08icjonmt3l0s7ph2cdb5s
+++ b/docs @ vpl1rk08eccdfap89kkrff1pk3r8519j
+-----+----+----+
|     | pk | c1 |
+-----+----+----+
|  +  | 10 | 10 |
+-----+----+----+
docs $ dolt commit -am "Added a row on a branch"
commit ijrrpul05o5j0kgsk1euds9pt5n5ddh0
Author: Tim Sehn <tim@dolthub.com>
Date:   Mon Dec 06 15:06:39 -0800 2021

	Added a row on a branch

docs $ dolt checkout main
Switched to branch 'main'
docs $ dolt sql -q "select * from docs"
+----+----+
| pk | c1 |
+----+----+
| 1  | 1  |
| 2  | 1  |
+----+----+
docs $ dolt merge check-out-new-branch
Updating f0ga78jrh4llc0uus8h2refopp6n870m..ijrrpul05o5j0kgsk1euds9pt5n5ddh0
Fast-forward
docs $ dolt sql -q "select * from docs"
+----+----+
| pk | c1 |
+----+----+
| 1  | 1  |
| 2  | 1  |
| 10 | 10 |
+----+----+
```