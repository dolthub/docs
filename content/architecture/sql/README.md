# SQL

Dolt's SQL engine is built as a layer on top of its storage engine. This allows us to implement non-SQL operations, such as the CLI commands, directly against the storage layer. It also leaves the door open to build additional database dialects on top of Dolt in the future.

The SQL engine is implemented by three different open source projects, listed below.

## vitess

[vitess](https://github.com/dolthub/vitess) is a MySQL sharding management system. It implements the MySQL parser and the MySQL server, including the wire protocol.

[Read more about the vitess project and how it's used in Dolt.](vitess.md)

## go-mysql-server

[go-mysql-server](https://github.com/dolthub/go-mysql-server) is a storage agnostic SQL query engine written in pure Go. It implements a query analyzer and execution engine, and defines interfaces for storage backend integrators (like Dolt) to implement.

[Read more about the go-mysql-server project and how it's used in Dolt.](go-mysql-server.md)

## Dolt

The Dolt project itself implements the interfaces defined in [go-mysql-server](https://github.com/dolthub/go-mysql-server) to make the Dolt storage engine available for reads and writes in a SQL context. It also implements many System variables and custom SQL functions.

Dolt is responsible for the various interfaces to start, stop, configure and manage SQL servers.
