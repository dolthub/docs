---
title: Version Controlled Database
---

# Version Controlled Database

Dolt is a MySQL compatible database server. 

## Starting a server

To start a server you run `dolt sql-server`. This starts a server standard MySQL clients can connect to on port `3306`. Databases created by the server process are by default stored in the directory where `dolt sql-server` was run.

## Connect to the running server

### dolt sql-client

### mysql client

## Running SQL

Dolt will now respond to standard MySQL SQL. See [SQL Support](../../reference/sql-support/support.md) for more details. Dolt implements Git read operations as [system tables](../../reference/sql/dolt-system-tables.md) and Git write operations as [SQL functions](./../reference/sql/dolt-sql-functions.md).

## Creating a database

```sql
create database dolts;
```

## Inspect the log

```sql
select * from dolt_log;
```

## Create a table

```sql
create table dolts (last_name varchar(255), first_name varchar(255), title varchar(255), date_started date, primary key(last_name, first_name));
```

## Create a Dolt commit

```sql
select dolt_commit('-a', '-m', 'Created dolts table');
```

Note, `-a` was used to commit all modified tables in the working set.

## Insert data

```sql
insert into dolts values ('Sehn', 'Tim', 'CEO', '2018-08-06');
select dolt_commit('-a', '-m', 'Inserted Tim Sehn, CEO');
```

## Create a branch



## Insert more data



## View the diff



## Commit and Merge


## Next Steps

As you can see, Dolt is a fully compatible MySQL Server with additional Git-style version control functionality implemented as system tables and SQL functions. You can use Dolt in this mode to back applications and give those applications version control at the data layer. 

* Not sure yet