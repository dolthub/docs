# Working with multiple heads

Unlike other relational databases, Dolt has multiple heads, one for
each branch in the database. Multiple clients can connect to each
head, and will see other writes to the same head following the normal
SQL transactional isolation semantics (REPEATABLE_READ). In effect,
each head functions as is its own isolated database instance, with
changes only visible to other clients connected to the same head.

![A Dolt database server with multiple heads](../../.gitbook/assets/dolt-server-branches.png)

A database server has a default head, which is the checked-out branch
at the time the server was started. Each client can choose a specific
head to connect to with their connection string, or change it for
their session with various statements.

## Specify a head in the connection string

The exact connection string you need to use will vary depending on
your client.

To connect to the default head, use a connection string with the name
of the database only.

`mysql://127.0.0.1:3306/myDb`

To connect to a different branch, specify that branch name with a
slash after the database name:

`mysql://127.0.0.1:3306/myDb/feature-branch`

To connect to a specific revision of the database, use a commit hash
instead of a branch name. The database will be read-only in this case.

`mysql://127.0.0.1:3306/myDb/ia1ibijq8hq1llr7u85uivsi5lh3310p`

## Switch heads with the `USE` statement

Following the above connection string examples, you can issue `USE`
statements to switch your current head.

`USE myDb` switches to the default branch

`USE \`mydb/feature-branch\`` switches to the feature branch
given. Note that the string must be back-tick quoted, since it
contains a `/` character.

`USE \`myDb/ia1ibijq8hq1llr7u85uivsi5lh3310p\`` switches to a
read-only database at the commit hash given.

## Switch heads with the `DOLT_CHECKOUT` function

The `DOLT_CHECKOUT` SQL function provides identical functionality as
the `dolt checkout` command on the command line, and accepts the same
arguments.

`SELECT DOLT_CHECKOUT('feature-branch');` switches the session to the
`feature-branch` branch. You can also switch to a new branch, like so:

`SELECT DOLT_CHECKOUT('-b', 'new-branch');`

You can switch to a new branch with a starting commit as well:

`SELECT DOLT_CHECKOUT('-b', 'new-branch-at-commit', 'ia1ibijq8hq1llr7u85uivsi5lh3310p')`

## Switch heads with a session variable

Each session defines a system variable that controls the current
session head. For a database called `myDb` as above, this variable
will be called `@@myDb_head_ref` and be set to the current head.

```sql
myDb> select @@myDb_head_ref;
+-------------------------+
| @@SESSION.myDb_head_ref |
+-------------------------+
| refs/heads/master       |
+-------------------------+
```

To switch heads, set this session variable. Use either
`refs/heads/branchName` or just `branchName`:

`SET @@myDb_head_ref = 'feature-branch'`

# Notes on switching heads

If you have outstanding changes in your session (because you have
issued DML or DDL statements to change the data or schema), you must
`COMMIT` them or `ROLLBACK` the transaction before switching heads.
