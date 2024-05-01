---
title: SQL Clients
---

# SQL Clients

Doltgres ships with a built in Postgres compatible server. To start the server for your Doltgres
database, you run `doltgres`. The `doltgres` command starts a Postgres compatible server for the
Doltgres database on port 5432 with no authentication. The database name is the name of the
repository directory.

Once a server is running, any Postgres client should be able to connect to Doltgres SQL Server in
the exact same way it connects to a standard Postgres database. For instance, if you are running a
Doltgres sql-server locally, you can connect to it with the `psql` client like so:

```sql
PGPASSWORD=password psql -h 127.0.0.1 -U doltgres
psql (16.1 (Ubuntu 16.1-1.pgdg20.04+1), server 15.0)
Type "help" for help.

doltgres=>
```

We explicitly support the programmatic clients outlined in this document through integration
testing. Tests are run on GitHub pull requests to Doltgres in a Ubuntu environment in a Docker
container. If you would like another Postgres compatible client supported and tested, [please let us
know](https://www.dolthub.com/contact).

The test code linked to below is a good way to get started connecting to a Doltgres SQL server if
you are not familiar how to connect to Postgres in your language of choice. The code establishes a
connection, runs some simple queries, verifies the output comes back as expected, and closes the
connection.

## Supported clients

Doltgres client support and tests for compatibility are still being built out. If you have a
particular client you would like to see supported, please let us know by [filing an
issue](https://github.com/dolthub/doltgresql/issues).
