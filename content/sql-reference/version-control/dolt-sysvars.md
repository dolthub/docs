# System Variables

## Dolt System Variables

Dolt exposes various information about the state of the current session. This information is typically only useful for advanced users.

### @@dbname\_head\_ref

Each session defines a system variable that controls the current session head. For a database called `mydb`, this variable will be called `@@mydb_head_ref` and be set to the current head.

```sql
mydb> select @@mydb_head_ref;
+-------------------------+
| @@SESSION.mydb_head_ref |
+-------------------------+
| refs/heads/master       |
+-------------------------+
```

To switch heads, set this session variable. Use either `refs/heads/branchName` or just `branchName`:

`SET @@mydb_head_ref = 'feature-branch'`

### @@dolt\_show\_branch\_databases

When set to `1`, this system variable causes all branches to be represented as separate databases in `show databases`, the `information_schema` tables, and other places where databases are enumerated. Defaults to `0`, which means that by default branch-derived databases are not displayed (although they can still be used).

```sql
fresh> show databases;
+--------------------+
| Database           |
+--------------------+
| fresh              |
| information_schema |
| mysql              |
+--------------------+
3 rows in set (0.00 sec)

fresh> set @@dolt_show_branch_databases = 1;
fresh> show databases;
+--------------------+
| Database           |
+--------------------+
| fresh              |
| fresh/b1           |
| fresh/main         |
| information_schema |
| mysql              |
+--------------------+
5 rows in set (0.00 sec)
```

### @@dolt\_transaction\_commit

When set to `1`, this system variable creates a Dolt commit for every SQL transaction commit. Commits have an auto-generated commit message. Defaults to `0`.

### @@dolt\_allow\_commit\_conflicts

When set to `1`, this system variable allows transactions with merge conflicts to be committed. When set to `0`, merge conflicts must be resolved before committing a transaction, and attempting to commit a transaction with conflicts fails and rolls back the transaction. Defaults to `0`.

### @@dolt\_force\_transaction\_commit

When set to `1`, this system variable ignores all merge conflicts, constraint violations, and other correctness issues resulting from a merge and allows them to be committed. Defaults to `0`.

### @@dolt\_replicate\_to\_remote

This system variable is used to push to replication middlemen. Dolt commit triggers a push and transmits the resulting dataset to the named remote. SQL commits do not trigger replication.

```sql
mysql> select name from dolt_remotes;
+---------+
| name    |
+---------+
| remote1 |
| origin  |
+---------+
mysql> SET @@GLOBAL.dolt_replicate_to_remote = remote1;
mysql> CALL dolt_commit('-am', 'push on write');
```

### @@dolt\_async\_replication

This system variable can be enabled when using push-on-commit replication (i.e. `@@dolt_replicate_to_remote`). When enabled, Dolt commits will be pushed asynchronously to the remote specified in the `@@dolt_replicate_to_remote` system variable, instead of synchronously completing the push before returning from the Dolt commit operation. This setting can cause commits to complete faster since the push to remote is not synchronous, but it may also increase the remote replication delay. Because of the asynchronous nature, replication errors may also be less obvious.

```sql
mysql> SET @@GLOBAL.dolt_replicate_to_remote = remote1;
mysql> SET @@GLOBAL.dolt_async_replication = 1;
```

### @@dolt\_read\_replica\_remote

This system variable is used to pull updates to read replicas. New data is pulled every time a transaction begins.

Setting either `dolt_replicate_heads` or `dolt_replicate_all_heads` is also required.

```sql
mysql> SET @@GLOBAL.dolt_read_replica_remote = origin;
mysql> SET @@GLOBAL.dolt_replicate_heads = main;
mysql> START TRANSACTION;
```

### @@dolt\_replicate\_heads

This system variable specifies which heads a read replica should fetch. Pair with `dolt_read_replica_remote`. Use is mutually exclusive with `dolt_replicate_all_heads`.

```sql
mysql> SET @@GLOBAL.dolt_replicate_heads = main;
mysql> SET @@GLOBAL.dolt_replicate_heads = "main,feature1,feature2";
```

### @@dolt\_replicate\_all\_heads

This system variable indicates to pull all branches for every read replica fetch. Pair with `dolt_read_replica_remote`. Use is mutually exclusive with `dolt_replicate_heads`.

```sql
mysql> SET @@GLOBAL.dolt_replicate_all_heads = 1;
```

### @@dolt\_replication\_remote\_url\_template

This system variable indicates that newly created databases should have a remote created according to the URL template supplied. This URL template must include the `{database}` placeholder. Some examples:

```sql
set @@persist.dolt_replication_remote_url_template = 'file:///share/doltRemotes/{database}'; -- file based remote
set @@persist.dolt_replication_remote_url_template = 'aws://dynamo-table:s3-bucket/{database}'; -- AWS remote
set @@persist.dolt_replication_remote_url_template = 'gs://mybucket/remotes/{database}'; -- GCP remote
```

On a read replica, setting this variable will cause the server to attempt to clone any unknown database used in a query or connection string by constructing a remote URL.

### @@dolt\_skip\_replication\_errors

This system variable is used to quiet replication errors that would otherwise halt query execution. Missing or malformed configuration is the main target of replication warnings. Faults unrelated to replication should still error.

```sql
mysql> SET @@GLOBAL.dolt_skip_replication_errors = 1;
```

### @@dbname\_working

This system variable controls the current working root value. Setting it is an expert use case that can have very many unexpected consequences. Selecting it is useful for diagnostics.

### @@dbname\_staged

This system variable controls the current staged root value. Setting it is an expert use case that can have very many unexpected consequences. Selecting it is useful for diagnostics.

### @@dbname\_default\_branch

This system variable controls a database's default branch, defaulting to the `repo.json` HEAD. New session active branches and working sets will reflect the new default. Sessions started before a variable change are unimpacted.

## Persisting System Variables

Dolt supports a limited form of system variable persistence. The same way session variables can be changed with `SET`, global variables can be persisted to disk with `SET PERSIST`. Persisted system variables survive restarts, loading back into the global variables namespace on startup.

Dolt supports `SET PERSIST` and `SET PERSIST_ONLY` by writing system variables to the local `.dolt/config.json`. The same result can be achieved with the CLI by appending `sqlserver.global.` prefix to keys with the `dolt config add --local` command. System variables are used as session variables, and the SQL interface is the encouraged access point. Variables that affect server startup, like replication, must be set before instantiation.

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
