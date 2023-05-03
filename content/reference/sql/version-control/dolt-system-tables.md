---
title: Dolt System Tables
---

# Table of contents

- [Database Metadata](#database-metadata-system-tables)

  - [dolt_branches](#dolt_branches)
  - [dolt_remote_branches](#dolt_remote_branches)
  - [dolt_docs](#dolt_docs)
  - [dolt_procedures](#dolt_procedures)
  - [dolt_query_catalog](#dolt_query_catalog)
  - [dolt_remotes](#dolt_remotes)
  - [dolt_schemas](#dolt_schemas)
  - [dolt_tags](#dolt_tags)

- [Database History](#database-history-system-tables)

  - [dolt_blame\_$tablename](#dolt_blame_usdtablename)
  - [dolt_commit_ancestors](#dolt_commit_ancestors)
  - [dolt_commit_diff\_$tablename](#dolt_commit_diff_usdtablename)
  - [dolt_commits](#dolt_commits)
  - [dolt_diff](#dolt_diff)
  - [dolt_column_diff](#dolt_column_diff)
  - [dolt_diff\_$tablename](#dolt_diff_usdtablename)
  - [dolt_history\_$tablename](#dolt_history_usdtablename)
  - [dolt_log](#dolt_log)

- [Working Set Metadata](#working-set-metadata-system-tables)

  - [dolt_conflicts](#dolt_conflicts)
  - [dolt_conflicts\_$tablename](#dolt_conflicts_usdtablename)
  - [dolt_merge_status](#dolt_merge_status)
  - [dolt_status](#dolt_status)

- [Constraint Validation](#constraint-violation-system-tables)

  - [dolt_constraint_violations](#dolt_constraint_violations)
  - [dolt_constraint_violations\_$tablename](#dolt_constraint_violations_usdtablename)

- [Configuration Tables](#configuration_tables)

  - [dolt_ignore](#dolt_ignore)

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
+------------------------+----------+
```

### Example Queries

Get all the branches.

```sql
SELECT *
FROM dolt_branches
```

```text
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
| name   | hash                             | latest_committer | latest_committer_email | latest_commit_date                | latest_commit_message         |
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
| 2011   | t2sbbg3h6uo93002frfj3hguf22f1uvh | bheni            | brian@dolthub.com      | 2020-01-22 20:47:31.213 +0000 UTC | import 2011 column mappings   |
| 2012   | 7gonpqhihgnv8tktgafsg2oovnf3hv7j | bheni            | brian@dolthub.com      | 2020-01-22 23:01:39.08 +0000 UTC  | import 2012 allnoagi data     |
| 2013   | m9seqiabaefo3b6ieg90rr4a14gf6226 | bheni            | brian@dolthub.com      | 2020-01-22 23:50:10.639 +0000 UTC | import 2013 zipcodeagi data   |
| 2014   | v932nm88f5g3pjmtnkq917r2q66jm0df | bheni            | brian@dolthub.com      | 2020-01-23 00:00:43.673 +0000 UTC | update 2014 column mappings   |
| 2015   | c7h0jc23hel6qbh8ro5ertiv15to9g9o | bheni            | brian@dolthub.com      | 2020-01-23 00:04:35.459 +0000 UTC | import 2015 allnoagi data     |
| 2016   | 0jntctp6u236le9qjlt9kf1q1if7mp1l | bheni            | brian@dolthub.com      | 2020-01-28 20:38:32.834 +0000 UTC | fix allnoagi zipcode for 2016 |
| 2017   | j883mmogbd7rg3cfltukugk0n65ud0fh | bheni            | brian@dolthub.com      | 2020-01-28 16:43:45.687 +0000 UTC | import 2017 allnoagi data     |
| main   | j883mmogbd7rg3cfltukugk0n65ud0fh | bheni            | brian@dolthub.com      | 2020-01-28 16:43:45.687 +0000 UTC | import 2017 allnoagi data     |
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
```

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

### Usage

Dolt users do not have to be familiar with this system table in order
to make a `LICENSE.md` or `README.md`. Simply run `dolt init` or
`touch README.md` and `touch LICENSE.md` from a Dolt database to get
started. Then, `dolt add` and `dolt commit` the docs like you would a
table.

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
CREATE PROCEDURE p1(x INT) SELECT x;
SELECT * FROM dolt_procedures;
```

```text
+------+-------------------------------------+-------------------------------+-------------------------------+
| name | create_stmt                         | created_at                    | modified_at                   |
+------+-------------------------------------+-------------------------------+-------------------------------+
| p1   | CREATE PROCEDURE p1(x INT) SELECT x | 2021-03-04 00:00:000+0000 UTC | 2021-03-04 00:00:000+0000 UTC |
+------+-------------------------------------+-------------------------------+-------------------------------+
```

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

Using the `jfulghum/iris-flower-dataset` from DoltHub as an example, you can create a
named query using the CLI, or by directly inserting into the `dolt_query_catalog` table.

```shell
> dolt sql -q "select distinct(class) from classified_measurements where petal_length_cm > 5" \
           -s "Large Irises" -m "Query to identify iris species with the largest recorded petal lengths"
```

After creating a named query, you can view it in the `dolt_query_catalog` table:

```sql
> select * from dolt_query_catalog;
+--------------+---------------+--------------+-------------------------------------------------------------------------------+------------------------------------------------------------------------+
| id           | display_order | name         | query                                                                         | description                                                            |
+--------------+---------------+--------------+-------------------------------------------------------------------------------+------------------------------------------------------------------------+
| Large Irises | 1             | Large Irises | select distinct(class) from classified_measurements where petal_length_cm > 5 | Query to identify iris species with the largest recorded petal lengths |
+--------------+---------------+--------------+-------------------------------------------------------------------------------+------------------------------------------------------------------------+
```

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
+-------------+----------+
| field       | type     |
+-------------+--------- +
| type        | text     |
| name        | text     |
| fragment    | text     |
+-------------+--------- +
```

Currently only view definitions are stored in `dolt_schemas`. `type` is currently always the string `view`. `name` is the name of the view as supplied in the `CREATE VIEW ...` statement. `fragment` is the `select` fragment that the view is defined as.

The values in this table are partly implementation details associated with the implementation of the underlying database objects.

### Example Query

```sql
CREATE VIEW four AS SELECT 2+2 FROM dual;
SELECT * FROM dolt_schemas;
```

```text
+------+------+----------------------+
| type | name | fragment             |
+------+------+----------------------+
| view | four | select 2+2 from dual |
+------+------+----------------------+
```

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
CALL DOLT_TAG('v2','head','-m','creating v2 tag');
```

```text
+--------+
| status |
+--------+
| 0      |
+--------+
```

Get all the tags.

```sql
SELECT * FROM dolt_tags;
```

```text
+----------+----------------------------------+------------+----------------------+-------------------------+-----------------+
| tag_name | tag_hash                         | tagger     | email                | date                    | message         |
+----------+----------------------------------+------------+----------------------+-------------------------+-----------------+
| v1       | av46ue6knfcf59b3621vtu69dfrkgdpv | jennifersp | jennifer@dolthub.com | 2022-07-10 12:45:23.135 | creating v1 tag |
+----------+----------------------------------+------------+----------------------+-------------------------+-----------------+
| v2       | ppjpdtj8hsvrmg2455qguduthrcfektu | jennifersp | jennifer@dolthub.com | 2022-07-11 16:36:05.461 | creating v2 tag |
+----------+----------------------------------+------------+----------------------+-------------------------+-----------------+
```

# Database History System Tables

## `dolt_blame_$tablename`

For every user table that has a primary key, there is a queryable system view named `dolt_blame_$tablename`
which can be queried to see the user and commit responsible for the current value of each row.
This is equivalent to the [`dolt blame` CLI command](../../cli.md#dolt-blame).
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

Consider the following example table `app_config` that holds configuration data:

```
> describe app_config;
+--------+----------+------+-----+---------+-------+
| Field  | Type     | Null | Key | Default | Extra |
+--------+----------+------+-----+---------+-------+
| id     | bigint   | NO   | PRI |         |       |
| name   | longtext | NO   |     |         |       |
| value  | longtext | NO   |     |         |       |
+--------+----------+------+-----+---------+-------+
```

To find who set the current configuration values, we can query the `dolt_blame_app_config` table:

```
> select * from dolt_blame_app_config;
+-----+----------------------------------+-----------------------------------+-----------------+-------------------+-------------------------------+
| id  | commit                           | commit_date                       | committer       | email             | message                       |
+-----+----------------------------------+-----------------------------------+-----------------+-------------------+-------------------------------+
| 1   | gift4cdu4m0daedgppu8m3uiuh8sovc8 | 2022-02-22 20:05:08.881 +0000 UTC | Thomas Foolery, | foolery@email.com | updating display config value |
| 2   | 30c2qqv3u6mvfsd11g0t1ejk0j974f71 | 2022-02-22 20:05:09.14 +0000 UTC  | Harry Wombat,   | wombat@email.com  | switching to file encryption  |
| 3   | s15jrjbtg1mq5sfmekpgdomijcr4jsq0 | 2022-02-22 20:05:09.265 +0000 UTC | Johnny Moolah,  | johnny@moolah.com | adding new config for format  |
| 4   | s15jrjbtg1mq5sfmekpgdomijcr4jsq0 | 2022-02-22 20:05:09.265 +0000 UTC | Johnny Moolah,  | johnny@moolah.com | adding new config for format  |
+-----+----------------------------------+-----------------------------------+-----------------+-------------------+-------------------------------+
```

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

Consider a simple example with a table that has two columns:

```text
+--------------+
| field | type |
+--------------+
| pk    | int  |
| val   | int  |
+--------------+
```

Based on the table's schema above, the schema of the `dolt_commit_diff_$TABLENAME` will be:

```text
+------------------+----------+
| field            | type     |
+------------------+----------+
| to_pk            | int      |
| to_val           | int      |
| to_commit        | longtext |
| to_commit_date   | datetime |
| from_pk          | int      |
| from_val         | int      |
| from_commit      | longtext |
| from_commit_date | datetime |
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

```SQL
SELECT * from dolt_commit_diff_$TABLENAME where to_commit=HASHOF('feature') and from_commit = HASHOF('main');
```

We can also compute a three-point diff using this table.
In a three-point diff we want to see how our feature branch has diverged
from our common ancestor E, without including the changes from F and G on main.

```SQL
SELECT * FROM dolt_commit_diff_$TABLENAME WHERE to_commit=HASHOF('feature') and from_commit=dolt_merge_base('main', 'feature');
```

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

Using the [`dolthub/SHAQ` database from DoltHub](https://www.dolthub.com/repositories/dolthub/SHAQ),
we can query for the five most recent commits before November 1st, 2021, across all commits in the database
(regardless of what is checked out to `HEAD`) with this query:

```sql
SELECT *
FROM dolt_commits
WHERE date < "2021-11-01"
ORDER BY date DESC
LIMIT 5;
```

```text
+----------------------------------+-----------+--------------------+-----------------------------------+--------------------------------------------------------+
| commit_hash                      | committer | email              | date                              | message                                                |
+----------------------------------+-----------+--------------------+-----------------------------------+--------------------------------------------------------+
| 57cbn09m8egip6anq5c8s94uhhvaifkp | bpf120    | bpf120@gmail.com   | 2021-10-22 11:13:32.125 -0700 PDT | Merge pull request #43 from brian_add_all_team_seasons |
| nqpgo65t5rcq2gkcvnfigqpsabc42qln | bpf120    | bpf120@gmail.com   | 2021-10-22 11:13:17.919 -0700 PDT | Merge pull request #41 from brian                      |
| vto66re76lvfri7ls0ndu3m9fg47s4li | bpf120    | bpf120@gmail.com   | 2021-10-22 08:28:20.748 -0700 PDT | Added all teams for all seasons                        |
| akiasoe4jp68gq3k4fbhdni6ti0lntqk | bpf120    | brianf@dolthub.com | 2021-10-22 04:19:07.037 -0700 PDT | Adding BAA to league tables                            |
| ptau7oesshub36075l12bqp7cejqu64j | bpf120    | brianf@dolthub.com | 2021-10-22 04:09:07.604 -0700 PDT | Adding ABA as a league                                 |
+----------------------------------+-----------+--------------------+-----------------------------------+--------------------------------------------------------+
```

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
[`dolthub/nba-players`](https://www.dolthub.com/repositories/dolthub/nba-players)
database from [DoltHub](https://www.dolthub.com/) as our
example, the following query uses the `dolt_diff` system table to find all commits, and the tables they changed,
from the month of October, 2020.

```sql
SELECT commit_hash, table_name
FROM   dolt_diff
WHERE  date BETWEEN "2020-10-01" AND "2020-10-31";
```

```text
+----------------------------------+------------------------------+
| commit_hash                      | table_name                   |
+----------------------------------+------------------------------+
| rla1p8emnp91urj3uant52msrskouqil | draft_history                |
| 1gtq675ira4phn3ib05ri0qksdp13ut3 | career_totals_post_season    |
| 1gtq675ira4phn3ib05ri0qksdp13ut3 | career_totals_regular_season |
| 1gtq675ira4phn3ib05ri0qksdp13ut3 | rankings_post_season         |
| 1gtq675ira4phn3ib05ri0qksdp13ut3 | rankings_regular_season      |
| 1gtq675ira4phn3ib05ri0qksdp13ut3 | season_totals_allstar        |
| 1gtq675ira4phn3ib05ri0qksdp13ut3 | season_totals_post_season    |
| 1gtq675ira4phn3ib05ri0qksdp13ut3 | season_totals_regular_season |
| jbk2ckroo4hhqovrcpiv7c615dlsf3ut | draft_history                |
| pu60cdppae7rumf1lm06j5ngkijp7i8f | players                      |
+----------------------------------+------------------------------+
```

From these results, we can see there were four commits to this database in October, 2020. Commits
`rla1p8em` and `jbk2ckro` only changed the `draft_history` table, commit `pu60cdpp` changed the `players`
table, and commit `1gtq675i` made changes to seven tables. To dig deeper into these changes, we can query
the `dolt_diff_$TABLE` system tables specific to each of the changed tables, like this:

```sql
SELECT count(*) as total_rows_changed
FROM   dolt_diff_players
WHERE  to_commit='pu60cdppae7rumf1lm06j5ngkijp7i8f';
```

```text
+--------------------+
| total_rows_changed |
+--------------------+
| 4501               |
+--------------------+
```

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
[`dolthub/us-jails`](https://www.dolthub.com/repositories/dolthub/us-jails)
database from [DoltHub](https://www.dolthub.com/) as our
example, the following query uses the `dolt_column_diff` system table to find all commits, and tables where the source url was updated.

```sql
SELECT commit_hash, date 
FROM dolt_column_diff 
WHERE column_name = 'source_url';
```

```text
+----------------------------------+-------------------------+
| commit_hash                      | date                    |
+----------------------------------+-------------------------+
| i3f3orlfmbjgqnst90c8r96jps7tdtv9 | 2022-06-14 19:11:58.402 |
| ubu61jhc3qp1d28035ee3kd105ao10q1 | 2022-06-14 06:40:23.19  |
| gora1aioouji9j3858n928g84en6b17b | 2022-06-02 19:25:54.407 |
| bg7c1miq9rpbhfhnlebtlmpdvt3u898j | 2022-05-28 04:56:12.894 |
| 4dgdn1ur42cuk18sin7olt8fnaik5d9b | 2022-05-19 19:28:49.013 |
| 3c2mb901bm3m1erc3k3ojad950v694ad | 2022-05-18 18:09:27.142 |
| 2qdmmfgjm5kuv358e2c9p2a91c9ue9ja | 2022-04-19 14:37:20.099 |
| 2qdmmfgjm5kuv358e2c9p2a91c9ue9ja | 2022-04-19 14:37:20.099 |
| dj11kqhja290f9vut5i8jhdg3hun4e1v | 2022-05-19 19:26:53.179 |
| 6p9ho1qgjbsgaf810k6u4f5mhqfti82o | 2022-05-18 00:26:43.743 |
| ...                              |                         |
+----------------------------------+-------------------------+
```

If we narrow in on the `inmate_population_snapshots` table we can count the number of commits that updated each column
over the course of all our commits.

```sql
SELECT column_name, count(commit_hash) as total_column_changes 
FROM dolt_column_diff 
WHERE table_name = 'inmate_population_snapshots' 
GROUP BY column_name;
```

```text
+----------------------------+----------------------+
| column_name                | total_column_changes |
+----------------------------+----------------------+
| source_url_2               | 34                   |
| id                         | 63                   |
| snapshot_date              | 63                   |
| total                      | 62                   |
| male                       | 25                   |
| source_url                 | 64                   |
| total_off_site             | 16                   |
| female                     | 25                   |
| on_probation               | 3                    |
| technical_parole_violators | 16                   |
| federal_offense            | 22                   |
| convicted_or_sentenced     | 26                   |
| detained_or_awaiting_trial | 33                   |
| civil_offense              | 7                    |
| awaiting_trial             | 4                    |
| convicted                  | 4                    |
| other_gender               | 4                    |
| white                      | 7                    |
| back                       | 1                    |
| hispanic                   | 4                    |
| asian                      | 7                    |
| american_indian            | 7                    |
| mexican_american           | 1                    |
| multi_racial               | 4                    |
| other_race                 | 7                    |
| on_parole                  | 1                    |
| felony                     | 18                   |
| misdemeanor                | 18                   |
| other_offense              | 6                    |
| first_time_incarcerated    | 1                    |
| employed                   | 1                    |
| unemployed                 | 1                    |
| citizen                    | 1                    |
| noncitizen                 | 1                    |
| juvenile                   | 4                    |
| juvenile_male              | 1                    |
| juvenile_female            | 1                    |
| death_row_condemned        | 1                    |
| solitary_confinement       | 1                    |
| black                      | 6                    |
+----------------------------+----------------------+
```

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
[`dolthub/wikipedia-ngrams`](https://www.dolthub.com/repositories/dolthub/wikipedia-ngrams)
database from [DoltHub](https://www.dolthub.com/) as our
example, the following query will retrieve the bigrams whose total
counts have changed the most between 2 versions.

```sql
SELECT from_bigram, to_bigram, from_total_count, to_total_count, ABS(to_total_count-from_total_count) AS delta
FROM dolt_diff_bigram_counts
WHERE from_commit = HASHOF("HEAD~3") AND diff_type = "modified"
ORDER BY delta DESC
LIMIT 10;
```

```text
+-------------+-------------+------------------+----------------+-------+
| from_bigram | to_bigram   | from_total_count | to_total_count | delta |
+-------------+-------------+------------------+----------------+-------+
| of the      | of the      | 21566470         | 21616678       | 50208 |
| _START_ The | _START_ The | 19008468         | 19052410       | 43942 |
| in the      | in the      | 14345719         | 14379619       | 33900 |
| _START_ In  | _START_ In  | 8212684          | 8234586        | 21902 |
| to the      | to the      | 7275659          | 7291823        | 16164 |
| _START_ He  | _START_ He  | 5722362          | 5737483        | 15121 |
| at the      | at the      | 4273616          | 4287398        | 13782 |
| for the     | for the     | 4427780          | 4438872        | 11092 |
| and the     | and the     | 4871852          | 4882874        | 11022 |
| is a        | is a        | 4632620          | 4643068        | 10448 |
+-------------+-------------+------------------+----------------+-------+
```

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

Consider a table named `states` with the following schema:

```text
+------------+--------+
| field      | type   |
+------------+--------+
| state      | TEXT   |
| capital    | TEXT   |
| population | BIGINT |
| area       | BIGINT |
| counties   | BIGINT |
+------------+--------+
```

The schema for `dolt_history_states` would be:

```text
+-------------+----------+
| field       | type     |
+-------------+----------+
| state       | TEXT     |
| capital     | TEXT     |
| population  | BIGINT   |
| area        | BIGINT   |
| counties    | BIGINT   |
| commit_hash | TEXT     |
| committer   | TEXT     |
| commit_date | DATETIME |
+-------------+----------+
```

### Example Query

Assume a database with the `states` table above and the following commit graph:

```text
   B---E  feature
  /
 A---C---D  main
```

When the `main` branch is checked out, the following query returns the results below, showing
the state of the Virginia row at every ancestor commit reachable from our current branch.

```sql
SELECT *
FROM dolt_history_states
WHERE state = "Virginia";
```

```text
+----------+------------+--------------+--------+----------+-------------+-----------+---------------------------------+
| state    | population | capital      | area   | counties | commit_hash | committer | commit_date                     |
+----------+------------+--------------+--------+----------+-------------+-----------+---------------------------------+
| Virginia | 877683     | Richmond     | 42774  | 75       | HASHOF(D)   | billybob  | 1810-01-01 00:00:00.0 +0000 UTC |
| Virginia | 807557     | Richmond     | 42774  | 73       | HASHOF(C)   | billybob  | 1800-01-01 00:00:00.0 +0000 UTC |
| Virginia | 691937     | Williamsburg | 42774  | 68       | HASHOF(A)   | billybob  | 1778-01-09 00:00:00.0 +0000 UTC |
+----------+------------+--------------+--------+----------+-------------+-----------+---------------------------------+

# Note: in the real result set there would be actual commit hashes for each row.
```

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

The following query shows the commits reachable from the current checked out head and created by user `bheni` since April, 2019:

```sql
SELECT *
FROM dolt_log
WHERE committer = "bheni" and date > "2019-04-01"
ORDER BY date;
```

```text
+----------------------------------+-----------+--------------------+-----------------------------------+---------------+
| commit_hash                      | committer | email              | date                              | message       |
+----------------------------------+-----------+--------------------+-----------------------------------+---------------+
| qi331vjgoavqpi5am334cji1gmhlkdv5 | bheni     | brian@dolthub.com | 2019-06-07 00:22:24.856 +0000 UTC | update rating |
| 137qgvrsve1u458briekqar5f7iiqq2j | bheni     | brian@dolthub.com | 2019-04-04 22:43:00.197 +0000 UTC | change rating |
| rqpd7ga1nic3jmc54h44qa05i8124vsp | bheni     | brian@dolthub.com | 2019-04-04 21:07:36.536 +0000 UTC | fixes         |
+----------------------------------+-----------+--------------------+-----------------------------------+---------------+
```

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
| staged     | tinyint | NO   |     |
| status     | text    | NO   |     |
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

- An asterisk "*"  or ampersand "%" matches any number of characters.
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