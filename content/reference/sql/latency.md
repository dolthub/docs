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

The Dolt version is `0.40.4`.
<!-- START_LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|-------------------------|-------|-------|----------|
| covering\_index\_scan   |  1.73 |   7.7 |      4.5 |
| groupby\_scan           | 11.87 | 32.53 |      2.7 |
| index\_scan             | 36.24 |  86.0 |      2.4 |
| oltp\_point\_select     |  0.15 |  0.87 |      5.8 |
| oltp\_read\_only        |  2.91 | 12.08 |      4.2 |
| select\_random\_points  |  0.28 |  1.73 |      6.2 |
| select\_random\_ranges  |  0.34 |  1.86 |      5.5 |
| table\_scan             | 36.89 | 82.96 |      2.2 |
| reads\_mean\_multiplier |       |       |      4.2 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete             |  0.15 |  1.32 |      8.8 |
| oltp\_insert             |  2.81 |  8.13 |      2.9 |
| oltp\_read\_write        |  6.32 | 39.65 |      6.3 |
| oltp\_update\_index      |  2.61 |  9.56 |      3.7 |
| oltp\_update\_non\_index |  2.61 |  6.67 |      2.6 |
| oltp\_write\_only        |  3.55 | 26.68 |      7.5 |
| writes\_mean\_multiplier |       |       |      4.7 |

| Overall Mean Multiple | 4.4 |
|-----------------------|-----|
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>
