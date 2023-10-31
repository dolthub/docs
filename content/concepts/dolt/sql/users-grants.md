---
title: Users/Grants
---

# Users/Grants

## What are Users and Grants?

Users and grants are SQL's permissions system. A database administrator creates users and grants them permissions to do certain actions, like read or write to tables.

## How to use Users and Grants

As an administrator user, you create users and roles using `CREATE USER` and `CREATE ROLE` statements. You grant permissions to users using `GRANT` statements. You can grant privileges to specific users but this is generally not advised. It is better to grant privileges to roles and then assign users roles using `GRANT` statements.

## Difference between MySQL Users & Grants and Dolt Users & Grants

The goal is for Dolt users and grants to match MySQL users and grants exactly. As of now, Dolt users and grants are missing some functionality, like column-level privileges and restricted access to stored procedures. [Submit an issue](https://github.com/dolthub/dolt/issues) if you need more functionality.

## Interaction with Dolt Version Control

The users and grants tables exist outside of Dolt in a separate database named `mysql`. We decided to implement users and grants this way to maintain MySQL compatibility. Thus, user and grant functionality is not versioned in Dolt.

Grants can only apply to traditional SQL access to Dolt tables as of now. Our roadmap includes adding grant functionality to version control operations. For instance, we think it is powerful to grant write permissions to a user on a specific branch.

## Example

### Create a user and grant permissions
```
$ dolt sql
# Welcome to the DoltSQL shell.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
dolt> CREATE USER testuser@localhost IDENTIFIED BY 'password123';
dolt> GRANT SELECT ON db_name.example TO testuser@localhost;
dolt> CREATE ROLE testrole;
dolt> GRANT SELECT, INSERT, UPDATE, DELETE on *.* TO testrole;
dolt> exit;
```

### Access data as a user
```
$ dolt --user="testuser" --password="password123" sql
# Welcome to the DoltSQL shell.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
dolt> USE db_name;
db_name> SELECT * FROM example;
+----+
| pk |
+----+
| 1  |
| 2  |
| 3  |
+----+
db_name> SELECT * FROM example2;
Error 1105: Access denied for user 'testuser'@'localhost' to table 'example2'
db_name> SELECT * FROM table_does_not_exist;
Error 1105: Access denied for user 'testuser'@'localhost' to table 'table_does_not_exist'
db_name> INSERT INTO example VALUES (4);
Error 1105: command denied to user 'testuser'@'localhost'
```
