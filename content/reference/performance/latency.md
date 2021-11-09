---
title: SQL Latency and Throughput
---

Our approach to SQL performance benchmarking is to use `sysbench`, an
industry standard benchmarking tool.

### Performance Roadmap

Dolt is slower than MySQL. The goal is to get Dolt to within 2-4 times
the speed of MySQL for common operations. If a query takes MySQL 1
second, we expect it to take Dolt 2-4 seconds. Or, if MySQL can run 8
queries in 10 seconds, then we want Dolt to run 2-4 queries in 10
seconds. The `multiple` column represents this relationship with
regard to a particular benchmark.

It's important recognize that these are industry standard tests, and
are OLTP oriented. Many Dolt use-cases are non-OLTP, and Dolt is fast
for bulk operations common in, for example, data pipeline contexts.

### Benchmark Data

Below are the results of running `sysbench` MySQL tests against Dolt
SQL Server for the most recent release of Dolt. We will update this
with every release. The tests attempt to run as many queries as
possible in a fixed 2 minute time window. The `Dolt` and `MySQL`
columns show the median latency of each query during that 2 minute
time window.

The Dolt version is `0.33.1`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 10.46 | 1.34 | 8.0 |
| index\_scan | 144.97 | 35.59 | 4.0 |
| oltp\_point\_select | 2.26 | 0.15 | 15.0 |
| oltp\_read\_only | 33.72 | 2.76 | 12.0 |
| select\_random\_points | 3.3 | 0.28 | 12.0 |
| select\_random\_ranges | 4.25 | 0.31 | 14.0 |
| table\_scan | 155.8 | 36.24 | 4.0 |
| mean |  |  | _9.86_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 3.3 | 0.14 | 24.0 |
| oltp\_insert | 9.22 | 2.52 | 4.0 |
| oltp\_read\_write | 61.08 | 6.09 | 10.0 |
| oltp\_update\_index | 10.65 | 2.43 | 4.0 |
| oltp\_update\_non\_index | 7.7 | 2.57 | 3.0 |
| oltp\_write\_only | 30.81 | 3.68 | 8.0 |
| mean |  |  | _7.71_ |

| Overall Mean Multiple | _8.79_ |
| :--- | :--- |
<br/>
