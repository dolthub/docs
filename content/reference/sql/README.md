
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
