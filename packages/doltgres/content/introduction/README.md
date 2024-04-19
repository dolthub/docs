![](../.gitbook/assets/doltgres-preview.png)

DoltgreSQL, or Doltgres for short, is a Postgres-compatible version of [Dolt](https://www.doltdb.com). It is currently in [pre-alpha release](#doltgres-is-pre-alpha). 

Download the latest DoltgreSQL [here](https://github.com/dolthub/doltgresql/releases/latest).

For instructions on how to install and run DoltgreSQL, checkout our [installation guide](./installation.md).

## Differences from Dolt

Dolt and Doltgres share the same [storage engine](https://docs.dolthub.com/architecture/storage-engine) and implement the same version control interfaces in SQL. Only the SQL dialect/implementation is different. Thus, you can refer to the [documentation for the Dolt SQL server](https://docs.dolthub.com/sql-reference/server) to understand how to run and use DoltgreSQL and its features. Just connect with a Postgres-compatible client instead of a MySQL-compatible client.

So, what is different?

### Doltgres is pre-alpha

Dolt is 1.0 and production ready. Doltgres is still in very active development and many required features are missing. See [../ If you are a potential user and want a feature that is missing, please [create an issue]().

Check back often for progress. You can also follow our [blog](?q=doltgres) for updates, where
we publish DoltgreSQL blogs every week.

### Doltgres does not have a CLI

Unlike Dolt, DoltgreSQL does not implement version control features via the command line and must be
run as a server. For example, the Dolt CLI command to pull from a remote:

```
% dolt pull
```

Can only be accessed in DoltgreSQL through its corresponding [SQL stored
procedure](https://docs.dolthub.com/sql-reference/version-control/dolt-sql-procedures):

```bash
% doltgres &
% psql -h 127.0.0.1 -U doltgres -c "CALL DOLT_PULL()"
```

Refer to the docs for [version control features](https://docs.dolthub.com/sql-reference/version-control/dolt-sql-procedures) for details on supported stored procedures and system tables.