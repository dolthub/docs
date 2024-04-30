---
title: Branch
---

# Branch

## What is a Branch?

A branch adds non-distributed, write isolation to Doltgres. A branch can be thought of as a long
running transaction. If you have a set of database changes that logically should be grouped together
or reviewed together, you make those changes on a branch.

A branch is a named reference that starts with a parent commit. When creating a branch you define
it's parent commit and then effectively you have created a new copy of the Doltgres
database. Changes to the branch only effect that branch. As you commit to the branch the head of the
branch changes to the new commit.

You can merge two branches together using the `DOLT_MERGE()` procedure. This creates a commit in the
graph with two parents.

Your Doltgres database starts with one named branch, `main`. The name is configurable.

Branches differ from tags which is a named commit that does not change.

## How to use Branches

Branches can be used on a running Doltgres server for write isolation or parallelism. Writes to a
branch do not affect another branch until a merge.

In traditional SQL databases, transactions are designed to be short lived. The rows you change in a
transaction are essentially locked for the duration of the transaction. Because Doltgres allows for
merge and more complex conflict resolution than traditional SQL databases, Doltgres can essentially
support long running transactions on branches.

See [the branches section in reference](../../reference/sql/version-control/branches.md) for a
deeper dive into how to use branches in the SQL server context.

## Difference between Git branch and Doltgres branch

Conceptually Git branches and Doltgres branches are the same.

In Doltgres, branches become a slightly more important concept in server mode. In Git, you often are
working on a clone of your repository locally. Thus, your write isolation can be at the clone
level. With Doltgres, your application will be coordinating writes to a single server through
branches.

## Example

```sql
CALL dolt_branch('new-branch');
CALL dolt_checkout('-b', 'check-out-new-branch');
select * from dolt_branches;
+----------------------+----------------------------------+------------------+------------------------+-----------------------------------+------------------------------+
| name                 | hash                             | latest_committer | latest_committer_email | latest_commit_date                | latest_commit_message        |
+----------------------+----------------------------------+------------------+------------------------+-----------------------------------+------------------------------+
| check-out-new-branch | f0ga78jrh4llc0uus8h2refopp6n870m | Tim Sehn         | tim@dolthub.com        | 2021-12-06 13:39:57.705 -0800 PST | Removed row from no_pk table |
| main                 | f0ga78jrh4llc0uus8h2refopp6n870m | Tim Sehn         | tim@dolthub.com        | 2021-12-06 13:39:57.705 -0800 PST | Removed row from no_pk table |
| new-branch           | f0ga78jrh4llc0uus8h2refopp6n870m | Tim Sehn         | tim@dolthub.com        | 2021-12-06 13:39:57.705 -0800 PST | Removed row from no_pk table |
+----------------------+----------------------------------+------------------+------------------------+-----------------------------------+------------------------------+
```

