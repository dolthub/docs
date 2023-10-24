---
title: Branch
---

# Branch

## What is a Branch?

A branch adds non-distributed, write isolation to Dolt. A branch can be thought of as a long running transaction. If you have a set of database changes that logically should be grouped together or reviewed together, you make those changes on a branch. 

A branch is a named reference that starts with a parent commit. When creating a branch you define it's parent commit and then effectively you have created a new copy of the Dolt database. Changes to the branch only effect that branch. As you commit to the branch the head of the branch changes to the new commit. 

You can merge two branches together using the merge command. This creates a commit in the graph with two parents.

Your Dolt database starts with one named branch, `main`. The name is configurable.

Branches differ from tags which is a named commit that does not change.

## How to use Branches

Branches can be used on a running Dolt server for write isolation or parallelism. Writes to a branch do not effect another branch until a merge. 

In traditional SQL databases, transactions are designed to be short lived. The rows you change in a transaction are essentially locked for the duration of the transaction. Because Dolt allows for merge and more complex conflict resolution than traditional SQL databases, Dolt can essentially support long running transactions on branches.

See [the branches section in reference](../../../reference/sql/version-control/branches.md) for a deeper dive into how to use branches in the SQL server context.

## Difference between Git branch and Dolt branch

Conceptually Git branches and Dolt branches are the same.

In Dolt, branches become a slightly more important concept in server mode. In Git, you often are working on a clone of your repository locally. Thus, your write isolation can be at the clone level. With Dolt in server mode, your application will be coordinating writes to a single server through branches. 

## Valid Branch Names

Branch names have a few restrictions which are similar to the constraints Git puts on branch names. Dolt's branches are a little more restrictive, as [ASCII](https://en.wikipedia.org/wiki/ASCII) characters are required. Rules are as follows:

* All characters must be ASCII (7 Bit)
* May not start with '.' (period)
* May not contain '..' (two periods)
* May not contain '@{'
* May not contain ASCII control characters
* May not contain characters: ':', '?', '\[', '\', '^', '~', '*'
* May not contain whitespace (spaces, tabs, newlines)
* May not end with '/'
* May not end with '.lock'

## Example

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

