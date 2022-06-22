---
title: Constraints
---

# Constraints

## What is a Constraint?

Constraints restrict the values allowed in a column. There are multiple forms of constraints: 

1. `NOT NULL` or `UNIQUE` in the column definition
2. Check constraints
3. Foreign Key constraints

Simple constraints like `NOT NULL` and `UNIQUE` can be added when defining a column. These constrain the column to not be NULL and only contain unique values, respectively.

Check constraints allow the database user to define more complex constraints, like ranges on numerical values. 

Foreign key constraints allow you to reference and define relations between other tables in your database. 

## How to use Constraints

Constraints add further definition to the shape of the data allowed in your database. Constraints programmatically enforce data quality rules as well as communicate to other database users what data to expect in the database.

You can add constraints when running `CREATE TABLE` statements or add them to existing tables using `ALTER` statements.

## Difference between MySQL Constraints and Dolt Constraints

MySQL and Dolt constraints are functionally equivalent.

## Interaction with Dolt Version Control

However, in Dolt, foreign key constraints can cause merged databases to become inconsistent. [Explain]

## Example


