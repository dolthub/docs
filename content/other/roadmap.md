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

Roadmap last updated Apr 2023, next update Jul 2023.

## Upcoming features

| Feature                                 | Estimate    |
| -------                                 | ---         |
| Better schema merging                   | Q2 2023     |
| dolt_ignore table                       | Q2 2023     |
| Collation regex support                 | Q2 2023     |
| Server / CLI compatibility              | Q2 2023     |
| 99.9% SQL correctness                   | 2023        |
| Row-level locking (`SELECT FOR UPDATE`) | 2023        |
| All transaction isolation levels        | 2023        |
| Full text indexes                       | 2023        |
| Postgres Support                        | Unscheduled |
| Virtual columns and json indexing       | Unscheduled |
| Multiple DBs in one repo                | Unscheduled |
| Embedded Dolt                           | Unscheduled |
| Signed commits                          | Unscheduled |
| Cross-database joins with indexes       | Unscheduled |
| Lock / unlock tables                    | Unscheduled |
| Updateable views                        | Unscheduled |
| Shallow clones                          | Unscheduled |
| Encryption at rest                      | Unscheduled |
| Rebase                                  | Unscheduled |
| Pipeline query processing               | Unscheduled |
| Automatic garbage collection            | Unscheduled |
| More function coverage                  | Ongoing     |

## Selection of recent feature launches

| Feature                                   | Launch Date |
| -------                                   | ---         |
| dolt_column_diff system table             | Apr 2023    |
| Clone from running database               | Apr 2023    |
| ACID transactions                         | Mar 2023    |
| dolt_patch() procedure                    | Mar 2023    |
| Spatial indexes                           | Mar 2023    |
| Complete information_schema support       | Feb 2023    |
| MySQL binlog replication                  | Feb 2023    |
| Additional join types                     | Feb 2023    |
| Online garbage collection                 | Jan 2022    |
| ACID transactions alpha                   | Dec 2022    |
| Hash join strategy                        | Dec 2022    |
| Better stored procedure support           | Dec 2022    |
| Branch protections                        | Nov 2022    |
| Hot standby replication                   | Nov 2022    |
| Prefix indexes for `TEXT` columns         | Oct 2022    |
| Socket file support                       | Sep 2022    |
| Collation and charset support             | Sep 2022    |
| `dolt_merge_status` system table          | Sep 2022    |
| New storage launch (3x speedup)           | Aug 2022    |
| Global auto_increment tracking            | Aug 2022    |
| Users, roles, and grants                  | Aug 2022    |
| `JSON_TABLE()`                            | Jul 2022    |
| Table / index statistics                  | Jul 2022    |
| `DESCRIBE` for views                      | Jun 2022    |
| `MOD()` function                          | Jun 2022    |
| Delete branches in running server         | Jun 2022    |
| Hosted Dolt v1                            | May 2022    |
| `dolt clean` command and stored procedure | May 2022    |
| `SELECT INTO` support                     | May 2022    |
| `XOR` operator                            | Apr 2022    |
| Unique constraints for keyless tables     | Apr 2022    |
| Stored procedures for `dolt` functions    | Apr 2022    |
