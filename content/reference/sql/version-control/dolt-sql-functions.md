---
title: Dolt SQL Functions
---

# Table of Contents
  
* [Informational Functions](#informational-functions)
  * [active\_branch()](#active_branch)
  * [dolt\_merge\_base()](#dolt_merge_base)
  * [hashof()](#hashof)
  * [dolt\_version()](#dolt_version)

* [Table Functions](#table-functions)
  * [dolt_diff()](#dolt_diff)

* [Version Control Functions](#version-control-functions) (deprecated)
  * [These are deprecated](#deprecation-warning), please use the
    equivalent [stored procedures](dolt-sql-procedures.md) instead.
  * [dolt\_add()](#dolt_add)
  * [dolt\_checkout()](#dolt_checkout)
  * [dolt\_commit()](#dolt_commit)
  * [dolt\_fetch()](#dolt_fetch)
  * [dolt\_merge()](#dolt_merge)
  * [dolt\_pull()](#dolt_pull)
  * [dolt\_push()](#dolt_push)
  * [dolt\_reset()](#dolt_reset)

# Informational Functions

## `ACTIVE_BRANCH()`

The `ACTIVE_BRANCH()` function returns the name of the currently
active branch for this session.

```sql
mysql> select active_branch();
+-----------------+
| active_branch() |
+-----------------+
| main            |
+-----------------+
```

## `DOLT_MERGE_BASE()`

`DOLT_MERGE_BASE()` returns the hash of the common ancestor between
two branches.

Consider the following branch structure:

```text
      A---B---C feature
     /
D---E---F---G main
```

The following would return the hash of commit `E`:

```sql
mysql> SELECT DOLT_MERGE_BASE('feature', 'main');
+------------------------------------+
| DOLT_MERGE_BASE('feature', 'main') |
+------------------------------------+
| tjj1kp2mnoad8crv6b94mh4a4jiq7ab2   |
+------------------------------------+
```

## `HASHOF()`

The `HASHOF()` function returns the commit hash of a branch or other
commit spec.

```sql
mysql> select hashof('main');
+----------------------------------+
| hashof('main')                   |
+----------------------------------+
| v391rm7r0t4989sgomv0rpn9ue4ugo6g |
+----------------------------------+
```

## `DOLT_VERSION()`

The `DOLT_VERSION()` function returns the version string for the Dolt
binary.

```sql
mysql> select dolt_version();
+----------------+
| dolt_version() |
+----------------+
| 0.40.4         |
+----------------+
```

# Table Functions

Table functions operate like regular SQL functions, but instead of returning a single, scalar value, a
table function returns rows of data, just like a table. Dolt's table function support is currently limited
to only the `DOLT_DIFF()` function and table functions have several restrictions in how they can be used in 
queries. For example, you cannot currently alias a table function or join a table function with another table
or table function. 

## `DOLT_DIFF()`

The `DOLT_DIFF()` table function calculates the differences in a table's data at any two commits in the database.
Each row in the result set describes how a row in the underlying table has changed between the two commits,
including the row's values at to and from commits and the type of change (i.e. `added`, `modified`, or `removed`).
`DOLT_DIFF()` is an alternative to the 
[`dolt_commit_diff_$tablename` system table](dolt-system-tables.md#dolt_commit_diff_usdtablename).
You should generally prefer the system tables when possible, since they have less restrictions on use. 
However, some use cases, such as viewing a table data diff containing schema changes, can be easier to view 
with the `DOLT_DIFF` table function.  

The main difference between the results of the `DOLT_DIFF()` table function and the `dolt_commit_diff_$tablename`
system table is the schema of the returned results. `dolt_commit_diff_$tablename` generates the resulting schema
based on the table's schema at the currently checked out branch. `DOLT_DIFF()` will use the schema at the `from_commit`
for the `from_` columns and the schema at the `to_commit` for the `to_` columns. This can make it easier to view 
diffs where the schema of the underlying table has changed. 

Note that the `DOLT_DIFF()` table function currently has restrictions on how it can be used in queries. It does not
support aliasing or joining with other tables, and argument values must currently be literal values. 

### Options

```sql
DOLT_DIFF(<tablename>, <from_revision>, <to_revision>)
```
The `DOLT_DIFF()` table function takes three required arguments:
* `tablename`  —  the name of the table containing the data to diff
* `from_revision`  — the revision of the table data for the start of the diff. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~").
* `to_revision`    — the revision of the table data for the end of the diff. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~").

### Schema 

```text
+------------------+----------+
| field            | type     |
+------------------+----------+
| from_commit      | TEXT     |
| from_commit_date | DATETIME |
| to_commit        | TEXT     |
| to_commit_date   | DATETIME |
| diff_type        | TEXT     |
| other cols       |          |
+------------------+----------+
```

The remaining columns are dependent on the schema of the user table as it existed at the `from_commit` and at 
the `to_commit`. For every column `X` in your table at the `from_commit` revision, there is a column in the result 
set named `from_X`. Likewise, for every column `Y` in your table at the `to_commit` revision, there is a column
in the result set named `to_Y`. This is the major difference between the `DOLT_DIFF()` table function and the
`dolt_commit_diff_$tablename` system table – `DOLT_DIFF()` uses the two schemas at the `to_commit` and 
`from_commit` revisions to form the to and from columns of the result set, while `dolt_commit_diff_$tablename` uses
only the table schema of the currently checked out branch to form the to and from columns of the result set.   

### Example 

Consider a table named `inventory` in a database with two branches: `main` and `feature_branch`. We can use the
`DOLT_DIFF()` function to calculate a diff of the table data from the `main` branch to the `feature_branch` branch
to see how our data has changed on the feature branch. 

Here is the schema of `inventory` at the tip of `main`:
```text
+----------+------+
| field    | type |
+----------+------+
| pk       | int  |
| name     | text |
| quantity | int  |
+----------+------+
```

Here is the schema of `inventory` at the tip of `feature_branch`:
```text
+----------+------+
| field    | type |
+----------+------+
| pk       | int  |
| name     | text |
| color    | text |
| size     | int  |
+----------+------+
```

Based on the schemas at the two revision above, the resulting schema from `DOLT_DIFF()` will be:
```text
+------------------+----------+
| field            | type     |
+------------------+----------+
| from_pk          | int      |
| from_name        | text     |
| from_quantity    | int      |
| from_commit      | TEXT     |
| from_commit_date | DATETIME |
| to_pk            | int      |
| to_name          | text     |
| to_color         | text     |
| to_size          | int      |
| to_commit        | TEXT     |
| to_commit_date   | DATETIME |
| diff_type        | text     |
+------------------+----------+
```

To calculate the diff and view the results, we run the following query: 

```sql
SELECT * FROM DOLT_DIFF("inventory", "main", "feature_branch")
```

The results from `DOLT_DIFF()` show how the data has changed going from `main` to `feature_branch`:
```text
+---------+-------+---------+----------+----------------+-----------------------------------+-----------+---------+---------------+-------------+-----------------------------------+-----------+
| to_name | to_pk | to_size | to_color | to_commit      | to_commit_date                    | from_name | from_pk | from_quantity | from_commit | from_commit_date                  | diff_type |
+---------+-------+---------+----------+----------------+-----------------------------------+-----------+---------+---------------+-------------+-----------------------------------+-----------+
| shirt   | 1     | 15      | false    | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | shirt     | 1       | 70            | main        | 2022-03-23 18:51:48.333 +0000 UTC | modified  |
| shoes   | 2     | 9       | brown    | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | shoes     | 2       | 200           | main        | 2022-03-23 18:51:48.333 +0000 UTC | modified  |
| pants   | 3     | 30      | blue     | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | pants     | 3       | 150           | main        | 2022-03-23 18:51:48.333 +0000 UTC | modified  |
| hat     | 4     | 6       | grey     | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | NULL      | NULL    | NULL          | main        | 2022-03-23 18:51:48.333 +0000 UTC | added     |
+---------+-------+---------+----------+----------------+-----------------------------------+-----------+---------+---------------+-------------+-----------------------------------+-----------+
```

# Version Control Functions 

## Deprecation Warning

All of the functions in this section have been deprecated and replaced
with their [stored procedure equivalents](dolt-sql-procedures.md).
They will be removed in a future release.

## `DOLT_ADD()`

Deprecated. Use the [DOLT\_ADD stored
procedure](dolt-sql-procedures.md#dolt_add).

```sql
SELECT DOLT_ADD('-A');
SELECT DOLT_ADD('.');
SELECT DOLT_ADD('table1', 'table2');
```

## `DOLT_CHECKOUT()`
Deprecated. Use the [DOLT\_CHECKOUT stored
procedure](dolt-sql-procedures.md#dolt_checkout) instead.

```sql
SELECT DOLT_CHECKOUT('-b', 'my-new-branch');
SELECT DOLT_CHECKOUT('my-existing-branch');
SELECT DOLT_CHECKOUT('my-table');
```

## `DOLT_COMMIT()`
Deprecated. Use the [DOLT\_COMMIT stored
procedure](dolt-sql-procedures.md#dolt_commit) instead.

```sql
SELECT DOLT_COMMIT('-a', '-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

## `DOLT_FETCH()`

Deprecated. Use the [DOLT\_FETCH stored
procedure](dolt-sql-procedures.md#dolt_fetch) instead.

```sql
SELECT DOLT_FETCH('origin', 'main');
SELECT DOLT_FETCH('origin', 'feature-branch');
SELECT DOLT_FETCH('origin', 'refs/heads/main:refs/remotes/origin/main');
```

## `DOLT_MERGE()`

Deprecated. Use the [DOLT\_MERGE stored
procedure](dolt-sql-procedures.md#dolt_merge) instead.

```sql
SELECT DOLT_MERGE('feature-branch'); -- Optional --squash parameter
SELECT DOLT_MERGE('feature-branch', '-no-ff', '-m', 'This is a msg for a non fast forward merge');
SELECT DOLT_MERGE('--abort');
```

## `DOLT_RESET()`

Deprecated. Use the [DOLT\_RESET stored
procedure](dolt-sql-procedures.md#dolt_reset) instead.

```sql
SELECT DOLT_RESET('--hard');
SELECT DOLT_RESET('my-table'); -- soft reset
```

## `DOLT_PUSH()`

Deprecated. Use the [DOLT\_PUSH stored
procedure](dolt-sql-procedures.md#dolt_push) instead.

```sql
SELECT DOLT_PUSH('origin', 'main');
SELECT DOLT_PUSH('--force', 'origin', 'main');
```

## `DOLT_PULL()`

Deprecated. Use the [DOLT\_PULL stored
procedure](dolt-sql-procedures.md#dolt_pull) instead.

```sql
SELECT DOLT_PULL('origin');
SELECT DOLT_PULL('feature-branch', '--force');
```
