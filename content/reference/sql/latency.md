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
columns show the median latency in milliseconds (ms) of each query 
during that 2 minute time window.

The Dolt version is `0.37.8`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 7.84 | 1.73 | 4.5 |
| groupby\_scan | 34.33 | 11.87 | 2.9 |
| index\_scan | 87.56 | 36.24 | 2.4 |
| oltp\_point\_select | 0.94 | 0.15 | 6.3 |
| oltp\_read\_only | 13.7 | 2.86 | 4.8 |
| select\_random\_points | 1.82 | 0.28 | 6.5 |
| select\_random\_ranges | 2.18 | 0.34 | 6.4 |
| table\_scan | 84.47 | 36.24 | 2.3 |
| mean |  |  | _4.5_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 1.42 | 0.14 | 10.1 |
| oltp\_insert | 8.43 | 2.52 | 3.3 |
| oltp\_read\_write | 41.85 | 6.55 | 6.4 |
| oltp\_update\_index | 9.91 | 2.61 | 3.8 |
| oltp\_update\_non\_index | 6.91 | 2.71 | 2.5 |
| oltp\_write\_only | 28.16 | 3.75 | 7.5 |
| mean |  |  | _4.9_ |

| Overall Mean Multiple | _4.7_ |
| :--- | :--- |
<br/>
