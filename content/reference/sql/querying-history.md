---
title: Querying database history
---

# Querying database history

Dolt databases allow you to query the data at any point in the commit
history. There are several ways to do so.

Please note: when querying history, the unit of snapshot is the dolt
commit. SQL transactions commits do not create a dolt commit by
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
supports an extension to the standard MySQL syntax to examine the
database schema for a previous revision:

```sql
SHOW TABLES AS OF 'kfvpgcf8pkd6blnkvv8e0kle8j6lug7a';
```

## Specifying a commit hash for an entire connection

You can connect to a non-HEAD, read-only database where every table is
locked to a particular commit. Use a connection string like this:

`mysql://127.0.0.1:3306/mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`

Or a `USE` statement. Note the backtick quoting, which is necessary
since the database identifier contains a slash character.

```sql
USE `mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`
```

Or specify the commit hash directly in the query. This is equivalent
to `AS OF`, but works in some queries where the `AS OF` syntax is not
supported.

```sql
show create table `mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`.myTable;
```

There are other variations on this as well. See the docs on [using
branches](branches.md) for more details.

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

