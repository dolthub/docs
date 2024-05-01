---
title: System Variables
---

# System Variables

## What is a System Variable?

System variables are server-side key-value pairs. These variables have lifecycles between server
restarts (`PERSIST`), between sessions within a single server lifetime (`GLOBAL`), and within a
single client session (`SESSION`). Variables for narrowing scopes are initialized hierarchically:
`PERSIST` -> `GLOBAL` -> `SESSION`.

<!-- TODO: this isn't quite accurate, needs revision -->

## How to use System Variables

System variables are most often managed through the SQL shell, although server-startup defaults can
be manually set and persisted between server restarts.

## Difference between Postgres and Doltgres System Variables

Doltgres only supports a subset of Postgres's system variables at the moment. The ones we do
support should have the same lifecycle behavior as Postgres.

We also have Doltgres-specific system variables, which can be found
[here](../../reference/sql/version-control/dolt-sysvars.md). Most dolt specific variables are
prefixed with either `dolt_...` or the database's name (ex: `mydb_...`). These can be listed in the
MySQL shell with show queries: `show all`.

## Interaction with Doltgres Version Control

System variables are maintained outside of version control. Different clones of the same database
can have different system variables.

Some system variables impact transaction, merge, and conflict resolution behavior. For example,
`@@dolt_force_transaction_commit` both creates a new Doltgres commit for every SQL transaction, and
dismisses merge conflicts in the process of auto-executing these commits.

A full list of Doltgres system variables and descriptions can be found
[here](../../reference/sql/version-control/dolt-sysvars.md).

## Example

### Reading System Variables

```SQL
show max_connections;
 max_connections
-----------------
 100
(1 row)
```

### Writing System Variables

```SQL
-- some variables are read only
SET max_connections 10;
Error 1105: Variable 'max_connections' is a read only variable

-- some variables are "dynamic" at session time
SET TIME ZONE = 'PST8PDT';
```

### Show System Variables

The `SHOW ALL` shows all system variables, but this syntax is not yet supported.
