---
title: Views
---

# Views

## What is a View?

Views look and act like tables, but the data in views is materialized on execution using a view definition query that itself references concrete tables. The data is stored in the tables the views reference not the view itself.

## How to use Views

Views allow you to derive tables using SQL instead of storing a copy of all the data you might want to derive. As a simple example, in a table of employee's salaries, you may store yearly salary but when using the table to calculate monthly salary, you use a view that divides the yearly salary by 12.

Note, accessing views is be slower than accessing a table itself because the database must compute the values returned.

## Difference between MySQL Views and Dolt Views

There is no difference between MySQL and Dolt views. They are functionally equivalent.

## Interaction with Dolt Version Control

Dolt view definitions are versioned in the `dolt_schemas` system table. 

If you would like to use a current view with an different version of the data, `as of` syntax works with views. To use a past definition of the view, you must checkout a branch at the commit of the definition you would like to use.

## Example

```
mysql> create table salaries (name varchar(255), salary int, primary key(name));
mysql> insert into salaries values ('Jim', 120000), ('Bob', 240000), ('Sally', 360000);
mysql> create view monthly_salaries as select name, salary/12 as monthly_pay from salaries; 
mysql> select * from monthly_salaries order by monthly_pay asc;
+-------+-------------+
| name  | monthly_pay |
+-------+-------------+
| Jim   | 10000       |
| Bob   | 20000       |
| Sally | 30000       |
+-------+-------------+
```

### Using `as of` with Views
```
mysql> call dolt_commit('-am', 'Created table and view');
+----------------------------------+
| hash                             |
+----------------------------------+
| trj7dm02r8c94nqpbphjgolhhsk37rkj |
+----------------------------------+
mysql> insert into salaries values ('Tim', 480000);
mysql> select * from monthly_salaries order by monthly_pay asc;
+-------+-------------+
| name  | monthly_pay |
+-------+-------------+
| Jim   | 10000       |
| Bob   | 20000       |
| Sally | 30000       |
| Tim   | 40000       |
+-------+-------------+
mysql> select * from monthly_salaries as of 'HEAD' order by monthly_pay asc;
+-------+-------------+
| name  | monthly_pay |
+-------+-------------+
| Jim   | 10000       |
| Bob   | 20000       |
| Sally | 30000       |
+-------+-------------+
```

