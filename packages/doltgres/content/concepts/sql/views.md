---
title: Views
---

# Views

## What is a View?

Views look and act like tables, but the data in views is materialized on execution using a view
definition query that itself references concrete tables. The data is stored in the tables the views
reference not the view itself.

## How to use Views

Views allow you to derive tables using SQL instead of storing a copy of all the data you might want
to derive. As a simple example, in a table of employee's salaries, you may store yearly salary but
when using the table to calculate monthly salary, you use a view that divides the yearly salary by
12.

Note, accessing views is be slower than accessing a table itself because the database must compute
the values returned.

## Difference between Postgres Views and Doltgres Views

There is no difference between Postgres and Doltgres views. They are functionally equivalent.

## Interaction with Doltgres Version Control

Doltgres view definitions are versioned in the `dolt_schemas` system table. 

## Example

```sql
create table salaries (name varchar(255), salary int, primary key(name));
insert into salaries values ('Jim', 120000), ('Bob', 240000), ('Sally', 360000);
create view monthly_salaries as select name, salary/12 as monthly_pay from salaries; 
select * from monthly_salaries order by monthly_pay asc;
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
call dolt_add('-A');
call dolt_commit('-am', 'Created table and view');
+----------------------------------+
| hash                             |
+----------------------------------+
| trj7dm02r8c94nqpbphjgolhhsk37rkj |
+----------------------------------+
insert into salaries values ('Tim', 480000);
select * from monthly_salaries order by monthly_pay asc;
+-------+-------------+
| name  | monthly_pay |
+-------+-------------+
| Jim   | 10000       |
| Bob   | 20000       |
| Sally | 30000       |
| Tim   | 40000       |
+-------+-------------+
select * from monthly_salaries as of 'HEAD' order by monthly_pay asc;
+-------+-------------+
| name  | monthly_pay |
+-------+-------------+
| Jim   | 10000       |
| Bob   | 20000       |
| Sally | 30000       |
+-------+-------------+
```

