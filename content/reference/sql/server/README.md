---
title: Running the Dolt SQL Server
---

There are two ways to run SQL queries against your database:

- `dolt sql-server` starts a MySQL-compatible server
- `dolt sql` runs SQL queries from your shell without starting a server

# dolt sql-server

The `dolt sql-server` command runs a MySQL compatible server which
clients can connect to and execute queries against. Any library or tool
that can connect to MySQL can connect to Dolt.

```bash
% dolt sql-server
Starting server with Config HP="localhost:3306"|U="root"|P=""|T="28800000"|R="false"|L="info"
```

The host, user, password, timeout, logging info and other options can
be set on the command line or via a config file.

View the `dolt sql-server` command documentation
[here](../../cli/cli.md#dolt-sql-server).

# dolt sql

Using `dolt sql` you can issue SQL statements against a local database
without starting a server.

With no arguments, `dolt sql` begins an interactive shell.

```bash
% dolt sql
# Welcome to the DoltSQL shell.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
menus> show tables;
+------------+
| Table      |
+------------+
| menu_items |
+------------+
menus> exit
Bye
```

With the `-q` flag, it executes queries specified as arguments.

```bash
% dolt sql -q "show tables"
+------------+
| Table      |
+------------+
| menu_items |
+------------+
```

You can also use `STDIN` to the `dolt sql` command to execute many SQL
statements at once. This is useful for [importing a dump from another database](../../../guides/import.md#mysql-databases).

```bash
% dolt sql < mysqldump.sql
```

View the `dolt sql` command documentation [here](../../cli/cli.md#dolt-sql).
