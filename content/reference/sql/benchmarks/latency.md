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

The Dolt version is `0.41.1`.
<!-- START___LD_1___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  1.96 |   6.55 |      3.3 |
| groupby\_scan           |  12.3 |  22.28 |      1.8 |
| index\_join             |  1.18 |  16.71 |     14.2 |
| index\_join\_scan       |  1.12 |  16.12 |     14.4 |
| index\_scan             | 30.81 |  66.84 |      2.2 |
| oltp\_point\_select     |  0.15 |   0.57 |      3.8 |
| oltp\_read\_only        |  2.97 |   9.56 |      3.2 |
| select\_random\_points  |   0.3 |   1.39 |      4.6 |
| select\_random\_ranges  |  0.36 |   1.37 |      3.8 |
| table\_scan             | 31.37 |  62.19 |      2.0 |
| types\_table\_scan      | 70.55 | 590.56 |      8.4 |
| reads\_mean\_multiplier |       |        |      5.6 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  3.07 | 19.65 |      6.4 |
| oltp\_insert             |  1.61 |  8.13 |      5.0 |
| oltp\_read\_write        |  5.09 | 36.89 |      7.2 |
| oltp\_update\_index      |  1.55 |  9.39 |      6.1 |
| oltp\_update\_non\_index |  1.55 |  6.43 |      4.1 |
| oltp\_write\_only        |   2.3 |  26.2 |     11.4 |
| types\_delete\_insert    |  3.19 | 155.8 |     48.8 |
| writes\_mean\_multiplier |       |       |     11.3 |

| Overall Mean Multiple | 8.0 |
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
| covering\_index\_scan   |  1.96 |   2.71 |      1.4 |
| groupby\_scan           |  12.3 |  23.95 |      1.9 |
| index\_join             |  1.18 |   5.28 |      4.5 |
| index\_join\_scan       |  1.14 |   4.33 |      3.8 |
| index\_scan             | 30.26 |  46.63 |      1.5 |
| oltp\_point\_select     |  0.15 |   0.49 |      3.3 |
| oltp\_read\_only        |  2.91 |   8.74 |      3.0 |
| select\_random\_points  |   0.3 |    0.8 |      2.7 |
| select\_random\_ranges  |  0.35 |   1.16 |      3.3 |
| table\_scan             | 30.81 |  55.82 |      1.8 |
| types\_table\_scan      | 69.29 | 549.52 |      7.9 |
| reads\_mean\_multiplier |       |        |      3.2 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  2.86 |  9.91 |      3.5 |
| oltp\_insert             |  1.58 |  2.91 |      1.8 |
| oltp\_read\_write        |  5.09 | 17.32 |      3.4 |
| oltp\_update\_index      |  1.42 |  4.49 |      3.2 |
| oltp\_update\_non\_index |  1.44 |  4.74 |      3.3 |
| oltp\_write\_only        |  2.22 |  8.28 |      3.7 |
| types\_delete\_insert    |  3.07 | 11.65 |      3.8 |
| writes\_mean\_multiplier |       |       |      3.0 |

| Overall Mean Multiple | 3.1 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
