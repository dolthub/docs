# System Variables

## What is a System Variable?

System variables are server-side key-value pairs. These variables have lifecycles between server restarts (`PERSIST`), between sessions within a single server lifetime (`GLOBAL`), and within a single client session (`SESSION`). Variables for narrowing scopes are initialized hierarchically: `PERSIST` -> `GLOBAL` -> `SESSION`.

## How to use System Variables

System variables are most often managed through the SQL shell, although server-startup defaults can be manually set and persisted between server restarts.

For example, `@@max_connections` has a system default value of 155. We can use the shell to persist a new default for future server startups, immediately materialize a new global default for this and other sessions, change the value only for this session, or some combination of the above.

## Difference between MySQL and Dolt System Variables

Dolt only supports a subset of MySQL's system variables at the moment. The ones we do support should have the same lifecycle behavior as MySQL. One exception is that we do not currently support deleting persisted variables.

We also have Dolt-specific system variables, which can be found [here](../../../sql-reference/version-control/dolt-sysvars.md). Most dolt specific variables are prefixed with either `dolt_...` or the database's name (ex: `mydb_...`). These can be listed in the MySQL shell with show queries: `show variables like 'dolt_%';` (see below for output).

## Interaction with Dolt Version Control

System variables are maintained outside of version control. Different clones of the same database can have different system variables.

Some system variables impact transaction, merge, and conflict resolution behavior. For example, `@@dolt_force_transaction_commit` both creates a new Dolt commit for every SQL transaction, and dismisses merge conflicts in the process of auto-executing these commits.

A full list of Dolt system variables and descriptions can be found [here](../../../sql-reference/version-control/dolt-sysvars.md).

## Example

### Reading System Variables

```
-- global variables default to persisted configuration or system defaults
mysql> select @@GLOBAL.max_connections;
+--------------------------+
| @@GLOBAL.max_connections |
+--------------------------+
| 150                      |
+--------------------------+

-- session variables are initialized from global values
mysql> select @@SESSION.max_connections;
+---------------------------+
| @@SESSION.max_connections |
+---------------------------+
| 151                       |
+---------------------------+

-- variable defaults to session value
mysql> select @@max_connections;
+---------------------------+
| @@SESSION.max_connections |
+---------------------------+
| 151                       |
+---------------------------+
```

### Writing System Variables

```
-- some variables are read only
mysql> SET @@GLOBAL.basedir = '/';
Error 1105: Variable 'basedir' is a read only variable

-- some variables are "dynamic" at session time
mysql> SET @@autocommit = 1;

-- some variables are only globally "dynamic"
mysql> SET @@max_connections = 100;
Variable 'max_connections' is a GLOBAL variable and should be set with SET GLOBAL

-- global variable changes only affect new sessions
mysql> SET @@GLOBAL.max_connections = 100;
mysql> select @@GLOBAL.max_connections;
+--------------------------+
| @@GLOBAL.max_connections |
+--------------------------+
| 100                      |
+--------------------------+

-- editing a global variable only affects new sessions
mysql> select @@max_connections;
+---------------------------+
| @@SESSION.max_connections |
+---------------------------+
| 151                       |
+---------------------------+
```

### Persisting System Variables

```
-- persisting a variable with PERSIST affects existing GLOBAL value and outlives server restarts
mysql> SET @@PERSIST.max_connections = 99;
mysql> select @@GLOBAL.max_connections;
+---------------------------+
| @@SESSION.max_connections |
+---------------------------+
| 99                        |
+---------------------------+

-- persisting a variable with PERSIST_ONLY will only impact restarted servers
mysql> SET @@PERSIST_ONLY.max_connections = 10;
mysql> select @@GLOBAL.max_connections;
+---------------------------+
| @@SESSION.max_connections |
+---------------------------+
| 99                        |
+---------------------------+
```

### Show Dolt Variables

```
mysql> show variables like 'dolt_%';
+-------------------------------+-------+
| Variable_name                 | Value |
+-------------------------------+-------+
| dolt_allow_commit_conflicts   | 0     |
| dolt_async_replication        | 0     |
| dolt_force_transaction_commit | 0     |
| dolt_read_replica_remote      |       |
| dolt_replicate_all_heads      | 0     |
| dolt_replicate_heads          |       |
| dolt_replicate_to_remote      |       |
| dolt_skip_replication_errors  | 0     |
| dolt_transaction_commit       | 0     |
| dolt_transactions_disabled    | 0     |
+-------------------------------+-------+
```

### Show Database Variables

```
mydb> show variables like 'mydb_%' ;
+---------------------+----------------------------------+
| Variable_name       | Value                            |
+---------------------+----------------------------------+
| mydb_default_branch |                                  |
| mydb_head           | lv1hhlqsfn2ikhgogkts7c8399k7evik |
| mydb_head_ref       | refs/heads/main                  |
| mydb_staged         | egnkhhepjlhsfhj4v0uhuna4sbcmstif |
| mydb_working        | egnkhhepjlhsfhj4v0uhuna4sbcmstif |
+---------------------+----------------------------------+
```
