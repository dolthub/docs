---
title: Dolt System Variables
---

# Dolt System Variables

Dolt exposes various information about the state of the current
session. This information is typically only useful for advanced
users. 

## @@dbname_head_ref

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

To switch heads, set this session variable. Use either
`refs/heads/branchName` or just `branchName`:

`SET @@mydb_head_ref = 'feature-branch'`

## @@dolt_default_branch

This system variable toggles the default database branch on server
(or SQL engine) instantiation. Setting this changes the active branch
and working set new server sessions connect to.

## @@dolt_transaction_commit

When set to `1`, this system variable creates a Dolt commit for every
SQL transaction commit. Commits have an auto-generated commit
message. Defaults to `0`.

## @@dolt_allow_commit_conflicts

When set to `1`, this system variable allows transactions with merge
conflicts to be committed. When set to `0`, merge conflicts must be
resolved before committing a transaction, and attempting to commit a
transaction with conflicts fails and rolls back the
transaction. Defaults to `0`.

## @@dolt_force_transaction_commit

When set to `1`, this system variable ignores all merge conflicts,
constraint violations, and other correctness issues resulting from a
merge and allows them to be committed. Defaults to `0`.

## @@dolt_replicate_to_remote

This system variable is used to push to replication middlemen. Dolt
commit triggers a push and transmits the resulting dataset to the named
remote. SQL commits do not trigger replication.

```sql
mysql> select name from dolt_remotes;
+---------+
| name    |
+---------+
| remote1 |
| origin  |
+---------+
mysql> SET @@GLOBAL.dolt_replicate_to_remote = remote1;
mysql> select dolt_commit('-am', 'push on write');
```

## @@dolt_async_replication
This system variable can be enabled when using push-on-commit replication (i.e. `@@dolt_replicate_to_remote`). 
When enabled, Dolt commits will be pushed asynchronously to the remote specified in the 
`@@dolt_replicate_to_remote` system variable, instead of synchronously completing the push before 
returning from the Dolt commit operation. This setting can cause 
commits to complete faster since the push to remote is not synchronous, but it 
may also increase the remote replication delay. Because of the asynchronous nature, replication errors
may also be less obvious.  

```sql
mysql> SET @@GLOBAL.dolt_replicate_to_remote = remote1;
mysql> SET @@GLOBAL.dolt_async_replication = 1;
```

## @@dolt_read_replica_remote

This system variable is used to pull updates to read replicas.
Pulling is triggered on SQL `START TRANSACTION`. Setting `autocommit = 1`
will wrap every query in a transaction.

Setting `dolt_replicate_heads` or `dolt_replicate_all_heads` is required.

```sql
mysql> SET @@GLOBAL.dolt_read_replica_remote = origin;
mysql> SET @@GLOBAL.dolt_replicate_heads = main;
mysql> START TRANSACTION;
```

## @@dolt_skip_replication_errors

This system variable is used to quiet replication
errors that would otherwise halt query execution. Missing or malformed
configuration is the main target of replication warnings. Faults
unrelated to replication should still error.

```sql
mysql> SET @@GLOBAL.dolt_skip_replication_errors = 1;
```

## @@dolt_replicate_heads

This system variable specifies which heads a read replica should fetch.
Pair with `dolt_read_replica_remote`. Use is mutually exclusive with
`dolt_replicate_all_heads`.

```sql
mysql> SET @@GLOBAL.dolt_replicate_heads = main;
mysql> SET @@GLOBAL.dolt_replicate_heads = "main,feature1,feature2";
```

## @@dolt_replicate_all_heads

This system variable indicates to pull all branches for every read replica
fetch. Pair with `dolt_read_replica_remote`. Use is mutually exclusive
with `dolt_replicate_heads`.

```sql
mysql> SET @@GLOBAL.dolt_replicate_all_heads = 1;
```

## @@dbname_working

This system variable controls the current working root value. Setting
it is an expert use case that can have very many unexpected
consequences. Selecting it is useful for diagnostics.

## @@dbname_staged

This system variable controls the current staged root value. Setting
it is an expert use case that can have very many unexpected
consequences. Selecting it is useful for diagnostics.

## @@dbname_default_branch

This system variable controls a specific database's default branch for
the server, defaulting to the `repo.json` HEAD. Sessions at edit time
will remain on their existing branches. New session working
sets will beinitialized at the default branch.

# Persisting System Variables

Dolt supports a limited form of system variable persistence. The same
way session
variables can be changed with `SET`, global variables can be persisted
to disk with `SET PERSIST`. Persisted system variables survive restarts,
loading back into the global variables namespace on startup.

Dolt supports `SET PERSIST` and `SET PERSIST_ONLY` by writing system
variables to the local `.dolt/config.json`. The same result can be
achieved with the CLI by appending `sqlserver.global.` prefix to
keys with the `dolt config add --local` command. System
variables are used as session variables, and the SQL interface is
the encouraged access point. Variables that affect server startup, like
replication, must be set before instantiation.

# Examples

## `SET PERSIST`

```sql
SET PERSIST max_connections = 1000;
SET @@PERSIST.max_connections = 1000;
```

## `SET PERSIST_ONLY`

```sql
SET PERSIST_ONLY back_log = 1000;
SET @@PERSIST_ONLY.back_log = 1000;
```

## CLI

```bash
$ dolt config --local --add sqlserver.global.max_connections 1000
```

## Limitations

1. Deleting variables with `RESET PERSIST` is not supported.

2. Persistence in multi-db mode is not supported.

3. Loading variables from the Dolt global config on server startup is
   not supported.
