---
title: Using branches and database revisions
---

# Using branches and database revisions 

Branches and database revisions allow you to work with your data at any commit in your database's
commit graph.  This is useful for isolating development on different branches, analyzing historical
data, tracking data lineage, and much more.

Unlike other relational databases, Doltgres has multiple heads, one for each branch in the database. A
head can be a branch, a tag, or a working set. Multiple clients can connect to each branch, and will
see other writes to the same branch following the normal SQL transactional isolation semantics
(`REPEATABLE_READ`). In effect, each branch functions as its own isolated database instance, with
changes only visible to other clients connected to the same branch.

![A Doltgres database server with multiple heads](../../../.gitbook/assets/dolt-server-branches.png)

A database server has a default branch, which is the checked-out branch at the time the server was
started, and can be changed for new connections with a [system
variable](./dolt-sysvars.md#dbname_default_branch). Using database revision specifiers, clients can
choose a specific branch, tag, or commit to pin their queries to.

## Specify a database revision in the connection string

The exact connection string you need to use will vary depending on your client.

To connect to the default branch, use a connection string with the name of the database only.

`postgresql://localhost/mydb`

To connect to a different branch, specify that branch name with a slash after the database name:

`postgresql://localhost/mydb/feature-branch`

To connect to a specific revision of the database, use a commit hash or tag instead of a branch
name. The database will be read-only in this case.

`postgresql://localhost/mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`
`postgresql://localhost/mydb/v1.0`

You can also use the same ancestry syntax as Git to reference specific parent commits in a
connection string, or anywhere else you would use a database revision specifier. For example,
`postgresql://localhost/mydb/feature-branch~2` will connect you to a read-only database for the
grandparent commit of the `feature-branch` branch.

This also works with the standard `psql` command line client:

```sh
PGPASSWORD=password psql -h 127.0.0.1 "dbname=mydb/feature-branch" -U postgres
```

## Switch heads by connecting to a different database

Different clients have different syntax for changing the connected database. In `psql`, use the `\c`
command:

```sql
\c mydb/feature-branch
```

To switch to a read-only database at a commit hash or tag:

```sql
\c `mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`
\c `mydb/v1.0`
```

## Use fully-qualified references with database revisions

<!-- TODO: revisit this when we have better schema support -->

You can also use fully-qualified names with database revisions in your queries. For example, the
following query references a specific branch of a database by using a fully-qualified name that
includes a revision specification:

```sql
insert into `mydatabase/feature-branch`.accounts (id) values (1);
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

## Branches and transactions

The set of branches and their HEAD commits are established at transaction start time. Changes made
to the set of branches or their HEAD commits in other transactions will not be visible to this
session until a new transaction begins.

## Recovering a deleted branch

The data on a branch is versioned, but the metadata of the branch head itself is not, so if you delete a 
branch or reset it to point at an older commit, you can't revert or undo that change the same way you can 
with your data. Instead, you can use 
[the `dolt_reflog()` table function](./dolt-sql-functions.md#dolt_reflog) to see the history of commits
your branch has referenced and either recreate the branch from the last referenced commit with 
[the `dolt_branch()` stored procedure](./dolt-sql-procedures.md#dolt_branch) or reset the branch to a 
previous commit with [the `dolt_reset()` stored procedure](./dolt-sql-procedures.md#dolt_reset). See
[the `dolt_reflog()` table function](./dolt-sql-functions.md#dolt_reflog) for an example of recreating
a deleted branch and more information on how the Doltgres reflog works and what limitations it has.

## Restrictions on committing to multiple branches in a single transaction

The server will permit you to modify more than one branch in a single transaction, but will not
permit such transactions to be committed. For example, the following sequence of statements will be
rejected:

```sql
start transaction;
insert into `mydb/branch1`.t1 values (100);
insert into `mydb/branch2`.t1 values (200);
commit; -- ERROR: can only commit changes to one branch at a time
```

This restriction is true regardless of how you perform the modifications. This
sequence also fails.

```sql
start transaction;
call dolt_checkout('branch1');
insert into t1 values (100);
call dolt_checkout('branch2');
insert into t1 values (200);
commit; -- ERROR: can only commit changes to one branch at a time
```

This restriction will be lifted in a future release of the database. For now you must `ROLLBACK` any
transaction that modifies more than one branch.

## Notes on unqualified database names

If you use a database name that isn't qualified by a branch or other revision specifier, it still
resolves to a particular branch. The rules for this are subtle.

* If `dolt_checkout()` was called to switch the checked-out branch previously in this session, an
  unqualified database name will resolve to that branch. `dolt_checkout()` has the side-effect of
  changing what branch an unqualified database name resolves to for the remainder of a session.
* Otherwise, an unqualified database name resolves to the default branch, typically `main`.

An example:

```sql
\c mydb/branch1;
insert into t1 values (1); -- modifying the `branch1` branch
\c mydb/branch2;
insert into t1 values (2); -- modifying the `branch2` branch
use mydb;
insert into t1 values (3); -- modifying the `main` branch
```

In the last line, `mydb` resolves to `mydb/main` because no branch was checked out with
`dolt_checkout()` in this session.

Using `dolt_checkout()` changes this behavior:

```sql
call dolt_checkout('branch1');
insert into t1 values (1); -- modifying the `branch1` branch
call dolt_checkout('branch2');
insert into t1 values (2); -- modifying the `branch2` branch
use mydb;
insert into t1 values (3); -- modifying the `branch2` branch
```

In the last line of this example, `mydb` resolves to `mydb/branch2`, because that was the branch
last checked out with `dolt_checkout()`.

Note that these name resolution rules apply to all statements that use an unqualified database name,
not just `USE`. For example, `insert into mydb.t1 values (4)` will also modify the last checked-out
branch, or the default branch, depending on session history.
