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

The Dolt version is `0.52.20`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  1.96 |   2.81 |      1.4 |
| groupby\_scan           |  12.3 |  16.41 |      1.3 |
| index\_join             |  1.16 |   4.57 |      3.9 |
| index\_join\_scan       |  1.12 |   3.96 |      3.5 |
| index\_scan             | 30.26 |  52.89 |      1.7 |
| oltp\_point\_select     |  0.15 |   0.48 |      3.2 |
| oltp\_read\_only        |  2.97 |   8.58 |      2.9 |
| select\_random\_points  |   0.3 |   0.75 |      2.5 |
| select\_random\_ranges  |  0.35 |   1.14 |      3.3 |
| table\_scan             | 30.81 |  61.08 |      2.0 |
| types\_table\_scan      | 70.55 | 186.54 |      2.6 |
| reads\_mean\_multiplier |       |        |      2.6 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  2.76 | 11.87 |      4.3 |
| oltp\_insert             |  1.44 |  2.97 |      2.1 |
| oltp\_read\_write        |  5.09 | 17.95 |      3.5 |
| oltp\_update\_index      |  1.42 |  5.47 |      3.9 |
| oltp\_update\_non\_index |  1.37 |  5.99 |      4.4 |
| oltp\_write\_only        |  2.22 |  9.06 |      4.1 |
| types\_delete\_insert    |  2.97 | 11.87 |      4.0 |
| writes\_mean\_multiplier |       |       |      3.4 |

| Overall Mean Multiple | 2.9 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
