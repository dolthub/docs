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

The Dolt version is `0.35.5`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 10.27 | 1.37 | 7.5 |
| index\_scan | 106.75 | 34.95 | 3.1 |
| oltp\_point\_select | 0.83 | 0.14 | 5.9 |
| oltp\_read\_only | 14.73 | 2.71 | 5.4 |
| select\_random\_points | 1.96 | 0.28 | 7.0 |
| select\_random\_ranges | 2.11 | 0.31 | 6.8 |
| table\_scan | 167.44 | 34.95 | 4.8 |
| mean |  |  | _5.8_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 1.1 | 0.14 | 7.9 |
| oltp\_insert | 7.7 | 2.18 | 3.5 |
| oltp\_read\_write | 38.94 | 5.99 | 6.5 |
| oltp\_update\_index | 9.22 | 2.39 | 3.9 |
| oltp\_update\_non\_index | 6.32 | 2.61 | 2.4 |
| oltp\_write\_only | 25.28 | 3.43 | 7.4 |
| mean |  |  | _4.7_ |

| Overall Mean Multiple | _5.2_ |
| :--- | :--- |
<br/>
