---
title: Working Set
---

# Working Set

## What is a Working Set?

Doltgres has three kinds of changes: committed, staged and working. The working set is the set of
changes that has not been staged or committed. To stage a change in a table you `dolt_add()` it to
the staging set. The staging set is committed by issuing a `dolt_commit()` command and supplying the
appropriate metadata.

If you start a Doltgres SQL server and start making changes, you are making changes to the working
set. If you never make a commit, your working set is a standard Postgres database. So, a way to think
about your working set is Doltgres without version control features, just a standard Postgres
relational database.

## How to use Working Sets

Working sets are used to isolate changes to your database from committed schema or data. Each branch
gets it's own working set so you can make changes in isolation. If you don't like the changes made
to a working set, you can `dolt_reset()` or `dolt_checkout()` to the previous commit.

## Difference between Git Working Sets and Doltgres Working Sets

Git working sets change files. Doltgres working sets change tables.

On the command line, working set changes do follow to the newly checked out branch, just like
Git. However, in SQL server mode, working set changes are not transferred to the newly checked out
branch when you do a `call dolt_checkout()`. The working set changes stay on the branch they were
originally made. This change was made to account for multiple users using the same branch in SQL
server mode.

## Example

### Make changes in a working set

```sql
insert into docs values (3,0);
select * from dolt_status;
+------------+--------+----------+
| table_name | staged | status   |
+------------+--------+----------+
| docs       | false  | modified |
+------------+--------+----------+
```

### See what's changed in your working set

```sql
select * from dolt_diff('HEAD', 'WORKING', 'docs');
+-------+-------+-----------+----------------------------+---------+---------+-------------+-------------------------+-----------+
| to_pk | to_c1 | to_commit | to_commit_date             | from_pk | from_c1 | from_commit | from_commit_date        | diff_type |
+-------+-------+-----------+----------------------------+---------+---------+-------------+-------------------------+-----------+
| 3     | 0     | WORKING   | 2024-04-30 22:59:20.504853 | NULL    | NULL    | HEAD        | 2024-04-30 22:57:42.846 | added     |
+-------+-------+-----------+----------------------------+---------+---------+-------------+-------------------------+-----------+
```

### Reset a change to your working set

```sql
call dolt_reset('--hard');
select * from docs;
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
+----+----+
```

### Checkout a branch

```sql
insert into docs values (4,4);
select * from docs;
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
| 3  | 0  |
| 4  | 4  |
+----+----+
call dolt_checkout('branch2');
+--------+
| status |
+--------+
| 0      |
+--------+
select * from docs ;
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
| 3  | 0  |
+----+----+
```
