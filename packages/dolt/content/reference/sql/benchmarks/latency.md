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

The Dolt version is `1.42.5`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.11 |   2.97 |      1.4 |
| groupby\_scan           | 13.46 |  17.32 |      1.3 |
| index\_join             |  1.37 |   2.81 |      2.1 |
| index\_join\_scan       |   1.3 |   2.22 |      1.7 |
| index\_scan             | 34.33 |  53.85 |      1.6 |
| oltp\_point\_select     |  0.18 |   0.46 |      2.6 |
| oltp\_read\_only        |  3.49 |    7.7 |      2.2 |
| select\_random\_points  |  0.34 |   0.77 |      2.3 |
| select\_random\_ranges  |  0.39 |   0.89 |      2.3 |
| table\_scan             | 34.33 |  54.83 |      1.6 |
| types\_table\_scan      | 74.46 | 142.39 |      1.9 |
| reads\_mean\_multiplier |       |        |      1.9 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| oltp\_delete\_insert     |  8.13 |  6.09 |      0.7 |
| oltp\_insert             |  3.82 |  3.02 |      0.8 |
| oltp\_read\_write        |  8.58 | 13.95 |      1.6 |
| oltp\_update\_index      |  3.82 |  3.07 |      0.8 |
| oltp\_update\_non\_index |  3.89 |  3.02 |      0.8 |
| oltp\_write\_only        |  5.37 |  6.43 |      1.2 |
| types\_delete\_insert    |   7.7 |  6.67 |      0.9 |
| writes\_mean\_multiplier |       |       |      1.0 |

|    TPC-C TPS Tests    | MySQL | Dolt  | Multiple |
|-----------------------|-------|-------|----------|
| tpcc-scale-factor-1   | 99.43 | 34.46 |      2.9 |
| tpcc\_tps\_multiplier |       |       |      2.9 |

| Overall Mean Multiple | 1.93 |
|-----------------------|------|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>