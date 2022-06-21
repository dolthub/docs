---
title: Primary Key
---

# Primary Key

## What is a Primary Key?

A primary key is a column or set of columns that defines a unique row in a table. Often the primary key is a unique identification or id number. In most databases, a map of primary keys to the values  of the other columns in the table are how the data is laid out on disk or memory. This makes row lookups by primary key indexed lookups. Indexed lookups can be accomplished in constant time (ie. O(1)). Thus, use of primary keys in table definition and queries is a common database performance optimization.

Tables without primary keys, or keyless tables, are implemented differently in databases. Usually, a keyless table is implemented as a map of every column in the table pointing to a counter of the number of rows with that value. When the counter goes to zero the index is deleted.

## How to use Primary Keys

You can add one or many primary keys to a table at creation time. Rows in the table cannot share the same primary key. Each set of primary keys must be unique. Also, primary keys must not be `NULL`. You can add primary keys to a table using `alter table <table> add primary key`. 

It is generally desirable for most tables in a database to have a primary key for performance reasons. Most database applications assign a primary key, usually called `id`, on row creation. Databases also support auto incrementing (ie. `AUTOINCREMENT`) ids and random ids using the `UUID()` function.

## Difference between MySQL Primary Keys and Dolt Primary Keys

MySQL and Dolt primary keys are functionally the same. You use the same syntax to define and alter them.

Additionally in Dolt, primary keys are used produce modifications between rows across versions. A keyless table in Dolt only shows additions and deletions. Tables with primary keys additionally show modifications to non-primary key columns. Thus, Dolt can produce cell-wise diffs and logs across versions for tables with primary keys.

## Example


