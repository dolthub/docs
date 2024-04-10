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

Roadmap last updated Jan 2024, next update Mar 2024.

## Upcoming features

| Feature                                   | Estimate    |
| -------                                   | ---         |
| Multiple DBs in one repo                  | Q1 2024     |
| Statistics in joins                       | Q1 2024     |
| DoltgreSQL prepared statements            | Q1 2024     |
| DoltgreSQL 90% correctness                | Q1 2024     |
| Postgres type support                     | Q1 2024     |
| Postgres function support                 | Q1 2024     |
| DoltgreSQL 99% correctness                | Q2 2024     |
| Update multiple branches in a transaction | 2024        |
| Row-level locking (`SELECT FOR UPDATE`)   | 2024        |
| Transaction isolation levels              | 2024        |
| Images / video types                      | Unscheduled |
| History compression                       | Unscheduled |
| Dolt to MySQL binlog replication          | Unscheduled |
| Embedded Dolt                             | Unscheduled |
| Signed commits                            | Unscheduled |
| Lock / unlock tables                      | Unscheduled |
| Updateable views                          | Unscheduled |
| Shallow clones                            | Unscheduled |
| Encryption at rest                        | Unscheduled |
| Pipeline query processing                 | Unscheduled |
| Automatic garbage collection              | Unscheduled |
| User-defined functions                    | Unscheduled |
| Better stored procedure support           | Unscheduled |
| More function coverage                    | Ongoing     |

## Selection of recent feature launches

| Feature                             | Launch Date |
| -------                             | ---         |
| Automatic JSON column merge         | Jan 2024    |
| Rebase                              | Jan 2024    |
| Push to running SQL server          | Dec 2023    |
| reflog                              | Nov 2023    |
| Virtual columns and json indexing   | Nov 2023    |
| Postgres alpha                      | Nov 2023    |
| Better table statistics support     | Nov 2023    |
| 99.99% SQL correctness              | Oct 2023    |
| Event execution                     | Oct 2023    |
| CLI profiles                        | Sep 2023    |
| Hosted replication failover         | Sep 2023    |
| Full text indexes                   | Aug 2023    |
| Server / CLI compatibility          | Jul 2023    |
| Cross-database joins with indexes   | Jul 2023    |
| Hosted replication                  | Jun 2023    |
| dolt_schema_diff table              | Jun 2023    |
| Better branch transaction support   | Jun 2023    |
| Many new collations                 | Jun 2023    |
| Collation regex support             | Jun 2023    |
| Better schema merging               | May 2023    |
| dolt_ignore table                   | May 2023    |
| dolt show command                   | May 2023    |
| Cluster replication                 | Apr 2023    |
| dolt_column_diff system table       | Apr 2023    |
| Clone from running database         | Apr 2023    |
| Event definitions                   | Apr 2023    |
| ACID transactions                   | Mar 2023    |
| dolt_patch() procedure              | Mar 2023    |
| Spatial indexes                     | Mar 2023    |
| Complete information_schema support | Feb 2023    |
| MySQL binlog replication            | Feb 2023    |
| Additional join types               | Feb 2023    |
