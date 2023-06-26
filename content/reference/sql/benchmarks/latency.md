---
title: Latency
---

# Latency and Throughput

Our approach to SQL performance benchmarking is to use `sysbench`, an
industry standard benchmarking tool.

## Performance Roadmap

Dolt is slower than MySQL. The goal is to get Dolt to match 
MySQL latency for common operations. Dolt is currently 2X slower 
than MySQL, approximately 1.5X on writes and 2.5X on reads. The 
`multiple` column represents this relationship with regard to a 
particular benchmark.

It's important recognize that these are industry standard tests, and
are OLTP oriented. Performance results may vary but Dolt is 
generally competitive on latency with MySQL and Postgres.

## Benchmark Data

### Current Default Format (`__DOLT__`)

Below are the results of running `sysbench` MySQL tests against Dolt
SQL Server for the most recent release of Dolt in the current default 
storage format. We will update this with every release. The tests 
attempt to run as many queries as possible in a fixed 2 minute time 
window. The `Dolt` and `MySQL` columns show the median latency in 
milliseconds (ms) of each query during that 2 minute time window.

The Dolt version is `1.6.1`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  1.93 |   2.71 |      1.4 |
| groupby\_scan           |  12.3 |  16.71 |      1.4 |
| index\_join             |  1.18 |   4.33 |      3.7 |
| index\_join\_scan       |  1.14 |   2.14 |      1.9 |
| index\_scan             | 30.26 |  55.82 |      1.8 |
| oltp\_point\_select     |  0.14 |   0.46 |      3.3 |
| oltp\_read\_only        |  2.86 |   8.13 |      2.8 |
| select\_random\_points  |  0.29 |   0.75 |      2.6 |
| select\_random\_ranges  |  0.35 |   1.08 |      3.1 |
| table\_scan             | 30.81 |  55.82 |      1.8 |
| types\_table\_scan      | 70.55 | 158.63 |      2.2 |
| reads\_mean\_multiplier |       |        |      2.4 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  4.49 |  5.67 |      1.3 |
| oltp\_insert             |  2.18 |  2.76 |      1.3 |
| oltp\_read\_write        |  6.09 | 15.27 |      2.5 |
| oltp\_update\_index      |  2.26 |  2.91 |      1.3 |
| oltp\_update\_non\_index |  2.26 |  2.81 |      1.2 |
| oltp\_write\_only        |  3.25 |  7.43 |      2.3 |
| types\_delete\_insert    |  4.57 |  6.32 |      1.4 |
| writes\_mean\_multiplier |       |       |      1.5 |

| Overall Mean Multiple | 2.0 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
