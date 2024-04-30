---
title: Merge
---

# Merge

## What is a merge?

A merge is an operation that takes two branches and assembles a reasonable combination of the two
databases represented by those branches. The merge may or may not generate
[conflicts](./conflicts.md). Merges happen at the Dolt storage layer. No SQL is used to merge.

A merge is triggered with the `DOLT_MERGE()` procedure.

Dolt implements one merge strategy. The Dolt merge strategy will generally produce reasonable
results. For schema, if the two branches modify different tables or columns, no conflict is
generated. For data, Dolt does a cell-wise merge of data. See [conflicts](./conflicts.md) for
details on when conflicts are generated and when they are not.

A commit that is created on a branch where a merge operation took place has two parent commits.

There is a special type of merge call a "Fast-forward" merge. Fast-forward merges happen when no
changes happened on the branch you are merging into since you branched. In the commit log,
fast-forward merges do not create merge commits, they just append the current branch's commits to
the end of the branch you are merging into.

## How to use merges

Merges are a fundamental building block used to power distributed writes to Dolt. Dolt merges are
used to combine two copies of a database into one copy.

Dolt merges are used implicitly in SQL transactions. 

Dolt merges are used explicitly in write isolation use cases. Make changes on a branch, examine the
differences, and make a commit when you are satisfied the database looks as you expect. Switch to
another branch and merge your changes into that branch. Examine the differences if it is not a
fast-forward merge and make sure the branch looks as you expect. Make a commit to preserve the
merged copy of your database.

## Difference between Git merges and Dolt merges

Conceptually merges in Git and Dolt are the same. Practically, Dolt merges can only have two
parents. Merges in Git can have N parents.

## Example

```sql
call dolt_checkout('-b', 'check-out-new-branch');
insert into docs values (10,10);
call dolt_commit('-am', 'Added a row on a branch');
call dolt_checkout('main');
select * from docs;
+----+----+
| pk | c1 |
+----+----+
| 1  | 1  |
| 2  | 1  |
+----+----+
call dolt_merge('check-out-new-branch');
select * from docs;
+----+----+
| pk | c1 |
+----+----+
| 1  | 1  |
| 2  | 1  |
| 10 | 10 |
+----+----+
```
