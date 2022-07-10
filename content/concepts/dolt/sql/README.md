---
title: A Full-featured SQL Database
---

Dolt is a full-featured SQL database, akin to [Postgres](https://www.postgresql.org/) or [MySQL](https://www.mysql.com/).

Dolt implements the MySQL SQL dialect. You connect to Dolt using a MySQL client. The goal is for Dolt to be a drop in replacement for MySQL.

Dolt has [databases](./databases.md) and [tables](./schema.md) as you'd expect. Dolt implements most MySQL [data types](./types.md). Dolt supports [secondary indexes](./indexes.md). Dolt supports [foreign key and check constraints](./constraints.md). Dolt supports [views](./views.md), [triggers](./triggers.md), and [procedures](./procedures.md). Dolt implements [users and grants](./users-grants.md) for permissions.

This section of the documentation will explain Dolt's flavor of these standard SQL concepts. Perhaps more importantly, this section will also explain how these concepts interact with Dolt's version control features.

Concepts will be tackled in the following order:

1. [Databases](./databases.md)
2. [Schema](./schema.md)
3. [Tables](./table.md)
4. [Primary Keys](./primary-key.md)
5. [Types](./types.md)
6. [Indexes](./indexes.md)
7. [Views](./views.md)
8. [Constraints](./views.md)
9. [Triggers](./triggers.md)
10. [Procedures](./procedures.md)
11. [Users/Grants](./users-grants.md)
12. [Transactions](./transaction.md)
13. [System Variables](./system-variables.md)
