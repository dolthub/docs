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

Roadmap last updated Oct 2022, next update Jan 2023.

## Upcoming features

| Feature                                 | Estimate    |
| -------                                 | ---         |
| 99.9% SQL correctness                   | Q4 2022     |
| Hash join strategy                      | Q4 2022     |
| Universal SQL path for CLI              | Q4 2022     |
| Hot standby replication                 | Q4 2022     |
| Clone from running database             | Q4 2022     |
| Row-level locking (`SELECT FOR UPDATE`) | 2023        |
| All transaction isolation levels        | 2023        |
| Full text indexes                       | 2023        |
| Spatial indexes                         | 2023        |
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

## Recently launched major features

| Feature                                   | Launch Date |
| -------                                   | ---         |
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
| New storage alpha                         | Mar 2022    |
| Better `dolt_diff` table experience       | Mar 2022    |
| Geometry types and functions              | Feb 2022    |
| Users / grants                            | Feb 2022    |
| `dolt dump` command                       | Jan 2022    |
| DoltLab (on-prem DoltHub)                 | Jan 2022    |
| `RANGE` window definitions                | Jan 2022    |
| `ROWS` window definitions                 | Jan 2022    |
| Hosted Dolt Alpha                         | Jan 2022    |
| CREATE / DROP DATABASE                    | Dec 2021    |
| Persistent SQL configuration              | Dec 2021    |
| Commit graph performance                  | Nov 2021    |
| Backup and replication                    | Nov 2021    |
| Join for update                           | Oct 2021    |

