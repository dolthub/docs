---
title: Performance
---

Our approach to performance benchmarking is to use `sysbench`, an industry standard benchmkarking tool.

### Performance Roadmap

Dolt is slower than MySQL. The goal is to get Dolt to within 2-4 times the speed of MySQL for common operations. If a query takes MySQL 1 second, we expect it to take Dolt 2-4 seconds. Or, if MySQL can run 8 queries in 10 seconds, then we want Dolt to run 2-4 queries in 10 seconds. The `multiple` column represents this relationship with regard to a particular benchmark.

It's important recognize that these are industry standard tests, and are OLTP oriented. Many Dolt use-cases are non-OLTP, and Dolt is fast for bulk operations common in, for example, data pipeline contexts.

### Benchmark Data

Below are the results of running `sysbench` MySQL tests against Dolt SQL Server for the most recent release of Dolt. We will update this with every release. The tests attempt to run as many queries as possible in a fixed 2 minute time window. The `Dolt` and `MySQL` columns show the median latency of each test during that 2 minute time window.

The Dolt version is `0.26.3`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 10.09 | 1.55 | 7.0 |
| index\_scan | 123.28 | 35.59 | 4.0 |
| oltp\_point\_select | 1.64 | 0.11 | 15.0 |
| oltp\_read\_only | 34.95 | 2.3 | 15.0 |
| select\_random\_points | 2.97 | 0.26 | 11.0 |
| select\_random\_ranges | 3.89 | 0.29 | 13.0 |
| table\_scan | 132.49 | 35.59 | 4.0 |
| mean |  |  | _9.86_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 10.84 | 0.11 | 99.0 |
| oltp\_insert | 13.46 | 2.66 | 5.0 |
| oltp\_read\_write | 77.19 | 5.99 | 13.0 |
| oltp\_update\_index | 15.27 | 2.57 | 6.0 |
| oltp\_update\_non\_index | 9.22 | 2.57 | 4.0 |
| oltp\_write\_only | 44.17 | 3.55 | 14.0 |
| mean |  |  | _20.29_ |

| Overall Mean Multiple | _15.07_ |
| :--- | :--- |
<br/>
