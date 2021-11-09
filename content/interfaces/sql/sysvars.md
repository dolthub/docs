---
title: Dolt System Variables
---

# Dolt System Variables

Dolt exposes various information about the state of the current
session. This information is typically only useful for advanced
users. See information on [Detached Head
mode](heads.md#detached-head-mode).

## @@dbname\_head\_ref

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

## @@dbname_head

This system variable controls the current session's head
commit. Setting this variable to a commit hash causes your session to
enter detached head mode.

See [Detached Head mode](heads.md#detached-head-mode) for more detail.

## @@dbname_working

This system variable controls the current working root value. Setting
it is an expert use case that can have very many unexpected
consequences. Selecting it is useful for diagnostics.

## @@dbname_staged

This system variable controls the current staged root value. Setting
it is an expert use case that can have very many unexpected
consequences. Selecting it is useful for diagnostics.

## @@dolt_default_branch

This system variable toggles the default database branch on server
(or SQL engine) instantiation. Setting this changes the active branch
and working set new server sessions connect to.

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
mysql> SET @@GLOBAL.dolt_replicate_to_remote remote1;
mysql> select dolt_commit('-am', 'push on write');
```

## @@dolt_read_replica_remote

This system variable is used to pull updates to read replicas.
Pulling is triggered on SQL `START TRANSACTION`. Setting `autocommit = 1`
will wrap every query in a transaction.

Setting `dolt_replicate_heads` or `dolt_replicate_all_heads` is required.

```sql
mysql> SET @@GLOBAL.dolt_read_replica_remote = origin;
mysql> SET @@GLOBAL.dolt_replicate_heads main;
mysql> START TRANSACTION;
```

## @@dolt_skip_replication_errors

This system variable is used to quiet replication
errors that would otherwise hault query execution. Missing or malformed
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
mysql> SET @@GLOBAL.dolt_replicate_heads main;
mysql> SET @@GLOBAL.dolt_replicate_heads main,feature1,feature2;
```

## @@dolt_replicate_all_heads

This system variable indicates to pull all branches for every read replica
fetch. Pair with `dolt_read_replica_remote`. Use is mutually exclusive
with `dolt_replicate_heads`.

```sql
mysql> SET @@GLOBAL.dolt_replicate_all_heads = 1;
```
