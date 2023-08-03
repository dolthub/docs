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

The Dolt version is `1.8.8`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.07 |   3.02 |      1.5 |
| groupby\_scan           | 13.22 |  17.95 |      1.4 |
| index\_join             |  1.27 |   4.74 |      3.7 |
| index\_join\_scan       |  1.21 |    2.3 |      1.9 |
| index\_scan             | 32.53 |  56.84 |      1.7 |
| oltp\_point\_select     |  0.14 |   0.48 |      3.4 |
| oltp\_read\_only        |  2.71 |   8.28 |      3.1 |
| select\_random\_points  |   0.3 |   0.81 |      2.7 |
| select\_random\_ranges  |  0.37 |   1.21 |      3.3 |
| table\_scan             | 33.12 |  56.84 |      1.7 |
| types\_table\_scan      | 74.46 | 164.45 |      2.2 |
| reads\_mean\_multiplier |       |        |      2.4 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  4.49 |  5.88 |      1.3 |
| oltp\_insert             |  2.14 |  2.86 |      1.3 |
| oltp\_read\_write        |  5.99 | 15.55 |      2.6 |
| oltp\_update\_index      |  2.22 |  2.91 |      1.3 |
| oltp\_update\_non\_index |   2.3 |  2.91 |      1.3 |
| oltp\_write\_only        |  3.25 |  7.56 |      2.3 |
| types\_delete\_insert    |  4.57 |  6.79 |      1.5 |
| writes\_mean\_multiplier |       |       |      1.6 |

| Overall Mean Multiple | 2.1 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
