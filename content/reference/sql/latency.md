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

The Dolt version is `0.35.7`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 10.09 | 1.34 | 7.5 |
| groupby\_scan | 33.12 | 11.65 | 2.8 |
| index\_scan | 106.75 | 35.59 | 3.0 |
| oltp\_point\_select | 0.87 | 0.15 | 5.8 |
| oltp\_read\_only | 15.0 | 2.81 | 5.3 |
| select\_random\_points | 1.89 | 0.28 | 6.7 |
| select\_random\_ranges | 2.0 | 0.31 | 6.5 |
| table\_scan | 167.44 | 35.59 | 4.7 |
| mean |  |  | _5.3_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 1.12 | 0.14 | 8.0 |
| oltp\_insert | 7.7 | 2.61 | 3.0 |
| oltp\_read\_write | 39.65 | 6.55 | 6.1 |
| oltp\_update\_index | 9.22 | 2.71 | 3.4 |
| oltp\_update\_non\_index | 6.43 | 2.71 | 2.4 |
| oltp\_write\_only | 25.74 | 3.82 | 6.7 |
| mean |  |  | _4.4_ |

| Overall Mean Multiple | _4.9_ |
| :--- | :--- |
<br/>
