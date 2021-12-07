---
title: Vitess
---

# Vitess

Dolt's SQL server runs on [a fork of
Vitess](https://github.com/dolthub/vitess). Vitess is a MySQL database
sharding solution that was created to scale YouTube:

> Vitess is a database clustering system for horizontal scaling of
> MySQL through generalized sharding. Vitess has been a core
> component of YouTube's database infrastructure since 2011, and has
> grown to encompass tens of thousands of MySQL nodes.

In addition to implementing the MySQL server and wire protocol, Vitess
also provides the SQL parser for the database.

# Dolt's use of Vitess

Dolt's fork of Vitess has headed in a different direction from the
main project. In addition to adding support for DDL statements, stored
procedures, and triggers (never a priority of the Vitess project),
Dolt's fork prunes away the 90% of Vitess that isn't vital to Dolt's
current roadmap. You can read details about this work in [this blog
post](https://www.dolthub.com/blog/2020-09-23-vitess-pruning/).
