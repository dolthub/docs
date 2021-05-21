---
title: Performance
---

Our approach to performance benchmarking is to use `sysbench`, an industry standard benchmkarking tool.

### Performance Roadmap

Dolt is slower than MySQL. The goal is to get Dolt to within 2-4 times the speed of MySQL for common operations. If a query takes MySQL 1 second, we expect it to take Dolt 2-4 seconds. Or, if MySQL can run 8 queries in 10 seconds, then we want Dolt to run 2-4 queries in 10 seconds. The `multiple` column represents this relationship with regard to a particular benchmark.

It's important recognize that these are industry standard tests, and are OLTP oriented. Many Dolt use-cases are non-OLTP, and Dolt is fast for bulk operations common in, for example, data pipeline contexts.

### Benchmark Data

Below are the results of running `sysbench` MySQL tests against Dolt SQL Server for the most recent release of Dolt. We will update this with every release. The tests attempt to run as many queries as possible in a fixed 2 minute time window. The `Dolt` and `MySQL` columns show the median latency of each test during that 2 minute time window.

The Dolt version is `0.26.4`.

| Read Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| covering\_index\_scan | 10.27 | 1.39 | 7.0 |
| index\_scan | 108.68 | 34.95 | 3.0 |
| oltp\_point\_select | 1.64 | 0.14 | 12.0 |
| oltp\_read\_only | 34.95 | 2.66 | 13.0 |
| select\_random\_points | 2.97 | 0.27 | 11.0 |
| select\_random\_ranges | 3.96 | 0.3 | 13.0 |
| table\_scan | 121.08 | 35.59 | 3.0 |
| mean |  |  | _8.86_ |

| Write Tests | Dolt | MySQL | Multiple |
| :--- | :--- | :--- | :--- |
| bulk\_insert | 0.001 | 0.001 | 1.0 |
| oltp\_delete | 10.27 | 0.14 | 73.0 |
| oltp\_insert | 12.75 | 2.43 | 5.0 |
| oltp\_read\_write | 74.46 | 6.09 | 12.0 |
| oltp\_update\_index | 14.46 | 2.43 | 6.0 |
| oltp\_update\_non\_index | 8.74 | 2.48 | 4.0 |
| oltp\_write\_only | 41.1 | 3.49 | 12.0 |
| mean |  |  | _16.14_ |

| Overall Mean Multiple | _12.5_ |
| :--- | :--- |
<br/>
