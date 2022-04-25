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

The Dolt version is `0.39.2`.
<!-- START_LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|-------------------------|-------|-------|----------|
| covering\_index\_scan   |  1.76 |  7.43 |      4.2 |
| groupby\_scan           | 12.08 | 35.59 |      2.9 |
| index\_scan             | 36.89 | 87.56 |      2.4 |
| oltp\_point\_select     |  0.15 |  0.84 |      5.6 |
| oltp\_read\_only        |  2.91 | 11.87 |      4.1 |
| select\_random\_points  |  0.29 |  1.67 |      5.8 |
| select\_random\_ranges  |  0.34 |  1.76 |      5.2 |
| table\_scan             | 36.89 | 84.47 |      2.3 |
| reads\_mean\_multiplier |       |       |      4.1 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete             |  0.15 | 11.04 |     73.6 |
| oltp\_insert             |  2.48 | 10.27 |      4.1 |
| oltp\_read\_write        |  6.43 | 51.02 |      7.9 |
| oltp\_update\_index      |  2.48 | 23.52 |      9.5 |
| oltp\_update\_non\_index |  2.57 | 21.11 |      8.2 |
| oltp\_write\_only        |  3.55 | 35.59 |     10.0 |
| writes\_mean\_multiplier |       |       |     16.3 |

| Overall Mean Multiple | 9.8 |
|-----------------------|-----|
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>
