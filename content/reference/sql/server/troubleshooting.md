---
title: Troubleshooting
---

Debugging a running Dolt server can be challenging. This document covers the debugging basics and how to diagnose what is happening from common symptoms.

# Basics

## Make sure you are running the latest Dolt version

Dolt is constantly evolving. We release a new Dolt approximately once a week. Connect to the SQL server and run `select dolt_version()`. Make sure the version matches the latest as seen on the [GitHub releases page](https://github.com/dolthub/dolt/releases). 

To upgrade the server, download the latest Dolt binary for your platform and replace the Dolt binary on your `PATH` with the downloaded one. Running the install process on most platforms again will do this for you. Restart the Dolt server using `dolt sql-server` to have your running server start using the latest binary.

## Examine your CPU, Memory, and Disk usage

Dolt consumes CPU, Memory, and Disk. Consuming more of any of these resources than the host has available can lead to degraded performance. Use your system's built in resource monitoring systems to inspect Dolt's usage of these resources. You may need a larger host or additional [read replicas](./replication.md) to support your load.

## Set your log level to DEBUG or TRACE

To see queries being run against the server, query results, and query latency set your Dolt log level to `DEBUG` or `TRACE`. This can be done by starting the server like so `dolt sql-server --loglevel=debug` or by setting `log_level: debug` in your `config.yaml`. Your logs should be visible in the shell you started `dolt sql-server` in.

## EXPLAIN for complex queries

Dolt supports the SQL `EXPLAIN` operation in order for you to see the plan for complex queries. Rearranging your query to perform fewer `JOIN`s or make better use of indexes can help speed up complex queries.

## Compare to MySQL

Dolt strives to be 100% MySQL compatible. If you run a query that works in MySQL but does not work in Dolt, it is a Dolt bug and you should [submit an issue](#submitting-issues). You can dump your Dolt database using [`dolt dump`](../../cli.md#dolt-dump) and import the resulting file into MySQL using `mysql < dump.sql`. The test the query you think should work using any MySQL client.

# Submitting Issues

If you run into any issues requiring engineering attention, please submit a [GitHub Issue](https://github.com/dolthub/dolt/issues) to the Dolt project. Please be as detailed as possible in your report. Note the schema of the database and query or queries that can be used to trigger the issue.  If possible, push the database to [DoltHub](https://www.dolthub.com) so we can use a clone to reproduce the issue.

# Problems

Dolt operational issues usually manifest as slow SQL queries. In rare occasions, Dolt may consume more of your system's resources than you expect. In these cases, this document has some recommendations.

## Server Consuming Disk

Dolt creates disk garbage on write. This can sometimes become a substantial portion of the disk Dolt is consuming. Dolt ships with a garbage collection function. Running the garbage collection function can free disk.

To run garbage collection online, run [`call dolt_gc()`](../version-control/dolt-sql-procedures.md#dolt_gc). We are working on having this procedure run periodically in the background.

To run garbage collection offline, stop your `dolt sql-server`, navigate to the Dolt directory where your database is stored and run `dolt gc`. Once the operation is complete, restart your server using `dolt sql-server`. 

Disk garbage is especially pronounced after imports. We recommend concluding imports with a `dolt gc` call.

Another potential cause is a commit-heavy workflow that uses a database design that is antagonistic to Dolt's structural sharing. We've written thoroughly about this [here](https://www.dolthub.com/blog/2020-05-13-dolt-commit-graph-and-structural-sharing/), but some examples include

* Using primary keys with random values. Inserts into indexes with random values guarantees that edits will occur all throughout the index instead of being clustered around the same key space. This results in a rewrite of the prolly tree thereby increasing storage disproportionately to the delta of the changes.
* Adding a column to a table. A new column forks the storage of the table resulting in a loss of structural sharing. Dolt is row major and builds chunks for each primary key, row values pair. The row values encodes the schema length so every row now requires a new chunk.

## Server Consuming Memory

A Dolt server requires approximately 1% of the disk size of the database in memory at minimum. So, a 100GB database should have at least 1GB of RAM but preferably more. We recommend provisioning approximately 10% of the disk size of the database as memory.

A query may cause Dolt to grow memory use unbounded and then eventually crash the server. If you discover one such queries, please submit a [GitHub Issue](https://github.com/dolthub/dolt/issues). Such queries should be rare but not impossible, especially with complex queries containing multiple `JOIN`s.

Dolt may not free memory efficiently. If your Dolt server grows memory use unbounded over time and then frees the memory upon restart, you have discoverd a memory leak. Again, please submit a [GitHub issue](https://github.com/dolthub/dolt/issues). Memory leaks should be rare and we treat memory leak fixes as high priority.

## Server Consuming CPU

Under too much concurrent load, Dolt may consume all the CPU on a host. This is likely caused by too much read concurrency. In this case, create more [read replicas](./replication.md) and load balance your reads among your replicas.

If you discover a query consuming all of your CPU, please submit a [GitHub Issue](https://github.com/dolthub/dolt/issues). On rare occasions, this could be a Dolt bug.

## Too much write concurrency

Currently, Dolt is not a high throughput write database. Given the current transaction model, each transaction is treated as a `merge` and requires a global write lock to perform that merge. Dolt can easily become overwhelmed with too many writes. This is an issue we will be tackling in the back half of 2023 using row level locking and other common transactional database strategies.
