---
title: Types
---

# Types

## What are Types?

A column in a SQL database has a defined type, like an integer or a string. Some databases are more strict on types than others. MySQL supports [a number of types](https://dev.mysql.com/doc/refman/8.0/en/data-types.html).

Types act as built in [constraints](./constraints.md) to help define the shape of your data. Are you expecting this column to be an integer or will it sometimes have decimal values? Defining the type explains to other database users what you expected when you defined the table.

Moreover types act as a way to control the storage footprint of your database. A database must procure the maximum size of the type you define for each row when it stores your data on disk or memory.

## How to use Types

Each column in your tables must have a type. You use types when defining tables. You can change the type of a column with `ALTER` statements.

When querying tables, the type of the column defines which functions can be used on the data retrieved. To manipulate the type of a column when querying you use the `CAST()` function.

## Difference between MySQL Types and Dolt Types

Dolt supports [a subset of MYSQL types](../../../reference/sql/sql-support/data-description.md#data-types) but otherwise shares the same behavior.

## Interaction with Dolt Version Control

A type change in Dolt is versioned and can cause conflicts when merged. Dolt can diff across some type changes and will make a best effort to do so.

## Example
```
mysql> create table complex (pk1 int, pk2 varchar(47), c1 tinyint not null, c2 datetime, c3 json, primary key(pk1, pk2));
mysql> show create table complex;
+---------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table   | Create Table                                                                                                                                                                                                                     |
+---------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| complex | CREATE TABLE `complex` (
  `pk1` int NOT NULL,
  `pk2` varchar(47) NOT NULL,
  `c1` tinyint NOT NULL,
  `c2` datetime,
  `c3` json,
  PRIMARY KEY (`pk1`,`pk2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin |
+---------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```