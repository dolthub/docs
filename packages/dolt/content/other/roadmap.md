---
title: Roadmap
---

# Roadmap

Full details on [supported SQL
features](../reference/sql/sql-support/README.md) are
available on the docs site.

This is a selection of unimplemented features we're working on. Don't
see what you need on here? [Let us
know!](https://github.com/dolthub/dolt/issues) Paying customers get
their feature requests implemented first.

Our next major goal is getting the Postgres version of Dolt, [Doltgres](https://www.doltgres.com/),
to a [production quality Beta
release](https://www.dolthub.com/blog/2024-08-06-doltgres-beta/). Doltgres Beta will ship in Q1
2025, with hosted deployment available.

Roadmap last updated Oct 2024, next update Jan 2025.

## Upcoming features

Work to improve the performance and availability of Dolt is a constant theme and not called out
explicitly unless it's a major separable effort.

### Dolt

| Feature                                                                                  | Estimate    |
|------------------------------------------------------------------------------------------|-------------|
| Vector support                                                                           | Q4 2024     |
| Virtual private cloud for Google Cloud in hosted deployments                             | Q4 2024     |
| Update multiple branches in a transaction                                                | 2025        |
| Row-level locking (`SELECT FOR UPDATE`)                                                  | 2025        |
| [Automatic garbage collection](https://github.com/dolthub/dolt/issues/1987)              | 2025        |
| [Transaction isolation levels](https://github.com/dolthub/dolt/issues/2007)              | 2025        |
| More function coverage                                                                   | Ongoing     |
| [Rebase schema conflict resolution support](https://github.com/dolthub/dolt/issues/7820) | Unscheduled |
| [Multiple DBs in one repo](https://github.com/dolthub/dolt/issues/3043)                  | Unscheduled |
| [Customized merge rules](https://github.com/dolthub/dolt/issues/7680)                    | Unscheduled |
| Images / video types                                                                     | Unscheduled |
| [History compression](https://github.com/dolthub/dolt/issues/5355)                       | Unscheduled |
| Embedded Dolt                                                                            | Unscheduled |
| Lock / unlock tables                                                                     | Unscheduled |
| Updateable views                                                                         | Unscheduled |
| Encryption at rest                                                                       | Unscheduled |
| Pipeline query processing                                                                | Unscheduled |
| [User-defined functions](https://github.com/dolthub/dolt/issues/6193)                    | Unscheduled |
| Better stored procedure support                                                          | Unscheduled |
| Other database frontends (e.g. Mongo, SQL Server)                                        | Unscheduled |

### Doltgres

Dolt and Doltgres share an engine, so most features on the Dolt roadmap also apply to Doltgres.

| Feature                           | Estimate |
|-----------------------------------|----------|
| User defined types                | Q4 2024  |
| User defined functions            | Q4 2024  |
| Users and auth                    | Q4 2024  |
| 50% most common function coverage | Q4 2024  |
| Hosted Doltgres                   | Q1 2025  |
| Doltges Beta release              | Q1 2025  |
| Stored procedures                 | Q1 2025  |

## Selection of recent feature launches

| Feature                                                                                                                  | Launch Date |
|--------------------------------------------------------------------------------------------------------------------------|-------------|
| [dolt fsck](https://www.dolthub.com/blog/2024-10-09-fsck-announce/)                                                      | Oct 2024    |
| [Doltgres support for workbench](https://www.dolthub.com/blog/2024-10-17-dolt-workbench-supports-doltgres/)              | Oct 2024    |
| [Data conflict resolution for dolt rebase](https://www.dolthub.com/blog/2024-09-05-rebase-conflict-resolution/)          | Sep 2024    |
| [Doltgres: COPY support](https://www.dolthub.com/blog/2024-09-17-tabular-data-imports/)                                  | Sep 2024    |
| Doltgres: 90% correctness                                                                                                | Sep 2024    |
| [Signed commits](https://www.dolthub.com/blog/2024-09-16-signed-commits/)                                                | Sep 2024    |
| [Improved JSON performance](https://www.dolthub.com/blog/2024-07-15-json-prolly-trees/)                                  | Jul 2024    |
| [Postgres function support](https://www.dolthub.com/blog/2024-07-30-re-introducing-dolt-functions/)                      | Jul 2024    |
| [Dolt to MySQL binlog replication](https://www.dolthub.com/blog/2024-07-05-binlog-source-preview/)                       | Jul 2024    |
| [pg_catalog support](https://www.dolthub.com/blog/2024-07-02-pg-catalog-update/)                                         | Jul 2024    |
| [Doltgres schema support](https://www.dolthub.com/blog/2024-05-07-understanding-postgres-schemas/)                       | May 2024    |
| [Storage archives](https://www.dolthub.com/blog/2024-04-29-dolt-storage-v2/)                                             | Apr 2024    |
| [Zstd dictionary compression](https://www.dolthub.com/blog/2024-04-22-dolt-storage-dictionaries/)                        | Apr 2024    |
| [Postgres to Doltgres replication](https://www.dolthub.com/blog/2024-04-23-announcing-postgres-to-doltgres-replication/) | Apr 2024    |
| [Doltgres prepared statements](https://www.dolthub.com/blog/2024-04-01-prepared-statements-postgres/)                    | Apr 2024    |
| [Automatic table statistics](https://www.dolthub.com/blog/2024-02-16-stats-refresh/)                                     | Mar 2024    |
| [Postgres type support](https://www.dolthub.com/blog/2024-02-14-adding-types-to-doltgresql/)                             | Feb 2024    |
| [100% sql correctness](https://www.dolthub.com/blog/2024-02-26-100-percent-correctness/)                                 | Feb 2024    |
| [Shallow clones](https://www.dolthub.com/blog/2024-02-21-shallow-clone/)                                                 | Feb 2024    |
| [Statistics in joins](https://www.dolthub.com/blog/2024-01-22-join-statistics/)                                          | Jan 2024    |
| [Automatic JSON column merge](https://www.dolthub.com/blog/2024-01-16-announcing-json-merge/)                            | Jan 2024    |
| [Rebase](https://www.dolthub.com/blog/2024-01-03-announcing-dolt-rebase/)                                                | Jan 2024    |
