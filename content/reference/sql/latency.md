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

The Dolt version is `0.37.3`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 7.3 | 1.7 | 4.3 |
| groupby\_scan | 33.72 | 11.87 | 2.8 |
| index\_scan | 101.13 | 36.89 | 2.7 |
| oltp\_point\_select | 0.9 | 0.15 | 6.0 |
| oltp\_read\_only | 15.83 | 2.81 | 5.6 |
| select\_random\_points | 1.73 | 0.28 | 6.2 |
| select\_random\_ranges | 2.0 | 0.34 | 5.9 |
| table\_scan | 167.44 | 36.89 | 4.5 |
| mean |  |  | _4.8_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 1.27 | 0.14 | 9.1 |
| oltp\_insert | 8.13 | 2.48 | 3.3 |
| oltp\_read\_write | 41.85 | 6.43 | 6.5 |
| oltp\_update\_index | 9.56 | 2.43 | 3.9 |
| oltp\_update\_non\_index | 6.67 | 2.52 | 2.6 |
| oltp\_write\_only | 26.68 | 3.62 | 7.4 |
| mean |  |  | _4.8_ |

| Overall Mean Multiple | _4.8_ |
| :--- | :--- |
<br/>
