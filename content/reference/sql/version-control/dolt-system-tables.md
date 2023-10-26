---
title: Dolt System Tables
---

# Table of contents

- [Database Metadata](#database-metadata-system-tables)

  - [dolt_branches](#doltbranches)
  - [dolt_remote_branches](#doltremotebranches)
  - [dolt_docs](#doltdocs)
  - [dolt_procedures](#doltprocedures)
  - [dolt_query_catalog](#doltquerycatalog)
  - [dolt_remotes](#doltremotes)
  - [dolt_schemas](#doltschemas)
  - [dolt_tags](#dolttags)

- [Database History](#database-history-system-tables)

  - [dolt_blame\_$tablename](#doltblametablename)
  - [dolt_commit_ancestors](#doltcommitancestors)
  - [dolt_commit_diff\_$tablename](#doltcommitdifftablename)
  - [dolt_commits](#doltcommits)
  - [dolt_diff](#doltdiff)
  - [dolt_column_diff](#doltcolumndiff)
  - [dolt_diff\_$tablename](#doltdifftablename)
  - [dolt_history\_$tablename](#dolthistorytablename)
  - [dolt_log](#doltlog)

- [Working Set Metadata](#working-set-metadata-system-tables)

  - [dolt_conflicts](#doltconflicts)
  - [dolt_conflicts\_$tablename](#doltconflictstablename)
  - [dolt_schema_conflicts](#doltschemaconflicts)
  - [dolt_merge_status](#doltmergestatus)
  - [dolt_status](#doltstatus)

- [Constraint Validation](#constraint-violation-system-tables)

  - [dolt_constraint_violations](#doltconstraintviolations)
  - [dolt_constraint_violations\_$tablename](#doltconstraintviolationstablename)

- [Configuration Tables](#configuration-tables)

  - [dolt_ignore](#doltignore)

# Database Metadata System Tables

## `dolt_branches`

`dolt_branches` contains information about branches known to the database.

Because the branch information is global to all clients, not just your
session, `dolt_branches` system table is read-only. Branches can be created
or deleted with the [`DOLT_BRANCH()` stored procedure](dolt-sql-procedures.md#dolt_branch).

### Schema

```text
+------------------------+----------+
| Field                  | Type     |
+------------------------+----------+
| name                   | TEXT     |
| hash                   | TEXT     |
| latest_committer       | TEXT     |
| latest_committer_email | TEXT     |
| latest_commit_date     | DATETIME |
| latest_commit_message  | TEXT     |
| remote                 | TEXT     |
| branch                 | TEXT     |
+------------------------+----------+
```

### Example Queries

Get all the branches.

{% embed url="https://www.dolthub.com/repositories/dolthub/first-hour-db/embed/main?q=select+*+from+dolt_branches%3B" %}

To find the current active branch use [`select active_branch()`](./dolt-sql-functions.md#active_branch).

`dolt_branches` only contains information about local branches. For
branches on a remote you have fetched, see
[`dolt_remote_branches`](#dolt_remote_branches).

## `dolt_remote_branches`

`dolt_remote_branches` contains information about branches on remotes
you have fetched. It has the same schema as `dolt_branches`, but
contains only branches found on remotes, not any local branches.

### Schema

```text
+------------------------+----------+
| Field                  | Type     |
+------------------------+----------+
| name                   | TEXT     |
| hash                   | TEXT     |
| latest_committer       | TEXT     |
| latest_committer_email | TEXT     |
| latest_commit_date     | DATETIME |
| latest_commit_message  | TEXT     |
+------------------------+----------+
```

### Example Queries

Get all local and remote branches in a single query. Remote branches
will have the prefix `remotes/<remoteName>` in their names.

```sql
SELECT *
FROM dolt_branches
UNION
SELECT * FROM dolt_remote_branches;
```

```text
+-----------------+----------------------------------+------------------+------------------------+-------------------------+----------------------------+
| name            | hash                             | latest_committer | latest_committer_email | latest_commit_date      | latest_commit_message      |
+-----------------+----------------------------------+------------------+------------------------+-------------------------+----------------------------+
| main            | r3flrdqk73lkcrugtbohcdbb3hmr2bev | Zach Musgrave    | zach@dolthub.com       | 2023-02-01 18:59:55.156 | Initialize data repository |
| remotes/rem1/b1 | r3flrdqk73lkcrugtbohcdbb3hmr2bev | Zach Musgrave    | zach@dolthub.com       | 2023-02-01 18:59:55.156 | Initialize data repository |
+-----------------+----------------------------------+------------------+------------------------+-------------------------+----------------------------+
```

## `dolt_docs`

`dolt_docs` stores the contents of Dolt docs \(`LICENSE.md`,
`README.md`\).

You can modify the contents of these files via SQL, but you are not
guaranteed to see these changes reflected in the files on disk.

### Schema

```text
+----------+------+
| field    | type |
+----------+------+
| doc_name | text |
| doc_text | text |
+----------+------+
```

## `dolt_procedures`

`dolt_procedures` stores each stored procedure that has been created
on the database.

The values in this table are implementation details associated with
the storage of stored procedures. It is recommended to use built-in
SQL statements for examining and modifying stored procedures rather
than using this table directly.

### Schema

```text
+-------------+----------+
| field       | type     |
+-------------+----------+
| name        | longtext |
| create_stmt | longtext |
| created_at  | datetime |
| modified_at | datetime |
+-------------+----------+
```

When using the standard `CREATE PROCEDURE` workflow, the `name` column
will always be lowercase. Dolt assumes that `name` is always lowercase
as a result, and manually inserting a stored procedure must also have
a lowercase `name`. Otherwise, it will be invisible to some
operations, such as `DROP PROCEDURE`.

### Example Query

```sql
CREATE PROCEDURE simple_proc1(x DOUBLE, y DOUBLE) SELECT x*y;
CREATE PROCEDURE simple_proc2() SELECT name FROM category;
```

{% embed url="https://www.dolthub.com/repositories/dolthub/first-hour-db/embed/main?q=SELECT+*+FROM+dolt_procedures%3B" %}


## `dolt_query_catalog`

The `dolt_query_catalog` system table stores named queries for your database.
Like all data stored in Dolt, these named queries are versioned alongside your data, so
after you create, modify, or remove a named query, you'll need to commit that change to save it.  
You can use the Dolt CLI to save and execute named queries or you can use the  
`dolt_query_catalog` system table directly to add, modify, or delete named queries.
All named queries are displayed in the Queries tab of your database on
[DoltHub](https://www.dolthub.com/).

### Schema

```text
+---------------+-----------------+------+-----+---------+-------+
| Field         | Type            | Null | Key | Default | Extra |
+---------------+-----------------+------+-----+---------+-------+
| id            | varchar(16383)  | NO   | PRI |         |       |
| display_order | bigint unsigned | NO   |     |         |       |
| name          | varchar(16383)  | YES  |     |         |       |
| query         | varchar(16383)  | YES  |     |         |       |
| description   | varchar(16383)  | YES  |     |         |       |
+---------------+-----------------+------+-----+---------+-------+
```

### Example Query

Using the `dolthub/docs_examples` from DoltHub as an example, you can create a
named query using the CLI, or by directly inserting into the `dolt_query_catalog` table.

```shell
> dolt sql -q "select * from tablename" -s "select all" -m "Query to select all records from tablename"
```

After creating a named query, you can view it in the `dolt_query_catalog` table:

{% embed url="https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=select+*+from+dolt_query_catalog%3B" %}

Then you can use the dolt CLI to execute it:

```shell
> dolt sql -x "Large Irises"
Executing saved query 'Large Irises':
select distinct(class) from classified_measurements where petal_length_cm > 5
+------------+
| class)     |
+------------+
| versicolor |
| virginica  |
+------------+
```

Last, but not least, if you want to persist that named query, be sure to commit your change to the
`dolt_query_catalog` table.

```shell
dolt add dolt_query_catalog
dolt commit -m "Adding new named query"
```

## `dolt_remotes`

`dolt_remotes` returns the remote subcontents of the `repo_state.json`, similar
to running `dolt remote -v` from the command line.

The `dolt_remotes` table is currently read only. Use the CLI `dolt remote` functions
to add, update or delete remotes.

### Schema

```text
+-------------+------+------+-----+---------+-------+
| Field       | Type | Null | Key | Default | Extra |
+-------------+------+------+-----+---------+-------+
| name        | text | NO   | PRI |         |       |
| url         | text | NO   |     |         |       |
| fetch_specs | json | YES  |     |         |       |
| params      | json | YES  |     |         |       |
+-------------+------+------+-----+---------+-------+
```

### Example Query

```sql
SELECT *
FROM dolt_remotes
WHERE name = 'origin';
```

```text
+--------+-----------------------------------------+--------------------------------------+--------+
| name   | url                                     | fetch_specs                          | params |
+--------+-----------------------------------------+--------------------------------------+--------+
| origin | file:///go/github.com/dolthub/dolt/rem1 | [refs/heads/*:refs/remotes/origin/*] | map[]  |
+--------+-----------------------------------------+--------------------------------------+--------+
```

## `dolt_schemas`

`dolt_schemas` stores SQL schema fragments for a dolt database that
are versioned alongside the database itself. Certain DDL statements
will modify this table and the value of this table in a SQL session
will affect what database entities exist in the session.

The values in this table are implementation details associated with
the storage of certain schema elements. It is recommended to use
built-in SQL statements for examining and modifying schemas, rather
than using this table directly.

### Schema

```text
+----------+----------------------------------------+------+-----+---------+-------+
| Field    | Type                                   | Null | Key | Default | Extra |
+----------+----------------------------------------+------+-----+---------+-------+
| type     | varchar(64) COLLATE utf8mb4_0900_ai_ci | NO   | PRI | NULL    |       |
| name     | varchar(64) COLLATE utf8mb4_0900_ai_ci | NO   | PRI | NULL    |       |
| fragment | longtext                               | YES  |     | NULL    |       |
| extra    | json                                   | YES  |     | NULL    |       |
+----------+----------------------------------------+------+-----+---------+-------+
```

Currently, all `VIEW`, `TRIGGER` and `EVENT` definitions are stored in the `dolt_schemas` table.
The column `type` defines whether the fragment is `view`, `trigger` or `event`.
The column `name` is the fragment name as supplied in the `CREATE` statement.
The column `fragment` stores the `CREATE` statement of the fragment. The column
`json` is any additional important information such as `CreateAt` field
for the fragment.

The values in this table are partly implementation details associated with the implementation of the underlying database objects.

### Example Query

```sql
CREATE VIEW four AS SELECT 2+2 FROM dual;
CREATE TABLE mytable (x INT PRIMARY KEY);
CREATE TRIGGER inc_insert BEFORE INSERT ON mytable FOR EACH ROW SET NEW.x = NEW.x + 1;
CREATE EVENT monthly_gc ON SCHEDULE EVERY 1 MONTH DO CALL DOLT_GC();
```

Then you can view them in `dolt_schemas`:
{% embed url="https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=select+*+from+dolt_schemas%3B" %}

## `dolt_tags`

`dolt_tags` shows information for all active tags in the current database.

[DOLT_TAG()](./dolt-sql-procedures.md#dolt_tag) procedure can be used to INSERT and DELETE tags on the `dolt_tags` table.

### Schema

```text
+----------+----------+
| Field    | Type     |
+----------+----------+
| tag_name | text     |
| tag_hash | text     |
| tagger   | text     |
| email    | text     |
| date     | datetime |
| message  | text     |
+----------+----------+
```

### Example Query

Create a tag using dolt_tag() stored procedure.

```sql
CALL DOLT_TAG('_migrationtest','head','-m','savepoint for migration testing');
```

```text
+--------+
| status |
+--------+
| 0      |
+--------+
```

Get all the tags.

{% embed url="https://www.dolthub.com/repositories/dolthub/first-hour-db/embed/main?q=SELECT+*+FROM+dolt_tags%3B" %}

# Database History System Tables

## `dolt_blame_$tablename`

For every user table that has a primary key, there is a queryable system view named `dolt_blame_$tablename`
which can be queried to see the user and commit responsible for the current value of each row.
This is equivalent to the [`dolt blame` CLI command](../../cli/cli.md#dolt-blame).
Tables without primary keys will not have an associated `dolt_blame_$tablename`.

### Schema

The `dolt_blame_$tablename` system view has the following columns:

```text
+-------------------+----------+
| field             | type     |
+-------------------+----------+
| commit            | text     |
| commit_date       | datetime |
| committer         | text     |
| email             | text     |
| message           | text     |
| primary key cols  |          |
+-------------------+----------+
```

The remaining columns are dependent on the schema of the user table.
Every column from the primary key of your table will be included in the `dolt_blame_$tablename` system table.

### Query Details

Executing a `SELECT *` query for a `dolt_blame_$tablename` system view will show you the primary key columns
for every row in the underlying user table and the commit metadata for the last commit that modified that row.
Note that if a table has any uncommitted changes in the working set,
those will not be displayed in the `dolt_blame_$tablename` system view.

`dolt_blame_$tablename` is only available for tables with a primary key.
Attempting to query `dolt_blame_$tablename` for a table without a primary key will return an error message.

### Example Query

Consider the following example table `city`:

{% embed url="https://www.dolthub.com/repositories/dolthub/first-hour-db/embed/main?q=describe+city%3B" %}

To find who set the current values, we can query the `dolt_blame_city` table:

{% embed url="https://www.dolthub.com/repositories/dolthub/first-hour-db/embed/main?q=select+*+from+dolt_blame_city%3B" %}



## `dolt_commit_ancestors`

The `dolt_commit_ancestors` table records the ancestors for every commit in the database. Each commit has one or two
ancestors, two in the case of a merge commit.

### Schema

Each commit hash has one or two entries in the table, depending on whether it has one or two parent commits. The root
commit of the database has a `NULL` parent. For merge commits, the merge base will have `parent_index` 0, and the commit
merged will have `parent_index` 1.

```text
+--------------+------+------+-----+---------+-------+
| Field        | Type | Null | Key | Default | Extra |
+--------------+------+------+-----+---------+-------+
| commit_hash  | text | NO   | PRI |         |       |
| parent_hash  | text | NO   | PRI |         |       |
| parent_index | int  | NO   | PRI |         |       |
+--------------+------+------+-----+---------+-------+
```

## `dolt_commit_diff_$TABLENAME`

For every user table named `$TABLENAME`, there is a read-only system table named `dolt_commit_diff_$TABLENAME`
that can be queried to see a diff of the data in the specified table between **any** two commits in the database.
For example, you can use this system table to view the diff between two commits on different branches.
The schema of the returned data from this system table is based on the schema of the underlying user table
at the currently checked out branch.

You must provide `from_commit` and `to_commit` in all queries to this system table in order to specify the
to and from points for the diff of your table data. Each returned row describes how a row in the underlying
user table has changed from the `from_commit` ref to the `to_commit` ref by showing the old and new values.

`dolt_commit_diff_$TABLENAME` is the analogue of the `dolt diff` CLI command.  
It represents the [two-dot diff](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#double_dot)
between the two commits provided.
The `dolt_diff_$TABLENAME` system table also exposes diff information, but instead of a two-way diff,
it returns a log of individual diffs between all adjacent commits in the history of the current branch.
In other words, if a row was changed in 10 separate commits, `dolt_diff_$TABLENAME` will show 10 separate rows –
one for each individual delta. In contrast, `dolt_commit_diff_$TABLENAME` would show a single row that combines
all the individual commit deltas into one diff.

The [`DOLT_DIFF()` table function](dolt-sql-functions.md#dolt_diff) is an alternative to the
`dolt_commit_diff_$tablename` system table for cases where a table's schema has changed between the `to` and `from`
commits. Consider the `DOLT_DIFF()` table function if you need to see the schema from each of those commits,
instead of using the schema from the currently checked out branch.

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

The remaining columns are dependent on the schema of the user table at the currently checked out branch.  
For every column `X` in your table at the currently checked out branch, there are columns in the result set named
`from_X` and `to_X` with the same type as `X` in the current schema.
The `from_commit` and `to_commit` parameters must both be specified in the query, or an error is returned.

### Example Schema

Consider a simple example with a table that has one column:

```text
+--------------+
| field | type |
+--------------+
| x     | int  |
+--------------+
```

Based on the table's schema above, the schema of the `dolt_commit_diff_$TABLENAME` will be:

```text
+------------------+----------+
| field            | type     |
+------------------+----------+
| to_x             | int      |
| to_commit        | longtext |
| to_commit_date   | datetime |
| from_x           | int      |
| from_commit      | longtext |
| from_commit_date | datetime |
| diff_type        | varchar  |
+------------------+----------+
```

### Query Details

Now consider the following branch structure:

```text
      A---B---C feature
     /
D---E---F---G main
```

We can use the above table to represent two types of diffs: a two-point diff and a three-point diff.
In a two-point diff we want to see the difference in rows between Point C and Point G.

{% embed url="https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=SELECT+*+from+dolt_commit_diff_mytable+where+to_commit%3DHASHOF%28%27feature%27%29+and+from_commit+%3D+HASHOF%28%27main%27%29%3B" %}

We can also compute a three-point diff using this table.
In a three-point diff we want to see how our feature branch has diverged
from our common ancestor E, without including the changes from F and G on main.

{% embed url="https://www.dolthub.com/repositories/dolthub/docs_examples/embed/main?q=SELECT+*+from+dolt_commit_diff_mytable+where+to_commit%3DHASHOF%28%27feature%27%29+and+from_commit%3Ddolt_merge_base%28%27main%27%2C+%27feature%27%29%3B" %}

[The `dolt_merge_base` function](dolt-sql-functions.md#dolt_merge_base)
computes the closest ancestor E between `main` and `feature`.

### Additional Notes

There is one special `to_commit` value `WORKING` which can be used to
see what changes are in the working set that have yet to be committed
to HEAD. It is often useful to use [the `HASHOF()` function](dolt-sql-functions.md#hashof)
to get the commit hash of a branch, or an ancestor commit. The above table
requires both `from_commit` and `to_commit` to be filled.

## `dolt_commits`

The `dolt_commits` system table shows _ALL_ commits in a Dolt database.

This is similar, but different from the `dolt_log` [system table](https://docs.dolthub.com/reference/sql/dolt-system-tables#dolt_log)
and the `dolt log` [CLI command](https://docs.dolthub.com/reference/cli#dolt-log).
`dolt log` shows you commit history for all commit ancestors reachable from the current `HEAD` of the
checked out branch, whereas `dolt_commits` shows all commits from the entire database, no matter which branch is checked out.

### Schema

```text
> describe dolt_commits;
+-------------+----------+------+-----+---------+-------+
| Field       | Type     | Null | Key | Default | Extra |
+-------------+----------+------+-----+---------+-------+
| commit_hash | text     | NO   | PRI |         |       |
| committer   | text     | NO   |     |         |       |
| email       | text     | NO   |     |         |       |
| date        | datetime | NO   |     |         |       |
| message     | text     | NO   |     |         |       |
+-------------+----------+------+-----+---------+-------+
```

### Example Query

Using the [`dolthub/first-hour-db` database from DoltHub](https://www.dolthub.com/repositories/dolthub/first-hour-db),
we can query for the five commits before April 20th, 2022, across all commits in the database
(regardless of what is checked out to `HEAD`) with this query:

{% embed url="https://www.dolthub.com/repositories/dolthub/first-hour-db/embed/main?q=SELECT+*%0AFROM+dolt_commits%0Awhere+date+%3C+%222022-04-20%22%0A" %}

## `dolt_diff`

The `dolt_diff` system table shows which tables in the current database were changed in each commit reachable from the active branch's HEAD. When multiple tables are changed in a single commit, there is one row in the `dolt_diff` system table for each table, all with the same commit hash. Any staged or unstaged changes in the working set are included with the value `WORKING` for their `commit_hash`. After identifying the tables that changed in a commit, the `dolt_diff_$TABLENAME` system tables can be used to determine the data that changed in each table.

### Schema

The `DOLT_DIFF` system table has the following columns

```text
+-------------+----------+
| field       | Type     |
+-------------+----------+
| commit_hash | text     |
| table_name  | text     |
| committer   | text     |
| email       | text     |
| date        | datetime |
| message     | text     |
+-------------+----------+
```

### Query Details

`dolt_diff` displays the changes from the current branch HEAD, including any working set changes. If a commit did not
make any changes to tables _(e.g. an empty commit)_, it is not included in the `dolt_diff` results.

### Example Query

Taking the
[`dolthub/first-hour-db`](https://www.dolthub.com/repositories/dolthub/first-hour-db)
database from [DoltHub](https://www.dolthub.com/) as our
example, the following query uses the `dolt_diff` system table to find all commits, and the tables they changed,
from the month of April, 2022.

{% embed url="https://www.dolthub.com/repositories/dolthub/first-hour-db/embed/main?q=SELECT+commit_hash%2C+table_name%0AFROM+++dolt_diff%0AWHERE++date+BETWEEN+%222022-04-01%22+AND+%222022-04-30%22%3B%0A" %}


From these results, we can see there were four commits to this database in October, 2020. Commits
`	224helo` only changed the `dolt_schemas` table, commit `7jrvg1a` changed the `dolt_docs`
table, and commit `5jpgb0f` made changes to two tables. To dig deeper into these changes, we can query
the `dolt_diff_$TABLE` system tables specific to each of the changed tables, like this:

{% embed url="https://www.dolthub.com/repositories/dolthub/first-hour-db/embed/main?q=SELECT+count%28*%29+as+total_rows_changed%0AFROM+++dolt_diff_dolt_schemas%0AWHERE++to_commit%3D%27224helolb2bg6iqrf9b7befrflehqgnb%27%3B%0A" %}

## `dolt_column_diff`

The `dolt_column_diff` system table shows which columns and tables in the current database were changed in each commit
reachable from the active branch's HEAD. When multiple columns are changed in a single commit, there is one row in the
`dolt_column_diff` system table for each column, all with the same commit hash. Any staged changes in the working set
are included with the value `STAGED` for their `commit_hash`. Any unstaged changes in the working set are included with
the value `WORKING` for their `commit_hash`.

### Schema

The `DOLT_COLUMN_DIFF` system table has the following columns

```text
+-------------+----------+
| field       | Type     |
+-------------+----------+
| commit_hash | text     |
| table_name  | text     |
| column_name | text     |
| committer   | text     |
| email       | text     |
| date        | datetime |
| message     | text     |
| diff_type   | text     |
+-------------+----------+
```

### Query Details

`dolt_column_diff` displays the changes from the current branch HEAD, including any working set changes. If a commit did not
make any changes to tables _(e.g. an empty commit)_, it is not included in the `dolt_column_diff` results.

### Example Query

Taking the
[`first-hour-db`](https://www.dolthub.com/repositories/dolthub/first-hour-db)
database from [DoltHub](https://www.dolthub.com/) as our
example, the following query uses the `dolt_column_diff` system table to find commits, and tables where the name was updated.

{% embed url="https://www.dolthub.com/repositories/dolthub/first-hour-db/embed/main?q=SELECT+commit_hash%2C+date%0AFROM+dolt_column_diff+where+column_name+%3D+%27name%27%0A%3B%0A" %}

If we narrow in on the `dolt_schemas` table we can count the number of commits that updated each column
over the course of all our commits.

{% embed url="https://www.dolthub.com/repositories/dolthub/first-hour-db/embed/main?q=SELECT+column_name%2C+count%28commit_hash%29+as+total_column_changes%0AFROM+dolt_column_diff%0AWHERE+table_name+%3D+%27dolt_schemas%27%0AGROUP+BY+column_name%3B" %}

From these results, we can see that fields describing the reasons an inmate is being held are being updated far more
frequently than the fields holding demographic information about inmates.

## `dolt_diff_$TABLENAME`

For every user table named `$TABLENAME`, there is a read-only system
table named `dolt_diff_$TABLENAME` that returns a list of diffs showing
how rows have changed over time on the current branch.
Each row in the result set represents a row that has changed between two adjacent
commits on the current branch – if a row has been updated in 10 commits, then 10
individual rows are returned, showing each of the 10 individual updates.

Compared to the
[`dolt_commit_diff_$TABLENAME` system table](#dolt_commit_diff_usdtablename),
the `dolt_diff_$TABLENAME` system table focuses on
how a particular row has evolved over time in the current branch's history.
The major differences are that `dolt_commit_diff_$TABLENAME` requires specifying `from_commit` and `to_commit`,
works on any commits in the database (not just the current branch),
and returns a single combined diff for all changes to a row between those two commits. In the example
above where a row is changed 10 times, `dolt_commit_diff_$TABLENAME` would only return a single row
showing the diff, instead of the 10 individual deltas.

### Schema

Every Dolt diff table will have the columns

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

The remaining columns are dependent on the schema of the user
table at the current branch. For every column `X` in your table at the current branch there will
be columns in the result set named `from_X` and `to_X` with the same type as `X`.

### Example Schema

For a table named `states` with the following schema:

```text
+------------+--------+
| field      | type   |
+------------+--------+
| state      | TEXT   |
| population | BIGINT |
| area       | BIGINT |
+-------------+-------+
```

The schema for `dolt_diff_states` would be:

```text
+------------------+----------+
| field            | type     |
+-----------------+-----------+
| from_state       | TEXT     |
| from_population  | BIGINT   |
| from_area        | TEXT     |
| from_commit      | TEXT     |
| from_commit_date | DATETIME |
| to_state         | TEXT     |
| to_population    | BIGINT   |
| to_area          | TEXT     |
| to_commit        | TEXT     |
| to_commit_date   | DATETIME |
| diff_type        | TEXT     |
+------------------+----------+
```

### Query Details

A `SELECT *` query for a diff table will show you every change
that has occurred to each row for every commit in this branch's
history. Using `to_commit` or `from_commit` will limit the data to
specific commits. There is one special `to_commit` value `WORKING`
which can be used to see what changes are in the working set that have
yet to be committed to HEAD. It is often useful to use the
[`HASHOF()`](dolt-sql-functions.md#hashof)
function to get the commit hash of a branch, or an ancestor
commit. For example, to get the differences between the last commit and its parent
you could use `to_commit=HASHOF("HEAD") and from_commit=HASHOF("HEAD^")`

For each row the field `diff_type` will be one of the values `added`,
`modified`, or `removed`. You can filter which rows appear in the
result set to one or more of those `diff_type` values in order to
limit which types of changes will be returned.

### Example Query

Taking the
[`dolthub/us-jails`](https://www.dolthub.com/repositories/dolthub/us-jails)
database from [DoltHub](https://www.dolthub.com/) as our
example, the following query will retrieve the jails whose total
num_inmates_rated_for have changed the most between 2 versions.

{% embed url="https://www.dolthub.com/repositories/dolthub/us-jails/embed/main?q=SELECT+to_county%2C+from_county%2Cto_num_inmates_rated_for%2Cfrom_num_inmates_rated_for%2C++abs%28to_num_inmates_rated_for+-+from_num_inmates_rated_for%29+AS+delta%0AFROM+dolt_diff_jails%0AWHERE+from_commit+%3D+HASHOF%28%22HEAD~3%22%29+AND+diff_type+%3D+%22modified%22%0AORDER+BY+delta+DESC%0ALIMIT+10%3B%0A" %}


## `dolt_history_$TABLENAME`

For every user table named `$TABLENAME`, there is a read-only system table named `dolt_history_$TABLENAME`
that can be queried to find a row's value at every commit in the current branch's history.

### Schema

Every Dolt history table contains columns for `commit_hash`, `committer`, and `commit_date`, plus every column
from the user table's schema at the current checked out branch.

```text
+-------------+----------+
| field       | type     |
+-------------+----------+
| commit_hash | TEXT     |
| committer   | TEXT     |
| commit_date | DATETIME |
| other cols  |          |
+-------------+----------+
```

### Example Schema

Consider a table named `mytable` with the following schema:

```text
+------------+--------+
| field      | type   |
+------------+--------+
| x          | INT    |
+------------+--------+
```

The schema for `dolt_history_states` would be:

```text
+-------------+----------+
| field       | type     |
+-------------+----------+
| x           | INT      |
| commit_hash | TEXT     |
| committer   | TEXT     |
| commit_date | DATETIME |
+-------------+----------+
```

### Example Query

Assume a database with the `mytable` table above and the following commit graph:

```text
   B---E  feature
  /
 A---C---D  main
```

When the `feature` branch is checked out, the following query returns the results below, showing
the row at every ancestor commit reachable from our current branch.

{% embed url="https://www.dolthub.com/repositories/dolthub/docs_examples/embed/feature?q=SELECT+*+FROM+dolt_history_mytable%3B" %}

## `dolt_log`

The `dolt_log` system table contains the commit log for all commits reachable from the current `HEAD`.
This is the same data returned by the [`dolt log` CLI command](https://docs.dolthub.com/reference/cli#dolt-log).

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
+-------------+--------- +
```

### Example Query

The following query shows the commits reachable from the current checked out head and created by user `jennifersp` since April, 2022:

{% embed url="https://www.dolthub.com/repositories/dolthub/first-hour-db/embed/main?q=SELECT+*%0AFROM+dolt_log%0AWHERE+committer+%3D+%22jennifersp%22+and+date+%3E+%222022-04-01%22%0AORDER+BY+date%3B" %}

# Working Set Metadata System Tables

## `dolt_conflicts`

dolt_conflicts is a system table that has a row for every table in the working set that has an unresolved merge
conflict.

```sql
+---------------+-----------------+------+-----+---------+-------+
| Field         | Type            | Null | Key | Default | Extra |
+---------------+-----------------+------+-----+---------+-------+
| table         | text            | NO   | PRI |         |       |
| num_conflicts | bigint unsigned | NO   |     |         |       |
+---------------+-----------------+------+-----+---------+-------+
```

Query this table when resolving conflicts in a SQL session. For more information on resolving merge conflicts in SQL,
see docs for the [dolt_conflicts\_$TABLENAME](#dolt_conflicts_usdtablename) tables.

## `dolt_conflicts_$TABLENAME`

For each table `$TABLENAME` in conflict after a merge, there is a
corresponding system table named `dolt_conflicts_$TABLENAME`. The
schema of each such table contains three columns for each column in
the actual table, representing each row in conflict for each of ours,
theirs, and base values.

Consider a table `mytable` with this schema:

```sql
+-------+------+------+-----+---------+-------+
| Field | Type | Null | Key | Default | Extra |
+-------+------+------+-----+---------+-------+
| a     | int  | NO   | PRI |         |       |
| b     | int  | YES  |     |         |       |
+-------+------+------+-----+---------+-------+
```

If we attempt a merge that creates conflicts in this table, I can
examine them with the following query:

```sql
mydb> select dolt_conflict_id, base_a, base_b, our_a, our_b, their_a, their_b from dolt_conflicts_mytable;
+------------------------+--------+--------+-------+-------+---------+---------+
| dolt_conflict_id       | base_a | base_b | our_a | our_b | their_a | their_b |
+------------------------+--------+--------+-------+-------+---------+---------+
| hWDLmYufTrm+eVjFSVzPWw | NULL   | NULL   | 3     | 3     | 3       | 1       |
| gi2p1YbSwu8oUV/WRSpr3Q | NULL   | NULL   | 4     | 4     | 4       | 2       |
+------------------------+--------+--------+-------+-------+---------+---------+
```

To mark conflicts as resolved, delete them from the corresponding
table. To effectively keep all `our` values, I would simply run:

```sql
mydb> delete from dolt_conflicts_mytable;
```

If I wanted to keep all `their` values, I would first run this statement:

```sql
mydb> replace into mytable (select their_a, their_b from dolt_conflicts_mytable);
```

For convenience, you can also modify the `our_` columns of the
`dolt_conflicts_mytable` to update the corresponding row in `mytable`. The above
replace statement can be rewritten as:

```sql
mydb> update dolt_conflicts_mytable set our_a = their_a, our_b = their_b;
```

And of course you can use any combination of `ours`, `theirs` and
`base` rows in these statements.

{% hint style="info" %}

### Notes

- Updates made to the `our_` columns are applied to the original table using the
  primary key (or keyless hash). If the row does not exist, it will be inserted.
  Updates made to `our_` columns will never delete a row, however.

- `dolt_conflict_id` is a unique identifier for the conflict. It is particulary
  useful when writing software that needs to resolve conflicts automatically.

- `from_root_ish` is the commit hash of the "from branch" of the merge. This
  hash can be used to identify which merge produced a conflict, since conflicts
  can accumalate across merges.

{% endhint %}

## `dolt_schema_conflicts`

dolt_schema_conflicts is a system table that has a row for every table in the working
set that has an unresolved schema conflict.

```sql
> SELECT table_name, description, base_schema, our_schema, their_schema FROM dolt_schema_conflicts;
+------------+--------------------------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
| table_name | description                          | base_schema                                                       | our_schema                                                        | their_schema                                                      |
+------------+--------------------------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
| people     | different column definitions for our | CREATE TABLE `people` (                                           | CREATE TABLE `people` (                                           | CREATE TABLE `people` (                                           |
|            | column age and their column age      |   `id` int NOT NULL,                                              |   `id` int NOT NULL,                                              |   `id` int NOT NULL,                                              |
|            |                                      |   `last_name` varchar(120),                                       |   `last_name` varchar(120),                                       |   `last_name` varchar(120),                                       |
|            |                                      |   `first_name` varchar(120),                                      |   `first_name` varchar(120),                                      |   `first_name` varchar(120),                                      |
|            |                                      |   `birthday` datetime(6),                                         |   `birthday` datetime(6),                                         |   `birthday` datetime(6),                                         |
|            |                                      |   `age` int DEFAULT '0',                                          |   `age` float,                                                    |   `age` bigint,                                                   |
|            |                                      |   PRIMARY KEY (`id`)                                              |   PRIMARY KEY (`id`)                                              |   PRIMARY KEY (`id`)                                              |
|            |                                      | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; | ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin; |
+------------+--------------------------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+-------------------------------------------------------------------+
```

Query this table when resolving schema conflicts in a SQL session. For more information on
resolving schema conflicts during merge, see the docs on [conflicts](./merges.md#conflicts).

## `dolt_merge_status`

The dolt_merge_status system table tells a user if a merge is active. It has the following schema:

```sql
CREATE TABLE `dolt_merge_status` (
-- Whether a merge is currently active or not
  `is_merging` tinyint NOT NULL,
 -- The commit spec that was used to initiate the merge
  `source` text,
-- The commit that the commit spec resolved to at the time of merge
  `source_commit` text,
-- The target destination working set
  `target` text,
-- A list of tables that have conflicts or constraint violations
  `unmerged_tables` text
)
```

### Example

Let's create a simple conflict:

```bash
dolt sql -q "CREATE TABLE t (a INT PRIMARY KEY, b INT);"
dolt add .
dolt commit -am "base"

dolt checkout -b right
dolt sql <<SQL
ALTER TABLE t ADD c INT;
INSERT INTO t VALUES (1, 2, 1);
SQL
dolt commit -am "right"

dolt checkout main
dolt sql -q "INSERT INTO t values (1, 3);"
dolt commit -am "left"

dolt merge right
```

Output of `SELECT * from dolt_merge_status;`:

```
+------------+--------+----------------------------------+-----------------+-----------------+
| is_merging | source | source_commit                    | target          | unmerged_tables |
+------------+--------+----------------------------------+-----------------+-----------------+
| true       | right  | fbghslue1k9cfgbi00ti4r8417frgbca | refs/heads/main | t               |
+------------+--------+----------------------------------+-----------------+-----------------+
```

## `dolt_status`

`dolt_status` returns the status of the database session, analogous to
running `dolt status` from the command line.

### Schema

```text
+------------+---------+------+-----+
| Field      | Type    | Null | Key |
+------------+---------+------+-----+
| table_name | text    | NO   | PRI |
| staged     | tinyint | NO   | PRI |
| status     | text    | NO   | PRI |
+------------+---------+------+-----+
```

### Example Query

```sql
SELECT *
FROM dolt_status
WHERE staged=false;
```

```text
+------------+--------+-----------+
| table_name | staged | status    |
+------------+--------+-----------+
| one_pk     | false  | new table |
+------------+--------+-----------+
```

# Constraint Violation System Tables

## `dolt_constraint_violations`

The `dolt_constraint_violations` system table contains one row for every table that has a constraint violation
introduced by a merge. Dolt enforces constraints (such as foreign keys) during normal SQL operations, but it's possible
that a merge puts one or more tables in a state where constraints no longer hold. For example, a row deleted in the
merge base could be referenced via a foreign key constraint by an added row in the merged commit. Use
`dolt_constraint_violations` to discover such violations.

### Schema

```sql
+----------------+-----------------+------+-----+---------+-------+
| Field          | Type            | Null | Key | Default | Extra |
+----------------+-----------------+------+-----+---------+-------+
| table          | text            | NO   | PRI |         |       |
| num_violations | bigint unsigned | NO   |     |         |       |
+----------------+-----------------+------+-----+---------+-------+
```

## `dolt_constraint_violations_$TABLENAME`

For each table `$TABLENAME` with a constraint violation after a merge, there is a corresponding system table named
`dolt_constraint_violations_$TABLENAME`. Each row in the table represents a constraint violation that must be resolved
via `INSERT`, `UPDATE`, or `DELETE` statements. Resolve each constraint violation before committing the result of the
merge that introduced them.

### Schema

For a hypothetical table `a` with the following schema:

```sql
+-------+------------+------+-----+---------+-------+
| Field | Type       | Null | Key | Default | Extra |
+-------+------------+------+-----+---------+-------+
| x     | bigint     | NO   | PRI |         |       |
| y     | varchar(1) | YES  |     |         |       |
+-------+------------+------+-----+---------+-------+
```

`dolt_constraint_violations_a` will have the following schema:

```sql
+----------------+-------------------------------------------------------+------+-----+---------+-------+
| Field          | Type                                                  | Null | Key | Default | Extra |
+----------------+-------------------------------------------------------+------+-----+---------+-------+
| violation_type | enum('foreign key','unique index','check constraint') | NO   | PRI |         |       |
| x              | bigint                                                | NO   | PRI |         |       |
| y              | varchar(1)                                            | YES  |     |         |       |
| violation_info | json                                                  | YES  |     |         |       |
+----------------+-------------------------------------------------------+------+-----+---------+-------+
```

Each row in the table represents a row in the primary table that is in violation of one or more constraint violations.
The `violation_info` field is a JSON payload describing the violation.

As with `dolt_conflicts`, delete rows from the corresponding `dolt_constraint_violations` table to signal to dolt that
you have resolved any such violations before committing.

# Configuration Tables

Configuration Tables can be staged and versioned just like user tables. They always exist, even in an empty database.

## `dolt_ignore`

`dolt_ignore` stores a list of "table name patterns", and a boolean flag for each pattern indicating whether tables that match the patterns should not be staged for commit.

This only affects the staging of new tables. Tables that have already been staged or committed are not affected the contents of `dolt_ignore`, and changes to those tables can still be staged.

### Schema

```text
+------------+---------+------+-----+
| Field      | Type    | Null | Key |
+------------+---------+------+-----+
| pattern    | text    | NO   | PRI |
| ignored    | tinyint | NO   |     |
+------------+---------+------+-----+
```

### Notes

The format of patterns is a simplified version of gitignore’s patterns:

- An asterisk "\*" or ampersand "%" matches any number of characters.
- The character "?" matches any one character.
- All other characters match exactly.

If a table name matches multiple patterns with different values for `ignored`, the most specific pattern is chosen (a pattern A is more specific than a pattern B if all names that match A also match pattern B, but not vice versa.) If no pattern is most specific, then attempting to stage that table will result in an error.

Tables that match patterns in `dolt_ignore` can be force-committed by passing the `--force` flag to `dolt add` or `CALL dolt_add`.

`dolt diff` won't display ignored tables, and `dolt show` won't display ignored tables unless the additional `--ignored` flag is passed.

### Example Query

```sql
INSERT INTO dolt_ignore VALUES ("generated_*", true), ("generated_exception", false);
CREATE TABLE foo (pk int);
CREATE TABLE generated_foo (pk int);
CREATE TABLE generated_exception (pk int);
CALL dolt_add("-A");
SELECT *
FROM dolt_status
WHERE staged=true;
```

```text
+---------------------+--------+-----------+
| table_name          | staged | status    |
+---------------------+--------+-----------+
| foo                 | true   | new table |
| generated_exception | true   | new table |
+---------------------+--------+-----------+
```
