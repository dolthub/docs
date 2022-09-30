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

The Dolt version is `0.50.0`.
<!-- START___LD_1___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|-------------------------|-------|-------|----------|
| covering\_index\_scan   |  1.93 |  6.79 |      3.5 |
| groupby\_scan           |  12.3 | 22.69 |      1.8 |
| index\_join             |  1.21 | 16.71 |     13.8 |
| index\_join\_scan       |  1.14 | 16.12 |     14.1 |
| index\_scan             | 30.81 | 70.55 |      2.3 |
| oltp\_point\_select     |  0.15 |  0.58 |      3.9 |
| oltp\_read\_only        |  2.97 |  9.91 |      3.3 |
| select\_random\_points  |   0.3 |  1.39 |      4.6 |
| select\_random\_ranges  |  0.35 |  1.39 |      4.0 |
| table\_scan             | 30.81 | 66.84 |      2.2 |
| types\_table\_scan      | 70.55 | 211.6 |      3.0 |
| reads\_mean\_multiplier |       |       |      5.1 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  3.36 | 19.65 |      5.8 |
| oltp\_insert             |  1.79 |  8.13 |      4.5 |
| oltp\_read\_write        |  5.28 | 37.56 |      7.1 |
| oltp\_update\_index      |  1.79 |  9.39 |      5.2 |
| oltp\_update\_non\_index |  1.73 |  6.55 |      3.8 |
| oltp\_write\_only        |  2.52 | 26.68 |     10.6 |
| types\_delete\_insert    |  3.62 | 155.8 |     43.0 |
| writes\_mean\_multiplier |       |       |     10.1 |

| Overall Mean Multiple | 7.2 |
|-----------------------|-----|
<!-- END___LD_1___LATENCY_RESULTS_TABLE -->

### New Format (`__DOLT__`)

Below are the results of running `sysbench` MySQL tests against Dolt
SQL Server for the most recent release of Dolt in the [new 
storage format](https://www.dolthub.com/blog/2022-08-12-new-format-migraiton/).
This is not updated automatically with each release yet.
To get this performance, create your database with `dolt init --new-format`. 
<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  1.93 |   2.66 |      1.4 |
| groupby\_scan           | 12.08 |  16.71 |      1.4 |
| index\_join             |  1.16 |   4.49 |      3.9 |
| index\_join\_scan       |  1.12 |   3.82 |      3.4 |
| index\_scan             | 30.26 |  53.85 |      1.8 |
| oltp\_point\_select     |  0.16 |   0.48 |      3.0 |
| oltp\_read\_only        |  2.97 |   8.58 |      2.9 |
| select\_random\_points  |   0.3 |   0.74 |      2.5 |
| select\_random\_ranges  |  0.36 |   1.12 |      3.1 |
| table\_scan             | 30.81 |  62.19 |      2.0 |
| types\_table\_scan      | 69.29 | 183.21 |      2.6 |
| reads\_mean\_multiplier |       |        |      2.5 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  2.81 | 10.84 |      3.9 |
| oltp\_insert             |  1.55 |  2.81 |      1.8 |
| oltp\_read\_write        |  5.18 | 17.01 |      3.3 |
| oltp\_update\_index      |  1.47 |  4.91 |      3.3 |
| oltp\_update\_non\_index |  1.47 |  5.18 |      3.5 |
| oltp\_write\_only        |  2.39 |  8.28 |      3.5 |
| types\_delete\_insert    |  3.07 | 12.08 |      3.9 |
| writes\_mean\_multiplier |       |       |      3.0 |

| Overall Mean Multiple | 2.7 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
