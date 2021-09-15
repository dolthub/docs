---
title: What is Dolt
---

# What is Dolt

## Version Controlled Database

Dolt is a version controlled relational database. Dolt implements a superset of MySQL. It is compatible with MySQL, and provides extra constructs exposing the version control features, which are closely modeled on Git.

### Offline vs Online

"Offline" Dolt operations happen via the Git-like command line interface \(CLI\). Used offline, Dolt feels very much like Git but for tables. To serve the data in a Dolt database over SQL connectors, users go "online" by starting Dolt SQL Server, which behaves like MySQL with additional features.

### Offline

When Dolt is "offline", it looks very much like Git. Let's use `dolt clone` to acquire a database:

```text
$ dolt clone dolthub/ip-to-country
cloning https://doltremoteapi.dolthub.com/dolthub/ip-to-country
32,832 of 32,832 chunks complete. 0 chunks being downloaded currently.
```

We now have acquired a database, and we can move into the newly created directory to give the `dolt` command the right database context:

```text
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

### Online

In the previous section we used Dolt's version control features, familiar from Git, to clone a remote database. In [Why Dolt](why-dolt/) we identified the value of a familiar SQL query interface, served over a widely adopted wire protocol, MySQL.

We can now take the cloned Dolt database "online" by firing up the Dolt SQL Server:

```text
dolt sql-server
Starting server with Config HP="localhost:3306"|U="root"|P=""|T="28800000"|R="false"|L="info"
```

We now have a running Dolt SQL Server. We can connect using the standard MySQL connector:

```text
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

We used Git-like "offline" features to clone a database, stood up a server, and connected to it to start performing "online" operations. Let's see how to access Git-like version control features in SQL.

## Everything in SQL

Where possible, Dolt's version control features are exposed in SQL. That means users can script complex version control workflows into the SQL queries that define data pipelines.

Let's dive into a couple of examples to see what this looks like in practice.

### AS OF

Suppose the IP to country mapping dataset that we procured earlier introduces a bug into our systems observed at `2020-12-12 02:00:00`. We can can grab the commit that introduced this state easily:

```text
mysql> select commit_hash, committer, message from dolt_log where `date` < '2020-12-10 18:00:00' limit 1;
+----------------------------------+------------------------+----------------------------------------------------------+
| commit_hash                      | committer              | message                                                  |
+----------------------------------+------------------------+----------------------------------------------------------+
| bqtrbbrsgie7u4fsgph0t12j94ofefml | LiquidataSystemAccount | Update IP to Country for date 2020-12-11 01:29:53.647746 |
+----------------------------------+------------------------+----------------------------------------------------------+
```

Suppose we want to see the new data introduced in that commit:

```text
mysql> select * from dolt_diff_IPv4ToCountry where to_commit = 'bqtrbbrsgie7u4fsgph0t12j94ofefml' and diff_type = 'added' limit 5;
+-----------------------+-------------+-----------------+---------------------+------------+------------+-----------------------+----------------------------------+-----------------------------------+-------------------------+---------------+-------------------+--------------+-----------+-------------+-------------------------+----------------------------------+-----------------------------------+-----------+
| to_CountryCode2Letter | to_Registry | to_AssignedDate | to_Country          | to_IpTo    | to_IPFrom  | to_CountryCode3Letter | to_commit                        | to_commit_date                    | from_CountryCode2Letter | from_Registry | from_AssignedDate | from_Country | from_IpTo | from_IPFrom | from_CountryCode3Letter | from_commit                      | from_commit_date                  | diff_type |
+-----------------------+-------------+-----------------+---------------------+------------+------------+-----------------------+----------------------------------+-----------------------------------+-------------------------+---------------+-------------------+--------------+-----------+-------------+-------------------------+----------------------------------+-----------------------------------+-----------+
| FI                    | ripencc     | 1607385600      | Finland             | 1542419967 | 1542419712 | FIN                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| DK                    | ripencc     | 1197936000      | Denmark             | 1559351295 | 1559347200 | DNK                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| SE                    | ripencc     | 1197936000      | Sweden              | 1559353343 | 1559351296 | SWE                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| DK                    | ripencc     | 1197936000      | Denmark             | 1559355391 | 1559353344 | DNK                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| IN                    | apnic       | 1607472000      | India               | 1738531839 | 1738531328 | IND                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
+-----------------------+-------------+-----------------+---------------------+------------+------------+-----------------------+----------------------------------+-----------------------------------+-------------------------+---------------+-------------------+--------------+-----------+-------------+-------------------------+----------------------------------+-----------------------------------+-----------+
```

### Rollback

Continuing with this example, let's suppose this is causing a production issue, and we need to rollback urgently. Dolt makes that easy:

```text
mysql> INSERT INTO dolt_branches (name, hash) VALUES  ('production' , 'u8pnf1o0mus2d8mok0083t5lpj190j5f');
Query OK, 1 row affected (0.21 sec)
```

The state of the Dolt SQL Server is now set to a commit prior to the one that caused an outage, and it was achieved with a single SQL query.

### DOLT\_COMMIT

Suppose that we want to write some data to Dolt and create a commit against a running Dolt SQL Server. We can use Dolt SQL functions that expose the Git-like version control features.:

```text
msql> SELECT DOLT_COMMIT('-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

We have now committed a new state of the database, which can be queried against and checked out.

