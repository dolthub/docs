---
title: Troubleshooting
---

Debugging a running Doltgres server can be challenging. This document covers the debugging basics and how to diagnose what is happening from common symptoms.

# Basics

## Make sure you are running the latest Doltgres version

Doltgres is constantly evolving. We release a new Doltgres approximately once a week. Connect to the SQL server and run `select dolt_version()`. Make sure the version matches the latest as seen on the [GitHub releases page](https://github.com/dolthub/doltgre/releases). 

To upgrade the server, download the latest Doltgres binary for your platform and replace the Doltgres binary on your `PATH` with the downloaded one. Running the install process on most platforms again will do this for you. Restart the Doltgres server using `dolt sql-server` to have your running server start using the latest binary.

## Examine your CPU, Memory, and Disk usage

Doltgres consumes CPU, Memory, and Disk. Consuming more of any of these resources than the host has available can lead to degraded performance. Use your system's built in resource monitoring systems to inspect Doltgres's usage of these resources. You may need a larger host or additional [read replicas](./replication.md) to support your load.

## Set your log level to DEBUG or TRACE

To see queries being run against the server, query results, and query latency set your Doltgres log level to `DEBUG` or `TRACE`. This can be done by starting the server like so `doltgres sql-server --loglevel=debug` or by setting `log_level: debug` in your `config.yaml`. Your logs should be visible in the shell you started `doltgres sql-server` in.

## Compare to Postgres

Doltgres strives to be 100% Postgres compatible. If you run a query that works in Postgres but does not work in Doltgres, it is a Doltgres bug and you should [submit an issue](#submitting-issues). You can dump your Doltgres database using the `pg_dump` tool and import the resulting file into Doltgres. Then test the query you think should work using any Postgres client.

# Submitting Issues

If you run into any issues requiring engineering attention, please submit a [GitHub Issue](https://github.com/dolthub/doltgresql/issues) to the Doltgres project. Please be as detailed as possible in your report. Note the schema of the database and query or queries that can be used to trigger the issue. If possible, push the database to a cloud remote and give us access.

# Problems

Doltgres operational issues usually manifest as slow SQL queries. In rare occasions, Doltgres may consume more of your system's resources than you expect. In these cases, this document has some recommendations.

## Server Consuming Disk

Doltgres creates disk garbage on write. This can sometimes become a substantial portion of the disk Doltgres is consuming. Doltgres ships with a garbage collection function. Running the garbage collection function can free disk.

To run garbage collection online, run [`call dolt_gc()`](../version-control/dolt-sql-procedures.md#dolt_gc). We are working on having this procedure run periodically in the background.

Disk garbage is especially pronounced after imports. We recommend concluding imports with a `call dolt_gc()` call.

Another potential cause is a commit-heavy workflow that uses a database design that is antagonistic to Doltgres's structural sharing. We've written thoroughly about this [here](https://www.dolthub.com/blog/2020-05-13-dolt-commit-graph-and-structural-sharing/), but some examples include

* Using primary keys with random values. Inserts into indexes with random values guarantees that edits will occur all throughout the index instead of being clustered around the same key space. This results in a rewrite of the prolly tree thereby increasing storage disproportionately to the delta of the changes.
* Adding a column to a table. A new column forks the storage of the table resulting in a loss of structural sharing. Doltgres is row major and builds chunks for each primary key, row values pair. The row values encodes the schema length so every row now requires a new chunk.

## Server Consuming Memory

Serving Doltgres databases requires a fair amount of memory. As a general rule, we recommend a minimum
of 2GB available RAM for any production use case. Larger databases or heavier workloads should start
at 4GB of RAM, and 8GB is common for our production customers. Your server's RAM requirements grow
with the size of the database being served, the number of concurrent connections, the size /
complexity of queries being executed, and other factors. These numbers can vary dramatically and are
only intended as first-step guidance on resource requirements. Your use case may require more or
less memory to run well, and you should load test to determine the correct ceiling.

A query may cause Doltgres to grow memory use unbounded and then eventually crash the server. If you
discover one such queries, please submit a [GitHub
Issue](https://github.com/dolthub/doltgresql/issues). Such queries should be rare but not impossible,
especially with complex queries containing multiple `JOIN`s.

Doltgres may not free memory efficiently. If your Doltgres server grows memory use unbounded over time and
then frees the memory upon restart, you have discoverd a memory leak. Again, please submit a [GitHub
issue](https://github.com/dolthub/doltgresql/issues). Memory leaks should be rare and we treat memory leak
fixes as high priority.

## Server Consuming CPU

Under too much concurrent load, Doltgres may consume all the CPU on a host. This is likely caused by too
much read concurrency. In this case, create more [read replicas](./replication.md) and load balance
your reads among your replicas.

If you discover a query consuming all of your CPU, please submit a [GitHub
Issue](https://github.com/dolthub/doltgresql/issues). On rare occasions, this could be a Doltgres bug.

## Too much write concurrency

Currently, Doltgres is not a high-throughput database for writes. The current transaction model
serializes all writes, which means that after a certain threshold of writer concurrency, you'll
observe increasing latency for write operations which becomes worse as more writers pile up. As of
this writing Doltgres can handle approximately 300 writes per second, but this number can be lower
depending on the size of the database, the size of the updates, replication settings, and other
factors.

Improving maximum write concurrency is an ongoing project.
