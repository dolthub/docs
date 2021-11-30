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

## Limitations

1) Deleting variables with `RESET PERSIST` is not supported.

2) Persistence in multi-db mode is not supported.

3) Loading variables from the Dolt global config on server startup is
   not supported.
