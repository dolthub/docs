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

The Dolt version is `0.40.14`.
<!-- START_LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|-------------------------|-------|-------|----------|
| covering\_index\_scan   |  1.79 |   7.7 |      4.3 |
| groupby\_scan           | 12.08 | 31.94 |      2.6 |
| index\_join\_scan       |  3.89 | 34.33 |      8.8 |
| index\_scan             | 36.89 | 81.48 |      2.2 |
| oltp\_point\_select     |  0.15 |  0.83 |      5.5 |
| oltp\_read\_only        |  2.97 |  12.3 |      4.1 |
| select\_random\_points  |  0.29 |  1.67 |      5.8 |
| select\_random\_ranges  |  0.34 |  1.86 |      5.5 |
| table\_scan             | 36.89 | 77.19 |      2.1 |
| reads\_mean\_multiplier |       |       |      4.5 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  5.57 | 20.37 |      3.7 |
| oltp\_insert             |  2.86 |  8.28 |      2.9 |
| oltp\_read\_write        |  6.79 | 39.65 |      5.8 |
| oltp\_update\_index      |  2.91 |  9.56 |      3.3 |
| oltp\_update\_non\_index |  2.91 |  6.79 |      2.3 |
| oltp\_write\_only        |  4.03 | 27.17 |      6.7 |
| writes\_mean\_multiplier |       |       |      3.7 |

| Overall Mean Multiple | 4.4 |
|-----------------------|-----|
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>
