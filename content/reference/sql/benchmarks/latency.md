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

The Dolt version is `0.40.21`.
<!-- START_LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|-------------------------|-------|-------|----------|
| covering\_index\_scan   |   1.7 |  6.55 |      3.9 |
| groupby\_scan           | 11.87 | 22.28 |      1.9 |
| index\_join\_scan       |  1.03 | 18.28 |     17.7 |
| index\_scan             | 28.67 | 63.32 |      2.2 |
| oltp\_point\_select     |  0.15 |  0.59 |      3.9 |
| oltp\_read\_only        |  2.97 |  9.73 |      3.3 |
| select\_random\_points  |  0.29 |  1.42 |      4.9 |
| select\_random\_ranges  |  0.34 |  1.55 |      4.6 |
| table\_scan             | 28.67 | 58.92 |      2.1 |
| reads\_mean\_multiplier |       |       |      4.9 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  2.91 | 19.65 |      6.8 |
| oltp\_insert             |  1.42 |  8.13 |      5.7 |
| oltp\_read\_write        |  5.18 | 36.89 |      7.1 |
| oltp\_update\_index      |  1.44 |  9.39 |      6.5 |
| oltp\_update\_non\_index |  1.42 |  6.55 |      4.6 |
| oltp\_write\_only        |   2.3 |  26.2 |     11.4 |
| writes\_mean\_multiplier |       |       |      6.2 |

| Overall Mean Multiple | 5.5 |
|-----------------------|-----|
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>
