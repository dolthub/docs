# Procedures

## What is a Stored Procedure?

A stored procedure is SQL code that can be accessed using SQL `CALL` syntax. Much like a function in other programming languages, you can pass values into a stored procedures. Results are returned as a table.

Database users create procedures. Procedures are schema and are stored along with other schema elements in the database.

## How to use Stored Procedures

Stored Procedures are used to store code you want the database to execute when a user asks. In Dolt, we use built in stored procedures to allow users to do version control write operations, like create a commit.

## Difference between MySQL Stored Procedures and Dolt Stored Procedures

The goal is for Dolt stored procedures to match MySQL stored procedures exactly. As of now, Dolt triggers are missing some functionality, like the `DECLARE` statement. [Submit an issue](https://github.com/dolthub/dolt/issues) if you need more functionality.

## Interaction with Dolt Version Control

Procedures are versioned in the `dolt_procedures` table. You add and commit that table just like any other changed table after you create or modify a trigger.

## Example

```
mysql> CREATE PROCEDURE example(x INT) SELECT x + 1;
mysql> call example(1);
+---------+
| (x + 1) |
+---------+
| 2       |
+---------+
```

### `dolt_procedures` table

```
mysql> select * from dolt_status;
+-----------------+--------+----------+
| table_name      | staged | status   |
+-----------------+--------+----------+
| dolt_procedures | 0      | modified |
+-----------------+--------+----------+
mysql> select * from dolt_procedures;
+---------+----------------------------------------------+----------------------------+----------------------------+
| name    | create_stmt                                  | created_at                 | modified_at                |
+---------+----------------------------------------------+----------------------------+----------------------------+
| example | CREATE PROCEDURE example(x INT) SELECT x + 1 | 2022-06-24 18:21:44.125045 | 2022-06-24 18:21:44.125045 |
+---------+----------------------------------------------+----------------------------+----------------------------+
```
