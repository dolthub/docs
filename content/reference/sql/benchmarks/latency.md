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

The Dolt version is `0.40.5`.
<!-- START_LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|-------------------------|-------|-------|----------|
| covering\_index\_scan   |  1.76 |   7.7 |      4.4 |
| groupby\_scan           | 11.87 | 33.12 |      2.8 |
| index\_scan             | 36.24 |  86.0 |      2.4 |
| oltp\_point\_select     |  0.15 |  0.83 |      5.5 |
| oltp\_read\_only        |  2.97 | 12.08 |      4.1 |
| select\_random\_points  |  0.29 |  1.67 |      5.8 |
| select\_random\_ranges  |  0.34 |  1.79 |      5.3 |
| table\_scan             | 36.24 | 82.96 |      2.3 |
| reads\_mean\_multiplier |       |       |      4.1 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete             |  0.15 |   1.3 |      8.7 |
| oltp\_insert             |  2.76 |  8.13 |      2.9 |
| oltp\_read\_write        |  6.67 | 38.94 |      5.8 |
| oltp\_update\_index      |  2.76 |  9.56 |      3.5 |
| oltp\_update\_non\_index |  2.86 |  6.67 |      2.3 |
| oltp\_write\_only        |  3.96 | 26.68 |      6.7 |
| writes\_mean\_multiplier |       |       |      4.4 |

| Overall Mean Multiple | 4.2 |
|-----------------------|-----|
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>
