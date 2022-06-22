---
title: Schema
---

# Schema

## What is a Schema?

Schema defines the shape of the data in your database. 

[Tables](./table.md) are the core unit of schema. Tables have columns and rows. Each column in a table has a [type](./types.md). A table can have one or many [primary keys](./primary-key.md), the combination of which identify the row and must be unique. Columns can also be assigned additional [constraints](./constraints.md), including foreign key constraints which are references to other tables in the database. 

Schema also includes [views](./views.md). Views look like tables but the data in them is generated using SQL stored in the view definition. The data is stored in the tables the views reference not the view itself.

[Indexes](./indexes.md) are a part of schema. An index allows read query performance to be improved at the expense of write performance and increased storage. 

Finally, schema includes [triggers](./triggers.md) and [procedures](./procedures.md). Triggers and procedures are code stored in your database that executes when a user asks or on specific conditions.

## How to use Schema

Schema is the core of database design. You use schema to explain to database users the shape of the data in the database. What values are allowed in this column? What data is allowed to be duplicated in multiple rows? Can a value exist in this table without existing in this other table as well? 

Schema design also effects the performance of queries against the database. Defining primary keys and indexes correctly can make your database perform for large databases or complex queries.

Changing schema can be a costly operation. For instance, adding an index to a column on a running database requires scanning the entire table and writing a new index artifact, usually while also restricting writes to that table. 

## Difference between MySQL Schema and Dolt Schema

Dolt supports [all MySQL schema elements at least partially](../../../reference/sql/sql-support/data-description.md) except charsets and collations.

## Interaction with Dolt Version Control

Dolt versions your schema and data. So, if you want to see the difference between the schema of two different versions, Dolt provides this using `diff` functionality. See individual SQL concepts for how Dolt handles each individual schema element with regards to versioning.

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