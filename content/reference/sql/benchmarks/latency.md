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

### Current Default Format (`__LD_1__`)

Below are the results of running `sysbench` MySQL tests against Dolt
SQL Server for the most recent release of Dolt in the current default 
storage format. We will update this with every release. The tests 
attempt to run as many queries as possible in a fixed 2 minute time 
window. The `Dolt` and `MySQL` columns show the median latency in 
milliseconds (ms) of each query during that 2 minute time window.

The Dolt version is `0.41.2`.
<!-- START___LD_1___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  1.96 |   6.55 |      3.3 |
| groupby\_scan           |  12.3 |  22.28 |      1.8 |
| index\_join             |  1.16 |  16.71 |     14.4 |
| index\_join\_scan       |  1.14 |  15.83 |     13.9 |
| index\_scan             | 30.26 |  65.65 |      2.2 |
| oltp\_point\_select     |  0.16 |   0.58 |      3.6 |
| oltp\_read\_only        |  3.02 |   9.56 |      3.2 |
| select\_random\_points  |   0.3 |   1.37 |      4.6 |
| select\_random\_ranges  |  0.35 |   1.37 |      3.9 |
| table\_scan             | 30.81 |  61.08 |      2.0 |
| types\_table\_scan      | 70.55 | 569.67 |      8.1 |
| reads\_mean\_multiplier |       |        |      5.5 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  3.07 | 19.65 |      6.4 |
| oltp\_insert             |  1.58 |  7.98 |      5.1 |
| oltp\_read\_write        |  5.47 | 36.89 |      6.7 |
| oltp\_update\_index      |  1.61 |  9.22 |      5.7 |
| oltp\_update\_non\_index |  1.67 |  6.55 |      3.9 |
| oltp\_write\_only        |  2.52 |  26.2 |     10.4 |
| types\_delete\_insert    |  3.13 | 155.8 |     49.8 |
| writes\_mean\_multiplier |       |       |     11.1 |

| Overall Mean Multiple | 7.9 |
|-----------------------|-----|
<!-- END___LD_1___LATENCY_RESULTS_TABLE -->

### New Format (`__DOLT__`)

Below are the results of running `sysbench` MySQL tests against Dolt
SQL Server for the most recent release of Dolt in the [new 
storage format](https://www.dolthub.com/blog/2022-08-12-new-format-migraiton/).
This is not updated automatically with each release yet.
To get this performance, create your database with `dolt init --new-format`. 
<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|-------------------------|-------|-------|----------|
| covering\_index\_scan   |  1.86 |  2.71 |      1.5 |
| groupby\_scan           |  12.3 | 23.95 |      1.9 |
| index\_join             |  1.18 |  5.09 |      4.3 |
| index\_join\_scan       |  1.14 |  4.25 |      3.7 |
| index\_scan             | 30.26 | 47.47 |      1.6 |
| oltp\_point\_select     |  0.15 |  0.49 |      3.3 |
| oltp\_read\_only        |  2.91 |  8.74 |      3.0 |
| select\_random\_points  |   0.3 |   0.8 |      2.7 |
| select\_random\_ranges  |  0.35 |  1.16 |      3.3 |
| table\_scan             | 30.81 | 55.82 |      1.8 |
| types\_table\_scan      | 69.29 | 559.5 |      8.1 |
| reads\_mean\_multiplier |       |       |      3.2 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  2.66 | 11.04 |      4.2 |
| oltp\_insert             |  1.52 |  2.86 |      1.9 |
| oltp\_read\_write        |  5.18 | 17.63 |      3.4 |
| oltp\_update\_index      |  1.52 |  4.91 |      3.2 |
| oltp\_update\_non\_index |  1.44 |  5.28 |      3.7 |
| oltp\_write\_only        |   2.3 |  8.58 |      3.7 |
| types\_delete\_insert    |  2.76 | 13.22 |      4.8 |
| writes\_mean\_multiplier |       |       |      3.2 |

| Overall Mean Multiple | 3.2 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
