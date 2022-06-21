---
title: Databases
---

# Databases

## What is a Database?

A database is a container for a set of schema: [tables](./table.md), [views](./views.md), [triggers](./triggers.md), [procedures](./procedures.md), etc. In relational databases, queries within a database are optimized, while queries across multiple databases are not. 

A relational database management system or [RDBMS](../rdbms/README.md) allows you to access multiple databases from a single running server. Confusingly, "database" is also shorthand for RDBMS. Phrases like "Connect to this database" or "We run our database on AWS" refer to RDBMS, not the SQL concept of a schema container. 

## How to use Databases

Databases logically divide up your schema. Permissions can be applied to databases as a logical entity.

When you connect a client to a running server, you can see the databases being server using the `show databases` command. To use a specific database, you issue a `use <database>` statement. You can also specify the database in the connection string to connect to a particular database.

## Difference between MySQL Databases and Dolt Databases

In Dolt, databases act like they do in traditional SQL but have a couple additional properties.

First, in Dolt, each database has it's own commit graph. So, Dolt version control is limited to a single database. You cannot commit changes across multiple databases in a single commit. You cannot share a log across multiple databases. Branches cannot be made across databases.

Secondly, Dolt databases are the unit of sharing. Clone, push, pull, and fetch act on individual databases. Thus, to create a copy of multiple databases, you must clone from multiple remotes. 

## Example

```
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| docs               |
| information_schema |
+--------------------+
mysql> use docs;
mysql> show tables;
+----------------+
| Tables_in_docs |
+----------------+
| docs           |
+----------------+
```