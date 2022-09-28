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

The Dolt version is `0.41.6`.
<!-- START___LD_1___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  1.96 |   6.43 |      3.3 |
| groupby\_scan           | 12.52 |  21.89 |      1.7 |
| index\_join             |  1.18 |  16.41 |     13.9 |
| index\_join\_scan       |  1.14 |  15.55 |     13.6 |
| index\_scan             | 30.26 |  71.83 |      2.4 |
| oltp\_point\_select     |  0.15 |   0.57 |      3.8 |
| oltp\_read\_only        |  2.97 |   9.56 |      3.2 |
| select\_random\_points  |   0.3 |   1.37 |      4.6 |
| select\_random\_ranges  |  0.35 |   1.37 |      3.9 |
| table\_scan             | 30.81 |  68.05 |      2.2 |
| types\_table\_scan      | 68.05 | 215.44 |      3.2 |
| reads\_mean\_multiplier |       |        |      5.1 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  2.76 | 19.65 |      7.1 |
| oltp\_insert             |  1.61 |  7.98 |      5.0 |
| oltp\_read\_write        |  5.18 | 36.89 |      7.1 |
| oltp\_update\_index      |  1.52 |  9.39 |      6.2 |
| oltp\_update\_non\_index |  1.58 |  6.43 |      4.1 |
| oltp\_write\_only        |  2.43 |  26.2 |     10.8 |
| types\_delete\_insert    |  2.91 | 155.8 |     53.5 |
| writes\_mean\_multiplier |       |       |     11.9 |

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
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  1.93 |   2.76 |      1.4 |
| groupby\_scan           | 12.52 |  17.32 |      1.4 |
| index\_join             |  1.18 |   4.49 |      3.8 |
| index\_join\_scan       |  1.14 |   3.82 |      3.4 |
| index\_scan             | 30.26 |  53.85 |      1.8 |
| oltp\_point\_select     |  0.15 |   0.47 |      3.1 |
| oltp\_read\_only        |  2.97 |   8.43 |      2.8 |
| select\_random\_points  |   0.3 |   0.73 |      2.4 |
| select\_random\_ranges  |  0.35 |   1.14 |      3.3 |
| table\_scan             | 30.81 |  62.19 |      2.0 |
| types\_table\_scan      | 71.83 | 183.21 |      2.6 |
| reads\_mean\_multiplier |       |        |      2.5 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  3.02 |  9.56 |      3.2 |
| oltp\_insert             |  1.58 |  2.81 |      1.8 |
| oltp\_read\_write        |  5.18 | 16.71 |      3.2 |
| oltp\_update\_index      |  1.52 |  4.33 |      2.8 |
| oltp\_update\_non\_index |  1.47 |  4.65 |      3.2 |
| oltp\_write\_only        |   2.3 |  7.98 |      3.5 |
| types\_delete\_insert    |  3.07 | 10.84 |      3.5 |
| writes\_mean\_multiplier |       |       |      2.8 |

| Overall Mean Multiple | 2.6 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
