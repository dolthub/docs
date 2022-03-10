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

The Dolt version is `0.37.4`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 7.3 | 1.76 | 4.1 |
| groupby\_scan | 33.53 | 11.87 | 2.7 |
| index\_scan | 84.47 | 35.59 | 2.4 |
| oltp\_point\_select | 0.92 | 0.15 | 6.1 |
| oltp\_read\_only | 16.12 | 2.81 | 5.7 |
| select\_random\_points | 1.73 | 0.29 | 6.0 |
| select\_random\_ranges | 2.03 | 0.34 | 6.0 |
| table\_scan | 82.96 | 35.59 | 2.3 |
| mean |  |  | _4.4_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 1.27 | 0.15 | 8.5 |
| oltp\_insert | 8.13 | 2.86 | 2.8 |
| oltp\_read\_write | 41.85 | 7.04 | 5.9 |
| oltp\_update\_index | 9.56 | 3.3 | 2.9 |
| oltp\_update\_non\_index | 6.67 | 3.25 | 2.1 |
| oltp\_write\_only | 26.68 | 4.33 | 6.2 |
| mean |  |  | _4.2_ |

| Overall Mean Multiple | _4.3_ |
| :--- | :--- |
<br/>
