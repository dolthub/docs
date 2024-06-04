---
title: Dolt System Variables
---

# Table of contents

- [General system setting variables](#general-system-setting-variables)

  - [dbname_default_branch](#dbname_default_branch)
  - [dolt_allow_commit_conflicts](#dolt_allow_commit_conflicts)
  - [dolt_force_transaction_commit](#dolt_force_transaction_commit)
  - [dolt_log_level](#dolt_log_level)
  - [dolt_override_schema](#dolt_override_schema)
  - [dolt_show_branch_databases](#dolt_show_branch_databases)
  - [dolt_show_system_tables](#dolt_show_system_tables)
  - [dolt_transaction_commit](#dolt_transaction_commit)
  - [dolt_transaction_commit_message](#dolt_transaction_commit_message)

- [Replication variables](#replication-variables)

  - [dolt_replicate_to_remote](#dolt_replicate_to_remote)
  - [dolt_async_replication](#dolt_async_replication)
  - [dolt_read_replica_remote](#dolt_read_replica_remote)
  - [dolt_replicate_heads](#dolt_replicate_heads)
  - [dolt_replicate_all_heads](#dolt_replicate_all_heads)
  - [dolt_replication_remote_url_template](#dolt_replication_remote_url_template)
  - [dolt_read_replica_force_pull](#dolt_read_replica_force_pull)
  - [dolt_skip_replication_errors](#dolt_skip_replication_errors)

- [Session metadata variables](#session-metadata-variables)

  - [dbname_head_ref](#dbname_head_ref)
  - [dbname_head](#dbname_head)
  - [dbname_working](#dbname_working)
  - [dbname_staged](#dbname_staged)

- [Persisting System Variables](#persisting-system-variables)

# General system setting variables

## `dbname_default_branch`

This system variable controls a database's default branch, defaulting to the checked out branch when
the server started. For a database named `mydb`, this variable will be named
`mydb_default_branch`. New sessions will connect to this branch by default.

## `dolt_log_level`

This system variable controls logging levels in the server. Valid values are `error`, `warn`,
`info`, `debug`, or `trace`. This value overrides whatever was specified on the command line for
`dolt sql-server` or in the `config.yaml` file.

## `dolt_show_branch_databases`

When set to `1`, this system variable causes all branches to be
represented as separate databases in `show databases`, the
`information_schema` tables, and other places where databases are
enumerated. Defaults to `0`, which means that by default
branch-derived databases are not displayed (although they can still be
used).

```sql
fresh=# show databases;
+--------------------+
| Database           |
+--------------------+
| fresh              |
| information_schema |
| postgres           |
+--------------------+
3 rows in set (0.00 sec)

fresh=# set @@dolt_show_branch_databases = 1;
fresh=# show databases;
+--------------------+
| Database           |
+--------------------+
| fresh              |
| fresh/b1           |
| fresh/main         |
| information_schema |
| postgres           |
+--------------------+
5 rows in set (0.00 sec)
```

## `dolt_show_system_tables`

When set to `1`, this system variable causes all system tables to be show in `show tables` and in `information_schema.tables`.
Defaults to `0`.

## `dolt_override_schema`

When set to a commit hash, branch name, or tag name, Dolt will map all table data to the schema at the specified commit,
branch, or tag. This is useful when you have a query that runs with a specific schema, and you want to run it with
data that has a different schema. For example, if you add a `Birthdate` column to the `People` table in the most recent commits
in your database, you cannot reference that column in queries run against older commits. If you enable schema overriding, and
set `@@dolt_override_schema` to a commit that contains the `Birthdate` column, you can run the same query with recent
commits and with older commits, without having to modify the query for the schema changes in the older commits. Dolt will
map the table data to the schema at the specified commit, branch, or tag, and fill in the missing columns with `NULL` values.

```sql
-- check out an older branch that has a different schema
CALL dolt_checkout('olderBranch');

-- running a query that references the Birthdate column will fail
SELECT Name, Birthdate FROM People;
column "Birthdate" could not be found in any table in scope

-- turning on schema overriding allows us to automatically map our data to the schema at the specified commit
SET @@dolt_override_schema = 'main';
SELECT Name, Birthdate FROM People;
+-----------+-----------+
| Name      | Birthdate |
+-----------+-----------+
| Billy     | NULL      |
| Jimbo     | NULL      |
+-----------+-----------+
```

Note that when this session variable is set, the active Dolt session becomes read-only. To disable schema overriding,
simply set this variable to `NULL`.

## `dolt_transaction_commit`

When set to `1`, this system variable creates a Dolt commit for every
SQL transaction commit. Defaults to `0`. Commits have a standard commit
message ("Transaction commit"), unless `@@dolt_transaction_commit_message` has been set.

## `dolt_transaction_commit_message`

When `@@dolt_transaction_commit` is enabled, if this system variable is set to a
string, it will be used as the message for the automatic Dolt commit. Defaults to `NULL`,
which means automatic Dolt commits will use their standard commit message ("Transaction commit").

## `dolt_allow_commit_conflicts`

When set to `1`, this system variable allows transactions with merge
conflicts to be committed. When set to `0`, merge conflicts must be
resolved before committing a transaction, and attempting to commit a
transaction with conflicts fails and rolls back the
transaction. Defaults to `0`.

## `dolt_force_transaction_commit`

When set to `1`, this system variable ignores all merge conflicts,
constraint violations, and other correctness issues resulting from a
merge and allows them to be committed. Defaults to `0`.

# Replication variables

## `dolt_replicate_to_remote`

This system variable should be set on replication primaries to name a remote to replicate to. See
[Replication](../server/replication.md).

```sql
select name from dolt_remotes;
+---------+
| name    |
+---------+
| remote1 |
| origin  |
+---------+
SET @@GLOBAL.dolt_replicate_to_remote = remote1;
CALL dolt_commit('-am', 'push on write');
```

## `dolt_async_replication`

This system variable can be set to `1` on replication primaries to make remote pushes
asynchronous. This setting can cause commits to complete faster since the push to remote is not
synchronous, but it may also increase the remote replication delay. See
[Replication](../server/replication.md).

```sql
SET @@GLOBAL.dolt_replicate_to_remote = remote1;
SET @@GLOBAL.dolt_async_replication = 1;
```

## `dolt_read_replica_remote`

This system variable is set on read replicas to name a remote to pull from. New data is pulled every
time a transaction begins.

Setting either `dolt_replicate_heads` or `dolt_replicate_all_heads` is
also required for read replicas. See [Replication](../server/replication.md).

```sql
SET @@GLOBAL.dolt_read_replica_remote = origin;
SET @@GLOBAL.dolt_replicate_heads = main;
START TRANSACTION;
```

## `dolt_replicate_all_heads`

This system variable indicates to pull all branches on a read replica at transaction start. Pair
with `dolt_read_replica_remote`. Use is mutually exclusive with `dolt_replicate_heads`. See
[Replication](../server/replication.md).

```sql
SET @@GLOBAL.dolt_replicate_all_heads = 1;
```

## `dolt_replicate_heads`

This system variable specifies which branch heads a read replica will fetch.
The wildcard `*` may be used to match zero or more characters in a branch name
and is useful for selecting multiple branch names.
Pair with `dolt_read_replica_remote`. Use is mutually exclusive with
`dolt_replicate_all_heads`. See [Replication](../server/replication.md).

```sql
SET @@GLOBAL.dolt_replicate_heads = main;
SET @@GLOBAL.dolt_replicate_heads = "main,feature1,feature2";
SET @@GLOBAL.dolt_replicate_heads = "main,release*";
```

## `dolt_replication_remote_url_template`

This system variable indicates that newly created databases should have a remote created according
to the URL template supplied. This URL template must include the `{database}` placeholder. Some
examples:

```sql
set @@persist.dolt_replication_remote_url_template = 'file:///share/doltRemotes/{database}'; -- file based remote
set @@persist.dolt_replication_remote_url_template = 'aws://dynamo-table:s3-bucket/{database}'; -- AWS remote
set @@persist.dolt_replication_remote_url_template = 'gs://mybucket/remotes/{database}'; -- GCP remote
```

On a read replica, setting this variable will cause the server to attempt to clone any unknown
database used in a query or connection string by constructing a remote URL and cloning from that
remote. See [Replication](../server/replication.md).

## `dolt_read_replica_force_pull`

Set this variable to `1` to cause read replicas to always pull their local copies of remote heads even
when they have diverged from the local copy, which can occur in the case of a `dolt push -f`. A
setting of `0` causes read replicas to reject remote head updates that cannot be fast-forward merged
into the local copy. Defaults to `1`.

## `dolt_skip_replication_errors`

Set this variable to `1` to ignore replication errors on a read replica. Replication errors will log
a warning rather than causing queries to fail. Defaults to `0`.

```sql
SET @@GLOBAL.dolt_skip_replication_errors = 1;
```

# Session metadata variables

## `dbname_head_ref`

Each session defines a system variable that controls the current
session head. For a database called `mydb`, this variable
will be called `@@mydb_head_ref` and be set to the current head.

```sql
mydb> select @@mydb_head_ref;
+-------------------------+
| @@SESSION.mydb_head_ref |
+-------------------------+
| refs/heads/master       |
+-------------------------+
```

You can set this session variable to switch your current head. Use either `refs/heads/branchName` or
just `branchName`:

```sql
SET @@mydb_head_ref = 'feature-branch'
```

This is equivalent to:

```sql
call dolt_checkout('feature-branch')
```

## `dbname_head`

This system variable reflects the current HEAD commit's hash. For a database called `mydb`, this
variable will be called `@@mydb_head`. It is read-only.

## `dbname_working`

This system variable reflects the current working root value's hash. For a database called `mydb`,
this variable will be called `@@mydb_working`. Its value corresponds to the current working
hash. Selecting it is useful for diagnostics. It is read-only.

## `dbname_staged`

This system variable reflects the current staged root value's hash. For a database called `mydb`,
this variable will be called `@@mydb_staged` Selecting it is useful for diagnostics. It is
read-only.

# Persisting System Variables

Dolt supports a limited form of system variable persistence. The same way session variables can be
changed with `SET`, global variables can be persisted to disk with `SET PERSIST`. Persisted system
variables survive restarts, loading back into the global variables namespace on startup.

Dolt supports `SET PERSIST` and `SET PERSIST_ONLY` by writing system
variables to the local `.dolt/config.json`. The same result can be
achieved with the CLI by appending `sqlserver.global.` prefix to
keys with the `dolt config add --local` command. System
variables are used as session variables, and the SQL interface is
the encouraged access point. Variables that affect server startup, like
replication, must be set before instantiation.

## Examples

### `SET PERSIST`

```sql
SET PERSIST max_connections = 1000;
SET @@PERSIST.max_connections = 1000;
```

### `SET PERSIST_ONLY`

```sql
SET PERSIST_ONLY back_log = 1000;
SET @@PERSIST_ONLY.back_log = 1000;
```

### CLI

```bash
$ dolt sql -q "set @@persist.max_connections = 1000"
```

### Limitations

Deleting variables with `RESET PERSIST` is not supported.
