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

The Dolt version is `1.1.2`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  1.93 |   2.76 |      1.4 |
| groupby\_scan           |  12.3 |  16.71 |      1.4 |
| index\_join             |  1.16 |    4.1 |      3.5 |
| index\_join\_scan       |  1.12 |   2.11 |      1.9 |
| index\_scan             | 30.81 |  55.82 |      1.8 |
| oltp\_point\_select     |  0.14 |   0.49 |      3.5 |
| oltp\_read\_only        |  2.81 |   8.28 |      2.9 |
| select\_random\_points  |  0.29 |   0.77 |      2.7 |
| select\_random\_ranges  |  0.34 |   1.16 |      3.4 |
| table\_scan             | 30.81 |  55.82 |      1.8 |
| types\_table\_scan      | 69.29 | 176.73 |      2.6 |
| reads\_mean\_multiplier |       |        |      2.4 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  4.18 |  5.47 |      1.3 |
| oltp\_insert             |  2.11 |  2.71 |      1.3 |
| oltp\_read\_write        |  5.99 |  15.0 |      2.5 |
| oltp\_update\_index      |  2.14 |  2.81 |      1.3 |
| oltp\_update\_non\_index |  2.22 |  2.76 |      1.2 |
| oltp\_write\_only        |  3.13 |  7.17 |      2.3 |
| types\_delete\_insert    |  4.33 |  6.32 |      1.5 |
| writes\_mean\_multiplier |       |       |      1.6 |

| Overall Mean Multiple | 2.1 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
