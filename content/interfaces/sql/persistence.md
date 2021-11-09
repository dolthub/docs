---
title: Dolt System Variable Persistence
---

# Persisting System Variables

Dolt supports a limited form of system variable persistence. The same
way session
variables can be changed with `SET`, global variables can be persisited
to disk with `SET PERSIST`. Peristed system variables survive restarts,
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

## Future Work

## `RESET PERSIST`

Variables can be unset by assigning keys to empty values, deleting the
configuration file (not recommended), or using MySQL's `RESET PERSIST`
or `RESET PERSIST ALL` syntax. We do not yet support `RESET PERSIST`.

## Multiple Databases

`SET PERSIST` queries in multi database settings are ambiguous, because
there are multiple equivalent configs. In these
scenarios, we write values to an in-memory map that do not survive a
restart. We will either support real persistence or
explicitly error in the future.

## Global Config

Users can persist system variables in the global dolt config using
the CLI, but we do not currently support loading global config values
on restarts.
