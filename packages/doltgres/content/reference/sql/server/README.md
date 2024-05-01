---
title: Running the Doltgres SQL Server
---

# doltgres sql-server

The `doltgres sql-server` command runs a Postgres compatible server which clients can connect to and
execute queries against. Any library or tool that can connect to Postgres can connect to
Doltgres. `doltgres` without any argument also starts the server.

```bash
% doltgres
Starting server with Config HP="localhost:3306"|U="root"|P=""|T="28800000"|R="false"|L="info"
```

The host, user, password, timeout, logging info and other options can
be set on the command line or via a config file.

View the `doltgres sql-server` command documentation
[here](../../cli/cli.md#dolt-sql-server).

## Stopping the server

The `doltgres sql-server` process can be stopped using your operating system's process control
mechanism. Doltgres will stop when sent a signal like `SIGHUP`, `SIGQUIT`, `SIGABRT`, or `SIGKILL`.

A common way to send a `SIGKILL` is to navigate to the shell running the `doltgres sql-server`
process and `Ctrl-C`.

Another common way to stop the server is to identify the process running `doltgres sql-server` and
send a signal to it using the `kill` command.

```sh
$ ps -a | grep doltgres
66187 ttys000    0:00.00 grep doltgres
46800 ttys003  3351:00.34 doltgres sql-server
$ kill -QUIT 46800
```
