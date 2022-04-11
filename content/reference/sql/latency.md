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

The Dolt version is `0.38.0`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 7.7 | 1.86 | 4.1 |
| groupby\_scan | 33.12 | 11.87 | 2.8 |
| index\_scan | 86.0 | 36.24 | 2.4 |
| oltp\_point\_select | 0.84 | 0.15 | 5.6 |
| oltp\_read\_only | 12.08 | 2.91 | 4.2 |
| select\_random\_points | 1.67 | 0.28 | 6.0 |
| select\_random\_ranges | 1.79 | 0.34 | 5.3 |
| table\_scan | 84.47 | 36.24 | 2.3 |
| mean |  |  | _4.1_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 1.32 | 0.14 | 9.4 |
| oltp\_insert | 8.28 | 2.86 | 2.9 |
| oltp\_read\_write | 38.94 | 6.67 | 5.8 |
| oltp\_update\_index | 9.56 | 2.76 | 3.5 |
| oltp\_update\_non\_index | 6.79 | 2.76 | 2.5 |
| oltp\_write\_only | 26.68 | 3.82 | 7.0 |
| mean |  |  | _4.6_ |

| Overall Mean Multiple | _4.3_ |
| :--- | :--- |
<br/>
