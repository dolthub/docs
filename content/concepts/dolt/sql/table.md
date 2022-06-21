---
title: Table
---

# Table

## What is a Table?

Tables are the core unit of database [schema](./schema.md). Tables are defined by a set of columns. Columns can be [primary keys](./primary-key.md) which act as a unique identifier for each row. Once a table schema is defined, rows containing data can be inserted in to the table.

Table data is stored on disk. The way a database lays out it's table data on disk defines some of the performance characteristics of the database. 

## How to use Tables



## Difference between MySQL Table and Dolt Table


Dolt stores table data on disk using a content-addressed binary tree called a [prolly tree](../../../architecture/storage-engine/prolly-tree.md). Dolt is [row major](https://en.wikipedia.org/wiki/Row-_and_column-major_order), meaning row values are stored next to each other as best as possible. This setup makes Dolt [fairly comparable in query performance to MySQL](../../../reference/sql/benchmarks/latency.md) while also providing fast `diff` between versions. Fast `diff` powers Dolt's version control capabilities.

## Example