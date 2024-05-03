---
title: Stored Procedures
---

# Stored Procedures

## What is a Stored Procedure?

A stored procedure is SQL code that can be accessed using SQL `CALL` syntax. Much like a function in
other programming languages, you can pass values into a stored procedures. Results are returned as a
table.

Database users create procedures. Procedures are schema and are stored along with other schema
elements in the database.

## Doltgres support for Stored Procedures

Doltgres comes with [many built-in stored procedures for version control
features](../../reference/sql/version-control/dolt-sql-procedures.md).

User created stored procedures are not yet supported.
