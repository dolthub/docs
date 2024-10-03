---
title: Dolt SQL Functions
---

# Table of Contents

- [Informational Functions](#informational-functions)

  - [active_branch()](#active_branch)
  - [dolt_merge_base()](#dolt_merge_base)
  - [dolt_hashof()](#dolt_hashof)
  - [dolt_hashof_table()](#dolt_hashof_table)
  - [dolt_hashof_db()](#dolt_hashof_table)
  - [dolt_version()](#dolt_version)
  - [has_ancestor()](#has_ancestor)

- [Table Functions](#table-functions)

  - [dolt_diff()](#dolt_diff)
  - [dolt_diff_stat()](#dolt_diff_stat)
  - [dolt_diff_summary()](#dolt_diff_summary)
  - [dolt_log()](#dolt_log)
  - [dolt_patch()](#dolt_patch)
  - [dolt_reflog()](#dolt_reflog)
  - [dolt_schema_diff()](#dolt_schema_diff)
  - [dolt_query_diff()](#dolt_query_diff)

# Informational Functions

## `ACTIVE_BRANCH()`

The `ACTIVE_BRANCH()` function returns the name of the currently
active branch for this session.

{% embed url="https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=select+active_branch%28%29%3B" %}

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

{% embed url="https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=SELECT+DOLT_MERGE_BASE%28%27feature%27%2C+%27main%27%29%3B" %}

## `DOLT_HASHOF()`

The `DOLT_HASHOF()` function returns the commit hash of a branch or other commit spec.

{% embed url="https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=select+dolt_hashof%28%27main%27%29%3B" %}

## `DOLT_HASHOF_TABLE()`

The `DOLT_HASHOF_TABLE()` function returns the value hash of a table. The hash is the hash of all the rows in the table,
and is dependent on their serialization format. As such a table could have the same rows, but different hashes if the
serialization format has changed, however if a table hash has not changed, then it's guaranteed that the table's data has
not changed.

This function can be used to watch for changes in data by storing previous hashes in your application and comparing them
to the current hash. For example, you can use this function to get the hash of a table named `color` like so:

```sql
SELECT dolt_hashof_table('color');
+----------------------------------+
| dolt_hashof_table('color')       |
+----------------------------------+
| q8t28sb3h5g2lnhiojacpi7s09p4csjv |
+----------------------------------+
1 row in set (0.01 sec)
```

## `DOLT_HASHOF_DB()`

The `DOLT_HASHOF_DB()` function returns the value hash of the entire versioned database. The hash is the hash of all tables
(schema and data) in the database, and includes additional versioned items such as stored procedures and triggers. The hash
does not include unversioned items such as tables which have been [ignored](dolt-system-tables.md#dolt_ignore). The function
takes an optional argument to specify a branch or one of the values of 'STAGED', 'WORKING', or 'HEAD' (default no argument select
is equivalent to 'WORKING').

This function can be used to watch for changes in the database by storing previous hashes in your application and comparing them
to the current hash. For example, you can use this function to get the hash of the entire database like so:

```sql
mysql> SELECT dolt_hashof_db();
+----------------------------------+
| dolt_hashof_db()                 |
+----------------------------------+
| 1q8t28sb3h5g2lnhiojacpi7s09p4csj |
+----------------------------------+
```

It should be noted that if you are connected to branch 'main' and you select `dolt_hashof_db('feature')`, the hash may be different
than if you were connected to branch 'feature' and called `dolt_hashof_db()`. This happens if there exist changes to the working set on
branch 'feature' that have not been committed. Calling `dolt_hashof_db('feature')` while on 'main' is equivalent to calling
`dolt_hashof_db('HEAD')` while on branch 'feature'.

The general recommendation when trying to look for changes to the database is to connect to the branch you want to use, then
select `dolt_hashof_db()` without any arguments. Any change in the hash means that the database has changed.

## `DOLT_VERSION()`

The `DOLT_VERSION()` function returns the version string for the Dolt
binary.

```sql
select dolt_version();
+----------------+
| dolt_version() |
+----------------+
| 0.40.4         |
+----------------+
```

## `HAS_ANCESTOR()`

The `HASH_ANCESTOR(target, ancestor)` function returns a `boolean` indicating whether a
candidate `ancestor` commit is in the commit graph of the `target` ref.

Consider the example commit graph from above:

```text
      A---B---C feature
     /
D---E---F---G main
```

A hypothetical example where we substitute letters for commit
hashes would look like:

```sql
select has_ancestor('feature', 'A'); -- true
select has_ancestor('feature', 'E'); -- true
select has_ancestor('feature', 'F'); -- false
select has_ancestor('main', 'E');    -- true
select has_ancestor('G', 'main');    -- true
```

# Table Functions

Table functions operate like regular SQL functions, but instead of returning a single,
scalar value, a table function returns rows of data, just like a table. Dolt's table
functions have several restrictions in how they can be used in queries. For example, you
cannot currently alias a table function or join a table function with another table or
table function.

## `DOLT_DIFF()`

The `DOLT_DIFF()` table function calculates the differences in a table's data at any two commits in the database.
Each row in the result set describes how a row in the underlying table has changed between the two commits,
including the row's values at to and from commits and the type of change (i.e. `added`, `modified`, or `removed`).
`DOLT_DIFF()` is an alternative to the
[`dolt_commit_diff_$tablename` system table](dolt-system-tables.md#dolt_commit_diff_usdtablename).
You should generally prefer the system tables when possible, since they have less restrictions on use.
However, some use cases, such as viewing a table data diff containing schema changes or viewing the [three dot diff](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log/#three-dot-diff),
can be easier to view with the `DOLT_DIFF` table function.

The main difference between the results of the `DOLT_DIFF()` table function and the `dolt_commit_diff_$tablename`
system table is the schema of the returned results. `dolt_commit_diff_$tablename` generates the resulting schema
based on the table's schema at the currently checked out branch. `DOLT_DIFF()` will use the schema at the `from_commit`
for the `from_` columns and the schema at the `to_commit` for the `to_` columns. This can make it easier to view
diffs where the schema of the underlying table has changed.

Note that the `DOLT_DIFF()` table function currently requires that argument values be literal values.

### Options

```sql
DOLT_DIFF(<from_revision>, <to_revision>, <tablename>)
DOLT_DIFF(<from_revision..to_revision>, <tablename>)
DOLT_DIFF(<from_revision...to_revision>, <tablename>)
```

The `DOLT_DIFF()` table function takes either two or three required arguments:

- `from_revision` — the revision of the table data for the start of the diff. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~").
- `to_revision` — the revision of the table data for the end of the diff. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~").
- `from_revision..to_revision` — gets the two dot diff, or revision of table data between the `from_revision` and `to_revision`. This is equivalent to `dolt_diff(<from_revision>, <to_revision>, <tablename>)`.
- `from_revision...to_revision` — gets the three dot diff, or revision of table data between the `from_revision` and `to_revision`, _starting at the last common commit_.
- `tablename` — the name of the table containing the data to diff.

### Schema

```sql
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

```sql
+----------+------+
| field    | type |
+----------+------+
| pk       | int  |
| name     | text |
| quantity | int  |
+----------+------+
```

Here is the schema of `inventory` at the tip of `feature_branch`:

```sql
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

```sql
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
SELECT * FROM DOLT_DIFF("main", "feature_branch", "inventory")
```

The results from `DOLT_DIFF()` show how the data has changed going from `main` to `feature_branch`:

```sql
+---------+-------+---------+----------+----------------+-----------------------------------+-----------+---------+---------------+-------------+-----------------------------------+-----------+
| to_name | to_pk | to_size | to_color | to_commit      | to_commit_date                    | from_name | from_pk | from_quantity | from_commit | from_commit_date                  | diff_type |
+---------+-------+---------+----------+----------------+-----------------------------------+-----------+---------+---------------+-------------+-----------------------------------+-----------+
| shirt   | 1     | 15      | false    | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | shirt     | 1       | 70            | main        | 2022-03-23 18:51:48.333 +0000 UTC | modified  |
| shoes   | 2     | 9       | brown    | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | shoes     | 2       | 200           | main        | 2022-03-23 18:51:48.333 +0000 UTC | modified  |
| pants   | 3     | 30      | blue     | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | pants     | 3       | 150           | main        | 2022-03-23 18:51:48.333 +0000 UTC | modified  |
| hat     | 4     | 6       | grey     | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | NULL      | NULL    | NULL          | main        | 2022-03-23 18:51:48.333 +0000 UTC | added     |
+---------+-------+---------+----------+----------------+-----------------------------------+-----------+---------+---------------+-------------+-----------------------------------+-----------+
```

#### Three dot `DOLT_DIFF`

Let's say the above database has a commit graph that looks like this:

```text
A - B - C - D (main)
         \
          E - F (feature_branch)
```

The example above gets the two dot diff, or differences between two revisions: `main` and `feature_branch`.
`dolt_diff('main', 'feature_branch', 'inventory')` (equivalent to `dolt_diff('main..feature_branch', 'inventory')`)
outputs the difference from F to D (i.e. with effects of E and F).

Three dot diff is useful for showing differences introduced by a feature branch from the point at which it _diverged_
from the main branch. Three dot diff is used to show pull request diffs.

Therefore, `dolt_diff('main...feature_branch')` outputs just the differences in `feature_branch` (i.e. E and F).

Learn more about two vs three dot diff [here](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log).

## `DOLT_DIFF_STAT()`

The `DOLT_DIFF_STAT()` table function calculates the data difference stat between any two commits
in the database. Schema changes such as creating a new table with no rows, or deleting a table with no rows will
return empty result. Each row in the result set describes a diff stat for a single table with statistics information of
number of rows unmodified, added, deleted and modified, number of cells added, deleted and modified and total number of
rows and cells the table has at each commit.

For keyless tables, this table function only provides the number of added and deleted rows. It
returns empty result for tables with no data changes.

Note that the `DOLT_DIFF_STAT()` table function currently requires that argument values be literal values.

### Privileges

`DOLT_DIFF_STAT()` table function requires `SELECT` privilege for all tables if no table is defined or
for the defined table only.

### Options

```sql
DOLT_DIFF_STAT(<from_revision>, <to_revision>, <optional_tablename>)
DOLT_DIFF_STAT(<from_revision..to_revision>, <optional_tablename>)
DOLT_DIFF_STAT(<from_revision...to_revision>, <optional_tablename>)
```

The `DOLT_DIFF_STAT()` table function takes three arguments:

- `from_revision` — the revision of the table data for the start of the diff. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `to_revision` — the revision of the table data for the end of the diff. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `from_revision..to_revision` — gets the two dot diff stat, or revision of table data between the `from_revision` and `to_revision`. This is equivalent to `dolt_diff_stat(<from_revision>, <to_revision>, <tablename>)`.
- `from_revision...to_revision` — gets the three dot diff stat, or revision of table data between the `from_revision` and `to_revision`, _starting at the last common commit_.
- `tablename` — the name of the table containing the data to diff. This argument is optional. When it's not defined, all tables with data diff will be returned.

### Schema

```sql
+-----------------+--------+
| field           | type   |
+-----------------+--------+
| table_name      | TEXT   |
| rows_unmodified | BIGINT |
| rows_added      | BIGINT |
| rows_deleted    | BIGINT |
| rows_modified   | BIGINT |
| cells_added     | BIGINT |
| cells_deleted   | BIGINT |
| cells_modified  | BIGINT |
| old_row_count   | BIGINT |
| new_row_count   | BIGINT |
| old_cell_count  | BIGINT |
| new_cell_count  | BIGINT |
+-----------------+--------+
```

### Example

Consider we start with a table `inventory` in a database on `main` branch. When we make any changes, we can use
the `DOLT_DIFF_STAT()` function to calculate a diff of the table data or all tables with data changes across specific
commits.

Here is the schema of `inventory` at the tip of `main`:

```sql
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| pk       | int         | NO   | PRI | NULL    |       |
| name     | varchar(50) | YES  |     | NULL    |       |
| quantity | int         | YES  |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
```

Here is what table `inventory` has at the tip of `main`:

```sql
+----+-------+----------+
| pk | name  | quantity |
+----+-------+----------+
| 1  | shirt | 15       |
| 2  | shoes | 10       |
+----+-------+----------+
```

We perform some changes to the `inventory` table and create new keyless table:

```sql
ALTER TABLE inventory ADD COLUMN color VARCHAR(10);
INSERT INTO inventory VALUES (3, 'hat', 6, 'red');
UPDATE inventory SET quantity=0 WHERE pk=1;
CREATE TABLE items (name varchar(50));
INSERT INTO items VALUES ('shirt'),('pants');
```

Here is what table `inventory` has in the current working set:

```sql
+----+-------+----------+-------+
| pk | name  | quantity | color |
+----+-------+----------+-------+
| 1  | shirt | 0        | NULL  |
| 2  | shoes | 10       | NULL  |
| 3  | hat   | 6        | red   |
+----+-------+----------+-------+
```

To calculate the diff and view the results, we run the following query:

```sql
SELECT * FROM DOLT_DIFF_STAT('main', 'WORKING');
```

The results from `DOLT_DIFF_STAT()` show how the data has changed going from tip of `main` to our current working set:

```sql
+-------------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
| table_name        | rows_unmodified | rows_added | rows_deleted | rows_modified | cells_added | cells_deleted | cells_modified | old_row_count | new_row_count | old_cell_count | new_cell_count |
+-------------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
| public.inventory  | 1               | 1          | 0            | 1             | 6           | 0             | 1              | 2             | 3             | 6              | 12             |
| public.items      | NULL            | 2          | 0            | NULL          | NULL        | NULL          | NULL           | NULL          | NULL          | NULL           | NULL           |
+-------------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
```

To get a table specific changes going from the current working set to tip of `main`, we run the following query:

```sql
SELECT * FROM DOLT_DIFF_STAT('WORKING', 'main', 'inventory');
```

With result of single row:

```sql
+-------------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
| table_name        | rows_unmodified | rows_added | rows_deleted | rows_modified | cells_added | cells_deleted | cells_modified | old_row_count | new_row_count | old_cell_count | new_cell_count |
+-------------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
| public.inventory  | 1               | 0          | 1            | 1             | 0           | 6             | 1              | 3             | 2             | 12             | 6              |
+-------------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
```

## `DOLT_DIFF_SUMMARY()`

_The previous version of `dolt_diff_summary` was renamed to `dolt_diff_stat`._

The `DOLT_DIFF_SUMMARY()` table function is a summary of what tables changed and how
between any two commits in the database. Only changed tables will be listed in the result,
along with the diff type ('added', 'dropped', 'modified', 'renamed') and whether there are
data and schema changes.

It returns empty result if there are no tables with changes.

Note that the `DOLT_DIFF()` table function currently requires that argument values be literal values.

### Privileges

`DOLT_DIFF_SUMMARY()` table function requires `SELECT` privilege for all tables if no
table is defined or for the defined table only.

### Options

```sql
DOLT_DIFF_SUMMARY(<from_revision>, <to_revision>, <optional_tablename>)
DOLT_DIFF_SUMMARY(<from_revision..to_revision>, <optional_tablename>)
DOLT_DIFF_SUMMARY(<from_revision...to_revision>, <optional_tablename>)
```

The `DOLT_DIFF_SUMMARY()` table function takes three arguments:

- `from_revision` — the revision of the table data for the start of the diff. This
  argument is required. This may be a commit, tag, branch name, or other revision
  specifier (e.g. "main~", "WORKING", "STAGED").
- `to_revision` — the revision of the table data for the end of the diff. This argument is
  required. This may be a commit, tag, branch name, or other revision specifier (e.g.
  "main~", "WORKING", "STAGED").
- `from_revision..to_revision` — gets the two dot diff summary, or revision of table data
  between the `from_revision` and `to_revision`. This is equivalent to
  `dolt_diff_summary(<from_revision>, <to_revision>, <tablename>)`.
- `from_revision...to_revision` — gets the three dot diff summary, or revision of table data
  between the `from_revision` and `to_revision`, _starting at the last common commit_.
- `tablename` — the name of the table containing the data to diff. This argument is
  optional. When it's not defined, all tables with data diff will be returned.

### Schema

```sql
+-----------------+---------+
| field           | type    |
+-----------------+---------+
| from_table_name | TEXT    |
| to_table_name   | TEXT    |
| diff_type       | TEXT    |
| data_change     | BOOLEAN |
| schema_change   | BOOLEAN |
+-----------------+---------+
```

### Example

Consider we start with a table `inventory` in a database on `main` branch. When we make
any changes, we can use the `DOLT_DIFF_SUMMARY()` function to calculate a diff of the
table data or all tables with data changes across specific commits.

Here is the schema of `inventory` at the tip of `main`:

```sql
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| pk       | int         | NO   | PRI | NULL    |       |
| name     | varchar(50) | YES  |     | NULL    |       |
| quantity | int         | YES  |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
```

Here is what table `inventory` has at the tip of `main`:

```sql
+----+-------+----------+
| pk | name  | quantity |
+----+-------+----------+
| 1  | shirt | 15       |
| 2  | shoes | 10       |
+----+-------+----------+
```

We perform some changes to the `inventory` table and create new keyless table:

```sql
ALTER TABLE inventory ADD COLUMN color VARCHAR(10);
INSERT INTO inventory VALUES (3, 'hat', 6, 'red');
UPDATE inventory SET quantity=0 WHERE pk=1;
CREATE TABLE items (name varchar(50));
```

Here is what table `inventory` has in the current working set:

```sql
+----+-------+----------+-------+
| pk | name  | quantity | color |
+----+-------+----------+-------+
| 1  | shirt | 0        | NULL  |
| 2  | shoes | 10       | NULL  |
| 3  | hat   | 6        | red   |
+----+-------+----------+-------+
```

To calculate the diff and view the results, we run the following query:

```sql
SELECT * FROM DOLT_DIFF_SUMMARY('main', 'WORKING');
```

The results from `DOLT_DIFF_SUMMARY()` show how the data has changed going from tip of
`main` to our current working set:

```sql
+-------------------+-------------------+-----------+-------------+---------------+
| from_table_name   | to_table_name     | diff_type | data_change | schema_change |
+-------------------+-------------------+-----------+-------------+---------------+
| public.inventory  | public.inventory  | modified  | 1           | 1             |
| public.items      | public.items      | added     | 0           | 1             |
+-------------------+-------------------+-----------+-------------+---------------+
```

To get a table specific changes going from the current working set to tip of `main`, we
run the following query:

```sql
SELECT * FROM DOLT_DIFF_SUMMARY('WORKING', 'main', 'inventory');
```

With result of single row:

```sql
+-------------------+-------------------+-----------+-------------+---------------+
| from_table_name   | to_table_name     | diff_type | data_change | schema_change |
+-------------------+-------------------+-----------+-------------+---------------+
| public.inventory  | public.inventory  | modified  | 1           | 1             |
+-------------------+-------------------+-----------+-------------+---------------+
```

## `DOLT_LOG()`

The `DOLT_LOG` table function gets the commit log for all commits reachable from the
provided revision's `HEAD` (or the current `HEAD` if no revision is provided).

Note that the `DOLT_LOG()` table function currently requires that argument values be literal values.

### Privileges

`DOLT_LOG()` table function requires `SELECT` privilege for all tables.

### Options

```sql
DOLT_LOG([<optional_revisions>...], [--tables <tables>...])
```

The `DOLT_LOG()` table function takes any number of optional revision arguments:

- `optional_revision`: a branch name, tag, or commit ref (with or without an ancestor
  spec) that specifies which ancestor commits to include in the results. If no revisions
  are specified, the default is the current branch `HEAD`.
  - If you'd like to get [two dot logs](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log/#two-dot-log)
    (all commits reachable by `revision2`, but NOT reachable by `revision1`), you can
    use `..` between revisions (`DOLT_LOG('revision1..revision2')`) or `^` in front of
    the revision you'd like to exclude (`DOLT_LOG('revision2', '^revision1')`). Note: if providing two
    revisions, one must contain `^`.
  - If you'd like to get [three dot logs](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log/#three-dot-log)
    (all commits reachable by `revision1` or `revision2`, excluding commits reachable by
    BOTH `revision1` AND `revision2`), you can use `...` between revisions (`DOLT_LOG('revision1...revision2')`).
- `--min-parents`: The minimum number of parents a commit must have to be included in the log.
- `--merges`: Equivalent to min-parents == 2, this will limit the log to commits with 2 or
  more parents.
- `--parents`: Shows all parents of each commit in the log.
- `--decorate`: Shows refs next to commits. Valid options are short, full, no, and auto. Defaults to "no".
- `--not`: Excludes commits reachable by revision.
- `--tables`: Limits the log to commits that affect the specified tables. Any number of comma separated tables can be specified.

### Schema

```sql
+-------------+----------+
| field       | type     |
+-------------+--------- +
| commit_hash | text     |
| committer   | text     |
| email       | text     |
| date        | datetime |
| message     | text     |
| parents     | text     | -- column hidden unless `--parents` flag provided
| refs        | text     | -- column hidden unless `--decorate` is "short" or "full"
+-------------+--------- +
```

### Example

Consider we have the following commit graph:

```text
A - B - C - D (main)
         \
          E - F (feature)
```

To get the commit log for the `main` branch, we can use the query:

```sql
SELECT * FROM DOLT_LOG('main');
```

And it would return commits in reverse-chronological order - `D`,`C`, `B`, and `A`. The
output will look something like:

```sql
+----------------------------------+-----------+--------------------+-----------------------------------+---------------+
| commit_hash                      | committer | email              | date                              | message       |
+----------------------------------+-----------+--------------------+-----------------------------------+---------------+
| qi331vjgoavqpi5am334cji1gmhlkdv5 | bheni     | brian@dolthub.com | 2019-06-07 00:22:24.856 +0000 UTC | update rating  |
| 137qgvrsve1u458briekqar5f7iiqq2j | bheni     | brian@dolthub.com | 2019-04-04 22:43:00.197 +0000 UTC | change rating  |
| rqpd7ga1nic3jmc54h44qa05i8124vsp | bheni     | brian@dolthub.com | 2019-04-04 21:07:36.536 +0000 UTC | fixes          |
| qfk3bpan8mtrl05n8nihh2e3t68t3hrk | bheni     | brian@dolthub.com | 2019-04-04 21:01:16.649 +0000 UTC | test           |
+----------------------------------+-----------+--------------------+-----------------------------------+---------------+
```

To get the commit log for the `feature` branch, we can change the revision in the above
query:

```sql
SELECT * FROM DOLT_LOG('feature');
```

And it would return all commits reachable from the `HEAD` of `feature` - `F`, `E`, `C`,
`B`, and `A`.

#### Two and three dot log

We also support two and three dot log. Two dot log returns commits from a revision,
excluding commits from another revision. If we want all commits in `feature`, excluding
commits from `main`, all of these queries will return commits `F` and `E`.

```sql
SELECT * FROM DOLT_LOG('main..feature');
SELECT * FROM DOLT_LOG('feature', '^main');
SELECT * FROM DOLT_LOG('feature', '--not', 'main');
```

Three dot log returns commits in either revision, excluding commits in BOTH revisions. If
we want commits in `main` OR `feature`, excluding commits in `main` AND `feature`, this
query would return commits `F`, `E`, and `D`.

```sql
SELECT * FROM DOLT_LOG('main...feature');
```

Note: The order of revisions in two dot log matters, but not for three dot log.
`DOLT_LOG('main..feature')` returns `F` and `E`, while `DOLT_LOG('feature..main')`
returns just `D`. `DOLT_LOG('main...feature')` and `DOLT_LOG('feature...main')`
both return `F`, `E`, and `D`.

Learn more about two vs three dot log [here](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log).

## `DOLT_PATCH()`

Generate the SQL statements needed to patch a table (or all tables) from a starting revision
to a target revision. This can be useful when you want to import data into Dolt from an external source,
compare differences, and generate the SQL statements needed to patch the original source.
Both schema and/or data diff statements are returned if applicable. Some data diff cannot be
produced from incompatible schema changes; these are shown as warnings containing
which table this occurred on.

The order of the statements is that the schema patch comes first after the data patch. If patching
all tables, then we recommend to turn off the foreign key checks (`SET foreign_key_checks=0;`)
before applying these patch statements in order to avoid conflicts.

### Privileges

`DOLT_PATCH()` table function requires `SELECT` privilege for all tables if no table is defined or
for the defined table only.

### Options

```sql
DOLT_PATCH(<from_revision>, <to_revision>, <optional_tablename>)
DOLT_PATCH(<from_revision..to_revision>, <optional_tablename>)
DOLT_PATCH(<from_revision...to_revision>, <optional_tablename>)
```

The `DOLT_PATCH()` table function takes the following arguments:

- `from_revision` — the revision of the table data for the start of the patch. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `to_revision` — the revision of the table data for the end of the patch. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `from_revision..to_revision` — gets the two dot patch, or revision of table data between the `from_revision` and `to_revision`. This is equivalent to `dolt_patch(<from_revision>, <to_revision>, <tablename>)`.
- `from_revision...to_revision` — gets the three dot patch, or revision of table data between the `from_revision` and `to_revision`, _starting at the last common commit_.
- `tablename` — the name of the table containing the data and/or schema to patch. This argument is optional. When it's not defined, all tables with data and/or schema patch will be returned.

### Schema

```sql
+------------------+--------+
| field            | type   |
+------------------+--------+
| statement_order  | BIGINT |
| from_commit_hash | TEXT   |
| to_commit_hash   | TEXT   |
| table_name       | TEXT   |
| diff_type        | TEXT   |
| statement        | TEXT   |
+------------------+--------+
```

### Example

Consider we start with a table `inventory` in a database on `main` branch. When we make any changes, we can use
the `DOLT_PATCH()` function to get SQL patch statements of the table data or all tables with data changes across specific
commits.

Here is the schema of `inventory` at the tip of `main`:

```sql
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| pk       | int         | NO   | PRI | NULL    |       |
| name     | varchar(50) | YES  |     | NULL    |       |
| quantity | int         | YES  |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
```

Here is what table `inventory` has at the tip of `main`:

```sql
+----+-------+----------+
| pk | name  | quantity |
+----+-------+----------+
| 1  | shirt | 15       |
| 2  | shoes | 10       |
+----+-------+----------+
```

We perform some changes to the `inventory` table and create new keyless table:

```sql
INSERT INTO inventory VALUES (3, 'hat', 6);
UPDATE inventory SET quantity=0 WHERE pk=1;
CREATE TABLE items (name varchar(50));
INSERT INTO items VALUES ('shirt'),('pants');
```

Here is what table `inventory` has in the current working set:

```sql
+----+-------+----------+
| pk | name  | quantity |
+----+-------+----------+
| 1  | shirt | 0        |
| 2  | shoes | 10       |
| 3  | hat   | 6        |
+----+-------+----------+
```

To get SQL patch statements, we run the following query:

```sql
SELECT * FROM DOLT_PATCH('main', 'WORKING');
```

The results from `DOLT_PATCH()` show how the data has changed going from tip of `main` to our current working set:

```sql
+-----------------+----------------------------------+----------------+-------------------+-----------+----------------------------------------------------------------------+
| statement_order | from_commit_hash                 | to_commit_hash | table_name        | diff_type | statement                                                            |
+-----------------+----------------------------------+----------------+-------------------+-----------+----------------------------------------------------------------------+
| 1               | gg4kasjl6tgrtoag8tnn1der09sit4co | WORKING        | public.inventory  | data      | UPDATE `inventory` SET `quantity`=0 WHERE `pk`=1;                    |
| 2               | gg4kasjl6tgrtoag8tnn1der09sit4co | WORKING        | public.inventory  | data      | INSERT INTO `inventory` (`pk`,`name`,`quantity`) VALUES (3,'hat',6); |
| 3               | gg4kasjl6tgrtoag8tnn1der09sit4co | WORKING        | public.items      | schema    | CREATE TABLE `items` (                                               |
|                 |                                  |                |                   |           |   `name` varchar(50)                                                 |
|                 |                                  |                |                   |           | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;    |
| 4               | gg4kasjl6tgrtoag8tnn1der09sit4co | WORKING        | public.items      | data      | INSERT INTO `items` (`name`) VALUES ('shirt');                       |
| 5               | gg4kasjl6tgrtoag8tnn1der09sit4co | WORKING        | public.items      | data      | INSERT INTO `items` (`name`) VALUES ('pants');                       |
+-----------------+----------------------------------+----------------+-------------------+-----------+----------------------------------------------------------------------+
```

To get a table specific schema patch going from the current working set to tip of `main`, we run the following query:

```sql
SELECT * FROM DOLT_PATCH('WORKING', 'main', 'items') WHERE diff_type = 'schema';
```

With result of single row:

```sql
+-----------------+------------------+----------------------------------+---------------+-----------+---------------------+
| statement_order | from_commit_hash | to_commit_hash                   | table_name    | diff_type | statement           |
+-----------------+------------------+----------------------------------+---------------+-----------+---------------------+
| 1               | WORKING          | gg4kasjl6tgrtoag8tnn1der09sit4co | public.items  | schema    | DROP TABLE `items`; |
+-----------------+------------------+----------------------------------+---------------+-----------+---------------------+
```

## `DOLT_REFLOG()`

The `DOLT_REFLOG()` table function shows the history of named refs (e.g. branches and tags), which is useful when you want to understand how a branch or tag has changed over time to reference different commits, particularly for information that isn't surfaced through the `dolt_log` system table or `dolt_log()` table function. For example, if you use `dolt_reset()` to change the commit a branch points to, you can use `dolt_reflog()` to see what commit the branch was pointing to before it was moved to that commit. Another common use case for `dolt_reflog()` is to recreate a branch or tag that was accidentally deleted. The example section below shows how to recreate a deleted branch.

The data from Dolt's reflog comes from [Dolt's journaling chunk store](https://www.dolthub.com/blog/2023-03-08-dolt-chunk-journal/). This data is local to a Dolt database and never included when pushing, pulling, or cloning a Dolt database. This means when you clone a Dolt database, it will not have any reflog data until you perform operations that change what commit branches or tags reference.

Dolt's reflog is similar to [Git's reflog](https://git-scm.com/docs/git-reflog), but there are a few differences:

- The Dolt reflog currently only supports named references, such as branches and tags, and not any of Git's special refs (e.g. `HEAD`, `FETCH-HEAD`, `MERGE-HEAD`).
- The Dolt reflog can be queried for the log of references, even after a reference has been deleted. In Git, once a branch or tag is deleted, the reflog for that ref is also deleted and to find the last commit a branch or tag pointed to you have to use Git's special `HEAD` reflog to find the commit, which can sometimes be challenging. Dolt makes this much easier by allowing you to see the history for a deleted ref so you can easily see the last commit a branch or tag pointed to before it was deleted.

### Privileges

There are no special privileges required to use the `dolt_reflog()` table function.

### Options

```sql
DOLT_REFLOG()
DOLT_REFLOG(['--all'], <ref_name>)
```

The `dolt_reflog()` table function can be called with no arguments or with one argument. If called without any arguments, it will return the full reference log, which lists changes from newest to oldest for all tracked references. If called with one argument, that argument is the name of a ref to query. This can be the name of a branch (e.g. "myBranch") or the name of a tag (e.g. "v1.1.4") or it can be the fully qualified ref path (e.g. "refs/heads/myBranch"). The `ref_name` parameter is case-insensitive.

The `dolt_reflog()` table function can also be called with the `--all` flag to show all refs, including hidden refs, such as DoltHub workspace refs.

### Schema

```sql
+-----------------------+-----------+
| field                 | type      |
+-----------------------+-----------+
| ref                   | TEXT      |
| ref_timestamp         | TIMESTAMP |
| commit_hash           | TEXT      |
| commit_message        | TEXT      |
+-----------------------+-----------+
```

### Example

The example below shows how to recreate a branch that was deleted by finding the last commit it referenced in Dolt's reflog.

```sql
-- Someone accidentally deletes the wrong branch!
select dolt_branch('-D', 'prodBranch');

-- After we realize the wrong branch has been deleted, we query the Dolt reflog on the same Dolt database instance
-- where the branch was deleted to see what commits the prodBranch branch has referenced. Using the same Dolt
-- instance is important, since reflog information is always local and not included when pushing/pulling databases.
select * from dolt_reflog('prodBranch');
+-----------------------+---------------------+----------------------------------+-------------------------------+
| ref                   | ref_timestamp       | commit_hash                      | commit_message                |
+-----------------------+---------------------+----------------------------------+-------------------------------+
| refs/heads/prodBranch | 2023-10-25 20:54:37 | v531ptpmv2tquig8v591tsjghtj84ksg | inserting row 42              |
| refs/heads/prodBranch | 2023-10-25 20:53:12 | rvt34lqrbtdr3dhnjchruu73lik4e398 | inserting row 100000          |
| refs/heads/prodBranch | 2023-10-25 20:53:06 | v531ptpmv2tquig8v591tsjghtj84ksg | inserting row 42              |
| refs/heads/prodBranch | 2023-10-25 20:52:43 | ihuj1l7fmqq37sjhtlrgpup5n76gfhju | inserting row 1 into table xy |
+-----------------------+---------------------+----------------------------------+-------------------------------+

-- The last commit prodBranch pointed to was v531ptpmv2tquig8v591tsjghtj84ksg, so to restore our branch, we
-- just need to create a branch with the same name, pointing to that last commit.
select dolt_branch('prodBranch', 'v531ptpmv2tquig8v591tsjghtj84ksg');
```

## `DOLT_SCHEMA_DIFF()`

The `DOLT_SCHEMA_DIFF()` table function calculates the schema difference between any two commits in the database.
Each row in the result set describes how a table was altered between the two commits, including the table's create statement at to and from commits.

Note that the `DOLT_SCHEMA_DIFF()` table function currently requires that argument values be literal values.

### Privileges

`DOLT_SCHEMA_DIFF()` table function requires `SELECT` privilege for all tables if no table is defined or
for the defined table only.

### Options

```sql
DOLT_SCHEMA_DIFF(<from_commit>, <to_commit>, <optional_tablename>)
DOLT_SCHEMA_DIFF(<from_revision..to_revision>, <optional_tablename>)
DOLT_SCHEMA_DIFF(<from_revision...to_revision>, <optional_tablename>)
```

The `DOLT_SCHEMA_DIFF()` table function takes three arguments:

- `from_revision` — the revision of the table data for the start of the diff. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `to_revision` — the revision of the table data for the end of the diff. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `from_revision..to_revision` — gets the two dot diff, or revision of table schema between the `from_revision` and `to_revision`. This is equivalent to `dolt_schema_diff(<from_revision>, <to_revision>, [<tablename>])`.
- `from_revision...to_revision` — gets the three dot diff, or revision of table schema between the `from_revision` and `to_revision`, _starting at the last common commit_.
- `tablename` — the name of the table to diff. This argument is optional. When it's not defined, all tables with schema diffs will be returned.

### Schema

```sql
+-----------------------+------+
| field                 | type |
+-----------------------+------+
| from_table_name       | TEXT |
| to_table_name         | TEXT |
| from_create_statement | TEXT |
| to_create_statement   | TEXT |
+-----------------------+------+
```

### Example

For this example, we'll consider three tables within the context of two branches: `main` and `feature_branch`.

These are the tables on `main`: `employees`, `inventory`, `vacations`.
These are the tables on `feature_branch`: `inventory`, `photos`, `trips`.

To figure out how these tables changed, we run the following query:

```sql
SELECT * FROM DOLT_SCHEMA_DIFF("main", "feature_branch")
```

The results from `DOLT_SCHEMA_DIFF()` show how the schema for all tables has changed going from tip of `main` to tip of `feature_branch`:

```sql
+-------------------+-------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
| from_table_name   | to_table_name     | from_create_statement                                             | to_create_statement                                               |
+-------------------+-------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
| public.employees  |                   | CREATE TABLE `employees` (                                        |                                                                   |
|                   |                   |   `pk` int NOT NULL,                                              |                                                                   |
|                   |                   |   `name` varchar(50),                                             |                                                                   |
|                   |                   |   PRIMARY KEY (`pk`)                                              |                                                                   |
|                   |                   | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; |                                                                   |
| public.inventory  | public.inventory  | CREATE TABLE `inventory` (                                        | CREATE TABLE `inventory` (                                        |
|                   |                   |   `pk` int NOT NULL,                                              |   `pk` int NOT NULL,                                              |
|                   |                   |   `name` varchar(50),                                             |   `name` varchar(50),                                             |
|                   |                   |   `quantity` int,                                                 |   `color` varchar(10),                                            |
|                   |                   |   PRIMARY KEY (`pk`)                                              |   PRIMARY KEY (`pk`)                                              |
|                   |                   | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; |
|                   | public.photos     |                                                                   | CREATE TABLE `photos` (                                           |
|                   |                   |                                                                   |   `pk` int NOT NULL,                                              |
|                   |                   |                                                                   |   `name` varchar(50),                                             |
|                   |                   |                                                                   |   `dt` datetime(6),                                               |
|                   |                   |                                                                   |   PRIMARY KEY (`pk`)                                              |
|                   |                   |                                                                   | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; |
| public.vacations  | public.trips      | CREATE TABLE `vacations` (                                        | CREATE TABLE `trips` (                                            |
|                   |                   |   `pk` int NOT NULL,                                              |   `pk` int NOT NULL,                                              |
|                   |                   |   `name` varchar(50),                                             |   `name` varchar(50),                                             |
|                   |                   |   PRIMARY KEY (`pk`)                                              |   PRIMARY KEY (`pk`)                                              |
|                   |                   | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; |
+-------------------+-------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
```

Let's look at the returned data.

1. The first row has values in `from_table_name` and `from_create_statement` columns, while `to_table_name` and `to_create_statement` columns are empty. This means that between `main` and `feature_branch`, the table `employees` was deleted.
2. The second row has identical values for `from_table_name` and `to_table_name`, but `from_create_statement` is different from `to_create_statement`. This means the table's schema changed between `main` and `feature_branch`.
3. The third row is similar to the first row, except its `to_*` columns are empty, and `from_*` columns are set. This means that between `main` and `feature_branch`, the table `photos` was added.
4. Finally, the last row has mostly identical `from_create_statement` and `to_create_statement` columns, but different `from_table_name` and `to_table_name` columns. This means the table was renamed changed between `main` and `feature_branch`.

We invoked `DOLT_SCHEMA_DIFF()` with branch names, but we could have used any revision specifier. For example, we could have used commit hashes or tag names, and would have gotten the same results.

Using tags or commit hashes:

```sql
select * from dolt_schema_diff('v1', 'v1.1');
select * from dolt_schema_diff('tjj1kp2mnoad8crv6b94mh4a4jiq7ab2', 'v391rm7r0t4989sgomv0rpn9ue4ugo6g');
```

So far, we have always supplied just the first two parameters, the `from` and `to` revisions, but we have not specified the optional table parameter, so `DOLT_SCHEMA_DIFF()` returned schema diffs of all changed tables.
We can scope `DOLT_SCHEMA_DIFF()` to a specific table simply by specifying it as the last parameter.

Let's try this with the `inventory` table.

```sql
SELECT * FROM DOLT_SCHEMA_DIFF("main", "feature_branch", "inventory")
```

We will see this set of results:

```sql
+-------------------+-------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
| from_table_name   | to_table_name     | from_create_statement                                             | to_create_statement                                               |
+-------------------+-------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
| public.inventory  | public.inventory  | CREATE TABLE `inventory` (                                        | CREATE TABLE `inventory` (                                        |
|                   |                   |   `pk` int NOT NULL,                                              |   `pk` int NOT NULL,                                              |
|                   |                   |   `name` varchar(50),                                             |   `name` varchar(50),                                             |
|                   |                   |   `quantity` int,                                                 |   `color` varchar(10),                                            |
|                   |                   |   PRIMARY KEY (`pk`)                                              |   PRIMARY KEY (`pk`)                                              |
|                   |                   | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; |
+-------------------+-------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
```

When a table is renamed, we can specify either the "old" table name, or the "new" table name, and we will receive the same results. The following two queries will provide the same results:

```sql
SELECT * FROM DOLT_SCHEMA_DIFF("main", "feature_branch", "trips");
SELECT * FROM DOLT_SCHEMA_DIFF("main", "feature_branch", "vacations");
```

Here are the results:

```sql
+-------------------+---------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
| from_table_name   | to_table_name | from_create_statement                                             | to_create_statement                                               |
+-------------------+---------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
| public.vacations  | public.trips  | CREATE TABLE `vacations` (                                        | CREATE TABLE `trips` (                                            |
|                   |               |   `pk` int NOT NULL,                                              |   `pk` int NOT NULL,                                              |
|                   |               |   `name` varchar(50),                                             |   `name` varchar(50),                                             |
|                   |               |   PRIMARY KEY (`pk`)                                              |   PRIMARY KEY (`pk`)                                              |
|                   |               | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; |
+-------------------+---------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
```

Finally, we can flip the order of the revisions to get the schema diff in the opposite direction.

```sql
select * from dolt_schema_diff('feature_branch', 'main');
```

The above query will produce this output:

```sql
+-------------------+-------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
| from_table_name   | to_table_name     | from_create_statement                                             | to_create_statement                                               |
+-------------------+-------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
| public.photos     |                   | CREATE TABLE `photos` (                                           |                                                                   |
|                   |                   |   `pk` int NOT NULL,                                              |                                                                   |
|                   |                   |   `name` varchar(50),                                             |                                                                   |
|                   |                   |   `dt` datetime(6),                                               |                                                                   |
|                   |                   |   PRIMARY KEY (`pk`)                                              |                                                                   |
|                   |                   | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; |                                                                   |
|                   | public.employees  |                                                                   | CREATE TABLE `employees` (                                        |
|                   |                   |                                                                   |   `pk` int NOT NULL,                                              |
|                   |                   |                                                                   |   `name` varchar(50),                                             |
|                   |                   |                                                                   |   PRIMARY KEY (`pk`)                                              |
|                   |                   |                                                                   | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; |
| public.inventory  | public.inventory  | CREATE TABLE `inventory` (                                        | CREATE TABLE `inventory` (                                        |
|                   |                   |   `pk` int NOT NULL,                                              |   `pk` int NOT NULL,                                              |
|                   |                   |   `name` varchar(50),                                             |   `name` varchar(50),                                             |
|                   |                   |   `color` varchar(10),                                            |   `quantity` int,                                                 |
|                   |                   |   PRIMARY KEY (`pk`)                                              |   PRIMARY KEY (`pk`)                                              |
|                   |                   | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; |
| public.trips      | public.vacations  | CREATE TABLE `trips` (                                            | CREATE TABLE `vacations` (                                        |
|                   |                   |   `pk` int NOT NULL,                                              |   `pk` int NOT NULL,                                              |
|                   |                   |   `name` varchar(50),                                             |   `name` varchar(50),                                             |
|                   |                   |   PRIMARY KEY (`pk`)                                              |   PRIMARY KEY (`pk`)                                              |
|                   |                   | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; |
+-------------------+-------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
```

Note the difference between this select and the previous `dolt_schema_diff('main', 'feature_branch')` invocation:

1. First row shows that the table `photos` was deleted
2. Second row show the creation of `employees` table
3. Third row has the `from_create_statement` and `to_create_statement` columns swapped
4. Fourth row shows the inverse rename of `trips` to `vacations`

### Example query

You can try calling `DOLT_SCHEMA_DIFF()` against the [DoltHub docs_examples DB](https://www.dolthub.com/repositories/dolthub/docs_examples), by getting the diff of schemas between `schema_diff_v1` and `schema_diff_v2` tags, which correspond to `main` and `feature_branch` branches from these examples.

{% embed url="https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?active=Tables&q=SELECT+*%0AFROM+dolt_schema_diff%28%27schema_diff_v1%27%2C+%27schema_diff_v2%27%29%3B%0A" %}

## `DOLT_QUERY_DIFF()`

The `DOLT_QUERY_DIFF()` table function calculates the data difference between any two queries, producing a table similar to the `DOLT_DIFF()` table function.

### Privileges

`DOLT_QUERY_DIFF()` table function requires `SELECT` privilege for all tables used in each query.

### Example

For this example, we have the table `t` in two branches `main` and `other`.

On `main`, the table `t` has the following data:

```sql
+---+----+
| i | j  |
+---+----+
| 0 | 0  |
| 1 | 10 |
| 3 | 3  |
| 4 | 4  |
+---+----+
```

On `other`, the table `t` has the following data:

```sql
+---+---+
| i | j |
+---+---+
| 0 | 0 |
| 1 | 1 |
| 2 | 2 |
| 4 | 4 |
+---+---+
```

We can use the `DOLT_QUERY_DIFF()` table function to calculate the difference between the two tables:

```sql
dolt> select * from dolt_query_diff('select * from t as of main', 'select * from t as of other');
+--------+--------+------+------+-----------+
| from_i | from_j | to_i | to_j | diff_type |
+--------+--------+------+------+-----------+
| 1      | 10     | 1    | 1    | modified  |
| NULL   | NULL   | 2    | 2    | added     |
| 3      | 3      | NULL | NULL | deleted   |
+--------+--------+------+------+-----------+
3 rows in set (0.00 sec)
```

### Note

Query diff is performed brute force and thus, will be slow for large result sets.
The algorithm is super linear (`n^2`) on the size of the results sets.
Over time, we will optimize this to use features of the storage engine to improve performance.
