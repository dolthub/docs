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

The Dolt version is `0.40.24`.
<!-- START_LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |   2.0 |   6.55 |      3.3 |
| groupby\_scan           |  12.3 |  22.69 |      1.8 |
| index\_join\_scan       |  1.12 |  18.61 |     16.6 |
| index\_scan             | 30.26 |  63.32 |      2.1 |
| oltp\_point\_select     |  0.15 |    0.6 |      4.0 |
| oltp\_read\_only        |  2.97 |   9.73 |      3.3 |
| select\_random\_points  |   0.3 |   1.39 |      4.6 |
| select\_random\_ranges  |  0.35 |   1.55 |      4.4 |
| table\_scan             | 30.81 |  58.92 |      1.9 |
| types\_table\_scan      | 68.05 | 569.67 |      8.4 |
| reads\_mean\_multiplier |       |        |      5.0 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  2.91 |  20.0 |      6.9 |
| oltp\_insert             |  1.44 |  8.28 |      5.7 |
| oltp\_read\_write        |  5.18 | 37.56 |      7.3 |
| oltp\_update\_index      |  1.44 |  9.56 |      6.6 |
| oltp\_update\_non\_index |   1.5 |  6.67 |      4.4 |
| oltp\_write\_only        |  2.22 | 26.68 |     12.0 |
| types\_delete\_insert    |  3.07 | 155.8 |     50.7 |
| writes\_mean\_multiplier |       |       |     11.8 |

| Overall Mean Multiple | 8.1 |
|-----------------------|-----|
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>
