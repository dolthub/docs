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

The Dolt version is `1.4.2`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|-------------------------|-------|-------|----------|
| covering\_index\_scan   |  1.93 |  2.61 |      1.4 |
| groupby\_scan           |  12.3 | 16.71 |      1.4 |
| index\_join             |  1.18 |  4.33 |      3.7 |
| index\_join\_scan       |  1.14 |  2.11 |      1.9 |
| index\_scan             | 30.81 | 53.85 |      1.7 |
| oltp\_point\_select     |  0.14 |  0.46 |      3.3 |
| oltp\_read\_only        |  2.86 |  7.98 |      2.8 |
| select\_random\_points  |   0.3 |  0.75 |      2.5 |
| select\_random\_ranges  |  0.35 |  1.06 |      3.0 |
| table\_scan             | 30.81 | 54.83 |      1.8 |
| types\_table\_scan      | 69.29 | 155.8 |      2.2 |
| reads\_mean\_multiplier |       |       |      2.3 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  5.57 |  6.21 |      1.1 |
| oltp\_insert             |  2.76 |  2.91 |      1.1 |
| oltp\_read\_write        |  6.43 | 15.27 |      2.4 |
| oltp\_update\_index      |  2.61 |  3.25 |      1.2 |
| oltp\_update\_non\_index |  2.76 |  3.13 |      1.1 |
| oltp\_write\_only        |  3.68 |  7.56 |      2.1 |
| types\_delete\_insert    |  5.18 |  7.04 |      1.4 |
| writes\_mean\_multiplier |       |       |      1.4 |

| Overall Mean Multiple | 2.0 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
