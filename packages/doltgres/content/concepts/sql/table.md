---
title: Table
---

# Table

## What is a Table?

Tables are the core unit of database [schema](./schema.md). Tables are defined by a set of
columns. Columns can be [primary keys](./primary-key.md) which act as a unique identifier for each
row. Once a table schema is defined, rows containing data can be inserted into the table.

Table data is stored on disk. The way a database lays out it's table data on disk defines some of
the performance characteristics of the database.

## How to use Tables

Structure the data in your database into tables. Define relationships between tables using foreign
key [constraints](./constraints.md). Use `CREATE` statements to create tables and `ALTER` statements
to change their schema.

## Difference between Postgres Table and Doltgres Table

A Postgres and Dolt table function the same on the surface. `CREATE` and `ALTER` statements work the
same on both.

Dolt and Postgres are [row major](https://en.wikipedia.org/wiki/Row-_and_column-major_order),
meaning row values are stored next to each other. However, MySQL stores data in a binary tree
structure while Dolt stores table data on disk using a content-addressed binary tree called a
[prolly tree](../../architecture/storage-engine/prolly-tree.md). This setup makes Dolt [fairly
comparable in query performance to MySQL](../../reference/sql/benchmarks/latency.md) while also
providing history-independence and fast `diff` between versions. Fast `diff` powers Dolt's version
control capabilities.

## Interaction with Dolt Version Control

Dolt versions table schema and data. A table in Dolt is akin to a file in Git, it is the unit of
change. Tables are the target of `call dolt_add()`.

## Example

```SQL
doltgres=> \dt
        List of relations
 Schema | Name | Type  |  Owner
--------+------+-------+----------
 public | t1   | table | postgres
(1 row)
```
