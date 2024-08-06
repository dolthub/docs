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

The Dolt version is `1.42.8`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.07 |   2.91 |      1.4 |
| groupby\_scan           | 13.46 |  16.71 |      1.2 |
| index\_join             |  1.39 |   2.61 |      1.9 |
| index\_join\_scan       |   1.3 |   2.11 |      1.6 |
| index\_scan             | 34.33 |  52.89 |      1.5 |
| oltp\_point\_select     |  0.18 |   0.39 |      2.2 |
| oltp\_read\_only        |  3.43 |   6.79 |      2.0 |
| select\_random\_points  |  0.33 |    0.7 |      2.1 |
| select\_random\_ranges  |  0.39 |   0.81 |      2.1 |
| table\_scan             | 34.33 |  53.85 |      1.6 |
| types\_table\_scan      | 74.46 | 139.85 |      1.9 |
| reads\_mean\_multiplier |       |        |      1.8 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| oltp\_delete\_insert     |  8.13 |  5.88 |      0.7 |
| oltp\_insert             |  3.82 |  2.97 |      0.8 |
| oltp\_read\_write        |  8.58 | 12.52 |      1.5 |
| oltp\_update\_index      |  3.89 |  2.97 |      0.8 |
| oltp\_update\_non\_index |  3.89 |  2.91 |      0.7 |
| oltp\_write\_only        |  5.37 |  5.99 |      1.1 |
| types\_delete\_insert    |   7.7 |  6.43 |      0.8 |
| writes\_mean\_multiplier |       |       |      0.9 |

|    TPC-C TPS Tests    | MySQL | Dolt  | Multiple |
|-----------------------|-------|-------|----------|
| tpcc-scale-factor-1   | 98.89 | 38.07 |      2.6 |
| tpcc\_tps\_multiplier |       |       |      2.6 |

| Overall Mean Multiple | 1.77 |
|-----------------------|------|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>