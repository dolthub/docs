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

The Dolt version is `0.35.4`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 10.46 | 1.34 | 7.8 |
| index\_scan | 106.75 | 35.59 | 3.0 |
| oltp\_point\_select | 1.08 | 0.15 | 7.2 |
| oltp\_read\_only | 18.61 | 2.86 | 6.5 |
| select\_random\_points | 2.22 | 0.29 | 7.7 |
| select\_random\_ranges | 2.35 | 0.31 | 7.6 |
| table\_scan | 176.73 | 35.59 | 5.0 |
| mean |  |  | _6.4_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 1.42 | 0.15 | 9.5 |
| oltp\_insert | 7.84 | 2.39 | 3.3 |
| oltp\_read\_write | 43.39 | 6.43 | 6.7 |
| oltp\_update\_index | 9.39 | 2.66 | 3.5 |
| oltp\_update\_non\_index | 6.67 | 2.76 | 2.4 |
| oltp\_write\_only | 26.68 | 3.55 | 7.5 |
| mean |  |  | _4.8_ |

| Overall Mean Multiple | _5.6_ |
| :--- | :--- |
<br/>
