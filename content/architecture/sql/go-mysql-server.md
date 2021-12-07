---
title: Go MySQL Server
---

# Go MySQL Server

[go-mysql-server](https://github.com/dolthub/go-mysql-server) is the
query engine for Dolt. It's a MySQL compatible parser, server, and
query execution engine written in pure Go. As with Dolt, its goal is
to be a 100% compatible drop-in replacement for MySQL.

[go-mysql-server](https://github.com/dolthub/go-mysql-server) is
storage engine agnostic, which means other projects can write their
own storage engine plugins to query them via a MySQL connection. There
are only two notable backend implementations so far:

* In-memory database. This ships with go-mysql-server and is useful
  for testing the engine, or for using in tests for golang projects
  that want a fast, local MySQL database.
  
* Dolt. In addition to the novel git-like storage engine, Dolt also
  adds a number of [system
  tables](../../reference/sql/dolt-system-tables.md), [custom
  functions](https://dolt.gitbook.io/dolt-dev/reference/sql/dolt-sql-functions),
  and new connection semantics.
  
# Project architecture

go-mysql-server defines a number of interfaces to allow integrators to
communicate about their database's capabilities, what tables exist,
what the schemas of tables are, and so on. Then another set of
interfaces let integrators iterate over their table rows, update them
with new values, delete them, and so on. For more information, see [the
project docs](https://github.com/dolthub/go-mysql-server#custom-data-source-implementation).

Broadly, the system has three main components:

1) **The parser and server**, which are mostly provided by
[Vitess](vitess.md). This component receives queries on the wire and
parses them into an AST.

2) **The query analyzer**, which repeatedly transforms the AST to
determine an optimal execution strategy, doing things like applying
indexes or ordering tables for a join.

3) **The execution engine**, which iterates over table rows provided
by integrators, evaluates expressions and functions, and produces the
ultimate result set.

For much more technical details on how these pieces function, refer to
the following blog articles:

* [Indexed joins](https://www.dolthub.com/blog/2020-02-14-implementing-indexed-joins/)
* [Implementing subqueries](https://www.dolthub.com/blog/2020-08-05-implementing-subqueries/)
* [Pushing down filters to make queries faster](https://www.dolthub.com/blog/2020-10-28-pushdown-filters/)
* [Planning joins to make use of indexes](https://www.dolthub.com/blog/2020-12-28-join-planning/)
* [Improvements in join planning](https://www.dolthub.com/blog/2021-03-17-recent-improvements-to-join-planning/)
* [Implementing window functions](https://www.dolthub.com/blog/2021-02-26-implementing-window-functions/)
* [Common table expressions](https://www.dolthub.com/blog/2021-03-24-common-table-expressions/)
* [Stored procedures](https://www.dolthub.com/blog/2021-03-10-introducing-stored-procedures/)
* [Triggers](https://www.dolthub.com/blog/2020-10-02-announcing-triggers/)
