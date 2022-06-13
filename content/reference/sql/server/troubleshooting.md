---
title: Troubleshooting
---

# Troubleshooting

Debugging a running Dolt server can be challenging. This document covers the debugging basics and how to diagnose what is happening from common symptoms.

# Basics

## Make sure you are running the latest Dolt version

Dolt is constantly evolving. We release a new Dolt approximately once a week. Connect to the SQL server and run `select dolt_version()`. Make sure the version matches the latest as seen on the [GitHub releases page](https://github.com/dolthub/dolt/releases). 

To upgrade the server, download the latest Dolt binary for your platform, replace the current Dolt binary with the current one, and restart the Dolt server using `dolt sql-server`.

## Examine your CPU, Memory, and Disk usage

Dolt consumes CPU, Memory, and Disk. Consuming more of any of these resources than the host has available can lead to degraded performance. Use your system's built in resource monitoring systems to inspect Dolt's usage of these resources. You may need a larger host or additional [read replicas](./replication.md) to support your load.

## Set your log level to TRACE

To see queries being run against the server, query results, and query latency set your Dolt log level to `DEBUG`. This can be done by starting the server like so `dolt sql-server --loglevel=DEBUG` or by setting `log_level: DEBUG` in your `config.yaml`.

## EXPLAIN for complex queries

Dolt supports the SQL `EXPLAIN` operation in order for you to see the plan for complex queries. Rearranging your query to perform fewer `JOIN`s or make better use of indexes can help speed up complex queries.

# Submitting Issues

If you run into any issues requiring engineering attention, please submit a [GitHub Issue](https://github.com/dolthub/dolt/issues) to the Dolt project. Please be as detailed as possible in your report. Note the schema of the database and query or queries that can be used to trigger the issue.  If possible, push the database to [DoltHub](https://www.dolthub.com) so we can use a clone to reproduce the issue.

# Problems

Dolt operational issues usually manifest as slow SQL queries. In rare occasions, Dolt may consume more of the your system's resources than you expect. In these cases, this document has some recommendations.

## Server Consuming Disk

Dolt creates disk garbage on write. This can sometimes become a substantial portion of the disk Dolt is consuming. Dolt ships with a garbage collection function. Running the garbage collection function can free disk.

To run garbage collection, you should first stop your running server. It is not a safe operation to run concurrently with server write operations. Once stopped, navigate to the Dolt directory where your database is stored and run `dolt gc`. Once the operation is complete, restart your server using `dolt sql-server`.

Online garbage collection is on the roadmap and we will be implementing it in the back half of 2022.

## Server Consuming Memory

A Dolt server requires approximately 1% of the disk size of the database in memory at minimum. So, a 100GB database should have at least 1GB of RAM but preferably more. We recommend provisioning approximately 10% of the disk size of the database as memory.

A query may cause Dolt to grow memory use unbounded and then eventually crash the server. If you discover one such queries, please submit a [GitHub Issue](https://github.com/dolthub/dolt/issues). Such queries should be rare but not impossible, especially with complex queries containing multiple `JOIN`s.

Dolt may not free memory efficiently. If your Dolt server grows memory use unbounded over time and then frees the memory upon restart, you have discoverd a memory leak. Again, please submit a [GitHub issue](https://github.com/dolthub/dolt/issues). Memory leaks should be rare and we treat memory leak fixes as high priority.

## Server Consuming CPU

Under too much concurrent load, Dolt may consume all the CPU on a host. This is likely caused by too much read concurrency. In this case, create more [read replicas](./replication.md) and load balance your reads among your replicas.

If you discover a query consuming all of your CPU, please submit a [GitHub Issue](https://github.com/dolthub/dolt/issues). On rare occasions, this could be a Dolt bug.

## Too much write concurrency

Currently, Dolt is not a high throughput write database. Given the current transaction model, each transaction is treated as a `merge` and requires a global write lock to perform that merge. Dolt can easily become overwhelmed with too many writes. This is an issue we will be tackling in the back half of 2022 using row level locking and other common transactional database strategies.