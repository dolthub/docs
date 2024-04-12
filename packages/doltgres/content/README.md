![](../.gitbook/assets/doltgres-preview.png)

DoltgreSQL is a Postgres-compatible version of Dolt. It is currently in pre-alpha release and has
many gaps that need to be addressed before being used in production.

Download the latest DoltgreSQL
[here](https://github.com/dolthub/doltgresql/releases/latest).

For instructions on how to install and run DoltgreSQL, checkout our [installation
guide](./installation.md).

## Differences from Dolt

For the most part, you can refer to the [documentation for the Dolt SQL
server](https://docs.dolthub.com/sql-reference/server) to understand how to run and use DoltgreSQL and its
features. Just connect with a Postgres-compatible client instead of a MySQL-compatible client.

Places where the two products differ in their operation are detailed in this section of the docs.

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

Refer to the docs for [version control features](https://docs.dolthub.com/sql-reference/version-control/dolt-sql-procedures) for
details on supported stored procedures and system tables.

## Doltgres is pre-alpha

Doltgres is still in very active development and many required features are missing. Check back
often for progress. You can also follow our [blog](https://www.dolthub.com/blog/) for updates, where
we publish DoltgreSQL blogs every few weeks.

Here are some of the DoltgreSQL blogs we've published so far:

- [Announcing DoltgreSQL](https://www.dolthub.com/blog/2023-11-01-announcing-doltgresql/)
- [Adding Types to DoltgreSQL](https://www.dolthub.com/blog/2024-02-14-adding-types-to-doltgresql/)
- [Writing a Postgres Logical Replication System in
  Golang](https://www.dolthub.com/blog/2024-03-08-postgres-logical-replication/)
