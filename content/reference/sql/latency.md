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

The Dolt version is `0.36.0`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 10.46 | 1.37 | 7.6 |
| groupby\_scan | 33.72 | 12.08 | 2.8 |
| index\_scan | 108.68 | 36.24 | 3.0 |
| oltp\_point\_select | 0.87 | 0.15 | 5.8 |
| oltp\_read\_only | 15.55 | 2.86 | 5.4 |
| select\_random\_points | 2.03 | 0.29 | 7.0 |
| select\_random\_ranges | 2.18 | 0.32 | 6.8 |
| table\_scan | 167.44 | 36.24 | 4.6 |
| mean |  |  | _5.4_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 1.18 | 0.15 | 7.9 |
| oltp\_insert | 7.98 | 2.35 | 3.4 |
| oltp\_read\_write | 40.37 | 6.32 | 6.4 |
| oltp\_update\_index | 9.39 | 2.48 | 3.8 |
| oltp\_update\_non\_index | 6.55 | 2.61 | 2.5 |
| oltp\_write\_only | 26.2 | 3.62 | 7.2 |
| mean |  |  | _4.6_ |

| Overall Mean Multiple | _5.0_ |
| :--- | :--- |
<br/>
