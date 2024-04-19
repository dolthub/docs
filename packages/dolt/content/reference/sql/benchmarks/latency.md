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

The Dolt version is `1.35.10`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.07 |   3.02 |      1.5 |
| groupby\_scan           | 13.22 |  17.63 |      1.3 |
| index\_join             |  1.37 |   5.18 |      3.8 |
| index\_join\_scan       |   1.3 |   2.26 |      1.7 |
| index\_scan             | 34.33 |  55.82 |      1.6 |
| oltp\_point\_select     |  0.17 |   0.53 |      3.1 |
| oltp\_read\_only        |  3.36 |   8.58 |      2.6 |
| select\_random\_points  |  0.33 |   0.84 |      2.5 |
| select\_random\_ranges  |  0.39 |   1.01 |      2.6 |
| table\_scan             | 34.33 |  55.82 |      1.6 |
| types\_table\_scan      | 73.13 | 161.51 |      2.2 |
| reads\_mean\_multiplier |       |        |      2.2 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| oltp\_delete\_insert     |  7.98 |  6.91 |      0.9 |
| oltp\_insert             |  3.75 |  3.43 |      0.9 |
| oltp\_read\_write        |  8.43 | 16.41 |      1.9 |
| oltp\_update\_index      |  3.82 |  3.55 |      0.9 |
| oltp\_update\_non\_index |  3.82 |  3.49 |      0.9 |
| oltp\_write\_only        |  5.37 |  7.98 |      1.5 |
| types\_delete\_insert    |   7.7 |   7.7 |      1.0 |
| writes\_mean\_multiplier |       |       |      1.1 |

|    TPC-C TPS Tests    | MySQL  | Dolt | Multiple |
|-----------------------|--------|------|----------|
| tpcc-scale-factor-1   | 101.79 | 0.16 |      4.5 |
| tpcc\_tps\_multiplier |        |      |      4.5 |

| Overall Mean Multiple | 2.60 |
|-----------------------|------|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>