---
title: Latency
---

# Latency and Throughput

Our approach to SQL performance benchmarking is to use `sysbench`, an
industry standard benchmarking tool.

## Performance Roadmap

Dolt is slower than MySQL. The goal is to get Dolt to within 2-4 times
the speed of MySQL for common operations. If a query takes MySQL 1
second, we expect it to take Dolt 2-4 seconds. Or, if MySQL can run 8
queries in 10 seconds, then we want Dolt to run 2-4 queries in 10
seconds. The `multiple` column represents this relationship with
regard to a particular benchmark.

It's important recognize that these are industry standard tests, and
are OLTP oriented. Many Dolt use-cases are non-OLTP, and Dolt is fast
for bulk operations common in, for example, data pipeline contexts.

## Benchmark Data

Below are the results of running `sysbench` MySQL tests against Dolt
SQL Server for the most recent release of Dolt. We will update this
with every release. The tests attempt to run as many queries as
possible in a fixed 2 minute time window. The `Dolt` and `MySQL`
columns show the median latency of each query during that 2 minute
time window.

The Dolt version is `0.34.6`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 10.84 | 1.34 | 8.0 |
| index\_scan | 142.39 | 34.95 | 4.0 |
| oltp\_point\_select | 1.34 | 0.15 | 9.0 |
| oltp\_read\_only | 25.28 | 2.76 | 9.0 |
| select\_random\_points | 2.52 | 0.28 | 9.0 |
| select\_random\_ranges | 3.19 | 0.31 | 10.0 |
| table\_scan | 207.82 | 34.95 | 6.0 |
| mean |  |  | _7.9_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 1.96 | 0.14 | 14.0 |
| oltp\_insert | 8.13 | 3.19 | 3.0 |
| oltp\_read\_write | 51.02 | 6.67 | 8.0 |
| oltp\_update\_index | 9.56 | 2.81 | 3.0 |
| oltp\_update\_non\_index | 6.67 | 2.91 | 2.0 |
| oltp\_write\_only | 28.16 | 3.96 | 7.0 |
| mean |  |  | _5.4_ |

| Overall Mean Multiple | _6.7_ |
| :--- | :--- |
<br/>
