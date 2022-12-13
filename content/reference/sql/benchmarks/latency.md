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

The Dolt version is `0.51.12`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.03 |   2.91 |      1.4 |
| groupby\_scan           | 12.98 |  18.28 |      1.4 |
| index\_join             |  1.25 |    5.0 |      4.0 |
| index\_join\_scan       |  1.21 |   4.25 |      3.5 |
| index\_scan             | 32.53 |  61.08 |      1.9 |
| oltp\_point\_select     |  0.16 |   0.54 |      3.4 |
| oltp\_read\_only        |  3.13 |   9.39 |      3.0 |
| select\_random\_points  |  0.32 |   0.84 |      2.6 |
| select\_random\_ranges  |  0.37 |   1.23 |      3.3 |
| table\_scan             | 33.12 |  66.84 |      2.0 |
| types\_table\_scan      | 75.82 | 207.82 |      2.7 |
| reads\_mean\_multiplier |       |        |      2.7 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |   3.3 | 11.24 |      3.4 |
| oltp\_insert             |  1.64 |  3.13 |      1.9 |
| oltp\_read\_write        |  5.57 | 18.28 |      3.3 |
| oltp\_update\_index      |  1.73 |  5.37 |      3.1 |
| oltp\_update\_non\_index |  1.67 |  5.88 |      3.5 |
| oltp\_write\_only        |  2.48 |  8.74 |      3.5 |
| types\_delete\_insert    |  3.43 |  12.3 |      3.6 |
| writes\_mean\_multiplier |       |       |      2.9 |

| Overall Mean Multiple | 2.8 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
