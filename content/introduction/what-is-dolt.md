---
title: What is Dolt
---

## Version Controlled Database
Dolt is a version controlled relational database. Dolt implements a superset of MySQL. It is compatible with MySQL, and provides extra constructs exposing version control features. The version control features are closely modeled on Git.

### Offline
When Dolt is "offline", it looks very much like Git. Let's use `dolt clone` to acquire a database:
```
$ dolt clone dolthub/ip-to-country
cloning https://doltremoteapi.dolthub.com/dolthub/ip-to-country
32,832 of 32,832 chunks complete. 0 chunks being downloaded currently.
```

We now have acquired a database, and we can move into the newly created directory to give `dolt` the right database context:
```
$ cd ip-to-country
$ dolt sql
# Welcome to the DoltSQL shell.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
ip_to_country> show tables;
+---------------+
| Table         |
+---------------+
| IPv4ToCountry |
| IPv6ToCountry |
+---------------+
```

### Online
In the previous section we used Dolt's version control features, familiar from Git, to clone a remote database. In [Why Dolt](why-dolt.md) we identified the value of a familiar SQL query interface, served over a widely adopted wire protocol, MySQL.

We can now take the cloned Dolt database "online" by firing up the Dolt SQL Server:
```
dolt sql-server
Starting server with Config HP="localhost:3306"|U="root"|P=""|T="28800000"|R="false"|L="info"
```

We now have a running Dolt SQL Server that presents a superset of the MySQL dialect as its query interface.

## Everything in SQL
Where possible Dolt's version control features are exposed in SQL. That means users can script complex version control features into the SQL queries that define their data pipelines.

Let's dive into a couple of examples to see what this looks like in practice.

### AS OF

Add example

### DOLT_COMMIT

Add example

## Conclusion
Dolt is a version controlled SQL database. It implements the MySQL dialect augmented with additional features to expose Dolt's version control features. Dolt's version control features are inspired by Git, and the semantics should be familiar to Git users.
