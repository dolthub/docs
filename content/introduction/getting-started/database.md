---
title: Version Controlled Database
---

# Version Controlled Database

Dolt is a MySQL compatible database server. 

## Starting a server

To start a server you run `dolt sql-server`. This starts a server
standard MySQL clients can connect to on port `3306`. Databases
created by the server process are by default stored in the directory
where `dolt sql-server` was run.

## Connect to the running server

The Dolt server will talk to any tool that can connect to MySQL. Dolt
ships with a built-in shell, or you can use the standard `mysql`
command line client, or a GUI of your choice.

### dolt sql-client

`dolt sql-client` will start a SQL shell that finds the server running
on port 3306 and connects to it.

### mysql client

Download the mysql shell if you don't have it. On Linux use:

```bash
sudo apt-get install mysql-shell
```

Then connect. On Mac and Linux you will need to use the localhost IP
address to force a TCP connection (rather than using a socket).

```bash
% mysql --host 127.0.0.1 --port 3306 -uroot
```

## Running SQL

Any standard SQL statement that works in MySQL works in Dolt.

For version control features, Dolt implements Git read operations as
[system tables](../../reference/sql/dolt-system-tables.md) and Git
write operations as [SQL
functions](../../reference/sql/dolt-sql-functions.md). Follow along
below for a quick tutorial.

## Create a database

```sql
create database dolts;
```

## Create a table

```sql
use dolts;
create table employees (
    last_name varchar(255), 
    first_name varchar(255), 
    title varchar(255), 
    date_started date, 
    primary key(last_name, first_name)
);
```

Any SQL type supported by MySQL works in Dolt as well.

## Create a Dolt commit

To create a commit, use the `dolt_commit` function. This is equivalent
to running `dolt commit` on the command line, and accepts the same
arguments. All `dolt` commands work the same as their `git`
equivalents.

```sql
select dolt_commit('-a', '-m', 'Created employees table');
```

Note, `-a` was used to commit all modified tables in the working set.

## Insert data

```sql
insert into employees values ('Sehn', 'Tim', 'CEO', '2018-08-06');
select dolt_commit('-a', '-m', 'Inserted Tim Sehn, CEO');
```

## Create a branch and insert data on it

To create a branch, use the `dolt_checkout` function. This is
equivalent to running `dolt checkout` on the command line, and accepts
the same arguments.

```sql
select dolt_checkout('-b', 'founders');
insert into employees values ('Son', 'Aaron', 'Founder', '2018-08-06');
insert into employees values ('Hendriks', 'Brian', 'Founder', '2018-08-06');
```

## View the diff

On the command line, we would run `dolt diff`, which works the same as
`git diff`. From a SQL session, we select from the `dolt_diff` system
table. Each table in the database has a corresponding `dolt_diff`
table. The `employees` table we created above has a
`dolt_diff_employees` table.

```sql
dolts> select * from dolt_diff_employees where to_commit = 'WORKING';
+-------------------------------+--------------+----------+---------------+-----------+----------------+-------------------+----------------+------------+-----------------+----------------------------------+-----------------------------------+-----------+
| to_date_started               | to_last_name | to_title | to_first_name | to_commit | to_commit_date | from_date_started | from_last_name | from_title | from_first_name | from_commit                      | from_commit_date                  | diff_type |
+-------------------------------+--------------+----------+---------------+-----------+----------------+-------------------+----------------+------------+-----------------+----------------------------------+-----------------------------------+-----------+
| 2018-08-06 00:00:00 +0000 UTC | Hendriks     | Founder  | Brian         | WORKING   | NULL           | NULL              | NULL           | NULL       | NULL            | fv4s0mathd64slfb2jb22dqugbqrdmtb | 2021-12-07 01:00:31.821 +0000 UTC | added     |
| 2018-08-06 00:00:00 +0000 UTC | Son          | Founder  | Aaron         | WORKING   | NULL           | NULL              | NULL           | NULL       | NULL            | fv4s0mathd64slfb2jb22dqugbqrdmtb | 2021-12-07 01:00:31.821 +0000 UTC | added     |
+-------------------------------+--------------+----------+---------------+-----------+----------------+-------------------+----------------+------------+-----------------+----------------------------------+-----------------------------------+-----------+
```

## Merge the branch back to `main`

To merge a branch, use the `dolt_merge` function. This is equivalent
to running `dolt checkout` on the command line, and accepts the same
arguments. Only commits can be merged, so make sure to commit
everything in the working set before merging.

```sql
select dolt_commit('-a', '-m', 'Added founders');
select dolt_checkout('main');
select dolt_merge('founders');
```

## Inspect the log

```sql
select * from dolt_log;
+----------------------------------+---------------+------------------+-----------------------------------+----------------------------+
| commit_hash                      | committer     | email            | date                              | message
      |
+----------------------------------+---------------+------------------+-----------------------------------+----------------------------+
| m9gr4bdjkdctn66lbv75guju59g65me4 | Zach Musgrave | zach@dolthub.com | 2021-12-06 17:07:12.548 -0800 PST | Added founders             |
| fv4s0mathd64slfb2jb22dqugbqrdmtb | Zach Musgrave | zach@dolthub.com | 2021-12-06 17:00:31.821 -0800 PST | Inserted Tim Sehn, CEO     |
| q66dpld8ai67jo6pv0q2mirensqucf1b | Zach Musgrave | zach@dolthub.com | 2021-12-06 16:56:49.546 -0800 PST | Initialize data repository |
+----------------------------------+---------------+------------------+-----------------------------------+----------------------------+
```

## Next Steps

AS you can see, Dolt is a fully compatible MySQL Server with
additional Git-style version control functionality implemented as
system tables and SQL functions. You can use Dolt in this mode to back
applications and give those applications version control at the data
layer.

Keep reading the getting started guide to learn more, or jump straight
to advanced SQL topics:

* [Dolt SQL functions](../../refernce/sql/dolt-sql-functions.md)
* [Dolt system tables](../../reference/sql/dolt-system-tables.md)
* [Using branches](../../reference/sql/branches.md)



