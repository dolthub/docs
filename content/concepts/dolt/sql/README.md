---
title: A Full-featured SQL Database
---

Dolt is a full-featured SQL database, akin to [Postgres](https://www.postgresql.org/) or [MySQL](https://www.mysql.com/).

Dolt implements the MySQL SQL dialect. You connect to Dolt using a MySQL client. The goal is for Dolt to be a drop in replacement for MySQL.

Dolt has [databases](./databases.md) and [tables](./schema.md) as you'd expect. Dolt implements most MySQL [data types](./types.md). Dolt supports [secondary indexes](./indexes.md), [foreign key and check constraints](./constraints.md). Dolt supports [views](./views.md). Dolt implements standard [users and grants](./users-grants.md) for permissions.

This section of the documentation will explain Dolt's favor of these standard SQL concepts. Perhaps more importantly, this section will also explain how these concepts interact with Dolt's version control features.

Concepts will be tackled in the following order:

1. [Databases](concepts/dolt/sql/databases.md)
2. [Schema](concepts/dolt/sql/schema.md)
3. [Tables](concepts/dolt/sql/table.md)
4. [Primary Keys]((concepts/dolt/sql/primary-key.md))
3. [Types](concepts/dolt/sql/types.md)
4. [Indexes](concepts/dolt/sql/indexes.md)
5. [Views](concepts/dolt/sql/views.md)
6. [Constraints](concepts/dolt/sql/views.md)
7. [Triggers](concepts/dolt/sql/triggers.md)
8. [Procedures](concepts/dolt/sql/procedures.md)
9. [Users/Grants](concepts/dolt/sql/users-grants.md)
10. [Sessions](concepts/dolt/sql/session.md)
11. [Transactions](concepts/dolt/sql/transaction.md)