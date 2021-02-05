---
title: SQL
---

# SQL

## Overview

Dolt data repositories are unique in that they arrive capable of running MySQL compatible SQL statements against them. Your Dolt binary can execute SQL against any Dolt repo you have happen to have locally. Existing RDBMS solutions have optimized their on-disk layout to support the needs of physical plan execution. Dolt makes a different set of tradeoffs, instead using a Merkel Tree to support robust version control semantics, and thus portability of the data. The combination of portability, robust version control semantics, and a SQL interface make Dolt a uniquely compelling data format.

### Executing SQL

There are two ways of executing SQL against your data repository. The first is via the `dolt sql` command, which runs SQL queries from your shell, and the second is the sql-server command, which starts a MySQL compatible server you can connect to with any standard database client.

#### dolt sql

Using `dolt sql` you can issue SQL statements against a local data repository directly. Any writes made to the repository will be reflected in the working set, which can be added via `dolt add` and committed via `dolt commit` as per usual.

There are 2 basic modes which the `dolt sql` command operate in. The first is command line query mode where a semicolon delimited list of queries is provided on the command line using the -q parameter. The second is using the Dolt SQL interactive shell which can be started by running the `dolt sql` command without any arguments in a directory containing a Dolt data repository.

View the `dolt sql` command documentation [here](https://github.com/dolthub/docs/tree/bfdf7d8c4c511940b3281abe0290c8eb4097e6c0/content/cli/README.md#dolt-sql)

#### dolt sql-server

The `dolt sql-server` command will run a MySQL compatible server which clients can execute queries against. This provides a programmatic interface to get data into or out of a Dolt data repository. It can also be used to connect with third party tooling which supports MySQL.

View the `dolt sql-server` command documentation [here](https://github.com/dolthub/docs/tree/bfdf7d8c4c511940b3281abe0290c8eb4097e6c0/content/cli/README.md#dolt-sql-server) to learn how to configure the server.

### Dolt CLI in SQL

You can operate several of dolt cli commands in the sql layer directly. This is especially useful if you are using sql in the application layer and want to the query a Dolt repository.

### System Tables

Many of Dolt's unique features are accessible via system tables. These tables allow you to query the same information available from various Dolt commands, such as branch information, the commit log, and much more. You can write queries that examine the history of a table, or that select the diff between two commits. See the individual sections below for more details.

* [dolt\_log table](sql.md#dolt-system-tables_dolt_log)
* [dolt\_branches table](sql.md#dolt-system-tables_dolt_branches)
* [dolt\_docs table](sql.md#dolt-system-tables_dolt_docs)
* [dolt\_diff tables](sql.md#dolt-system-tables_dolt_diff_tablename)
* [dolt\_history tables](sql.md#dolt-system-tables_dolt_history_tablename)
* [dolt\_schemas table](sql.md#dolt-system-tables_dolt_schemas)

### Concurrency

When any client initiates a SQL session against a Dolt data repository, that session will be pointing to a specific commit even if other clients make changes. Therefore, modifications made by other clients will not be visible. There are two commit modes which determine how you are able to write to the database, commit those writes, and get modifications made by other clients.

#### Autocommit mode

```text
NOTE: This may be confusing to some readers. Commit in this context is Commit in the database context not Commit in the
version control context.
```

In autocommit mode, when a client connects they will be pinned to the working data for the Dolt data repository. Any write queries will modify the in memory state, and automatically update the working set. This is the most intuitive model in that it works identically to the `dolt sql` command. Any time a write query completes against the server, you could open up a separate terminal window and see the modifications with `dolt diff` or by running a SELECT query using `dolt sql`. That same client will be able to see his modifications in read queries, however if there was a second client that connected at the same time, they will not see eachother's writes, and if both tried to make writes to the database the last write would win, and the first would be overwritten. This is why maximum connections should be set to 1 when working in this mode \(See the `dolt sql-server` docs [here](https://github.com/dolthub/docs/tree/bfdf7d8c4c511940b3281abe0290c8eb4097e6c0/content/cli/README.md#dolt-sql-server) to see how to configure the server\).

#### Manual commit mode

In manual-commit mode users will manually set what commit they are pinned to and user writes are not written to the database until the user creates a commit manually. Manually created commits can be used in insert and update statements on the [dolt\_branches](https://github.com/dolthub/docs/tree/bfdf7d8c4c511940b3281abe0290c8eb4097e6c0/content/sql/README.md#dolt-system-tables) table. In manual commit mode it is possible for multiple users to interact with the database simultaneously, however until merge support with conflict resolution is supported in dolt there are limitations.

See the full [manual commit mode documentation](https://github.com/dolthub/docs/tree/bfdf7d8c4c511940b3281abe0290c8eb4097e6c0/content/sql/README.md#concurrency)

## Querying non-HEAD revisions of a database

Dolt SQL supports a variant of [SQL 2011](https://en.wikipedia.org/wiki/SQL:2011) syntax to query non-HEAD revisions of a database via the `AS OF` clause:

```sql
SELECT * FROM myTable AS OF 'kfvpgcf8pkd6blnkvv8e0kle8j6lug7a';
SELECT * FROM myTable AS OF 'myBranch';
SELECT * FROM myTable AS OF 'HEAD^2';
SELECT * FROM myTable AS OF TIMESTAMP('2020-01-01');
SELECT * FROM myTable AS OF 'myBranch' JOIN myTable AS OF 'yourBranch' AS foo;
```

The `AS OF` expression must name a valid Dolt reference, such as a commit hash, branch name, or other reference. Timestamp / date values are also supported. Each table in a query can use a different `AS OF` clause.

In addition to this `AS OF` syntax for `SELECT` statements, Dolt also supports an extension to the standard MySQL syntax to examine the database schema for a previous revision:

```sql
SHOW TABLES AS OF 'kfvpgcf8pkd6blnkvv8e0kle8j6lug7a';
```

## DOLT CLI in SQL

### `DOLT_COMMIT()`

#### Description

Commits staged tables to HEAD. Works exactly like `dolt commit` with each value directly following the flag. Note that you must always support the message flag with the intended message right after.

By default, when running in server mode with dolt sql-server, dolt does not automatically update the working set of your repository with data updates unless @@autocommit is set to 1. You can also issue manual COMMIT statements to flush the working set to disk. See the section on [concurrency](https://www.dolthub.com/docs/reference/sql/#concurrency).

```sql
SELECT DOLT_COMMIT('-a', '-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

#### Options

`-m`, `--message`: Use the given `<msg>` as the commit message. **Required**

`-a`: Stages all tables with changes before committing

`--allow-empty`: Allow recording a commit that has the exact same data as its sole parent. This is usually a mistake, so it is disabled by default. This option bypasses that safety.

`--date`: Specify the date used in the commit. If not specified the current system time is used.

`--author`: Specify an explicit author using the standard "A U Thor [author@example.com](mailto:author@example.com)" format.

#### Example

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage all changes and commit.
SELECT DOLT_COMMIT('-a', '-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

## Dolt System Tables

### `dolt_branches`

#### Description

Queryable system table which shows the Dolt data repository branches.

#### Schema

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

#### Example Queries

Get all the branches.

```sql
SELECT *
FROM dolt_branches
```

```text
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
| name   | hash                             | latest_committer | latest_committer_email | latest_commit_date                | latest_commit_message         |
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
| 2011   | t2sbbg3h6uo93002frfj3hguf22f1uvh | bheni            | brian@dolthub.com     | 2020-01-22 20:47:31.213 +0000 UTC | import 2011 column mappings   |
| 2012   | 7gonpqhihgnv8tktgafsg2oovnf3hv7j | bheni            | brian@dolthub.com     | 2020-01-22 23:01:39.08 +0000 UTC  | import 2012 allnoagi data     |
| 2013   | m9seqiabaefo3b6ieg90rr4a14gf6226 | bheni            | brian@dolthub.com     | 2020-01-22 23:50:10.639 +0000 UTC | import 2013 zipcodeagi data   |
| 2014   | v932nm88f5g3pjmtnkq917r2q66jm0df | bheni            | brian@dolthub.com     | 2020-01-23 00:00:43.673 +0000 UTC | update 2014 column mappings   |
| 2015   | c7h0jc23hel6qbh8ro5ertiv15to9g9o | bheni            | brian@dolthub.com     | 2020-01-23 00:04:35.459 +0000 UTC | import 2015 allnoagi data     |
| 2016   | 0jntctp6u236le9qjlt9kf1q1if7mp1l | bheni            | brian@dolthub.com     | 2020-01-28 20:38:32.834 +0000 UTC | fix allnoagi zipcode for 2016 |
| 2017   | j883mmogbd7rg3cfltukugk0n65ud0fh | bheni            | brian@dolthub.com     | 2020-01-28 16:43:45.687 +0000 UTC | import 2017 allnoagi data     |
| master | j883mmogbd7rg3cfltukugk0n65ud0fh | bheni            | brian@dolthub.com     | 2020-01-28 16:43:45.687 +0000 UTC | import 2017 allnoagi data     |
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
```

Get the current branch for a database named "mydb".

```sql
SELECT *
FROM dolt_branches
WHERE hash = @@mydb_head
```

```text
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
| name   | hash                             | latest_committer | latest_committer_email | latest_commit_date                | latest_commit_message         |
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
| 2016   | 0jntctp6u236le9qjlt9kf1q1if7mp1l | bheni            | brian@dolthub.com     | 2020-01-28 20:38:32.834 +0000 UTC | fix allnoagi zipcode for 2016 |
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
```

Create a new commit, and then create a branch from that commit

```sql
SET @@mydb_head = COMMIT("my commit message")

INSERT INTO dolt_branches (name, hash)
VALUES ("my branch name", @@mydb_head);
```

### `dolt_diff_$TABLENAME`

#### Description

For every user table named `$TABLENAME`, there is a queryable system table named `dolt_diff_$TABLENAME` which can be queried to see how rows have changed over time. Each row in the result set represent a row that has changed between two commits.

#### Schema

Every Dolt diff table will have the columns

```text
+-------------+------+
| field       | type |
+-------------+------+
| from_commit | TEXT |
| to_commit   | TEXT |
| diff_type   | TEXT |
+-------------+------+
```

The remaining columns will be dependent on the schema of the user table. For every column X in your table at `from_commit`, there will be a column in the result set named `from_$X` with the same type as `X`, and for every column `Y` in your table at `to_commit` there will be a column in the result set named `to_$Y` with the same type as `Y`.

#### Example Schema

For a hypothetical table named states with a schema that changes between `from_commit` and `to_commit` as shown below

```text
# schema at from_commit    # schema at to_commit
+------------+--------+    +------------+--------+
| field      | type   |    | field      | type   |
+------------+--------+    +------------+--------+
| state      | TEXT   |    | state      | TEXT   |
| population | BIGINT |    | population | BIGINT |
+------------+--------+    | area       | BIGINT |
                           +-------------+-------+
```

The schema for `dolt_diff_states` would be

```text
+-----------------+--------+
| field           | type   |
+-----------------+--------+
| from_state      | TEXT   |
| to_state        | TEXT   |
| from_population | BIGINT |
| to_population   | BIGINT |
| to_state        | TEXT   |
| from_commit     | TEXT   |
| to_commit       | TEXT   |
| diff_type       | TEXT   |
+-----------------+--------+
```

#### Query Details

Doing a `SELECT *` query for a diff table will show you every change that has occurred to each row for every commit in this branches history. Using `to_commit` and `from_commit` you can limit the data to specific commits. There is one special `to_commit` value `WORKING` which can be used to see what changes are in the working set that have yet to be committed to HEAD. It is often useful to use the `HASHOF()` function to get the commit hash of a branch, or an anscestor commit. To get the differences between the last commit and it's parent you could use `to_commit=HASHOF("HEAD") and from_commit=HASHOF("HEAD^")`

For each row the field `diff_type` will be one of the values `added`, `modified`, or `removed`. You can filter which rows appear in the result set to one or more of those `diff_type` values in order to limit which types of changes will be returned.

#### Example Query

Taking the [`dolthub/wikipedia-ngrams`](https://www.dolthub.com/repositories/dolthub/wikipedia-ngrams) data repository from [DoltHub](https://www.dolthub.com/) as our example, the following query will retrieve the bigrams whose total counts have changed the most between 2 versions.

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

### `dolt_docs`

#### Description

System table that stores the contents of Dolt docs \(`LICENSE.md`, `README.md`\).

#### Schema

```text
+----------+------+
| field    | type |
+----------+------+
| doc_name | text |
| doc_text | text |
+----------+------+
```

#### Usage

Dolt users do not have to be familiar with this system table in order to make a `LICENSE.md` or `README.md`. Simply run `dolt init` or `touch README.md` and `touch LICENSE.md` from a Dolt repository to get started. Then, `dolt add` and `dolt commit` the docs like you would a table.

### `dolt_history_$TABLENAME`

#### Description

For every user table named $TABLENAME, there is a queryable system table named dolt\_history\_$TABLENAME which can be queried to find a rows value at every commit in the current branches commit graph.

#### Schema

Every Dolt history table will have the columns

```text
+-------------+----------+
| field       | type     |
+-------------+----------+
| commit_hash | TEXT     |
| committer   | TEXT     |
| commit_date | DATETIME |
+-------------+----------+
```

The rest of the columns will be the superset of all columns that have existed throughout the history of the table. As the query.

#### Example Schema

For a hypothetical data repository with the following commit graph:

```text
   A
  / \
 B   C
      \
       D
```

Which has a table named states with the following schemas at each commit:

```text
# schema at A              # schema at B              # schema at C              # schema at D
+------------+--------+    +------------+--------+    +------------+--------+    +------------+--------+
| field      | type   |    | field      | type   |    | field      | type   |    | field      | type   |
+------------+--------+    +------------+--------+    +------------+--------+    +------------+--------+
| state      | TEXT   |    | state      | TEXT   |    | state      | TEXT   |    | state      | TEXT   |
| population | BIGINT |    | population | BIGINT |    | population | BIGINT |    | population | BIGINT |
+------------+--------+    | capital    | TEXT   |    | area       | BIGINT |    | area       | BIGINT |
                           +------------+--------+    +------------+--------+    | counties   | BIGINT |
                                                                                 +------------+--------+
```

The schema for dolt\_history\_states would be:

```text
+-------------+----------+
| field       | type     |
+-------------+----------+
| state       | TEXT     |
| population  | BIGINT   |
| capital     | TEXT     |
| area        | BIGINT   |
| counties    | BIGINT   |
| commit_hash | TEXT     |
| committer   | TEXT     |
| commit_date | DATETIME |
+-------------+----------+
```

#### Example Query

Taking the above table as an example. If the data inside dates for each commit was:

* At commit "A" the state data from 1790
* At commit "B" the state data from 1800
* At commit "C" the state data from 1800
* At commit "D" the state data from 1810

```sql
SELECT *
FROM dolt_history_states
WHERE state = "Virginia";
```

```text
+----------+------------+----------+--------+----------+-------------+-----------+---------------------------------+
| state    | population | capital  | area   | counties | commit_hash | committer | commit_date                     |
+----------+------------+----------+--------+----------+-------------+-----------+---------------------------------+
| Virginia | 691937     | <NULL>   | <NULL> | <NULL>   | HASH_AT(A)  | billybob  | 1790-01-09 00:00:00.0 +0000 UTC |
| Virginia | 807557     | Richmond | <NULL> | <NULL>   | HASH_AT(B)  | billybob  | 1800-01-01 00:00:00.0 +0000 UTC |
| Virginia | 807557     | <NULL>   | 42774  | <NULL>   | HASH_AT(C)  | billybob  | 1800-01-01 00:00:00.0 +0000 UTC |
| Virginia | 877683     | <NULL>   | 42774  | 99       | HASH_AT(D)  | billybob  | 1810-01-01 00:00:00.0 +0000 UTC |
+----------+------------+----------+--------+----------+-------------+-----------+---------------------------------+

# Note in the real result set there would be actual commit hashes for each row.  Here I have used notation that is
# easier to understand how it relates to our commit graph and the data associated with each commit above
```

### `dolt_log`

#### Description

Queryable system table which shows the commit log

#### Schema

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

#### Example Query

```sql
SELECT *
FROM dolt_log
WHERE committer = "bheni" and date > "2019-04-01"
ORDER BY "date";
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

### `dolt_schemas`

#### Description

SQL Schema fragments for a dolt database value that are versioned alongside the database itself. Certain DDL statements will modify this table and the value of this table in a SQL session will affect what database entities exist in the session.

#### Schema

```text
+-------------+----------+
| field       | type     |
+-------------+--------- +
| type        | text     |
| name        | text     |
| fragment    | text     |
+-------------+--------- +
```

Currently on view definitions are stored in `dolt_schemas`. `type` is currently always the string `view`. `name` is the name of the view as supplied in the `CREATE VIEW ...` statement. `fragment` is the `select` fragment that the view is defined as.

The values in this table are partly implementation details associated with the implementation of the underlying database objects.

#### Example Query

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

## Supported SQL Features

Dolt's goal is to be a drop-in replacement for MySQL, with every query and statement that works in MySQL behaving identically in Dolt. For most syntax and technical questions, you should feel free to refer to the [MySQL user manual](https://dev.mysql.com/doc/refman/8.0/en/select.html). Any deviation from the MySQL manual should be documented on this page, or else indicates a bug. Please [file issues](https://github.com/dolthub/dolt/issues) with any incompatibilities you discover.

### Data types

| Data type | Supported | Notes |
| :--- | :--- | :--- |
| `BOOLEAN` | ✓ | Alias for `TINYINT` |
| `INTEGER` | ✓ |  |
| `TINYINT` | ✓ |  |
| `SMALLINT` | ✓ |  |
| `MEDIUMINT` | ✓ |  |
| `INT` | ✓ |  |
| `BIGINT` | ✓ |  |
| `DECIMAL` | ✓ | Max \(precision + scale\) is 65 |
| `FLOAT` | ✓ |  |
| `DOUBLE` | ✓ |  |
| `BIT` | ✓ |  |
| `DATE` | ✓ |  |
| `TIME` | ✓ |  |
| `DATETIME` | ✓ |  |
| `TIMESTAMP` | ✓ |  |
| `YEAR` | ✓ |  |
| `CHAR` | ✓ |  |
| `VARCHAR` | ✓ |  |
| `BINARY` | ✓ |  |
| `VARBINARY` | ✓ |  |
| `BLOB` | ✓ |  |
| `TINYTEXT` | ✓ |  |
| `TEXT` | ✓ |  |
| `MEDIUMTEXT` | ✓ |  |
| `LONGTEXT` | ✓ |  |
| `ENUM` | ✓ |  |
| `SET` | ✓ |  |
| `GEOMETRY` | X |  |
| `POINT` | X |  |
| `LINESTRING` | X |  |
| `POLYGON` | X |  |
| `MULTIPOINT` | X |  |
| `MULTILINESTRING` | X |  |
| `MULTIPOLYGON` | X |  |
| `GEOMETRYCOLLECTION` | X |  |
| `JSON` | X |  |

### Constraints

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Not Null | ✓ |  |
| Unique | ✓ | Unique constraints are supported via creation of indexes with `UNIQUE` keys. |
| Primary Key | ✓ | Dolt tables must have a primary key. |
| Check | X |  |
| Foreign Key | ✓ |  |
| Default Value | ✓ |  |

### Transactions

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `BEGIN` | O | `BEGIN` parses correctly, but is a no-op: it doesn't create a checkpoint that can be returned to with `ROLLBACK`. |
| `COMMIT` | ✓ | `COMMIT` will write any pending changes to the working set when `@@autocommit = false` |
| `COMMIT(MESSAGE)` | ✓ | The `COMMIT()` function creates a commit of the current database state and returns the hash of this new commit. See [concurrency](sql.md#concurrency) for details. |
| `LOCK TABLES` | X | `LOCK TABLES` parses correctly but does not prevent access to those tables from other sessions. |
| `ROLLBACK` | X | `ROLLBACK` parses correctly but is a no-op. |
| `SAVEPOINT` | X |  |
| `SET @@autocommit = 1` | ✓ | When `@@autocommit = true`, changes to data will update the working set after every statement. When `@@autocommit = false`, the working set will only be updated after `COMMIT` statements. |

### Indexes

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Indexes | ✓ |  |
| Multi-column indexes | ✓ |  |
| Full-text indexes | X |  |
| Spatial indexes | X |  |

### Schema

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `ALTER TABLE` statements | O | Some limitations. See the [supported statements doc](sql.md#supported-statements). |
| Database renames | X | Database names are read-only, and configured by the server at startup. |
| Adding tables | ✓ |  |
| Dropping tables | ✓ |  |
| Table renames | ✓ |  |
| Adding views | ✓ |  |
| Dropping views | ✓ |  |
| View renames | X |  |
| Column renames | ✓ |  |
| Adding columns | ✓ |  |
| Removing columns | ✓ |  |
| Reordering columns | ✓ |  |
| Adding constraints | ✓ |  |
| Removing constaints | ✓ |  |
| Creating indexes | ✓ |  |
| Index renames | ✓ |  |
| Removing indexes | ✓ |  |
| `AUTO INCREMENT` | ✓ |  |

### Statements

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Common statements | ✓ | See the [supported statements doc](sql.md#supported-statements) |

### Clauses

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `WHERE` | ✓ |  |
| `HAVING` | ✓ |  |
| `LIMIT` | ✓ |  |
| `OFFSET` | ✓ |  |
| `GROUP BY` | ✓ | Group-by columns can be referred to by their ordinal \(e.g. `1`, `2`\), a MySQL dialect extension. |
| `ORDER BY` | ✓ | Order-by columns can be referred to by their ordinal \(e.g. `1`, `2`\), a MySQL dialect extension. |
| Aggregate functions | ✓ |  |
| `DISTINCT` | O | Only supported for certain expressions. |
| `ALL` | ✓ |  |

### Table expressions

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Tables and views | ✓ |  |
| Table and view aliases | ✓ |  |
| Joins | O | `LEFT INNER`, `RIGHT INNER`, `INNER`, `NATURAL`, and `CROSS JOINS` are supported. `OUTER` joins are not supported. |
| Subqueries | ✓ |  |
| `UNION` | ✓ |  |

### Scalar expressions

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Common operators | ✓ |  |
| `IF` | ✓ |  |
| `CASE` | ✓ |  |
| `NULLIF` | ✓ |  |
| `COALESCE` | ✓ |  |
| `IFNULL` | ✓ |  |
| `AND` | ✓ |  |
| `OR` | ✓ |  |
| `LIKE` | ✓ |  |
| `IN` | ✓ |  |
| `INTERVAL` | ✓ |  |
| Scalar subqueries | ✓ |  |
| Column ordinal references | ✓ |  |

### Functions and operators

**Currently supporting 129 of 436 MySQL functions.**

Most functions are simple to implement. If you need one that isn't implemented, [please file an issue](https://github.com/dolthub/dolt/issues). We can fulfill most requests for new functions within 24 hours.

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `%` | ✓ |  |
| `&` | ✓ |  |
| `|` | ✓ |  |
| `*` | ✓ |  |
| `+` | ✓ |  |
| `->>` | ✓ |  |
| `->` | ✓ |  |
| `-` | ✓ |  |
| `/` | ✓ |  |
| `:=` | X |  |
| `<<` | ✓ |  |
| `<=>` | X |  |
| `<=` | ✓ |  |
| `<>`, `!=` | ✓ |  |
| `<` | ✓ |  |
| `=` | ✓ |  |
| `>=` | ✓ |  |
| `>>` | ✓ |  |
| `>` | ✓ |  |
| `^` | ✓ |  |
| `ABS()` | ✓ |  |
| `ACOS()` | ✓ |  |
| `ADDDATE()` | X |  |
| `ADDTIME()` | X |  |
| `AES_DECRYPT()` | X |  |
| `AES_ENCRYPT()` | X |  |
| `AND` | ✓ |  |
| `ANY_VALUE()` | X |  |
| `ARRAY_LENGTH()` | ✓ |  |
| `ASCII()` | ✓ |  |
| `ASIN()` | ✓ |  |
| `ASYMMETRIC_DECRYPT()` | X |  |
| `ASYMMETRIC_DERIVE()` | X |  |
| `ASYMMETRIC_ENCRYPT()` | X |  |
| `ASYMMETRIC_SIGN()` | X |  |
| `ASYMMETRIC_VERIFY()` | X |  |
| `ATAN()` | ✓ |  |
| `ATAN2()` | X |  |
| `AVG()` | ✓ |  |
| `BENCHMARK()` | X |  |
| `BETWEEN ... AND ...` | ✓ |  |
| `BIN()` | ✓ |  |
| `BIN_TO_UUID()` | X |  |
| `BIT_AND()` | X |  |
| `BIT_COUNT()` | X |  |
| `BIT_LENGTH()` | ✓ |  |
| `BIT_OR()` | X | `|` is supported |
| `BIT_XOR()` | X | `^` is supported |
| `CAN_ACCESS_COLUMN()` | X |  |
| `CAN_ACCESS_DATABASE()` | X |  |
| `CAN_ACCESS_TABLE()` | X |  |
| `CAN_ACCESS_VIEW()` | X |  |
| `CASE` | ✓ |  |
| `CAST()` | X |  |
| `CEIL()` | ✓ |  |
| `CEILING()` | ✓ |  |
| `CHAR()` | X |  |
| `CHARACTER_LENGTH()` | ✓ |  |
| `CHARSET()` | X |  |
| `CHAR_LENGTH()` | ✓ |  |
| `COALESCE()` | ✓ |  |
| `COERCIBILITY()` | X |  |
| `COLLATION()` | X |  |
| `COMMIT()` | ✓ | Creates a new Dolt commit and returns the hash of it. See [concurrency](sql.md#concurrency) |
| `COMPRESS()` | X |  |
| `CONCAT()` | ✓ |  |
| `CONCAT_WS()` | ✓ |  |
| `CONNECTION_ID()` | ✓ |  |
| `CONV()` | X |  |
| `CONVERT()` | X |  |
| `CONVERT_TZ()` | X |  |
| `COS()` | ✓ |  |
| `COT()` | ✓ |  |
| `COUNT()` | ✓ |  |
| `COUNT(DISTINCT)` | ✓ |  |
| `CRC32()` | ✓ |  |
| `CREATE_ASYMMETRIC_PRIV_KEY()` | X |  |
| `CREATE_ASYMMETRIC_PUB_KEY()` | X |  |
| `CREATE_DH_PARAMETERS()` | X |  |
| `CREATE_DIGEST()` | X |  |
| `CUME_DIST()` | X |  |
| `CURDATE()` | ✓ |  |
| `CURRENT_DATE()` | ✓ |  |
| `CURRENT_ROLE()` | X |  |
| `CURRENT_TIME()` | ✓ |  |
| `CURRENT_TIMESTAMP()` | ✓ |  |
| `CURRENT_USER()` | ✓ |  |
| `CURTIME()` | ✓ |  |
| `DATABASE()` | ✓ |  |
| `DATE()` | ✓ |  |
| `DATEDIFF()` | X |  |
| `DATETIME()` | ✓ |  |
| `DATE_ADD()` | ✓ |  |
| `DATE_FORMAT()` | ✓ |  |
| `DATE_SUB()` | ✓ |  |
| `DAY()` | ✓ |  |
| `DAYNAME()` | ✓ |  |
| `DAYOFMONTH()` | ✓ |  |
| `DAYOFWEEK()` | ✓ |  |
| `DAYOFYEAR()` | ✓ |  |
| `DEFAULT()` | X |  |
| `DEGREES()` | ✓ |  |
| `DENSE_RANK()` | X |  |
| `DIV` | ✓ |  |
| `ELT()` | X |  |
| `EXP()` | X |  |
| `EXPLODE()` | ✓ |  |
| `EXPORT_SET()` | X |  |
| `EXTRACT()` | X |  |
| `ExtractValue()` | X |  |
| `FIELD()` | X |  |
| `FIND_IN_SET()` | X |  |
| `FIRST()` | ✓ |  |
| `FIRST_VALUE()` | X |  |
| `FLOOR()` | ✓ |  |
| `FORMAT()` | X |  |
| `FORMAT_BYTES()` | X |  |
| `FORMAT_PICO_TIME()` | X |  |
| `FOUND_ROWS()` | X |  |
| `FROM_BASE64()` | ✓ |  |
| `FROM_DAYS()` | X |  |
| `FROM_UNIXTIME()` | X |  |
| `GET_DD_COLUMN_PRIVILEGES()` | X |  |
| `GET_DD_CREATE_OPTIONS()` | X |  |
| `GET_DD_INDEX_SUB_PART_LENGTH()` | X |  |
| `GET_FORMAT()` | X |  |
| `GET_LOCK()` | ✓ |  |
| `GREATEST()` | ✓ |  |
| `GROUPING()` | X |  |
| `GROUP_CONCAT()` | X |  |
| `GTID_SUBSET()` | X |  |
| `GTID_SUBTRACT()` | X |  |
| `GeomCollection()` | X |  |
| `GeometryCollection()` | X |  |
| `HASHOF()` | ✓ | Returns the hash of a reference, e.g. `HASHOF("master")`. See [concurrency](sql.md#concurrency) |
| `HEX()` | ✓ |  |
| `HOUR()` | ✓ |  |
| `ICU_VERSION()` | X |  |
| `IF()` | ✓ |  |
| `IFNULL()` | ✓ |  |
| `IN()` | ✓ |  |
| `INET6_ATON()` | X |  |
| `INET6_NTOA()` | X |  |
| `INET_ATON()` | X |  |
| `INET_NTOA()` | X |  |
| `INSERT()` | X |  |
| `INSTR()` | ✓ |  |
| `INTERVAL()` | ✓ |  |
| `IS NOT NULL` | ✓ |  |
| `IS NOT` | ✓ |  |
| `IS NULL` | ✓ |  |
| `ISNULL()` | X |  |
| `IS_BINARY()` | ✓ |  |
| `IS_FREE_LOCK()` | ✓ |  |
| `IS_IPV4()` | X |  |
| `IS_IPV4_COMPAT()` | X |  |
| `IS_IPV4_MAPPED()` | X |  |
| `IS_IPV6()` | X |  |
| `IS_USED_LOCK()` | ✓ |  |
| `IS_UUID()` | X |  |
| `IS` | ✓ |  |
| `JSON_ARRAY()` | X |  |
| `JSON_ARRAYAGG()` | X |  |
| `JSON_ARRAY_APPEND()` | X |  |
| `JSON_ARRAY_INSERT()` | X |  |
| `JSON_CONTAINS()` | X |  |
| `JSON_CONTAINS_PATH()` | X |  |
| `JSON_DEPTH()` | X |  |
| `JSON_EXTRACT()` | ✓ |  |
| `JSON_INSERT()` | X |  |
| `JSON_KEYS()` | X |  |
| `JSON_LENGTH()` | X |  |
| `JSON_MERGE()` | X |  |
| `JSON_MERGE_PATCH()` | X |  |
| `JSON_MERGE_PRESERVE()` | X |  |
| `JSON_OBJECT()` | X |  |
| `JSON_OBJECTAGG()` | X |  |
| `JSON_OVERLAPS()` | X |  |
| `JSON_PRETTY()` | X |  |
| `JSON_QUOTE()` | X |  |
| `JSON_REMOVE()` | X |  |
| `JSON_REPLACE()` | X |  |
| `JSON_SCHEMA_VALID()` | X |  |
| `JSON_SCHEMA_VALIDATION_REPORT()` | X |  |
| `JSON_SEARCH()` | X |  |
| `JSON_SET()` | X |  |
| `JSON_STORAGE_FREE()` | X |  |
| `JSON_STORAGE_SIZE()` | X |  |
| `JSON_TABLE()` | X |  |
| `JSON_TYPE()` | X |  |
| `JSON_UNQUOTE()` | ✓ |  |
| `JSON_VALID()` | X |  |
| `JSON_VALUE()` | X |  |
| `LAG()` | X |  |
| `LAST()` | ✓ |  |
| `LAST_DAY` | X |  |
| `LAST_INSERT_ID()` | X |  |
| `LAST_VALUE()` | X |  |
| `LCASE()` | X |  |
| `LEAD()` | X |  |
| `LEAST()` | ✓ |  |
| `LEFT()` | ✓ |  |
| `LENGTH()` | ✓ |  |
| `LIKE` | ✓ |  |
| `LN()` | ✓ |  |
| `LOAD_FILE()` | X |  |
| `LOCALTIME()` | X |  |
| `LOCALTIMESTAMP()` | X |  |
| `LOCATE()` | X |  |
| `LOG()` | ✓ |  |
| `LOG10()` | ✓ |  |
| `LOG2()` | ✓ |  |
| `LOWER()` | ✓ |  |
| `LPAD()` | ✓ |  |
| `LTRIM()` | ✓ |  |
| `LineString()` | X |  |
| `MAKEDATE()` | X |  |
| `MAKETIME()` | X |  |
| `MAKE_SET()` | X |  |
| `MASTER_POS_WAIT()` | X |  |
| `MATCH` | X |  |
| `MAX()` | ✓ |  |
| `MBRContains()` | X |  |
| `MBRCoveredBy()` | X |  |
| `MBRCovers()` | X |  |
| `MBRDisjoint()` | X |  |
| `MBREquals()` | X |  |
| `MBRIntersects()` | X |  |
| `MBROverlaps()` | X |  |
| `MBRTouches()` | X |  |
| `MBRWithin()` | X |  |
| `MD5()` | ✓ |  |
| `MEMBER OF()` | X |  |
| `MICROSECOND()` | ✓ |  |
| `MID()` | ✓ |  |
| `MIN()` | ✓ |  |
| `MINUTE()` | ✓ |  |
| `MOD()` | X | `%` is supported |
| `MONTH()` | ✓ |  |
| `MONTHNAME()` | ✓ |  |
| `MultiLineString()` | X |  |
| `MultiPoint()` | X |  |
| `MultiPolygon()` | X |  |
| `NAME_CONST()` | X |  |
| `NOT`, `!` | ✓ |  |
| `NOT BETWEEN ... AND ...` | ✓ |  |
| `NOT IN()` | ✓ |  |
| `NOT LIKE` | ✓ |  |
| `NOT MATCH` | X |  |
| `NOT REGEXP` | ✓ |  |
| `NOT RLIKE` | X | `NOT REGEXP` is supported |
| `NOT`, `!` | ✓ |  |
| `NOW()` | ✓ |  |
| `NTH_VALUE()` | X |  |
| `NTILE()` | X |  |
| `NULLIF()` | ✓ |  |
| `OCT()` | X |  |
| `OCTET_LENGTH()` | X |  |
| `ORD()` | X |  |
| `OR` | ✓ |  |
| `PERCENT_RANK()` | X |  |
| `PERIOD_ADD()` | X |  |
| `PERIOD_DIFF()` | X |  |
| `PI()` | X |  |
| `POSITION()` | X |  |
| `POW()` | ✓ |  |
| `POWER()` | ✓ |  |
| `PS_CURRENT_THREAD_ID()` | X |  |
| `PS_THREAD_ID()` | X |  |
| `Point()` | X |  |
| `Polygon()` | X |  |
| `QUARTER()` | X |  |
| `QUOTE()` | X |  |
| `RADIANS()` | ✓ |  |
| `RAND()` | ✓ |  |
| `RANDOM_BYTES()` | X |  |
| `RANK()` | X |  |
| `REGEXP_INSTR()` | X |  |
| `REGEXP_LIKE()` | X |  |
| `REGEXP_MATCHES()` | ✓ |  |
| `REGEXP_REPLACE()` | X |  |
| `REGEXP_SUBSTR()` | X |  |
| `REGEXP` | ✓ |  |
| `RELEASE_ALL_LOCKS()` | ✓ |  |
| `RELEASE_LOCK()` | ✓ |  |
| `REPEAT()` | ✓ |  |
| `REPLACE()` | ✓ |  |
| `REVERSE()` | ✓ |  |
| `RIGHT()` | X |  |
| `RLIKE` | X | `REGEXP` is supported |
| `ROLES_GRAPHML()` | X |  |
| `ROUND()` | ✓ |  |
| `ROW_COUNT()` | X |  |
| `ROW_NUMBER()` | X |  |
| `RPAD()` | ✓ |  |
| `RTRIM()` | ✓ |  |
| `SCHEMA()` | ✓ |  |
| `SECOND()` | ✓ |  |
| `SEC_TO_TIME()` | X |  |
| `SESSION_USER()` | X |  |
| `SHA()` | ✓ |  |
| `SHA1()` | ✓ |  |
| `SHA2()` | ✓ |  |
| `SIGN()` | ✓ |  |
| `SIN()` | ✓ |  |
| `SLEEP()` | ✓ |  |
| `SOUNDEX()` | ✓ |  |
| `SPACE()` | X |  |
| `SPLIT()` | ✓ |  |
| `SQRT()` | ✓ |  |
| `STATEMENT_DIGEST()` | X |  |
| `STATEMENT_DIGEST_TEXT()` | X |  |
| `STD()` | X |  |
| `STDDEV()` | X |  |
| `STDDEV_POP()` | X |  |
| `STDDEV_SAMP()` | X |  |
| `STRCMP()` | X |  |
| `STR_TO_DATE()` | X |  |
| `ST_Area()` | X |  |
| `ST_AsBinary()` | X |  |
| `ST_AsGeoJSON()` | X |  |
| `ST_AsText()` | X |  |
| `ST_Buffer()` | X |  |
| `ST_Buffer_Strategy()` | X |  |
| `ST_Centroid()` | X |  |
| `ST_Contains()` | X |  |
| `ST_ConvexHull()` | X |  |
| `ST_Crosses()` | X |  |
| `ST_Difference()` | X |  |
| `ST_Dimension()` | X |  |
| `ST_Disjoint()` | X |  |
| `ST_Distance()` | X |  |
| `ST_Distance_Sphere()` | X |  |
| `ST_EndPoint()` | X |  |
| `ST_Envelope()` | X |  |
| `ST_Equals()` | X |  |
| `ST_ExteriorRing()` | X |  |
| `ST_GeoHash()` | X |  |
| `ST_GeomCollFromText()` | X |  |
| `ST_GeomCollFromWKB()` | X |  |
| `ST_GeomFromGeoJSON()` | X |  |
| `ST_GeomFromText()` | X |  |
| `ST_GeomFromWKB()` | X |  |
| `ST_GeometryN()` | X |  |
| `ST_GeometryType()` | X |  |
| `ST_InteriorRingN()` | X |  |
| `ST_Intersection()` | X |  |
| `ST_Intersects()` | X |  |
| `ST_IsClosed()` | X |  |
| `ST_IsEmpty()` | X |  |
| `ST_IsSimple()` | X |  |
| `ST_IsValid()` | X |  |
| `ST_LatFromGeoHash()` | X |  |
| `ST_Latitude()` | X |  |
| `ST_Length()` | X |  |
| `ST_LineFromText()` | X |  |
| `ST_LineFromWKB()` | X |  |
| `ST_LongFromGeoHash()` | X |  |
| `ST_Longitude()` | X |  |
| `ST_MLineFromText()` | X |  |
| `ST_MLineFromWKB()` | X |  |
| `ST_MPointFromText()` | X |  |
| `ST_MPointFromWKB()` | X |  |
| `ST_MPolyFromText()` | X |  |
| `ST_MPolyFromWKB()` | X |  |
| `ST_MakeEnvelope()` | X |  |
| `ST_NumGeometries()` | X |  |
| `ST_NumInteriorRing()` | X |  |
| `ST_NumPoints()` | X |  |
| `ST_Overlaps()` | X |  |
| `ST_PointFromGeoHash()` | X |  |
| `ST_PointFromText()` | X |  |
| `ST_PointFromWKB()` | X |  |
| `ST_PointN()` | X |  |
| `ST_PolyFromText()` | X |  |
| `ST_PolyFromWKB()` | X |  |
| `ST_SRID()` | X |  |
| `ST_Simplify()` | X |  |
| `ST_StartPoint()` | X |  |
| `ST_SwapXY()` | X |  |
| `ST_SymDifference()` | X |  |
| `ST_Touches()` | X |  |
| `ST_Transform()` | X |  |
| `ST_Union()` | X |  |
| `ST_Validate()` | X |  |
| `ST_Within()` | X |  |
| `ST_X()` | X |  |
| `ST_Y()` | X |  |
| `SUBDATE()` | X |  |
| `SUBSTR()` | ✓ |  |
| `SUBSTRING()` | ✓ |  |
| `SUBSTRING_INDEX()` | ✓ |  |
| `SUBTIME()` | X |  |
| `SUM()` | ✓ |  |
| `SYSDATE()` | X |  |
| `SYSTEM_USER()` | X |  |
| `TAN()` | ✓ |  |
| `TIME()` | X |  |
| `TIMEDIFF()` | ✓ |  |
| `TIMESTAMP()` | ✓ |  |
| `TIMESTAMPADD()` | X |  |
| `TIMESTAMPDIFF()` | X |  |
| `TIME_FORMAT()` | X |  |
| `TIME_TO_SEC()` | ✓ |  |
| `TO_BASE64()` | ✓ |  |
| `TO_DAYS()` | X |  |
| `TO_SECONDS()` | X |  |
| `TRIM()` | ✓ |  |
| `TRUNCATE()` | X |  |
| `UCASE()` | X |  |
| `UNCOMPRESS()` | X |  |
| `UNCOMPRESSED_LENGTH()` | X |  |
| `UNHEX()` | ✓ |  |
| `UNIX_TIMESTAMP()` | ✓ |  |
| `UPPER()` | ✓ |  |
| `USER()` | ✓ |  |
| `UTC_DATE()` | X |  |
| `UTC_TIME()` | X |  |
| `UTC_TIMESTAMP()` | ✓ |  |
| `UUID()` | X |  |
| `UUID_SHORT()` | X |  |
| `UUID_TO_BIN()` | X |  |
| `UpdateXML()` | X |  |
| `VALIDATE_PASSWORD_STRENGTH()` | X |  |
| `VALUES()` | ✓ |  |
| `VARIANCE()` | X |  |
| `VAR_POP()` | X |  |
| `VAR_SAMP()` | X |  |
| `VERSION()` | ✓ |  |
| `WAIT_FOR_EXECUTED_GTID_SET()` | X |  |
| `WEEK()` | ✓ |  |
| `WEEKDAY()` | ✓ |  |
| `WEEKOFYEAR()` | ✓ |  |
| `WEIGHT_STRING()` | X |  |
| `YEAR()` | ✓ |  |
| `YEARWEEK()` | ✓ |  |

## Permissions

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Users | O | Only one user is configurable, and must be specified in the config file at startup. |
| Privileges | X | Only one user is configurable, and they have all privileges. |

### Misc features

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Information schema | ✓ |  |
| Views | ✓ |  |
| Window functions | X |  |
| Common table expressions \(CTEs\) | X |  |
| Stored procedures | X |  |
| Cursors | X |  |
| Triggers | ✓ |  |

### Collations and character sets

Dolt currently only supports a single collation and character set, the same one that Go uses: `utf8_bin` and `utf8mb4`. We will add support for more character sets and collations as required by customers. Please [file an issue](https://github.com/dolthub/dolt/issues) explaining your use case if current character set and collation support isn't sufficient.

## Supported Statements

Dolt's goal is to be a drop-in replacement for MySQL, with every query and statement that works in MySQL behaving identically in Dolt. For most syntax and technical questions, you should feel free to refer to the [MySQL user manual](https://dev.mysql.com/doc/refman/8.0/en/select.html). Any deviation from the MySQL manual should be documented on this page, or else indicates a bug. Please [file issues](https://github.com/dolthub/dolt/issues) with any incompatibilities you discover.

### Data manipulation statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `CALL` | X | Stored procedures are not yet implemented. |
| `CREATE TABLE AS` | X | `INSERT INTO SELECT *` is supported. |
| `CREATE TABLE LIKE` | ✓ |  |
| `DO` | X |  |
| `DELETE` | ✓ | No support for referring to more than one table in a single `DELETE` statement. |
| `HANDLER` | X |  |
| `IMPORT TABLE` | X | Use `dolt table import` |
| `INSERT` | ✓ | Including support for `ON DUPLICATE KEY` clauses. |
| `LOAD DATA` | X | Use `dolt table import` |
| `LOAD XML` | X | Use `dolt table import` |
| `REPLACE` | ✓ |  |
| `SELECT` | ✓ | Most select statements, including `UNION` and `JOIN`, are supported. |
| `SELECT FROM AS OF` | ✓ | Selecting from a table as of any known revision or commit timestamp is supported. See [AS OF queries](sql.md#querying-non-head-revisions-of-a-database). |
| `SELECT FOR UPDATE` | X | Locking and concurrency are currently very limited. |
| `SUBQUERIES` | ✓ | Subqueries work, but must be given aliases. Some limitations apply. |
| `TABLE` | X | Equivalent to `SELECT * FROM TABLE` without a `WHERE` clause. |
| `TRUNCATE` | ✓ |  |
| `UPDATE` | ✓ | No support for referring to more than one table in a single `UPDATE` statement. |
| `VALUES` | X |  |
| `WITH` | X | Common table expressions \(CTEs\) are not yet supported |

### Data definition statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `ADD COLUMN` | ✓ |  |
| `ADD CHECK` | X | `NOT NULL` is the only check currently possible. |
| `ADD CONSTRAINT` | X | `NOT NULL` is the only constraint currently possible. |
| `ADD FOREIGN KEY` | ✓ |  |
| `ADD PARTITION` | X |  |
| `ALTER COLUMN` | ✓ | Name and order changes are supported, but not type or primary key changes. |
| `ALTER DATABASE` | X |  |
| `ALTER INDEX` | X | Indexes can be created and dropped, but not altered. |
| `ALTER PRIMARY KEY` | X | Primary keys of tables cannot be changed. |
| `ALTER TABLE` | ✓ | Not all `ALTER TABLE` statements are supported. See the rest of this table for details. |
| `ALTER TYPE` | X | Column type changes are not supported. |
| `ALTER VIEW` | X | Views can be created and dropped, but not altered. |
| `CHANGE COLUMN` | O | Columns can be renamed and reordered, but type changes are not implemented. |
| `CREATE DATABASE` | X | Create new repositories with `dolt clone` or `dolt init` |
| `CREATE EVENT` | X |  |
| `CREATE FUNCTION` | X |  |
| `CREATE INDEX` | O | Unique indexes are not yet supported. Fulltext and spatial indexes are not supported. |
| `CREATE TABLE` | ✓ | Tables must have primary keys. |
| `CREATE TABLE AS` | X |  |
| `CREATE TRIGGER` | ✓ |  |
| `CREATE VIEW` | ✓ |  |
| `DESCRIBE TABLE` | ✓ |  |
| `DROP COLUMN` | ✓ |  |
| `DROP CONSTRAINT` | ✓ |  |
| `DROP DATABASE` | X | Delete a repository by deleting its directory on disk. |
| `DROP EVENT` | X |  |
| `DROP FUNCTION` | X |  |
| `DROP INDEX` | ✓ |  |
| `DROP TABLE` | ✓ |  |
| `DROP PARTITION` | X |  |
| `DROP TRIGGER` | ✓ |  |
| `DROP VIEW` | ✓ |  |
| `MODIFY COLUMN` | O | Columns can be renamed and reordered, but type changes are not implemented. |
| `RENAME COLUMN` | ✓ |  |
| `RENAME CONSTRAINT` | X |  |
| `RENAME DATABASE` | X | Database names are read-only, but can be configured in the server config. |
| `RENAME INDEX` | X |  |
| `RENAME TABLE` | ✓ |  |
| `SHOW COLUMNS` | ✓ |  |
| `SHOW CONSTRAINTS` | X |  |
| `SHOW CREATE TABLE` | ✓ |  |
| `SHOW CREATE VIEW` | ✓ |  |
| `SHOW DATABASES` | ✓ |  |
| `SHOW INDEX` | X |  |
| `SHOW SCHEMAS` | ✓ |  |
| `SHOW TABLES` | ✓ | `SHOW FULL TABLES` reveals whether a table is a base table or a view. |
| `TRUNCATE TABLE` | ✓ |  |

### Transactional statements

Transactional semantics are a work in progress. Dolt isn't like other databases: a "commit" in dolt creates a new entry in the repository revision graph, as opposed to updating one or more rows atomically as in other databases. By default, updating data through SQL statements modifies the working set of the repository. Committing changes to the repository requires the use of `dolt add` and `dolt commmit` from the command line. But it's also possible for advanced users to create commits and branches directly through SQL statements.

Not much work has been put into supporting the true transaction and concurrency primitives necessary to be an application server, but limited support for transactions does exist. Specifically, when running the SQL server with `@@autocommit = false`, the working set will not be updated with changes until a `COMMIT` statement is executed.

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `BEGIN` | O | `BEGIN` parses correctly, but is a no-op: it doesn't create a checkpoint that can be returned to with `ROLLBACK`. |
| `COMMIT` | ✓ | `COMMIT` will write any pending changes to the working set when `@@autocommit = false` |
| `COMMIT(MESSAGE)` | ✓ | The `COMMIT()` function creates a commit of the current database state and returns the hash of this new commit. See [concurrency](sql.md#concurrency) for details. |
| `LOCK TABLES` | X | `LOCK TABLES` parses correctly but does not prevent access to those tables from other sessions. |
| `ROLLBACK` | X | `ROLLBACK` parses correctly but is a no-op. |
| `SAVEPOINT` | X |  |
| `RELEASE SAVEPOINT` | X |  |
| `ROLLBACK TO SAVEPOINT` | X |  |
| `SET @@autocommit = 1` | ✓ | When `@@autocommit = true`, changes to data will update the working set after every statement. When `@@autocommit = false`, the working set will only be updated after `COMMIT` statements. |
| `SET TRANSACTION` | X | Different isolation levels are not yet supported. |
| `START TRANSACTION` | O | `START TRANSACTION` parses correctly, but is a no-op: it doesn't create a checkpoint that can be returned to with `ROLLBACK`. |
| `UNLOCK TABLES` | ✓ | `UNLOCK TABLES` parses correctly, but since `LOCK TABLES` doesn't prevent concurrent access it's essentially a no-op. |

### Prepared statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `PREPARE` | ✓ |  |
| `EXECUTE` | ✓ |  |

### Access management statements

Access management via SQL statements is not yet supported. This table will be updated as access management features are implemented. Please [file an issue](https://github.com/dolthub/dolt/issues) if lack of SQL access management is blocking your use of Dolt, and we will prioritize accordingly.

A root user name and password can be specified in the config for [`sql-server`](https://github.com/dolthub/docs/tree/bfdf7d8c4c511940b3281abe0290c8eb4097e6c0/cli/dolt-sql-server/README.md). This user has full privileges on the running database.

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `ALTER USER` | X |  |
| `CREATE ROLE` | X |  |
| `CREATE USER` | X |  |
| `DROP ROLE` | X |  |
| `DROP USER` | X |  |
| `GRANT` | X |  |
| `RENAME USER` | X |  |
| `REVOKE` | X |  |
| `SET DEFAULT ROLE` | X |  |
| `SET PASSWORD` | X |  |
| `SET ROLE` | X |  |

### Session management statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `SET` | ✓ |  |
| `SET CHARACTER SET` | O | \`SET CHARACTER SET\` parses correctly, but Dolt supports only the \`utf8mb4\` collation |
| `SET NAMES` | O | \`SET NAMES\` parses correctly, but Dolt supports only the \`utf8mb4\` collation for identifiers |
| `KILL QUERY` | ✓ |  |

### Utility statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `EXPLAIN` | ✓ |  |
| `USE` | ✓ |  |

## Concurrency

Currently, the only way the Dolt SQL server interface can handle modifications from multiple clients is by pushing some of the complexity onto the users. By default this mode is disabled, and autocommit mode is enabled, but concurrent connections can be enabled using either the `dolt sql-server` command line arguments, or the supported YAML configuration file. Read the [dolt sql-server documentation](https://github.com/dolthub/docs/tree/bfdf7d8c4c511940b3281abe0290c8eb4097e6c0/content/cli/README.md#sql-server) for details.

#### @@dbname\_head

The session variable `dbname_head` \(Where dbname is the name of the database\) provides an interface for reading and writing the HEAD commit for a session.

```sql
# Set the head commit to a specific hash.
SET @@mydb_head = 'fe31vq5c0qj1afnghl0d9448652smlo0';

# Get the head commit
SELECT @@mydb_head;
```

#### HASHOF\(\)

The HASHOF function returns the hash of a branch such as `HASHOF("master")`.

#### COMMIT\(\)

The COMMIT function writes a new commit to the database and returns the hash of that commit. The argument passed to the function is the commit message. The author's name and email for this commit will be determined by the server or can be provided by the user. on the repo.

Dolt provides a manual commit mode where a user works with a detached HEAD whose value is accessible and modifiable through the session variable @@dbname\_head \(where dbname is the name of the database whose pointer you wish to read or write\). You can write new commits to the database by inserting and updating rows in the dolt\_branches table. See below for details on how this works.

See the below examples as well as the section on [concurrency](https://www.dolthub.com/docs/reference/sql/#concurrency) for details.

Example:

```sql
SET @@mydb_head = COMMIT('-m', 'my commit message');
```

### Options

-m, --message: Use the given `<msg>` as the commit message. Required

-a: Stages all tables with changes before committing

--allow-empty: Allow recording a commit that has the exact same data as its sole parent. This is usually a mistake, so it is disabled by default. This option bypasses that safety.

--date: Specify the date used in the commit. If not specified the current system time is used.

--author: Specify an explicit author using the standard "A U Thor author@example.com" format.

#### MERGE\(\)

The MERGE function merges a branch reference into HEAD. The argument passed to the function is a reference to a branch \(its name\). The author's name and email for this commit will be determined by the server or can be provided by the user.

Example:

```sql
SET @@mydb_head = MERGE('feature-branch');
```

### Options

--author: Specify an explicit author using the standard "A U Thor author@example.com" format.

#### dolt\_branches

dolt\_branches is a system table that can be used to create, modify and delete branches in a dolt data repository via SQL.

#### Putting it all together

An example showing how to make modifications and create a new feature branch from those modifications.

```sql
-- Set the current database
USE mydb;

-- Set the HEAD commit to the latest commit of the branch "master"
SET @@mydb_head = HASHOF("master");

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Create a new commit containing these modifications and set the HEAD commit for this session to that commit
SET @@mydb_head = COMMIT("modified something")

-- Create a new branch with these changes
INSERT INTO dolt_branches (name,hash)
VALUES ("new_branch", @@mydb_head);
```

An example attempting to change the value of master, but only if nobody else has modified it since we read it.

```sql
-- Set the current database for the session
USE mydb;

-- Set the HEAD commit to the latest commit to the branch "master"
SET @@mydb_head = HASHOF("master");

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Modify master if nobody else has changed it
UPDATE dolt_branches
SET hash = COMMIT("modified something")
WHERE name == "master" and hash == @@mydb_head;

-- Set the HEAD commit to the latest commit to the branch "master" which we just wrote
SET @@mydb_head = HASHOF("master");
```

An example of merging in a feature branch.

```sql
-- Set the current database for the session
USE mydb;

-- Set the HEAD commit to the latest commit to the branch "feature-branch"
SET @@mydb_head = HASHOF("feature-branch");

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- MERGE the feature-branch into master and get a commit
SET @@mydb_head = MERGE('feature-branch');

-- Set the HEAD commit to the latest commit to the branch "master" which we just wrote
INSERT INTO dolt_branches (name, hash)
VALUES("master", @@bug_head);
```

## Benchmarks

This section provides benchmarks for Dolt. The current version of Dolt is 0.22.14, and we benchmark against MySQL 8.0.22.

### Data

Here we present the result of running `sysbench` MySQL tests against Dolt SQL for the most recent release of Dolt. We will update this with every release. The tests attempt to run as many queries as possible in a fixed 2 minute time window. The `Dolt` and `MySQL` columns show the median latency of each test during that 2 minute time window.

Dolt is slower than MySQL. The goal is to get Dolt to within 2-4 times the speed of MySQL common operations. If a query takes MySQL 1 second, we expect it to take Dolt 2-4 seconds. Or, if MySQL can run 8 queries in 10 seconds, then we want Dolt to run 2-4 queries in 10 seconds. The `multiple` column represents this relationship. Our custom lua tests can be found [here](https://github.com/dolthub/dolt/tree/master/benchmark/perf_tools/sysbench_scripts/lua).

| Test | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 11.65 | 1.39 | 8.0 |
| index\_scan | 121.08 | 34.33 | 4.0 |
| oltp\_delete | 11.87 | 0.11 | 108.0 |
| oltp\_point\_select | 1.55 | 0.11 | 14.0 |
| oltp\_read\_only | 	31.94 | 2.26 | 14.0 |
| oltp\_read\_write | 84.47 | 5.67 | 15.0 |
| oltp\_update\_index | 15.0 | 2.43 | 6.0 |
| oltp\_update\_non\_index | 8.9 | 2.48 | 4.0 |
| oltp\_write\_only | 54.83 | 3.43 | 16.0 |
| select\_random\_points | 2.76 | 0.26 | 11.0 |
| select\_random\_ranges | 3.07 | 0.28 | 11.0 |
| table\_scan | 147.61 | 34.95 | 4.0 |
| _mean_ |  |  | _17.92_ |

In the spirit of ["dog fooding"](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) we created a Dolt database on [DoltHub](https://www.dolthub.com/repositories/dolthub/dolt-benchmarks) with our performance metrics. You can find the full set of metrics produced by `sysbench` there, and explore them via our SQL console.

### Approach

We adopted an industry standard benchmarking tool, [`sysbench`](https://github.com/akopytov/sysbench). `sysbench` provides a series of benchmarks for examining various aspects of database performance, and was authored by developers who worked on MySQL.

You can read more about our benchmarking approach [here](https://github.com/dolthub/dolt/tree/master/benchmark/perf_tools). The basic idea is to provide our developers and contributors with simple tools for producing robust comparisons of Dolt SQL against MySQL. We do this by building and running on all benchmarks on the same hardware and associating the run with a unique identifier with each invocation of `run_benchmarks.sh`, our wrapper.

For example, suppose that a developer made a bunch of changes that are supposed to speed up bulk inserts:

```text
$ cd $DOLT_CHECKOUT/benchmark/perf_tools
$ ./run_benchmarks.sh \
  bulk_insert \
  10000 \
  <username> \
  current
```

This will do the following:

* build a copy of Dolt using the locally checked out Git repository located at `$DOLT_CHECKOUT` inside a Docker container
* build and launch a Docker container running Dolt SQL
* build and launch a Docker container running `sysbench` that executes `bulk_insert` using a table with 10000 records for the test
* repeat the process using MySQL for comparison

All of the data produced will be associated with a unique run ID.

### Code

The benchmarking tools are part of Dolt, which is free and open source. You can find a more detailed description of the tools on [GitHub](https://github.com/dolthub/dolt/tree/master/benchmark/perf_tools).

