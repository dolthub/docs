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

Below are the results of running `sysbench` MySQL tests against Dolt
SQL Server for the most recent release of Dolt in the current default 
storage format. We will update this with every release. The tests 
attempt to run as many queries as possible in a fixed 2 minute time 
window. The `Dolt` and `MySQL` columns show the median latency in 
milliseconds (ms) of each query during that 2 minute time window.

The Dolt version is `1.16.4`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.07 |   2.91 |      1.4 |
| groupby\_scan           | 12.98 |  17.95 |      1.4 |
| index\_join             |  1.27 |   4.74 |      3.7 |
| index\_join\_scan       |  1.21 |   2.22 |      1.8 |
| index\_scan             | 33.12 |  57.87 |      1.7 |
| oltp\_point\_select     |  0.14 |   0.39 |      2.8 |
| oltp\_read\_only        |  2.66 |   7.17 |      2.7 |
| select\_random\_points  |   0.3 |   0.72 |      2.4 |
| select\_random\_ranges  |  0.37 |   0.95 |      2.6 |
| table\_scan             | 33.12 |  57.87 |      1.7 |
| types\_table\_scan      | 74.46 | 170.48 |      2.3 |
| reads\_mean\_multiplier |       |        |      2.2 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  5.77 |  5.88 |      1.0 |
| oltp\_insert             |  2.76 |  3.02 |      1.1 |
| oltp\_read\_write        |  6.43 | 14.21 |      2.2 |
| oltp\_update\_index      |  2.81 |  2.97 |      1.1 |
| oltp\_update\_non\_index |  2.91 |  2.91 |      1.0 |
| oltp\_write\_only        |  3.82 |  7.17 |      1.9 |
| types\_delete\_insert    |  5.47 |  6.32 |      1.2 |
| writes\_mean\_multiplier |       |       |      1.3 |

| Overall Mean Multiple | 1.8 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
