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

The Dolt version is `1.20.0`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|-------------------------|-------|-------|----------|
| covering\_index\_scan   |  2.11 |  2.71 |      1.3 |
| groupby\_scan           | 12.98 | 17.01 |      1.3 |
| index\_join             |  1.32 |  4.57 |      3.5 |
| index\_join\_scan       |  1.25 |  2.14 |      1.7 |
| index\_scan             | 34.33 | 54.83 |      1.6 |
| oltp\_point\_select     |  0.17 |   0.4 |      2.4 |
| oltp\_read\_only        |  3.25 |  7.17 |      2.2 |
| select\_random\_points  |  0.32 |  0.68 |      2.1 |
| select\_random\_ranges  |  0.38 |   0.9 |      2.4 |
| table\_scan             | 34.33 | 54.83 |      1.6 |
| types\_table\_scan      | 74.46 | 155.8 |      2.1 |
| reads\_mean\_multiplier |       |       |      2.0 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  4.41 |  5.37 |      1.2 |
| oltp\_insert             |  2.18 |  2.66 |      1.2 |
| oltp\_read\_write        |  6.55 | 13.46 |      2.1 |
| oltp\_update\_index      |  2.22 |  2.66 |      1.2 |
| oltp\_update\_non\_index |  2.22 |  2.61 |      1.2 |
| oltp\_write\_only        |  3.25 |  6.55 |      2.0 |
| types\_delete\_insert    |  4.49 |  5.77 |      1.3 |
| writes\_mean\_multiplier |       |       |      1.4 |

| Overall Mean Multiple | 1.8 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
