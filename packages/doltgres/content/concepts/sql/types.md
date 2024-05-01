---
title: Types
---

# Types

## What are Types?

A column in a SQL database has a defined type, like an integer or a string. Some databases are more
strict on types than others. Postgres supports [a number of
types](https://www.postgresql.org/docs/current/datatype.html).

Types act as built in [constraints](./constraints.md) to help define the shape of your data. Are you
expecting this column to be an integer or will it sometimes have decimal values? Defining the type
explains to other database users the shape of the data you expected when you defined the table.

Moreover types act as a way to control the storage footprint of your database. A database must
procure the maximum size of the type you define for each row when it stores your data on disk or
memory.

## How to use Types

Each column in your tables must have a type. You use types when defining tables. You can change the
type of a column with `ALTER` statements.

When querying tables, the type of the column defines which functions can be used on the data
retrieved. To manipulate the type of a column when querying you use the `CONVERT()` function.

## Difference between MySQL Types and Doltgres Types

Doltgres supports [most Postgres
types](../../../reference/sql/sql-support/data-description.md#data-types), with more being
implemented.

## Interaction with Doltgres Version Control

A type change in Doltgres is versioned and can cause conflicts when merged. Doltgres can diff across
some type changes and will make a best effort to do so.

## Example

```sql
create table complex (pk1 int, pk2 varchar(47), c1 tinyint not null, c2 datetime, c3 json, primary key(pk1, pk2));
```
