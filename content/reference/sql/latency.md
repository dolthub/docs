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

The Dolt version is `0.39.0`.
<!-- START_LATENCY_RESULTS_TABLE -->
| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 7.43 | 1.7 | 4.4 |
| groupby\_scan | 33.53 | 11.87 | 2.7 |
| index\_scan | 87.56 | 36.24 | 2.4 |
| oltp\_point\_select | 0.86 | 0.15 | 5.7 |
| oltp\_read\_only | 12.08 | 2.91 | 4.2 |
| select\_random\_points | 1.67 | 0.29 | 5.8 |
| select\_random\_ranges | 1.76 | 0.34 | 5.2 |
| table\_scan | 84.47 | 36.24 | 2.3 |
| mean |  |  | _4.1_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 1.32 | 0.14 | 9.4 |
| oltp\_insert | 8.28 | 2.66 | 3.1 |
| oltp\_read\_write | 38.94 | 6.67 | 5.8 |
| oltp\_update\_index | 9.56 | 2.91 | 3.3 |
| oltp\_update\_non\_index | 6.79 | 2.97 | 2.3 |
| oltp\_write\_only | 26.68 | 3.75 | 7.1 |
| mean |  |  | _4.6_ |

| Overall Mean Multiple | _4.3_ |
| :--- | :--- |
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>
