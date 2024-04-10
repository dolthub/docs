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

Constraints extend the definition of the data allowed in your database. Constraints programmatically enforce data quality rules as well as communicate to other database users what data to expect in the database.

You can add constraints when running `CREATE TABLE` statements or add them to existing tables using `ALTER` statements.

## Difference between MySQL Constraints and Dolt Constraints

MySQL and Dolt constraints are functionally equivalent.

## Interaction with Dolt Version Control

Constraints can cause merge conflicts. If two different constraints on the same column are merged, it is a merge conflict.

Foreign key constraints can cause merged databases to become inconsistent. For instance, you have a foreign key relationship between two tables. On one branch, you add a reference to a parent value that exists. On the other branch you delete the parent value. This will be a valid merge but the parent value will no longer exist. 

Another case is foreign key constraints that trigger changes on other tables like `DELETE CASCADE` are not triggered on merge. Merges happen at the storage layer, not at the SQL layer. This can get your database into a invalid state. Merge reports this invalid state and you must resolve it before making a Dolt commit. 

## Example

```
mysql> create table employees (
    id int, 
    last_name varchar(100), 
    first_name varchar(100), 
    age int, 
    primary key(id), 
    constraint over_18 check (age >= 18));
mysql> show create table employees;
+-----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table     | Create Table                                                                                                                                                                                                                                              |
+-----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| employees | CREATE TABLE `employees` (
  `id` int NOT NULL,
  `last_name` varchar(100),
  `first_name` varchar(100),
  `age` int,
  PRIMARY KEY (`id`),
  CONSTRAINT `over_18` CHECK ((`age` >= 18))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin |
+-----------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
mysql> create table pay (id int, 
    salary int, 
    primary key(id), 
    foreign key (id) references employees(id));
mysql> show create table pay;
+-------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table | Create Table                                                                                                                                                                                                              |
+-------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| pay   | CREATE TABLE `pay` (
  `id` int NOT NULL,
  `salary` int,
  PRIMARY KEY (`id`),
  CONSTRAINT `kfkov1vc` FOREIGN KEY (`id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin |
+-------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

### Inconsistent state after merge

```
mysql> insert into employees values (0, 'Smith', 'Ella', 34), (1, 'Baker', 'Jack', 27);
mysql> insert into pay values (0, 50000);
mysql> call dolt_commit('-am', "Data for foreign key doc");
+----------------------------------+
| hash                             |
+----------------------------------+
| kgjb1tdbqt3vsn2e3nv06n5a6jdaqtk8 |
+----------------------------------+
mysql> call dolt_checkout('-b', 'delete-parent');
+--------+
| status |
+--------+
| 0      |
+--------+
mysql> delete from employees where id=1;
mysql> call dolt_commit('-am', "Deleted Jack Baker, id=1");
+----------------------------------+
| hash                             |
+----------------------------------+
| pd8r1j7or0aonincnc8iutsdjqnkmtsb |
+----------------------------------+
mysql> call dolt_checkout('main');
+--------+
| status |
+--------+
| 0      |
+--------+
mysql> insert into pay values (1, 48000);
mysql> call dolt_commit('-am', "Added salary for Jack Baker id=1");
+----------------------------------+
| hash                             |
+----------------------------------+
| 44h9p2k59o59rc1lcenkg4dghe052um0 |
+----------------------------------+
mysql> call dolt_merge('delete-parent');
Error 1105: Constraint violation from merge detected, cannot commit transaction. Constraint violations from a merge must be resolved using the dolt_constraint_violations table before committing a transaction. To commit transactions with constraint violations set @@dolt_force_transaction_commit=1
```