---
title: Table
---

# Table

## What is a Table?

Tables are the core unit of database [schema](./schema.md). Tables are defined by a set of columns. Columns can be [primary keys](./primary-key.md) which act as a unique identifier for each row. Once a table schema is defined, rows containing data can be inserted in to the table.

Table data is stored on disk. The way a database lays out it's table data on disk defines some of the performance characteristics of the database. 

## How to use Tables

Structure the data you want to store and query in your database into tables. Define relationships between tables using foreign key [constraints](./constraints.md). Use `CREATE` statements to create tables and `ALTER` statements to change their definition.

## Difference between MySQL Table and Dolt Table

A MySQL and Dolt table are function the same on the surface. `CREATE` and `ALTER` statements work the same on both.

Dolt and MySQL are [row major](https://en.wikipedia.org/wiki/Row-_and_column-major_order), meaning row values are stored next to each other as best as possible. However, MySQL stores data in a binary tree structure while Dolt stores table data on disk using a content-addressed binary tree called a [prolly tree](../../../architecture/storage-engine/prolly-tree.md). This setup makes Dolt [fairly comparable in query performance to MySQL](../../../reference/sql/benchmarks/latency.md) while also providing fast `diff` between versions. Fast `diff` powers Dolt's version control capabilities.

## Example

```
mysql> show tables;
+----------------+
| Tables_in_docs |
+----------------+
| complex        |
| docs           |
+----------------+
mysql> alter table complex add column c4 blob;
mysql> show create table complex;
+---------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table   | Create Table                                                                                                                                                                                                                                  |
+---------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| complex | CREATE TABLE `complex` (
  `pk1` int NOT NULL,
  `pk2` varchar(47) NOT NULL,
  `c1` tinyint NOT NULL,
  `c2` datetime,
  `c3` json,
  `c4` blob,
  PRIMARY KEY (`pk1`,`pk2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin |
+---------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```