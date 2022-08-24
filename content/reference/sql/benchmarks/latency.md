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

The Dolt version is `0.40.28`.
<!-- START_LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  1.96 |   6.43 |      3.3 |
| groupby\_scan           |  12.3 |  21.89 |      1.8 |
| index\_join\_scan       |  1.12 |  15.55 |     13.9 |
| index\_scan             | 30.26 |  62.19 |      2.1 |
| oltp\_point\_select     |  0.15 |   0.56 |      3.7 |
| oltp\_read\_only        |  2.97 |   9.39 |      3.2 |
| select\_random\_points  |   0.3 |   1.34 |      4.5 |
| select\_random\_ranges  |  0.35 |   1.37 |      3.9 |
| table\_scan             | 30.81 |  57.87 |      1.9 |
| types\_table\_scan      | 69.29 | 569.67 |      8.2 |
| reads\_mean\_multiplier |       |        |      4.7 |

|       Write Tests        | MySQL |  Dolt  | Multiple |
|--------------------------|-------|--------|----------|
| bulk\_insert             | 0.001 |  0.001 |      1.0 |
| oltp\_delete\_insert     |  2.97 |  19.65 |      6.6 |
| oltp\_insert             |  1.55 |   7.98 |      5.1 |
| oltp\_read\_write        |  5.18 |  36.89 |      7.1 |
| oltp\_update\_index      |  1.61 |   9.39 |      5.8 |
| oltp\_update\_non\_index |  1.55 |   6.43 |      4.1 |
| oltp\_write\_only        |  2.26 |   26.2 |     11.6 |
| types\_delete\_insert    |  3.07 | 158.63 |     51.7 |
| writes\_mean\_multiplier |       |        |     11.6 |

| Overall Mean Multiple | 7.8 |
|-----------------------|-----|
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>
