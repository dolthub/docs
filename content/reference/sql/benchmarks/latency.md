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

### Current Default Format (`__DOLT__`)

Below are the results of running `sysbench` MySQL tests against Dolt
SQL Server for the most recent release of Dolt in the current default 
storage format. We will update this with every release. The tests 
attempt to run as many queries as possible in a fixed 2 minute time 
window. The `Dolt` and `MySQL` columns show the median latency in 
milliseconds (ms) of each query during that 2 minute time window.

The Dolt version is `0.75.6`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |   2.0 |   2.71 |      1.4 |
| groupby\_scan           |  12.3 |  16.41 |      1.3 |
| index\_join             |  1.18 |    4.1 |      3.5 |
| index\_join\_scan       |  1.14 |   2.07 |      1.8 |
| index\_scan             | 30.81 |  52.89 |      1.7 |
| oltp\_point\_select     |  0.15 |   0.48 |      3.2 |
| oltp\_read\_only        |  2.97 |   8.58 |      2.9 |
| select\_random\_points  |   0.3 |   0.74 |      2.5 |
| select\_random\_ranges  |  0.35 |   1.14 |      3.3 |
| table\_scan             | 30.81 |  54.83 |      1.8 |
| types\_table\_scan      | 69.29 | 161.51 |      2.3 |
| reads\_mean\_multiplier |       |        |      2.3 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  4.74 |  5.57 |      1.2 |
| oltp\_insert             |  2.35 |  2.71 |      1.2 |
| oltp\_read\_write        |  6.21 | 15.55 |      2.5 |
| oltp\_update\_index      |   2.3 |  2.91 |      1.3 |
| oltp\_update\_non\_index |  2.39 |  2.76 |      1.2 |
| oltp\_write\_only        |  3.36 |  7.43 |      2.2 |
| types\_delete\_insert    |  4.74 |  6.32 |      1.3 |
| writes\_mean\_multiplier |       |       |      1.5 |

| Overall Mean Multiple | 2.0 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
