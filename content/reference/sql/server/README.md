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

## Stopping the server

The `dolt sql-server` process can be stopped using your operating system's process control mechanism. Dolt will stop when sent a signal like `SIGHUP`, `SIGQUIT`, `SIGABRT`, or `SIGKILL`.

A common way to send a `SIGKILL` is to navigate to the shell running the `dolt sql-server` process and `Ctrl-C`.

Another common way to stop the server is to identify the process running `dolt sql-server` and send a signal to it using the `kill` command. 

```sh
$ ps -a | grep dolt
66187 ttys000    0:00.00 grep dolt
46800 ttys003  3351:00.34 dolt sql-server
65544 ttys010    0:07.82 dolt push
$ kill -QUIT 46800
```

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
