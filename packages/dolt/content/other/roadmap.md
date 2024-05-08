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

Roadmap last updated May 2024, next update July 2024.

## Upcoming features

| Feature                                                                           | Estimate    |
|-----------------------------------------------------------------------------------|-------------|
| Postgres function support                                                         | Q2 2024     |
| Improved JSON performance                                                         | Q2 2024     |
| Zstd dictionary compression                                                       | Q2 2024     |
| Doltgres 90% correctness                                                          | Q2 2024     |
| [Dolt to MySQL binlog replication](https://github.com/dolthub/dolt/issues/7512)   | Q2 2024     |
| [Automatic table statistics](https://github.com/dolthub/dolt/issues/6161)         | Q3 2024     |
| [Rebase conflict resolution support](https://github.com/dolthub/dolt/issues/7820) | Q3 2024     |
| Doltgres 99% correctness                                                          | Q3 2024     |
| [Customized merge rules](https://github.com/dolthub/dolt/issues/7680)             | Q3 2024     |
| Update multiple branches in a transaction                                         | 2024        |
| Row-level locking (`SELECT FOR UPDATE`)                                           | 2024        |
| [Transaction isolation levels](https://github.com/dolthub/dolt/issues/2007)       | 2024        |
| [Multiple DBs in one repo](https://github.com/dolthub/dolt/issues/3043)           | 2024        |
| More function coverage                                                            | Ongoing     |
| Images / video types                                                              | Unscheduled |
| [History compression](https://github.com/dolthub/dolt/issues/5355)                | Unscheduled |
| Embedded Dolt                                                                     | Unscheduled |
| [Signed commits](https://github.com/dolthub/dolt/issues/628)                      | Unscheduled |
| Lock / unlock tables                                                              | Unscheduled |
| Updateable views                                                                  | Unscheduled |
| Encryption at rest                                                                | Unscheduled |
| Pipeline query processing                                                         | Unscheduled |
| [Automatic garbage collection](https://github.com/dolthub/dolt/issues/1987)       | Unscheduled |
| [User-defined functions](https://github.com/dolthub/dolt/issues/6193)             | Unscheduled |
| Better stored procedure support                                                   | Unscheduled |

## Selection of recent feature launches

| Feature                                                                                                                  | Launch Date   |
|--------------------------------------------------------------------------------------------------------------------------|---------------|
| [Doltgres to Postgres replication](https://www.dolthub.com/blog/2024-04-23-announcing-postgres-to-doltgres-replication/) | Apr 2024      |
| [Doltgres prepared statements](https://www.dolthub.com/blog/2024-04-01-prepared-statements-postgres/)                    | Apr 2024      |
| [Postgres type support](https://www.dolthub.com/blog/2024-02-14-adding-types-to-doltgresql/)                             | Feb 2024      |
| [Shallow clones](https://www.dolthub.com/blog/2024-02-21-shallow-clone/)                                                 | Feb 2024      |
| [Statistics in joins](https://www.dolthub.com/blog/2024-01-22-join-statistics/)                                          | Jan 2024      |
| [Automatic JSON column merge](https://www.dolthub.com/blog/2024-01-16-announcing-json-merge/)                            | Jan 2024      |
| [Rebase](https://www.dolthub.com/blog/2024-01-03-announcing-dolt-rebase/)                                                | Jan 2024      |
| [Push to running SQL server](https://www.dolthub.com/blog/2023-12-29-sql-server-push-support/)                           | Dec 2023      |
| [Reflog](https://www.dolthub.com/blog/2023-11-17-dolt-reflog/)                                                           | Nov 2023      |
| [Virtual columns and json indexing](https://www.dolthub.com/blog/2023-11-03-virtual-columns/)                            | Nov 2023      |
| Postgres alpha                                                                                                           | Nov 2023      |
| Better table statistics support                                                                                          | Nov 2023      |
| 99.99% SQL correctness                                                                                                   | Oct 2023      |
| Event execution                                                                                                          | Oct 2023      |
| CLI profiles                                                                                                             | Sep 2023      |
| Hosted replication failover                                                                                              | Sep 2023      |
| Full text indexes                                                                                                        | Aug 2023      |
| Server / CLI compatibility                                                                                               | Jul 2023      |
| Cross-database joins with indexes                                                                                        | Jul 2023      |
| Hosted replication                                                                                                       | Jun 2023      |
| dolt_schema_diff table                                                                                                   | Jun 2023      |
| Better branch transaction support                                                                                        | Jun 2023      |
| Many new collations                                                                                                      | Jun 2023      |
| Collation regex support                                                                                                  | Jun 2023      |
| Better schema merging                                                                                                    | May 2023      |
| dolt_ignore table                                                                                                        | May 2023      |
| dolt show command                                                                                                        | May 2023      |
