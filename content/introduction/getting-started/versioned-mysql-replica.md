---
title: Versioned MySQL Replica
---

Dolt can be configured as a MySQL Replica. 

In this mode, you set up Dolt to replicate a primary MySQL. Set up can take as as little as three commands. After set up, Dolt replicates every write to your primary to Dolt and creates a Dolt commit, giving you time travel, lineage, rollback, and other [database version control](https://www.dolthub.com/blog/2021-09-17-database-version-control/) features on your Dolt replica.

This document will walk you through step-by-step on how to get Dolt running as a MySQL replica on your host. It will show off some unique version control features you get in this set up, including finding and fixing a bad change on primary.

# Start a Local MySQL Server

First, we need a running MySQL instance. We'll consider this our "primary" database. 

I use homebrew on my Mac. To get MySQL and start it, I open a terminal and run:

```bash
$ brew install mysql
$ brew services start mysql
```

This starts a MySQL on port `3306`. I can connect to it with:

```bash
$ mysql -u root
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 14
Server version: 8.0.32 Homebrew

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

Simple enough. Keep that open. You're going to need it.

# Prepare Your Primary MySQL for a Replica

Now, you have to prepare MySQL to have a replica. This requires the following configuration which are on by default. So, don't touch these if you're starting fresh like me.

1. `BINLOG_FORMAT` must be set to `ROW`, which is the default in MySQL 8.0.
2. `LOG_BIN` must be set to `ON`, which is the default in MySQL 8.0.
3. `SERVER_ID` must be set to any positive integer (so long as there is not a replica server using that same ID). The default here is 1.

Now, for the things you have to change. First you need to turn on `ENFORCE_GTID_CONSISTENCY`. Go to the you `mysql` client we started in step one and run the following query.

```SQL
mysql> SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = ON;                              
Query OK, 0 rows affected (0.00 sec)
```

Finally, you have to change `GTID_MODE` to `ON`. It is `OFF` by default and [you can't go directly from `OFF` to `ON`](https://dev.mysql.com/doc/refman/8.0/en/replication-mode-change-online-enable-gtids.html). So, step through the options up to `ON` like so.

```SQL
mysql> SET @@GLOBAL.GTID_MODE = OFF_PERMISSIVE;
Query OK, 0 rows affected (0.01 sec)

mysql> SET @@GLOBAL.GTID_MODE = ON_PERMISSIVE;
Query OK, 0 rows affected (0.01 sec)

mysql> SET @@GLOBAL.GTID_MODE = ON;
Query OK, 0 rows affected (0.00 sec)
```

To make sure you have everything set up right, run the following and make sure the table looks the same.

```SQL
mysql> SHOW VARIABLES WHERE Variable_Name LIKE '%gtid_mode' OR Variable_Name LIKE '%enforce_gtid_consistency' OR Variable_Name LIKE '%binlog_format' OR Variable_Name LIKE 'server_id';
+--------------------------+-------+
| Variable_name            | Value |
+--------------------------+-------+
| binlog_format            | ROW   |
| enforce_gtid_consistency | ON    |
| gtid_mode                | ON    |
| server_id                | 1     |
+--------------------------+-------+
```

You're now ready to configure a Dolt replica.

# Install Dolt

Dolt is a single ~68 megabyte program.

```bash
$ du -h /Users/timsehn//go/bin/dolt
 68M	/Users/timsehn/go/bin/dolt
```

It's really easy to install. Download it and put it on your `PATH`.

Here is a convenience script that does that for `*NIX` platforms. Open a terminal and run it.

```bash
sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | sudo bash'
```

# Start a Dolt SQL Server

Dolt needs a place to put your databases. I put mine in `~/dolt_replica`.

```bash
$ cd ~
$ mkdir dolt_replica
$ cd dolt_replica
```

Start a `dolt sql-server`. This is a MySQL compatible database server similar to the one you started in the first section. You need to run it on a different port than `3306` because your MySQL is running there. So, we'll start it on port `1234` using the `-P` option. I'm also going to start the server with `--loglevel` at `debug` so I can show you the queries replication is running.

```bash
$ dolt sql-server -P 1234 --loglevel=debug                       
Starting server with Config HP="localhost:1234"|T="28800000"|R="false"|L="debug"|S="/tmp/mysql.sock"
2023-03-08T13:05:06-08:00 WARN [no conn] unix socket set up failed: file already in use: /tmp/mysql.sock {}
```

The shell will just hang there. That means Dolt is running. Any errors you encounter running Dolt will be printed here. Because we're in debug mode, you can also see the queries run against the server in this log.

# Configure Dolt as a Replica

Open a new terminal and connect a MySQL client to your running Dolt just like you did to MySQL above, but this time specify port `1243` and host `127.0.0.1` to force MySQL through the TCP interface. Without the host specified it will connect using the socket interface to your running MySQL, not Dolt like you want.

```bash
$ mysql -h 127.0.0.1 -P 1234 -u root
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1
Server version: 5.7.9-Vitess 

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

Now you need to run three commands. First, make sure the replica server has a unique `server_id` not used by any source or other replicas in our system. We'll use `2'.

```sql
mysql> SET @@GLOBAL.SERVER_ID=2;
Query OK, 1 row affected (0.00 sec)
```

Then, set the replication source to the primary, `localhost:3306` with user `root`, no password.

```sql
mysql> CHANGE REPLICATION SOURCE TO SOURCE_HOST='localhost', SOURCE_USER='root', SOURCE_PORT=3306;
Query OK, 0 rows affected (0.00 sec)
```

Finally, start the replica.

```SQL
mysql> START REPLICA;
Query OK, 0 rows affected (0.00 sec)
```

If you look at the logs in the Dolt terminal, you should see something like this:

```bash
2023-03-13T11:32:16-07:00 DEBUG [conn 1] Starting query {connectTime=2023-03-13T11:31:37-07:00, connectionDb=, query=START REPLICA}
2023-03-13T11:32:16-07:00 INFO [conn 1] starting binlog replication... {connectTime=2023-03-13T11:31:37-07:00, connectionDb=, query=START REPLICA}
2023-03-13T11:32:16-07:00 DEBUG [no conn] no binlog connection to source, attempting to establish one {}
2023-03-13T11:32:16-07:00 DEBUG [conn 1] Query finished in 1 ms {connectTime=2023-03-13T11:31:37-07:00, connectionDb=, query=START REPLICA}
2023-03-13T11:32:16-07:00 DEBUG [no conn] Received binlog event: Rotate {}
2023-03-13T11:32:16-07:00 DEBUG [no conn] Received binlog event: FormatDescription {checksum=1, format=&{4 8.0.32 19 1 [0 13 0 8 0 0 0 0 4 0 4 0 0 0 98 0 4 26 8 0 0 0 8 8 8 2 0 0 0 10 10 10 42 42 0 18 52 0 10 40 0]}, formatVersion=4, serverVersion=8.0.32}
2023-03-13T11:32:16-07:00 DEBUG [no conn] Received binlog event: PreviousGTIDs {previousGtids=}
```

You now have a Dolt replica of a running MySQL! If you have any data in the `binlog` of the MySQL (ie. you didn't start from scratch), that data will replicate over to Dolt right now.

# Write Something on the Primary

Now it's time to test out what you created. We'll start by creating a databases and a table.

On the primary, run the following queries.

```sql
mysql> create database foo;
Query OK, 1 row affected (0.00 sec)

mysql> use foo;
Database changed
mysql> create table t (c1 int primary key, c2 int);
Query OK, 0 rows affected (0.01 sec)

mysql> show tables;
+---------------+
| Tables_in_foo |
+---------------+
| t             |
+---------------+
1 row in set (0.01 sec)

mysql> insert into t values (0,0);
Query OK, 1 row affected (0.01 sec)
```

You can see the queries replicating in the Dolt log:

```bash
2023-03-13T11:33:51-07:00 DEBUG [no conn] Received binlog event: GTID {gtid=cb01d44a-c1cc-11ed-889a-b5857bdad497:1, isBegin=false}
2023-03-13T11:33:51-07:00 DEBUG [no conn] Received binlog event: Query {charset=client:255 conn:255 server:255, database=foo, options=0x0, query=create database foo, sql_mode=0x45a00020}
2023-03-13T11:34:13-07:00 DEBUG [no conn] Received binlog event: GTID {connectionDb=foo, gtid=cb01d44a-c1cc-11ed-889a-b5857bdad497:2, isBegin=false}
2023-03-13T11:34:13-07:00 DEBUG [no conn] Received binlog event: Query {charset=client:255 conn:255 server:255, connectionDb=foo, database=foo, options=0x0, query=create table t (c1 int primary key, c2 int), sql_mode=0x45a00020}
2023-03-13T11:34:30-07:00 DEBUG [no conn] Received binlog event: GTID {connectionDb=foo, gtid=cb01d44a-c1cc-11ed-889a-b5857bdad497:3, isBegin=false}
2023-03-13T11:34:30-07:00 DEBUG [no conn] Received binlog event: Query {charset=client:255 conn:255 server:255, connectionDb=foo, database=foo, options=0x0, query=BEGIN, sql_mode=0x45a00020}
2023-03-13T11:34:30-07:00 DEBUG [no conn] Received binlog event: TableMap {connectionDb=foo, database=foo, flags=1, id=113, metadata=[0 0], tableName=t, types=[3 3]}
2023-03-13T11:34:30-07:00 DEBUG [no conn] Received binlog event: WriteRows {connectionDb=foo}
2023-03-13T11:34:30-07:00 DEBUG [no conn] Processing rows from WriteRows event {connectionDb=foo, flags=1}
2023-03-13T11:34:30-07:00 DEBUG [no conn]  - Inserted Rows (table: t) {connectionDb=foo}
2023-03-13T11:34:30-07:00 DEBUG [no conn]      - Data: [0,0]  {connectionDb=foo}
2023-03-13T11:34:30-07:00 DEBUG [no conn] Received binlog event: XID {connectionDb=foo}
```

All seems to be working. 

# Inspect the Replica

Let's hop over to the `mysql` client connected to Dolt and inspect it just to make sure.

```sql
mysql> use foo;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+---------------+
| Tables_in_foo |
+---------------+
| t             |
+---------------+
1 row in set (0.01 sec)

mysql> select * from t;
+------+------+
| c1   | c2   |
+------+------+
|    0 |    0 |
+------+------+
1 row in set (0.01 sec)
```

The new database `foo` and the table `t` along with it's single row have replicated.

# Inspect the Commit Log

Now to show off the first new feature, the Dolt Commit log. The Dolt replica makes a Dolt commit after every transaction sent from the primary so you can see what changed and when.

Dolt has a number of [system tables](../../reference/sql/version-control/dolt-system-tables#database-history-system-tables), [functions](../../reference/sql/version-control/dolt-sql-functions#table-functions), and [procedures](../../reference/sql/version-control/dolt-sql-procedures) to expose the version control features. These tables, functions, and procedures are inspired by their Git equivalents, so `git log` becomes the `dolt_log` system table. 

```sql
mysql> select * from dolt_log;
+----------------------------------+-----------+-----------------+-------------------------+-------------------------------------------------------------------------+
| commit_hash                      | committer | email           | date                    | message                                                                 |
+----------------------------------+-----------+-----------------+-------------------------+-------------------------------------------------------------------------+
| h9hsr5ij8u9gml4nkqenm8alep1la1r9 | timsehn   | tim@dolthub.com | 2023-03-13 18:31:22.706 | Dolt binlog replica commit: GTID cb01d44a-c1cc-11ed-889a-b5857bdad497:3 |
| t3bp704udfjcuo83hb7qjat8ltv1osea | timsehn   | tim@dolthub.com | 2023-03-13 18:31:22.706 | Dolt binlog replica commit: GTID cb01d44a-c1cc-11ed-889a-b5857bdad497:2 |
| gia1ra16aakuc69hmha7p9pjnjd9ghid | timsehn   | tim@dolthub.com | 2023-03-13 18:33:51.736 | Initialize data repository                                              |
+----------------------------------+-----------+-----------------+-------------------------+-------------------------------------------------------------------------+
3 rows in set (0.01 sec)
```

As you can see, we have a full audit history of the database going back to inception. That should be useful.

# Inspect a Diff

Let's see what happened in the last transaction. I'm going to see what changed in table in the last commit using the [`dolt_diff()` table function](../../reference/sql/version-control/dolt-sql-functions#dolt_diff).

```sql
mysql> select * from dolt_diff('t3bp704udfjcuo83hb7qjat8ltv1osea', 'h9hsr5ij8u9gml4nkqenm8alep1la1r9', 't');
+-------+-------+----------------------------------+-------------------------+---------+---------+----------------------------------+-------------------------+-----------+
| to_c1 | to_c2 | to_commit                        | to_commit_date          | from_c1 | from_c2 | from_commit                      | from_commit_date        | diff_type |
+-------+-------+----------------------------------+-------------------------+---------+---------+----------------------------------+-------------------------+-----------+
|     0 |     0 | h9hsr5ij8u9gml4nkqenm8alep1la1r9 | 2023-03-13 18:31:22.706 |    NULL |    NULL | t3bp704udfjcuo83hb7qjat8ltv1osea | 2023-03-13 18:31:22.706 | added     |
+-------+-------+----------------------------------+-------------------------+---------+---------+----------------------------------+-------------------------+-----------+
```

It looks like `c1` and `c2` both went from `NULL` to `0` in that commit, just as we'd expect. With a Dolt replica, you get a queryable audit log of every cell in your database.

# A Bigger Database...

Now, let's examine a more interesting database. This time, I'm going to use [`https://github.com/datacharmer/test_db`](https://github.com/datacharmer/test_db) recommended by [MySQL](https://dev.mysql.com/doc/index-other.html). As the [README says](https://github.com/datacharmer/test_db/blob/master/README.md):

> The export data is 167 MB, which is not huge, but heavy enough to be non-trivial for testing.

First, I clone the GitHub repo and import the data to my running MySQL using the [provided instructions](https://github.com/datacharmer/test_db/blob/master/README.md) in the test_db repository.

```bash
$ git clone git@github.com:datacharmer/test_db.git
Cloning into 'test_db'...
remote: Enumerating objects: 120, done.
remote: Total 120 (delta 0), reused 0 (delta 0), pack-reused 120
Receiving objects: 100% (120/120), 74.27 MiB | 22.43 MiB/s, done.
Resolving deltas: 100% (62/62), done.
$ cd test_db 
$ mysql -u root < employees.sql     
INFO
CREATING DATABASE STRUCTURE
INFO
storage engine: InnoDB
INFO
LOADING departments
INFO
LOADING employees
INFO
LOADING dept_emp
INFO
LOADING dept_manager
INFO
LOADING titles
INFO
LOADING salaries
data_load_time_diff
00:00:25
```

It takes a bit longer than 25 seconds for Dolt to replicate that all over, especially with the log level at `debug`, but it should be done in under a minute.

Over on my Dolt replica, I can see the employees database and its tables.

```sql
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| employees          |
| foo                |
| information_schema |
| mysql              |
+--------------------+
4 rows in set (0.00 sec)

mysql> use employees;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+----------------------+
| Tables_in_employees  |
+----------------------+
| current_dept_emp     |
| departments          |
| dept_emp             |
| dept_emp_latest_date |
| dept_manager         |
| employees            |
| salaries             |
| titles               |
+----------------------+
8 rows in set (0.00 sec)
```

# Make a bad change

Now, let's do something crazy. We're going to mix a bad change in with a couple good changes and use the Dolt replica to find and revert the change.

Let's get a feel for this database first.

```sql
mysql> use employees;
Database changed
mysql> show tables;
+----------------------+
| Tables_in_employees  |
+----------------------+
| current_dept_emp     |
| departments          |
| dept_emp             |
| dept_emp_latest_date |
| dept_manager         |
| employees            |
| salaries             |
| titles               |
+----------------------+
8 rows in set (0.00 sec)

mysql> select count(*) from salaries;
+----------+
| count(*) |
+----------+
|  2844047 |
+----------+
1 row in set (0.08 sec)

mysql> select count(*) from employees;
+----------+
| count(*) |
+----------+
|   300024 |
+----------+
1 row in set (0.03 sec)

mysql> select * from employees limit 5;
+--------+------------+------------+-----------+--------+------------+
| emp_no | birth_date | first_name | last_name | gender | hire_date  |
+--------+------------+------------+-----------+--------+------------+
|  10001 | 1953-09-02 | Georgi     | Facello   | M      | 1986-06-26 |
|  10002 | 1964-06-02 | Bezalel    | Simmel    | F      | 1985-11-21 |
|  10003 | 1959-12-03 | Parto      | Bamford   | M      | 1986-08-28 |
|  10004 | 1954-05-01 | Chirstian  | Koblick   | M      | 1986-12-01 |
|  10005 | 1955-01-21 | Kyoichi    | Maliniak  | M      | 1989-09-12 |
+--------+------------+------------+-----------+--------+------------+
5 rows in set (0.00 sec)
```

Now, I'll make some changes.

I'm going to add myself as an employee and pay myself $1,000,000!

```sql
mysql> describe employees;
+------------+---------------+------+-----+---------+-------+
| Field      | Type          | Null | Key | Default | Extra |
+------------+---------------+------+-----+---------+-------+
| emp_no     | int           | NO   | PRI | NULL    |       |
| birth_date | date          | NO   |     | NULL    |       |
| first_name | varchar(14)   | NO   |     | NULL    |       |
| last_name  | varchar(16)   | NO   |     | NULL    |       |
| gender     | enum('M','F') | NO   |     | NULL    |       |
| hire_date  | date          | NO   |     | NULL    |       |
+------------+---------------+------+-----+---------+-------+
6 rows in set (0.01 sec)
mysql> select max(emp_no) from employees;
+-------------+
| max(emp_no) |
+-------------+
|      499999 |
+-------------+
1 row in set (0.00 sec)
mysql> insert into employees values (500000, '1980-02-03', 'Timothy', 'Sehn', 'M', '2023-02-03');
Query OK, 1 row affected (0.00 sec)
mysql> describe salaries;
+-----------+------+------+-----+---------+-------+
| Field     | Type | Null | Key | Default | Extra |
+-----------+------+------+-----+---------+-------+
| emp_no    | int  | NO   | PRI | NULL    |       |
| salary    | int  | NO   |     | NULL    |       |
| from_date | date | NO   | PRI | NULL    |       |
| to_date   | date | NO   |     | NULL    |       |
+-----------+------+------+-----+---------+-------+
4 rows in set (0.00 sec)
mysql> insert into salaries values (500000, 1000000,'2023-02-03','2023-02-03');
Query OK, 1 row affected (0.00 sec)
```

Let's mix in a bad change. Think about how disastrous this query would be without a Dolt replica.

```sql
mysql> update salaries set salary=salary-1 order by rand() limit 5;
Query OK, 5 rows affected (0.87 sec)
Rows matched: 5  Changed: 5  Warnings: 0
```

Finally, I'll add my co-founders Aaron and Brian to the database and give them salaries.

```sql
mysql> insert into employees values (500001, '1984-02-06', 'Aaron', 'Son', 'M', '2023-02-06'), (500002, '1984-02-06', 'Brian', 'Nendriks', 'M', '2023-02-06');
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> insert into salaries values (500001, 1,'2023-02-06','2023-02-06'),(500002, 1,'2023-02-06','2023-02-06');
Query OK, 2 rows affected (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 0
```

# Find a bad change

Let's say in this case, people are reporting their historical salaries have changed. We have a clue that something is wrong in the database. Let's head over to the Dolt replica and see what's up.

First, we want to find the changes in the last 10 transactions that touched the salaries table. To do this we use the unscoped [`dolt_diff` table](../../reference/sql/version-control/dolt-system-tables#dolt_diff) to see what tables changes in each commit.

```sql
mysql> select * from dolt_diff where table_name='salaries' limit 10;
+----------------------------------+------------+-----------+-----------------+-------------------------+---------------------------------------------------------------------------+-------------+---------------+
| commit_hash                      | table_name | committer | email           | date                    | message                                                                   | data_change | schema_change |
+----------------------------------+------------+-----------+-----------------+-------------------------+---------------------------------------------------------------------------+-------------+---------------+
| 649fgvojpthn1e21bqrdlv3r3bht4rqb | salaries   | timsehn   | tim@dolthub.com | 2023-03-14 16:58:40.516 | Dolt binlog replica commit: GTID 5dd3b782-c288-11ed-8525-f178832944db:184 |           1 |             0 |
| 123d9jc85evssjcrv6u5mlt5dg4lk6ss | salaries   | timsehn   | tim@dolthub.com | 2023-03-14 16:58:12.711 | Dolt binlog replica commit: GTID 5dd3b782-c288-11ed-8525-f178832944db:182 |           1 |             0 |
| 4te2i1qheceek434m3uoqsuejfv6f0nu | salaries   | timsehn   | tim@dolthub.com | 2023-03-14 16:57:59.715 | Dolt binlog replica commit: GTID 5dd3b782-c288-11ed-8525-f178832944db:181 |           1 |             0 |
| vrurdbqr7im0f2ha37e9agf9qr933r0j | salaries   | timsehn   | tim@dolthub.com | 2023-03-14 16:55:24.921 | Dolt binlog replica commit: GTID 5dd3b782-c288-11ed-8525-f178832944db:179 |           1 |             0 |
| u2rpdr1v49pumtdkpir04ohv2cinfrd6 | salaries   | timsehn   | tim@dolthub.com | 2023-03-14 16:55:24.72  | Dolt binlog replica commit: GTID 5dd3b782-c288-11ed-8525-f178832944db:178 |           1 |             0 |
| masl3j4d2f7ic3d0lgkhgskc8gridrk0 | salaries   | timsehn   | tim@dolthub.com | 2023-03-14 16:55:24.096 | Dolt binlog replica commit: GTID 5dd3b782-c288-11ed-8525-f178832944db:177 |           1 |             0 |
| bouhk6kkn9oqpn1ki61b8tc2uk81lted | salaries   | timsehn   | tim@dolthub.com | 2023-03-14 16:55:23.487 | Dolt binlog replica commit: GTID 5dd3b782-c288-11ed-8525-f178832944db:176 |           1 |             0 |
| ag00rebd7h25n6h786c4o0j2en76pek9 | salaries   | timsehn   | tim@dolthub.com | 2023-03-14 16:55:22.877 | Dolt binlog replica commit: GTID 5dd3b782-c288-11ed-8525-f178832944db:175 |           1 |             0 |
| pa4t6uj1igtma6r7elf3dl0s9b7q8sa8 | salaries   | timsehn   | tim@dolthub.com | 2023-03-14 16:55:22.281 | Dolt binlog replica commit: GTID 5dd3b782-c288-11ed-8525-f178832944db:174 |           1 |             0 |
| gqtrl19isbj7p97llibn0rejqr2r01mt | salaries   | timsehn   | tim@dolthub.com | 2023-03-14 16:55:21.739 | Dolt binlog replica commit: GTID 5dd3b782-c288-11ed-8525-f178832944db:173 |           1 |             0 |
+----------------------------------+------------+-----------+-----------------+-------------------------+---------------------------------------------------------------------------+-------------+---------------+
10 rows in set (0.00 sec)
```

It looks like the bottom seven are the import because they are happening back to back. Let's look at the diff between the third and first commit, `4te2i1qheceek434m3uoqsuejfv6f0nu` and `649fgvojpthn1e21bqrdlv3r3bht4rqb`.

```sql
mysql> select * from dolt_diff('4te2i1qheceek434m3uoqsuejfv6f0nu', '649fgvojpthn1e21bqrdlv3r3bht4rqb', 'salaries');
+-----------+-----------+--------------+------------+----------------------------------+-------------------------+-------------+-------------+----------------+--------------+----------------------------------+-------------------------+-----------+
| to_emp_no | to_salary | to_from_date | to_to_date | to_commit                        | to_commit_date          | from_emp_no | from_salary | from_from_date | from_to_date | from_commit                      | from_commit_date        | diff_type |
+-----------+-----------+--------------+------------+----------------------------------+-------------------------+-------------+-------------+----------------+--------------+----------------------------------+-------------------------+-----------+
|    203464 |     76540 | 1997-02-20   | 1998-02-20 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2023-03-14 16:58:40.516 |      203464 |       76541 | 1997-02-20     | 1998-02-20   | 4te2i1qheceek434m3uoqsuejfv6f0nu | 2023-03-14 16:57:59.715 | modified  |
|    255639 |     48854 | 1994-12-12   | 1995-12-12 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2023-03-14 16:58:40.516 |      255639 |       48855 | 1994-12-12     | 1995-12-12   | 4te2i1qheceek434m3uoqsuejfv6f0nu | 2023-03-14 16:57:59.715 | modified  |
|    291810 |     56424 | 1997-09-15   | 1998-09-15 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2023-03-14 16:58:40.516 |      291810 |       56425 | 1997-09-15     | 1998-09-15   | 4te2i1qheceek434m3uoqsuejfv6f0nu | 2023-03-14 16:57:59.715 | modified  |
|    416268 |     47129 | 1996-02-03   | 1997-02-02 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2023-03-14 16:58:40.516 |      416268 |       47130 | 1996-02-03     | 1997-02-02   | 4te2i1qheceek434m3uoqsuejfv6f0nu | 2023-03-14 16:57:59.715 | modified  |
|    441152 |     67238 | 1992-09-09   | 1993-08-27 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2023-03-14 16:58:40.516 |      441152 |       67239 | 1992-09-09     | 1993-08-27   | 4te2i1qheceek434m3uoqsuejfv6f0nu | 2023-03-14 16:57:59.715 | modified  |
|    500001 |         1 | 2023-02-06   | 2023-02-06 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2023-03-14 16:58:40.516 |        NULL |        NULL | NULL           | NULL         | 4te2i1qheceek434m3uoqsuejfv6f0nu | 2023-03-14 16:57:59.715 | added     |
|    500002 |         1 | 2023-02-06   | 2023-02-06 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2023-03-14 16:58:40.516 |        NULL |        NULL | NULL           | NULL         | 4te2i1qheceek434m3uoqsuejfv6f0nu | 2023-03-14 16:57:59.715 | added     |
+-----------+-----------+--------------+------------+----------------------------------+-------------------------+-------------+-------------+----------------+--------------+----------------------------------+-------------------------+-----------+
7 rows in set (0.01 sec)
```

We're getting closer. We have a couple good changes in there, the last two, but we see the badly modified rows pretty clearly. Let's compare the last two commits.

```sql
mysql> select * from dolt_diff('123d9jc85evssjcrv6u5mlt5dg4lk6ss', '649fgvojpthn1e21bqrdlv3r3bht4rqb', 'salaries');
+-----------+-----------+--------------+------------+----------------------------------+-------------------------+-------------+-------------+----------------+--------------+----------------------------------+-------------------------+-----------+
| to_emp_no | to_salary | to_from_date | to_to_date | to_commit                        | to_commit_date          | from_emp_no | from_salary | from_from_date | from_to_date | from_commit                      | from_commit_date        | diff_type |
+-----------+-----------+--------------+------------+----------------------------------+-------------------------+-------------+-------------+----------------+--------------+----------------------------------+-------------------------+-----------+
|    500001 |         1 | 2023-02-06   | 2023-02-06 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2023-03-14 16:58:40.516 |        NULL |        NULL | NULL           | NULL         | 123d9jc85evssjcrv6u5mlt5dg4lk6ss | 2023-03-14 16:58:12.711 | added     |
|    500002 |         1 | 2023-02-06   | 2023-02-06 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2023-03-14 16:58:40.516 |        NULL |        NULL | NULL           | NULL         | 123d9jc85evssjcrv6u5mlt5dg4lk6ss | 2023-03-14 16:58:12.711 | added     |
+-----------+-----------+--------------+------------+----------------------------------+-------------------------+-------------+-------------+----------------+--------------+----------------------------------+-------------------------+-----------+
```

That looks like the good changes so we've narrowed down the bad commit to `123d9jc85evssjcrv6u5mlt5dg4lk6ss`.

```sql
mysql> select * from dolt_diff('4te2i1qheceek434m3uoqsuejfv6f0nu', '123d9jc85evssjcrv6u5mlt5dg4lk6ss', 'salaries');
+-----------+-----------+--------------+------------+----------------------------------+-------------------------+-------------+-------------+----------------+--------------+----------------------------------+-------------------------+-----------+
| to_emp_no | to_salary | to_from_date | to_to_date | to_commit                        | to_commit_date          | from_emp_no | from_salary | from_from_date | from_to_date | from_commit                      | from_commit_date        | diff_type |
+-----------+-----------+--------------+------------+----------------------------------+-------------------------+-------------+-------------+----------------+--------------+----------------------------------+-------------------------+-----------+
|    203464 |     76540 | 1997-02-20   | 1998-02-20 | 123d9jc85evssjcrv6u5mlt5dg4lk6ss | 2023-03-14 16:58:12.711 |      203464 |       76541 | 1997-02-20     | 1998-02-20   | 4te2i1qheceek434m3uoqsuejfv6f0nu | 2023-03-14 16:57:59.715 | modified  |
|    255639 |     48854 | 1994-12-12   | 1995-12-12 | 123d9jc85evssjcrv6u5mlt5dg4lk6ss | 2023-03-14 16:58:12.711 |      255639 |       48855 | 1994-12-12     | 1995-12-12   | 4te2i1qheceek434m3uoqsuejfv6f0nu | 2023-03-14 16:57:59.715 | modified  |
|    291810 |     56424 | 1997-09-15   | 1998-09-15 | 123d9jc85evssjcrv6u5mlt5dg4lk6ss | 2023-03-14 16:58:12.711 |      291810 |       56425 | 1997-09-15     | 1998-09-15   | 4te2i1qheceek434m3uoqsuejfv6f0nu | 2023-03-14 16:57:59.715 | modified  |
|    416268 |     47129 | 1996-02-03   | 1997-02-02 | 123d9jc85evssjcrv6u5mlt5dg4lk6ss | 2023-03-14 16:58:12.711 |      416268 |       47130 | 1996-02-03     | 1997-02-02   | 4te2i1qheceek434m3uoqsuejfv6f0nu | 2023-03-14 16:57:59.715 | modified  |
|    441152 |     67238 | 1992-09-09   | 1993-08-27 | 123d9jc85evssjcrv6u5mlt5dg4lk6ss | 2023-03-14 16:58:12.711 |      441152 |       67239 | 1992-09-09     | 1993-08-27   | 4te2i1qheceek434m3uoqsuejfv6f0nu | 2023-03-14 16:57:59.715 | modified  |
+-----------+-----------+--------------+------------+----------------------------------+-------------------------+-------------+-------------+----------------+--------------+----------------------------------+-------------------------+-----------+
5 rows in set (0.00 sec)
```

Take a minute to marvel at what we just did. We were able to identify what changed from a `update salaries set salary=salary-1 order by rand() limit 5;` query all using queryable system tables on a replica. What a time to be alive! Now let's revert the change.

# Revert a bad change

If you were running Dolt as the primary database, reverting a bad change is as simple as calling [`dolt_revert()`](../../reference/sql/version-control/dolt-sql-procedures#dolt_revert). But since we're running Dolt as a replica, we need Dolt to produce a SQL patch to revert the bad changes. To do this, we're going to make a branch on the replica, revert the change, and then use the [`dolt_patch()` function](../../reference/sql/version-control/dolt-sql-functions#dolt_patch) to get the SQL we need to apply to our primary database.

First, we use [`call dolt_checkout()`](../../reference/sql/version-control/dolt-sql-procedures#dolt_checkout) to create a branch. Our revert changes will now be isolated from the replicating branch, `main`.

```sql
mysql> call dolt_checkout('-b', 'revert_bad_change');
+--------+
| status |
+--------+
|      0 |
+--------+
1 row in set (0.02 sec)
```

Then we revert the bad commit using [`call dolt_revert()`](../../reference/sql/version-control/dolt-sql-procedures#dolt_revert).

```sql
mysql> call dolt_revert('123d9jc85evssjcrv6u5mlt5dg4lk6ss');
+--------+
| status |
+--------+
|      0 |
+--------+
1 row in set (0.02 sec)

mysql> select * from dolt_diff('HEAD^', 'HEAD', 'salaries');
+-----------+-----------+--------------+------------+-----------+-------------------------+-------------+-------------+----------------+--------------+-------------+-------------------------+-----------+
| to_emp_no | to_salary | to_from_date | to_to_date | to_commit | to_commit_date          | from_emp_no | from_salary | from_from_date | from_to_date | from_commit | from_commit_date        | diff_type |
+-----------+-----------+--------------+------------+-----------+-------------------------+-------------+-------------+----------------+--------------+-------------+-------------------------+-----------+
|    203464 |     76541 | 1997-02-20   | 1998-02-20 | HEAD      | 2023-03-14 17:54:24.246 |      203464 |       76540 | 1997-02-20     | 1998-02-20   | HEAD^       | 2023-03-14 16:58:40.516 | modified  |
|    255639 |     48855 | 1994-12-12   | 1995-12-12 | HEAD      | 2023-03-14 17:54:24.246 |      255639 |       48854 | 1994-12-12     | 1995-12-12   | HEAD^       | 2023-03-14 16:58:40.516 | modified  |
|    291810 |     56425 | 1997-09-15   | 1998-09-15 | HEAD      | 2023-03-14 17:54:24.246 |      291810 |       56424 | 1997-09-15     | 1998-09-15   | HEAD^       | 2023-03-14 16:58:40.516 | modified  |
|    416268 |     47130 | 1996-02-03   | 1997-02-02 | HEAD      | 2023-03-14 17:54:24.246 |      416268 |       47129 | 1996-02-03     | 1997-02-02   | HEAD^       | 2023-03-14 16:58:40.516 | modified  |
|    441152 |     67239 | 1992-09-09   | 1993-08-27 | HEAD      | 2023-03-14 17:54:24.246 |      441152 |       67238 | 1992-09-09     | 1993-08-27   | HEAD^       | 2023-03-14 16:58:40.516 | modified  |
+-----------+-----------+--------------+------------+-----------+-------------------------+-------------+-------------+----------------+--------------+-------------+-------------------------+-----------+
5 rows in set (0.00 sec)
```

We use the `dolt_patch()` function to generate the sql we want to run on our primary.

```sql
mysql> call dolt_patch('HEAD^', 'HEAD');
ERROR 1105 (HY000): stored procedure "dolt_patch" does not exist
mysql> select * from dolt_patch('HEAD^', 'HEAD');
+-----------------+----------------------------------+----------------------------------+------------+-----------+------------------------------------------------------------------------------------------+
| statement_order | from_commit_hash                 | to_commit_hash                   | table_name | diff_type | statement                                                                                |
+-----------------+----------------------------------+----------------------------------+------------+-----------+------------------------------------------------------------------------------------------+
|               1 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2kakjoil0jvtl2bldd5rj83t9eeilvvm | salaries   | data      | UPDATE `salaries` SET `salary`=76541 WHERE `emp_no`=203464 AND `from_date`='1997-02-20'; |
|               2 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2kakjoil0jvtl2bldd5rj83t9eeilvvm | salaries   | data      | UPDATE `salaries` SET `salary`=48855 WHERE `emp_no`=255639 AND `from_date`='1994-12-12'; |
|               3 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2kakjoil0jvtl2bldd5rj83t9eeilvvm | salaries   | data      | UPDATE `salaries` SET `salary`=56425 WHERE `emp_no`=291810 AND `from_date`='1997-09-15'; |
|               4 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2kakjoil0jvtl2bldd5rj83t9eeilvvm | salaries   | data      | UPDATE `salaries` SET `salary`=47130 WHERE `emp_no`=416268 AND `from_date`='1996-02-03'; |
|               5 | 649fgvojpthn1e21bqrdlv3r3bht4rqb | 2kakjoil0jvtl2bldd5rj83t9eeilvvm | salaries   | data      | UPDATE `salaries` SET `salary`=67239 WHERE `emp_no`=441152 AND `from_date`='1992-09-09'; |
+-----------------+----------------------------------+----------------------------------+------------+-----------+------------------------------------------------------------------------------------------+
5 rows in set (0.00 sec)
```

Let's concatentate all those SQL statements together. Dolt [does not support the separator operator in `group_concat`](https://github.com/dolthub/dolt/issues/5570) just yet so we need to use `replace()`.

```sql
mysql> select replace(group_concat(statement), ',', '') from dolt_patch('HEAD^', 'HEAD');
+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| replace(group_concat(statement), ',', '')                                                                                                                                                                                                                                                                                                                                                                                                                |
+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| UPDATE `salaries` SET `salary`=76541 WHERE `emp_no`=203464 AND `from_date`='1997-02-20';UPDATE `salaries` SET `salary`=48855 WHERE `emp_no`=255639 AND `from_date`='1994-12-12';UPDATE `salaries` SET `salary`=56425 WHERE `emp_no`=291810 AND `from_date`='1997-09-15';UPDATE `salaries` SET `salary`=47130 WHERE `emp_no`=416268 AND `from_date`='1996-02-03';UPDATE `salaries` SET `salary`=67239 WHERE `emp_no`=441152 AND `from_date`='1992-09-09'; |
+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

We now have the SQL we need to run on the primary. Let's run it and make sure there is no diff between `main` and the `revert_bad_change` branch we're working on after it replicates. This is now in my primary mysql shell.

```sql
mysql> UPDATE `salaries` SET `salary`=76541 WHERE `emp_no`=203464 AND `from_date`='1997-02-20';UPDATE `salaries` SET `salary`=48855 WHERE `emp_no`=255639 AND `from_date`='1994-12-12';UPDATE `salaries` SET `salary`=56425 WHERE `emp_no`=291810 AND `from_date`='1997-09-15';UPDATE `salaries` SET `salary`=47130 WHERE `emp_no`=416268 AND `from_date`='1996-02-03';UPDATE `salaries` SET `salary`=67239 WHERE `emp_no`=441152 AND `from_date`='1992-09-09';
Query OK, 0 rows affected (0.00 sec)
Rows matched: 1  Changed: 0  Warnings: 0

Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0

Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

And back over on Dolt we should now see no difference between `main` and our branch `revert_bad_change`.

```sql
mysql> select * from dolt_diff('main', 'revert_bad_change', 'salaries');
Empty set (0.00 sec)
```

Phew, that was pretty awesome. I was able to find a bad change using my Dolt replica, generate a patch to revert it on my primary, apply the patch, and make sure everything was right with the world again. With a Dolt replica, you never have to worry about bad administrator queries again! 