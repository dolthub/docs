---
title: Querying database history
---

# Querying database history

Dolt databases allow you to query the data at any point in the commit
history. There are several ways to do so.

Please note: when querying history, the unit of snapshot is the dolt
commit. SQL transaction commits do not create a dolt commit by
default.

## Querying past snapshots with `AS OF`

Dolt SQL supports a variant of [SQL
2011](https://en.wikipedia.org/wiki/SQL:2011) syntax to query non-HEAD
revisions of a database via the `AS OF` clause:

```sql
SELECT * FROM myTable AS OF 'kfvpgcf8pkd6blnkvv8e0kle8j6lug7a';
SELECT * FROM myTable AS OF 'myBranch';
SELECT * FROM myTable AS OF 'HEAD^2';
SELECT * FROM myTable AS OF TIMESTAMP('2020-01-01');
SELECT * FROM myTable AS OF 'myBranch' JOIN myTable AS OF 'yourBranch' AS foo;
```

The `AS OF` expression must name a valid Dolt reference, such as a
commit hash, branch name, or other reference. Timestamp / date values
are also supported. Each table in a query can use a different `AS OF`
clause.

In addition to this `AS OF` syntax for `SELECT` statements, Dolt also
supports various extensions to the standard MySQL syntax to examine
the schemas of snapshots:

```sql
SHOW TABLES AS OF 'kfvpgcf8pkd6blnkvv8e0kle8j6lug7a';
SHOW CREATE TABLE myTable AS OF 'myBranch';
DESCRIBE myTable AS OF 'HEAD~';
```

Note that `AS OF` always names a revision at a specific Dolt commit. Changes on a branch's [working
set](../../../concepts/git/working-set.md) that have not been committed to that head via `call
dolt_commit()` or similar are not visible via this syntax.

## Specifying a revision in the database name

You can connect to any commit in the database history by including its commit hash in the name of
the database, like this:

`mysql://127.0.0.1:3306/mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`

The database will be read-only in this case. You can do the same thing on an existing connection
with a `USE` statement.

```sql
USE mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p
```

Or specify the commit hash directly in the query. This is equivalent
to `AS OF`, but works in some queries where the `AS OF` syntax is not
supported.

```sql
show create table `mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`.myTable;
```

There are other variations on this as well. See the docs on [using
branches](branches.md) for more details.

Note that this syntax applied to a branch will name that branch's [working
set](../../../concepts/git/working-set.md) and therefore includes any changes not yet committed to
the HEAD of the branch.

## Querying history using dolt system tables

For every table in the database, dolt also provides a set of system
tables that you can query to see past values of rows, diffs between
revisions, and more.

the `dolt_history` tables provide a row for every revision of a row in
a table.

```sql
SELECT * FROM dolt_history_mytable
WHERE state = "Virginia"
ORDER BY "commit_date"

+----------+------------+----------+-------------+-----------+---------------------------------+
| state    | population | capital  | commit_hash | committer | commit_date                     |
+----------+------------+----------+-------------+-----------+---------------------------------+
| Virginia | 691937     | NULL     | ...         | billybob  | 1790-01-09 00:00:00.0 +0000 UTC |
| Virginia | 807557     | Richmond | ...         | billybob  | 1800-01-01 00:00:00.0 +0000 UTC |
| Virginia | 877683     | NULL     | ...         | billybob  | 1810-01-01 00:00:00.0 +0000 UTC |
+----------+------------+----------+-------------+-----------+---------------------------------+
```

To query how rows changed between two commits, use the
`dolt_commit_diff` and `dolt_diff` tables.

```sql
SELECT * FROM dolt_commit_diff_mytable
WHERE to_commit = HASHOF('HEAD')
AND from_commit = HASHOF('HEAD~')
ORDER BY state, to_commit_date;
```

For more information, see the [system table
docs](dolt-system-tables.md).

## Querying historical view data

Database views are an edge case for historical queries. When you have
a database view whose definition has changed, querying it with `AS OF`
will use the current definition of the view, but use rows from the
tables as they existed at the revision provided.

To query the historical definition of a view, you must checkout the
database at a particular commit. You can do this by [changing your
branch](./branches.md), e.g.:

```sql
call dolt_checkout('-b', 'old-view-def', '81223g1cpmib215gmov8686b6310p37d');
```

You can also do this without changing your session's branch by using a
commit hash-qualified database identifier when referencing the view.

Consider this example:

```sql
-- Past data
view_test> select * from t1 as of '81223g1cpmib215gmov8686b6310p37d';
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
+---+---+
-- Past view definition
view_test> show create table `view_test/81223g1cpmib215gmov8686b6310p37d`.v1;
+------+--------------------------------------+
| View | Create View                          |
+------+--------------------------------------+
| v1   | CREATE VIEW `v1` AS select * from t1 |
+------+--------------------------------------+
-- Current data
view_test> select * from t1;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
+---+---+
-- Current view definition
view_test> show create table v1;
+------+-----------------------------------------------+
| View | Create View                                   |
+------+-----------------------------------------------+
| v1   | CREATE VIEW `v1` AS select a+10, b+10 from t1 |
+------+-----------------------------------------------+
-- Select past data using current view definition
view_test> select * from v1 as of '81223g1cpmib215gmov8686b6310p37d';
+------+------+
| a+10 | b+10 |
+------+------+
| 11   | 11   |
| 12   | 12   |
+------+------+
-- Select past data using past view definition
view_test> select * from `view_test/81223g1cpmib215gmov8686b6310p37d`.v1;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
+---+---+
-- Select past data using past view definition by checking out a new branch
view_test> call dolt_checkout('-b', 'old-view-def', '81223g1cpmib215gmov8686b6310p37d');
view_test> select * from v1;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
+---+---+
```
