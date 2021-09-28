---
title: SQL Latency and Throughput
---

Our approach to SQL performance benchmarking is to use `sysbench`, an
industry standard benchmkarking tool.

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

The Dolt version is `0.30.1`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 10.65 | 1.34 | 8.0 |
| index\_scan | 142.39 | 35.59 | 4.0 |
| oltp\_point\_select | 2.07 | 0.15 | 14.0 |
| oltp\_read\_only | 33.72 | 2.76 | 12.0 |
| select\_random\_points | 3.19 | 0.28 | 11.0 |
| select\_random\_ranges | 4.03 | 0.31 | 13.0 |
| table\_scan | 155.8 | 36.24 | 4.0 |
| mean |  |  | _9.43_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 3.13 | 0.14 | 22.0 |
| oltp\_insert | 8.9 | 2.81 | 3.0 |
| oltp\_read\_write | 59.99 | 6.43 | 9.0 |
| oltp\_update\_index | 10.09 | 2.91 | 3.0 |
| oltp\_update\_non\_index | 7.43 | 2.81 | 3.0 |
| oltp\_write\_only | 29.72 | 3.89 | 8.0 |
| mean |  |  | _7.0_ |

| Overall Mean Multiple | _8.21_ |
| :--- | :--- |
<br/>
