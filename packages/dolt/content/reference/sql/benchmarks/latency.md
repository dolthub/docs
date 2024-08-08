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

The Dolt version is `1.42.9`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.07 |   3.02 |      1.5 |
| groupby\_scan           |  13.7 |  17.63 |      1.3 |
| index\_join             |  1.37 |   2.66 |      1.9 |
| index\_join\_scan       |   1.3 |   2.18 |      1.7 |
| index\_scan             | 34.95 |  54.83 |      1.6 |
| oltp\_point\_select     |  0.18 |    0.3 |      1.7 |
| oltp\_read\_only        |  3.49 |   5.99 |      1.7 |
| select\_random\_points  |  0.34 |   0.65 |      1.9 |
| select\_random\_ranges  |  0.39 |   0.83 |      2.1 |
| table\_scan             | 34.95 |  55.82 |      1.6 |
| types\_table\_scan      | 75.82 | 144.97 |      1.9 |
| reads\_mean\_multiplier |       |        |      1.7 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| oltp\_delete\_insert     |  8.13 |  5.99 |      0.7 |
| oltp\_insert             |  3.82 |  3.02 |      0.8 |
| oltp\_read\_write        |  8.58 | 12.08 |      1.4 |
| oltp\_update\_index      |  3.89 |  3.02 |      0.8 |
| oltp\_update\_non\_index |  3.89 |  2.97 |      0.8 |
| oltp\_write\_only        |  5.47 |  6.21 |      1.1 |
| types\_delete\_insert    |   7.7 |  6.55 |      0.9 |
| writes\_mean\_multiplier |       |       |      0.9 |

|    TPC-C TPS Tests    | MySQL | Dolt  | Multiple |
|-----------------------|-------|-------|----------|
| tpcc-scale-factor-1   | 98.12 | 38.64 |      2.5 |
| tpcc\_tps\_multiplier |       |       |      2.5 |

| Overall Mean Multiple | 1.70 |
|-----------------------|------|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>