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

The Dolt version is `1.7.6`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.07 |   3.07 |      1.5 |
| groupby\_scan           | 12.98 |  17.95 |      1.4 |
| index\_join             |  1.25 |   4.74 |      3.8 |
| index\_join\_scan       |  1.18 |   2.26 |      1.9 |
| index\_scan             | 33.12 |  58.92 |      1.8 |
| oltp\_point\_select     |  0.14 |   0.47 |      3.4 |
| oltp\_read\_only        |  2.66 |   7.98 |      3.0 |
| select\_random\_points  |   0.3 |   0.78 |      2.6 |
| select\_random\_ranges  |  0.36 |   1.14 |      3.2 |
| table\_scan             | 33.12 |  58.92 |      1.8 |
| types\_table\_scan      | 75.82 | 170.48 |      2.2 |
| reads\_mean\_multiplier |       |        |      2.4 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  6.09 |  6.21 |      1.0 |
| oltp\_insert             |  2.71 |  3.19 |      1.2 |
| oltp\_read\_write        |  6.32 | 15.55 |      2.5 |
| oltp\_update\_index      |  2.81 |  3.19 |      1.1 |
| oltp\_update\_non\_index |  2.97 |  3.19 |      1.1 |
| oltp\_write\_only        |  3.96 |  7.84 |      2.0 |
| types\_delete\_insert    |  5.88 |  6.91 |      1.2 |
| writes\_mean\_multiplier |       |       |      1.4 |

| Overall Mean Multiple | 2.0 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
