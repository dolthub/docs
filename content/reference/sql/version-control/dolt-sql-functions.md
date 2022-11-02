---
title: Dolt SQL Functions
---

# Table of Contents

- [Informational Functions](#informational-functions)

  - [active_branch()](#active_branch)
  - [dolt_merge_base()](#dolt_merge_base)
  - [hashof()](#hashof)
  - [dolt_version()](#dolt_version)

- [Table Functions](#table-functions)

  - [dolt_diff()](#dolt_diff)
  - [dolt_diff_summary()](#dolt_diff_summary)
  - [dolt_log()](#dolt_log)

- [Version Control Functions](#version-control-functions) (deprecated)
  - [These are deprecated](#deprecation-warning), please use the
    equivalent [stored procedures](dolt-sql-procedures.md) instead.
  - [dolt_add()](#dolt_add)
  - [dolt_checkout()](#dolt_checkout)
  - [dolt_commit()](#dolt_commit)
  - [dolt_fetch()](#dolt_fetch)
  - [dolt_merge()](#dolt_merge)
  - [dolt_pull()](#dolt_pull)
  - [dolt_push()](#dolt_push)
  - [dolt_reset()](#dolt_reset)

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
However, some use cases, such as viewing a table data diff containing schema changes or viewing the [three dot diff](https://matthew-brett.github.io/pydagogue/git_diff_dots.html),
can be easier to view with the `DOLT_DIFF` table function.

The main difference between the results of the `DOLT_DIFF()` table function and the `dolt_commit_diff_$tablename`
system table is the schema of the returned results. `dolt_commit_diff_$tablename` generates the resulting schema
based on the table's schema at the currently checked out branch. `DOLT_DIFF()` will use the schema at the `from_commit`
for the `from_` columns and the schema at the `to_commit` for the `to_` columns. This can make it easier to view
diffs where the schema of the underlying table has changed.

Note that the `DOLT_DIFF()` table function currently has restrictions on how it can be used in queries. It does not
support aliasing or joining with other tables, and argument values must currently be literal values.

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
SELECT * FROM DOLT_DIFF("main", "feature_branch", "inventory")
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

## `DOLT_DIFF_SUMMARY()`

The `DOLT_DIFF_SUMMARY()` table function calculates the data difference summary between any two commits
in the database. Schema changes such as creating a new table with no rows, or deleting a table with no rows will
return empty result. Each row in the result set describes a diff summary for a single table with statistics information of
number of rows unmodified, added, deleted and modified, number of cells added, deleted and modified and total number of
rows and cells the table has at each commit.

`DOLT_DIFF_SUMMARY()` works like [CLI `dolt diff --summary` command](../../cli.md#dolt-diff), but two commits are required to use the `DOLT_DIFF_SUMMARY()` table function and the table name is optional. For keyless tables, this table function only provides the number of added and deleted rows. It returns empty result for tables with no data changes.

Note that the `DOLT_DIFF_SUMMARY()` table function currently has restrictions on how it can be used in queries. It does not
support aliasing or joining with other tables, and argument values must be literal values.

### Privileges

`DOLT_DIFF_SUMMARY()` table function requires `SELECT` privilege for all tables if no table is defined or
for the defined table only.

### Options

```sql
DOLT_DIFF_SUMMARY(<from_revision>, <to_revision>, <optional_tablename>)
DOLT_DIFF_SUMMARY(<from_revision..to_revision>, <optional_tablename>)
DOLT_DIFF_SUMMARY(<from_revision...to_revision>, <optional_tablename>)
```

The `DOLT_DIFF_SUMMARY()` table function takes three arguments:

- `from_revision` — the revision of the table data for the start of the diff. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `to_revision` — the revision of the table data for the end of the diff. This argument is required. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~", "WORKING", "STAGED").
- `from_revision..to_revision` — gets the two dot diff summary, or revision of table data between the `from_revision` and `to_revision`. This is equivalent to `dolt_diff_summary(<from_revision>, <to_revision>, <tablename>)`.
- `from_revision...to_revision` — gets the three dot diff summary, or revision of table data between the `from_revision` and `to_revision`, _starting at the last common commit_.
- `tablename` — the name of the table containing the data to diff. This argument is optional. When it's not defined, all tables with data diff will be returned.

### Schema

```text
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
the `DOLT_DIFF_SUMMARY()` function to calculate a diff of the table data or all tables with data changes across specific
commits.

Here is the schema of `inventory` at the tip of `main`:

```text
+----------+-------------+------+-----+---------+-------+
| Field    | Type        | Null | Key | Default | Extra |
+----------+-------------+------+-----+---------+-------+
| pk       | int         | NO   | PRI | NULL    |       |
| name     | varchar(50) | YES  |     | NULL    |       |
| quantity | int         | YES  |     | NULL    |       |
+----------+-------------+------+-----+---------+-------+
```

Here is what table `inventory` has at the tip of `main`:

```text
+----+-------+----------+
| pk | name  | quantity |
+----+-------+----------+
| 1  | shirt | 15       |
| 2  | shoes | 10       |
+----+-------+----------+
```

We perform some changes to the `inventory` table and create new keyless table:

```text
ALTER TABLE inventory ADD COLUMN color VARCHAR(10);
INSERT INTO inventory VALUES (3, 'hat', 6, 'red');
UPDATE inventory SET quantity=0 WHERE pk=1;
CREATE TABLE items (name varchar(50));
INSERT INTO items VALUES ('shirt'),('pants');
```

Here is what table `inventory` has in the current working set:

```text
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

The results from `DOLT_DIFF_SUMMARY()` show how the data has changed going from tip of `main` to our current working set:

```text
+------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
| table_name | rows_unmodified | rows_added | rows_deleted | rows_modified | cells_added | cells_deleted | cells_modified | old_row_count | new_row_count | old_cell_count | new_cell_count |
+------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
| inventory  | 1               | 1          | 0            | 1             | 6           | 0             | 1              | 2             | 3             | 6              | 12             |
| items      | NULL            | 2          | 0            | NULL          | NULL        | NULL          | NULL           | NULL          | NULL          | NULL           | NULL           |
+------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
```

To get a table specific changes going from the current working set to tip of `main`, we run the following query:

```sql
SELECT * FROM DOLT_DIFF_SUMMARY('WORKING', 'main', 'inventory');
```

With result of single row:

```text
+------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
| table_name | rows_unmodified | rows_added | rows_deleted | rows_modified | cells_added | cells_deleted | cells_modified | old_row_count | new_row_count | old_cell_count | new_cell_count |
+------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
| inventory  | 1               | 0          | 1            | 1             | 0           | 6             | 1              | 3             | 2             | 12             | 6              |
+------------+-----------------+------------+--------------+---------------+-------------+---------------+----------------+---------------+---------------+----------------+----------------+
```

## `DOLT_LOG()`

The `DOLT_LOG` table function gets the commit log for all commits reachable from the
provided revision's `HEAD` (or the current `HEAD` if no revision is provided). `DOLT_LOG()`
works like [CLI `dolt log` command](../../cli.md#dolt-log).

Note that the `DOLT_LOG()` table function currently has restrictions on how it can be used
in queries. It does not support aliasing or joining with other tables, and argument values
must be literal values.

### Privileges

`DOLT_LOG()` table function requires `SELECT` privilege for all tables.

### Options

```sql
DOLT_LOG(<optional_revision>, <optional_revision>)
```

The `DOLT_LOG()` table function takes up to two optional revision arguments:

- `optional_revision`: a branch name, tag, or commit ref (with or without an ancestor
  spec) that specifies which ancestor commits to include in the results. If no revisions
  are specified, the default is the current branch `HEAD`. 
    - If you'd like to get [two dot logs]([https://matthew-brett.github.io/pydagogue/git_log_dots.html](https://matthew-brett.github.io/pydagogue/git_log_dots.html#logging-with-two-dots)) 
      (all commits reachable by `revision2`, but NOT reachable by `revision1`), you can 
      use `..` between revisions (`DOLT_LOG('revision1..revision2')`) or `^` in front of 
      the revision you'd like to exclude (`DOLT_LOG('revision2', '^revision1')`). Note: if providing two
  revisions, one must contain `^`.
    - If you'd like to get [three dot logs]([https://matthew-brett.github.io/pydagogue/git_log_dots.html#logging-with-two-dots](https://matthew-brett.github.io/pydagogue/git_log_dots.html#logging-with-three-dots)) 
      (all commits reachable by `revision1` or `revision2`, excluding commits reachable by 
      BOTH `revision1` AND `revision2`), you can use `...` between revisions 
      (`DOLT_LOG('revision1...revision2')`. 
- `--min-parents`: The minimum number of parents a commit must have to be included in the log.
- `--merges`: Equivalent to min-parents == 2, this will limit the log to commits with 2 or
  more parents.
- `--parents`: Shows all parents of each commit in the log.
- `--decorate`: Shows refs next to commits. Valid options are short, full, no, and auto.
  Note: the CLI `dolt log` command defaults to "short", while this table function defaults
  to "no".
- `--not`: Excludes commits reachable by revision.

### Schema

```text
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

```text
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

# Version Control Functions

## Deprecation Warning

All of the functions in this section have been deprecated and replaced
with their [stored procedure equivalents](dolt-sql-procedures.md).
They will be removed in a future release.

## `DOLT_ADD()`

Deprecated. Use the [DOLT_ADD stored
procedure](dolt-sql-procedures.md#dolt_add).

```sql
SELECT DOLT_ADD('-A');
SELECT DOLT_ADD('.');
SELECT DOLT_ADD('table1', 'table2');
```

## `DOLT_CHECKOUT()`

Deprecated. Use the [DOLT_CHECKOUT stored
procedure](dolt-sql-procedures.md#dolt_checkout) instead.

```sql
SELECT DOLT_CHECKOUT('-b', 'my-new-branch');
SELECT DOLT_CHECKOUT('my-existing-branch');
SELECT DOLT_CHECKOUT('my-table');
```

## `DOLT_COMMIT()`

Deprecated. Use the [DOLT_COMMIT stored
procedure](dolt-sql-procedures.md#dolt_commit) instead.

```sql
SELECT DOLT_COMMIT('-a', '-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

## `DOLT_FETCH()`

Deprecated. Use the [DOLT_FETCH stored
procedure](dolt-sql-procedures.md#dolt_fetch) instead.

```sql
SELECT DOLT_FETCH('origin', 'main');
SELECT DOLT_FETCH('origin', 'feature-branch');
SELECT DOLT_FETCH('origin', 'refs/heads/main:refs/remotes/origin/main');
```

## `DOLT_MERGE()`

Deprecated. Use the [DOLT_MERGE stored
procedure](dolt-sql-procedures.md#dolt_merge) instead.

```sql
SELECT DOLT_MERGE('feature-branch'); -- Optional --squash parameter
SELECT DOLT_MERGE('feature-branch', '-no-ff', '-m', 'This is a msg for a non fast forward merge');
SELECT DOLT_MERGE('--abort');
```

## `DOLT_RESET()`

Deprecated. Use the [DOLT_RESET stored
procedure](dolt-sql-procedures.md#dolt_reset) instead.

```sql
SELECT DOLT_RESET('--hard');
SELECT DOLT_RESET('my-table'); -- soft reset
```

## `DOLT_PUSH()`

Deprecated. Use the [DOLT_PUSH stored
procedure](dolt-sql-procedures.md#dolt_push) instead.

```sql
SELECT DOLT_PUSH('origin', 'main');
SELECT DOLT_PUSH('--force', 'origin', 'main');
```

## `DOLT_PULL()`

Deprecated. Use the [DOLT_PULL stored
procedure](dolt-sql-procedures.md#dolt_pull) instead.

```sql
SELECT DOLT_PULL('origin');
SELECT DOLT_PULL('feature-branch', '--force');
```
