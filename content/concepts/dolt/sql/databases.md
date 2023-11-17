---
title: Databases
---

# Databases

## What is a Database?

A database is a container for a set of schema: [tables](./table.md), [views](./views.md), [triggers](./triggers.md), [procedures](./procedures.md), etc. In relational databases, queries within a database are optimized, while queries across multiple databases are not. 

A relational database management system or [RDBMS](../rdbms/README.md) allows you to access multiple databases from a single running [server](../rdbms/server.md). Confusingly, "database" is also shorthand for RDBMS. Phrases like "Connect to this database" or "We run our database on AWS" refer to RDBMS, not the SQL concept of a schema container. 

## How to use Databases

Databases logically divide up your schema. Permissions can be applied to databases as a logical entity.

When you connect a client to a running server, you can see the databases being served using the `show databases` command. To use a specific database, you issue a `use <database>` statement. You can also specify the database in the connection string to connect to a particular database.

## Difference between MySQL Databases and Dolt Databases

In Dolt, databases act like they do in MySQL.

## Interaction with Dolt Version Control

In Dolt, each database has its own commit graph. So, Dolt version control is limited to a single database. You cannot commit changes across multiple databases in a single commit. You cannot share a log across multiple databases. Branches cannot be made across databases.

Dolt databases are the unit of sharing. Clone, push, pull, and fetch act on individual databases. Thus, to create a copy of multiple databases, you must clone from multiple remotes. 

The only SQL statement not versioned in Dolt is `DROP DATABASE`. This statement deletes the Dolt database on disk, removing the database and all of its history. `DROP DATABASE` works this way for SQL tool compatibility as it is common for import tools to issue a drop database to clear all database state before an import. Dolt implements [remotes](../git/remotes.md) like in Git so you can maintain an offline copy for backup using clone, fetch, push, and pull. Maintaining a remote copy allows you to restore in the case of an errant `DROP DATABASE` query.

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

## Note

Previous to Dolt 1.27.0, Dolt replaced hyphens in database names (e.g. database directories containing hyphens) with underscores. Dolt now allows databases to be named with hyphens. If you need the old behavior for compatibility, you can set the `DOLT_DBNAME_REPLACE_HYPHENS` environment variable to any value.
