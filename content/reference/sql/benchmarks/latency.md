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

The Dolt version is `0.41.4`.
<!-- START___LD_1___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  1.93 |   6.55 |      3.4 |
| groupby\_scan           |  12.3 |  22.28 |      1.8 |
| index\_join             |  1.18 |  17.01 |     14.4 |
| index\_join\_scan       |  1.14 |  16.12 |     14.1 |
| index\_scan             | 30.26 |  73.13 |      2.4 |
| oltp\_point\_select     |  0.15 |   0.57 |      3.8 |
| oltp\_read\_only        |  2.91 |   9.56 |      3.3 |
| select\_random\_points  |   0.3 |   1.37 |      4.6 |
| select\_random\_ranges  |  0.35 |   1.37 |      3.9 |
| table\_scan             | 30.81 |  70.55 |      2.3 |
| types\_table\_scan      | 69.29 | 601.29 |      8.7 |
| reads\_mean\_multiplier |       |        |      5.7 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  2.91 | 19.65 |      6.8 |
| oltp\_insert             |  1.47 |  7.98 |      5.4 |
| oltp\_read\_write        |  5.09 | 36.89 |      7.2 |
| oltp\_update\_index      |  1.47 |  9.39 |      6.4 |
| oltp\_update\_non\_index |  1.44 |  6.55 |      4.5 |
| oltp\_write\_only        |   2.3 |  26.2 |     11.4 |
| types\_delete\_insert    |  2.97 | 155.8 |     52.5 |
| writes\_mean\_multiplier |       |       |     11.9 |

| Overall Mean Multiple | 8.3 |
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
| covering\_index\_scan   |   2.0 |   2.76 |      1.4 |
| groupby\_scan           | 12.52 |  17.32 |      1.4 |
| index\_join             |  1.18 |   4.57 |      3.9 |
| index\_join\_scan       |  1.16 |   3.96 |      3.4 |
| index\_scan             | 30.26 |  54.83 |      1.8 |
| oltp\_point\_select     |  0.15 |   0.47 |      3.1 |
| oltp\_read\_only        |  2.97 |   8.28 |      2.8 |
| select\_random\_points  |   0.3 |   0.73 |      2.4 |
| select\_random\_ranges  |  0.35 |   1.12 |      3.2 |
| table\_scan             | 30.81 |  64.47 |      2.1 |
| types\_table\_scan      | 70.55 | 569.67 |      8.1 |
| reads\_mean\_multiplier |       |        |      3.1 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  3.55 | 11.65 |      3.3 |
| oltp\_insert             |  1.58 |  2.81 |      1.8 |
| oltp\_read\_write        |  5.18 | 17.01 |      3.3 |
| oltp\_update\_index      |  1.58 |  5.18 |      3.3 |
| oltp\_update\_non\_index |  1.58 |  5.47 |      3.5 |
| oltp\_write\_only        |  2.43 |  8.28 |      3.4 |
| types\_delete\_insert    |  3.36 | 12.75 |      3.8 |
| writes\_mean\_multiplier |       |       |      2.9 |

| Overall Mean Multiple | 3.0 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>
