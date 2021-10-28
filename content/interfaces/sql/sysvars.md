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
