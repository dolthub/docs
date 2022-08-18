---
title: Latency
---

# Latency and Throughput

Our approach to SQL performance benchmarking is to use `sysbench`, an
industry standard benchmarking tool.

## Performance Roadmap

Dolt is slower than MySQL. The goal is to get Dolt to within 2-4 times
the speed of MySQL for common operations. If a query takes MySQL 1
second, we expect it to take Dolt 2-4 seconds. Or, if MySQL can run 8
queries in 10 seconds, then we want Dolt to run 2-4 queries in 10
seconds. The `multiple` column represents this relationship with
regard to a particular benchmark.

It's important recognize that these are industry standard tests, and
are OLTP oriented. Many Dolt use-cases are non-OLTP, and Dolt is fast
for bulk operations common in, for example, data pipeline contexts.

## Benchmark Data

Below are the results of running `sysbench` MySQL tests against Dolt
SQL Server for the most recent release of Dolt. We will update this
with every release. The tests attempt to run as many queries as
possible in a fixed 2 minute time window. The `Dolt` and `MySQL`
columns show the median latency in milliseconds (ms) of each query 
during that 2 minute time window.

The Dolt version is `0.40.27`.
<!-- START_LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  1.93 |   6.79 |      3.5 |
| groupby\_scan           |  12.3 |  22.69 |      1.8 |
| index\_join\_scan       |  1.12 |  16.41 |     14.7 |
| index\_scan             | 30.81 |  63.32 |      2.1 |
| oltp\_point\_select     |  0.15 |   0.57 |      3.8 |
| oltp\_read\_only        |  2.97 |   9.56 |      3.2 |
| select\_random\_points  |   0.3 |   1.39 |      4.6 |
| select\_random\_ranges  |  0.35 |   1.52 |      4.3 |
| table\_scan             | 31.37 |  58.92 |      1.9 |
| types\_table\_scan      | 70.55 | 590.56 |      8.4 |
| reads\_mean\_multiplier |       |        |      4.8 |

|       Write Tests        | MySQL |  Dolt  | Multiple |
|--------------------------|-------|--------|----------|
| bulk\_insert             | 0.001 |  0.001 |      1.0 |
| oltp\_delete\_insert     |  3.07 |   20.0 |      6.5 |
| oltp\_insert             |  1.58 |   8.13 |      5.1 |
| oltp\_read\_write        |  5.09 |  37.56 |      7.4 |
| oltp\_update\_index      |  1.47 |   9.56 |      6.5 |
| oltp\_update\_non\_index |  1.44 |   6.43 |      4.5 |
| oltp\_write\_only        |  2.22 |  27.17 |     12.2 |
| types\_delete\_insert    |  3.36 | 158.63 |     47.2 |
| writes\_mean\_multiplier |       |        |     11.3 |

| Overall Mean Multiple | 7.7 |
|-----------------------|-----|
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>
