---
title: What is Dolt
---

# What is Dolt

## Version controlled SQL database

Dolt is a version controlled SQL database. Its versioning model and
command line are based on git, and its SQL dialect and wire protocol
are based on MySQL. If you know how to use the `git` command line, you
know how to use the `dolt` command line. If your application works
with MySQL, it will work with Dolt with no changes.

## Example

The dolt command line copies git exactly. Let's use `dolt clone` to
clone a database from DoltHub:

```bash
$ dolt clone dolthub/ip-to-country
cloning https://doltremoteapi.dolthub.com/dolthub/ip-to-country
32,832 of 32,832 chunks complete. 0 chunks being downloaded currently.
```

After cloning the database, we can open a SQL shell on it.

```bash
$ cd ip-to-country
$ dolt sql
# Welcome to the DoltSQL shell.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
ip_to_country> show tables;
+---------------+
| Table         |
+---------------+
| IPv4ToCountry |
| IPv6ToCountry |
+---------------+
```

Make changes to tables with SQL. Create a new branch with `dolt
checkout -b`. Examine the diff with `dolt diff`. Stage changes with
`dolt add .`. Commit changes with `dolt commit`. Push your changes back to the remote with `dolt push origin master`. 

All the commands you know for git work exactly the same for `dolt`.

For more info, see the [CLI docs](../interfaces/cli.md).

## Application server

If you want Dolt to back your application, start the MySQL-compatible
server:

```bash
dolt sql-server
Starting server with Config HP="localhost:3306"|U="root"|P=""|T="28800000"|R="false"|L="info"
```

Any tool or application that speaks the MySQL protocol can talk to the
server. Here's the mysql shell:

```bash
~|>>  mysql --host=127.0.0.1 --user=root
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1
Server version: 5.7.9-Vitess

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> use ip_to_country;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+---------------+
| Table         |
+---------------+
| IPv4ToCountry |
| IPv6ToCountry |
+---------------+
2 rows in set (0.00 sec)
```

## Version control features in SQL

All of Dolt's version control features are exposed in SQL as well as
on the command line. That means users can script complex version
control workflows into the SQL queries that define data pipelines.

### AS OF

Query previous revisions of any table with the `AS OF` syntax.

```sql
select * from IPv6ToCountry as of 'HEAD~';
```

### DOLT\_COMMIT()

`DOLT_COMMIT()` in a SQL query works the same as `dolt commit` on the
command line:

```sql
SELECT DOLT_COMMIT('-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

Most dolt commands are accessible in a similar manner, and others are
exposed as system tables.

For more info, check out the [SQL docs](../interfaces/sql/README.md).
