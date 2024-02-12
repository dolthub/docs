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

The Dolt version is `1.34.0`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.11 |   3.02 |      1.4 |
| groupby\_scan           |  13.7 |  18.28 |      1.3 |
| index\_join             |  1.34 |   5.28 |      3.9 |
| index\_join\_scan       |  1.25 |   2.22 |      1.8 |
| index\_scan             | 33.72 |  62.19 |      1.8 |
| oltp\_point\_select     |  0.17 |   0.47 |      2.8 |
| oltp\_read\_only        |  3.36 |   8.13 |      2.4 |
| select\_random\_points  |  0.32 |   0.77 |      2.4 |
| select\_random\_ranges  |  0.39 |    0.9 |      2.3 |
| table\_scan             | 34.33 |  62.19 |      1.8 |
| types\_table\_scan      | 74.46 | 170.48 |      2.3 |
| reads\_mean\_multiplier |       |        |      2.2 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| oltp\_delete\_insert     |  5.88 |  5.99 |      1.0 |
| oltp\_insert             |  2.81 |  2.97 |      1.1 |
| oltp\_read\_write        |  7.43 | 15.55 |      2.1 |
| oltp\_update\_index      |  2.86 |  3.13 |      1.1 |
| oltp\_update\_non\_index |  2.97 |  3.07 |      1.0 |
| oltp\_write\_only        |  4.03 |  7.43 |      1.8 |
| types\_delete\_insert    |  5.47 |  6.67 |      1.2 |
| writes\_mean\_multiplier |       |       |      1.3 |

| Overall Mean Multiple | 1.9 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>