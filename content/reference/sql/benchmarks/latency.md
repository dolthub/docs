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

The Dolt version is `0.40.15`.
<!-- START_LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|-------------------------|-------|-------|----------|
| covering\_index\_scan   |  1.76 |   7.3 |      4.1 |
| groupby\_scan           | 11.87 | 31.37 |      2.6 |
| index\_join\_scan       |  3.82 | 33.12 |      8.7 |
| index\_scan             | 36.24 | 77.19 |      2.1 |
| oltp\_point\_select     |  0.15 |  0.74 |      4.9 |
| oltp\_read\_only        |  2.97 | 12.08 |      4.1 |
| select\_random\_points  |  0.29 |  1.55 |      5.3 |
| select\_random\_ranges  |  0.34 |  1.73 |      5.1 |
| table\_scan             | 36.24 | 74.46 |      2.1 |
| reads\_mean\_multiplier |       |       |      4.3 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  5.99 |  20.0 |      3.3 |
| oltp\_insert             |  2.66 |  8.13 |      3.1 |
| oltp\_read\_write        |  6.91 | 39.65 |      5.7 |
| oltp\_update\_index      |  2.97 |  9.56 |      3.2 |
| oltp\_update\_non\_index |  2.91 |  6.67 |      2.3 |
| oltp\_write\_only        |  4.03 | 26.68 |      6.6 |
| writes\_mean\_multiplier |       |       |      3.6 |

| Overall Mean Multiple | 4.2 |
|-----------------------|-----|
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>
