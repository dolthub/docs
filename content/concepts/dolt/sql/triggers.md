---
title: Triggers
---

# Triggers

## What is a Trigger?

Triggers are SQL statements you can set to run every time a row is inserted, updated, or deleted from a particular table. Triggers receive the value of the row being inserted, updated, or deleted like a parameter, and can change it in some cases.

Database users create triggers. Triggers are schema. Triggers are stored along with other schema elements in the database.

## How to use Triggers

Triggers are a general tool, but they are most commonly used to enforce complex constraints that can't be expressed by foreign keys, nullness, types, or the `check` syntax. 

## Difference between MySQL Triggers and Dolt Triggers

The goal is for Dolt triggers to match MySQL triggers exactly. As of now, Dolt triggers are missing some functionality, like `IF/ELSE` syntax. [Submit an issue](https://github.com/dolthub/dolt/issues) if you need more functionality.

## Interaction with Dolt Version Control

Triggers are versioned in the `dolt_schemas` table just like [views](./views.md). You add and commit that table just like any other changed table after you create or modify a trigger.

## Example

```
mysql> create table a (x int primary key);
mysql> create table b (y int primary key);
mysql> create trigger adds_one before insert on a for each row set new.x = new.x + 1;
mysql> insert into a values (1), (3);
mysql> select * from a;
+---+
| x |
+---+
| 2 |
| 4 |
+---+
mysql> create trigger inserts_into_b after insert on a for each row insert into b values (new.x * 2);
mysql> insert into a values (5);
mysql> select * from a;
+---+
| x |
+---+
| 2 |
| 4 |
| 6 |
+---+
mysql> select * from b;
+----+
| y  |
+----+
| 12 |
+----+
```

### `dolt_schemas` table
```
mysql> select * from dolt_status;
+--------------+--------+-----------+
| table_name   | staged | status    |
+--------------+--------+-----------+
| dolt_schemas | 0      | new table |
| a            | 0      | new table |
| b            | 0      | new table |
+--------------+--------+-----------+
mysql> select * from dolt_schemas;
+---------+----------------+-----------------------------------------------------------------------------------------------+----+--------------------------------+
| type    | name           | fragment                                                                                      | id | extra                          |
+---------+----------------+-----------------------------------------------------------------------------------------------+----+--------------------------------+
| trigger | adds_one       | create trigger adds_one before insert on a for each row set new.x = new.x + 1                 | 1  | {"CreatedAt": 1.656093714e+09} |
| trigger | inserts_into_b | create trigger inserts_into_b after insert on a for each row insert into b values (new.x * 2) | 2  | {"CreatedAt": 1.656093749e+09} |
+---------+----------------+-----------------------------------------------------------------------------------------------+----+--------------------------------+
```