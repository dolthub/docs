---
title: Using branches and database revisions
---

# Using branches and database revisions 

Branches and database revisions allow you to work with your data at any commit in your database's commit graph. 
This is useful for isolating development on different branches, analyzing historical data, tracking data lineage, 
and much more. 

Unlike other relational databases, Dolt has multiple heads, one for
each branch in the database. A head can be a branch, a tag, or a
working set. Multiple clients can connect to each branch, and will see
other writes to the same branch following the normal SQL transactional
isolation semantics (REPEATABLE_READ). In effect, each branch
functions as its own isolated database instance, with changes only
visible to other clients connected to the same branch.

![A Dolt database server with multiple heads](../../../.gitbook/assets/dolt-server-branches.png)

A database server has a default branch, which is the checked-out
branch at the time the server was started. Using database revision specifiers,
clients can choose a specific branch, tag, or commit to pin their queries to. 


## Specify a database revision in the connection string

The exact connection string you need to use will vary depending on
your client.

To connect to the default branch, use a connection string with the name
of the database only.

`mysql://127.0.0.1:3306/mydb`

To connect to a different branch, specify that branch name with a
slash after the database name:

`mysql://127.0.0.1:3306/mydb/feature-branch`

To connect to a specific revision of the database, use a commit hash or tag
instead of a branch name. The database will be read-only in this case.

`mysql://127.0.0.1:3306/mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`
`mysql://127.0.0.1:3306/mydb/v1.0`

You can also use the same ancestry syntax as Git to reference specific parent commits in a connection
string, or anywhere else you would use a database revision specifier. For example,
`mysql://127.0.0.1:3306/mydb/feature-branch~2` will connect you to a read-only database for the
grandparent commit of the `feature-branch` branch.

This also works with the standard MySQL command line client:

```sh
mysql --host 127.0.0.1 --port 3306 -u root mydb/feature-branch
```

## Switch heads with the `USE` statement

Similar to the examples above, you can issue `USE` statements to select a database revision, too. 

`USE mydb` switches to the default branch.

To switch to a named branch:

```sql
USE `mydb/feature-branch`
```

Note that the string must be back-tick quoted, since it contains a `/`
character.

To switch to a read-only database at a commit hash or tag:

```sql
USE `mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`
USE `mydb/v1.0`
```


## Use fully-qualified references with database revisions

You can also use fully-qualified names with database revisions in your queries. For example,
the following query references a specific branch of a database by using a fully-qualified name that
includes a revision specification:  

```sql
SELECT * from `mydatabase/feature-branch`.accounts;
```

You can use the same syntax for specific commits:

```sql
SELECT * from `mydatabase/ia1ibijq8hq1llr7u85uivsi5lh3310p`.accounts;
```

and for tags:

```sql
SELECT * from `mydatabase/v1.0`.accounts;
```


## Switch branches with the `DOLT_CHECKOUT()` procedure

The `DOLT_CHECKOUT()` SQL procedure provides identical functionality to
the `dolt checkout` command on the command line, and accepts the same
arguments.

`CALL DOLT_CHECKOUT('feature-branch');` switches the session to the
`feature-branch` branch. You can also switch to a new branch, like so:

```sql
CALL DOLT_CHECKOUT('-b', 'new-branch');
```

You can switch to a new branch with a starting commit as well:

```sql
CALL DOLT_CHECKOUT('-b', 'new-branch-at-commit', 'ia1ibijq8hq1llr7u85uivsi5lh3310p')
```

## Notes on switching branches

If you have outstanding changes in your session (because you have
issued DML or DDL statements to change the data or schema), you must
`COMMIT` them or `ROLLBACK` the transaction before switching branches.
