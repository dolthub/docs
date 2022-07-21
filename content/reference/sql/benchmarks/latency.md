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

The Dolt version is `0.40.19`.
<!-- START_LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|-------------------------|-------|-------|----------|
| covering\_index\_scan   |  1.79 |  6.79 |      3.8 |
| groupby\_scan           | 11.87 | 32.53 |      2.7 |
| index\_join\_scan       |  3.82 | 33.72 |      8.8 |
| index\_scan             | 36.24 | 70.55 |      1.9 |
| oltp\_point\_select     |  0.15 |  0.58 |      3.9 |
| oltp\_read\_only        |  2.97 |  9.39 |      3.2 |
| select\_random\_points  |  0.29 |  1.39 |      4.8 |
| select\_random\_ranges  |  0.34 |  1.55 |      4.6 |
| table\_scan             | 36.24 | 65.65 |      1.8 |
| reads\_mean\_multiplier |       |       |      3.9 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  2.81 | 19.65 |      7.0 |
| oltp\_insert             |   1.5 |  7.98 |      5.3 |
| oltp\_read\_write        |  5.18 | 36.24 |      7.0 |
| oltp\_update\_index      |  1.55 |  9.39 |      6.1 |
| oltp\_update\_non\_index |   1.5 |  6.55 |      4.4 |
| oltp\_write\_only        |  2.26 |  26.2 |     11.6 |
| writes\_mean\_multiplier |       |       |      6.1 |

| Overall Mean Multiple | 4.9 |
|-----------------------|-----|
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>
