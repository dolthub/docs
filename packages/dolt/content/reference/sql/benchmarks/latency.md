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

The Dolt version is `1.43.5`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.07 |   0.63 |      0.3 |
| groupby\_scan           | 13.22 |  16.71 |      1.3 |
| index\_join             |  1.37 |    2.3 |      1.7 |
| index\_join\_scan       |   1.3 |   1.89 |      1.5 |
| index\_scan             | 34.33 |  56.84 |      1.7 |
| oltp\_point\_select     |  0.18 |   0.27 |      1.5 |
| oltp\_read\_only        |  3.49 |   5.47 |      1.6 |
| select\_random\_points  |  0.34 |   0.61 |      1.8 |
| select\_random\_ranges  |  0.39 |   0.62 |      1.6 |
| table\_scan             | 34.95 |  57.87 |      1.7 |
| types\_table\_scan      | 74.46 | 147.61 |      2.0 |
| reads\_mean\_multiplier |       |        |      1.5 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| oltp\_delete\_insert     |  8.13 |  5.99 |      0.7 |
| oltp\_insert             |  3.75 |  2.91 |      0.8 |
| oltp\_read\_write        |  8.58 | 11.45 |      1.3 |
| oltp\_update\_index      |  3.89 |  2.97 |      0.8 |
| oltp\_update\_non\_index |  3.89 |  2.91 |      0.7 |
| oltp\_write\_only        |  5.28 |  5.99 |      1.1 |
| types\_delete\_insert    |  7.84 |  6.43 |      0.8 |
| writes\_mean\_multiplier |       |       |      0.9 |

|    TPC-C TPS Tests    | MySQL | Dolt | Multiple |
|-----------------------|-------|------|----------|
| tpcc-scale-factor-1   | 99.29 | 40.5 |      2.5 |
| tpcc\_tps\_multiplier |       |      |      2.5 |

| Overall Mean Multiple | 1.63 |
|-----------------------|------|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>