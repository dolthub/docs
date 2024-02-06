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

The Dolt version is `1.32.6`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.11 |   2.86 |      1.4 |
| groupby\_scan           | 13.46 |  17.63 |      1.3 |
| index\_join             |  1.32 |   5.09 |      3.9 |
| index\_join\_scan       |  1.25 |   2.18 |      1.7 |
| index\_scan             | 34.33 |  63.32 |      1.8 |
| oltp\_point\_select     |  0.17 |   0.46 |      2.7 |
| oltp\_read\_only        |  3.36 |   7.98 |      2.4 |
| select\_random\_points  |  0.32 |   0.75 |      2.3 |
| select\_random\_ranges  |  0.39 |    0.9 |      2.3 |
| table\_scan             | 34.33 |  64.47 |      1.9 |
| types\_table\_scan      | 74.46 | 173.58 |      2.3 |
| reads\_mean\_multiplier |       |        |      2.2 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| oltp\_delete\_insert     |  5.57 |  6.09 |      1.1 |
| oltp\_insert             |  2.76 |  2.91 |      1.1 |
| oltp\_read\_write        |   7.3 | 15.27 |      2.1 |
| oltp\_update\_index      |  2.81 |  3.07 |      1.1 |
| oltp\_update\_non\_index |  2.81 |  2.97 |      1.1 |
| oltp\_write\_only        |  4.03 |  7.43 |      1.8 |
| types\_delete\_insert    |  5.37 |  6.91 |      1.3 |
| writes\_mean\_multiplier |       |       |      1.4 |

| Overall Mean Multiple | 1.9 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>