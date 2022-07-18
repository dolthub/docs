---
title: Using branches
---

# Using branches

Unlike other relational databases, Dolt has multiple heads, one for
each branch in the database. A head can be a branch, a tag, or a
working set. Multiple clients can connect to each branch, and will see
other writes to the same branch following the normal SQL transactional
isolation semantics (REPEATABLE_READ). In effect, each branch
functions as its own isolated database instance, with changes only
visible to other clients connected to the same branch.

![A Dolt database server with multiple heads](../../../.gitbook/assets/dolt-server-branches.png)

A database server has a default branch, which is the checked-out
branch at the time the server was started. Each client can choose a
specific branch to connect to with their connection string, or change it
for their session with various statements.

## Specify a branch in the connection string

The exact connection string you need to use will vary depending on
your client.

To connect to the default branch, use a connection string with the name
of the database only.

`mysql://127.0.0.1:3306/mydb`

To connect to a different branch, specify that branch name with a
slash after the database name:

`mysql://127.0.0.1:3306/mydb/feature-branch`

To connect to a specific revision of the database, use a commit hash
instead of a branch name. The database will be read-only in this case.

`mysql://127.0.0.1:3306/mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`

The above options also work with the standard MySQL command line
client:

```sh
mysql --host 127.0.0.1 --port 3306 -u root mydb/feature-branch
```

## Switch heads with the `USE` statement

Following the above connection string examples, you can issue `USE`
statements to switch your current branch.

`USE mydb` switches to the default branch.

To switch to a named branch:

```sql
USE `mydb/feature-branch`
```

Note that the string must be back-tick quoted, since it contains a `/`
character.

To switch to a read-only database at a commit hash:

```sql
USE `mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`
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

## Switch branches with a session variable

Each session defines a system variable that controls the current
session head. For a database called `mydb` as above, this variable
will be called `@@mydb_head_ref` and be set to the current head.

```sql
mydb> select @@mydb_head_ref;
+-------------------------+
| @@SESSION.mydb_head_ref |
+-------------------------+
| refs/heads/main       |
+-------------------------+
```

To switch branches, set this session variable. Use either
`refs/heads/branchName` or just `branchName`:

```sql
SET @@mydb_head_ref = 'feature-branch'
```

## Notes on switching branches

If you have outstanding changes in your session (because you have
issued DML or DDL statements to change the data or schema), you must
`COMMIT` them or `ROLLBACK` the transaction before switching branches.
