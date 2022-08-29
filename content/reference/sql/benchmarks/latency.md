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

The Dolt version is `0.40.29`.
<!-- START_LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  1.93 |   6.43 |      3.3 |
| groupby\_scan           |  12.3 |  22.28 |      1.8 |
| index\_join\_scan       |  1.12 |  15.83 |     14.1 |
| index\_scan             | 30.26 |  65.65 |      2.2 |
| oltp\_point\_select     |  0.15 |   0.56 |      3.7 |
| oltp\_read\_only        |  2.97 |   9.39 |      3.2 |
| select\_random\_points  |   0.3 |   1.37 |      4.6 |
| select\_random\_ranges  |  0.35 |   1.34 |      3.8 |
| table\_scan             | 30.81 |  61.08 |      2.0 |
| types\_table\_scan      | 69.29 | 580.02 |      8.4 |
| reads\_mean\_multiplier |       |        |      4.7 |

|       Write Tests        | MySQL |  Dolt  | Multiple |
|--------------------------|-------|--------|----------|
| bulk\_insert             | 0.001 |  0.001 |      1.0 |
| oltp\_delete\_insert     |  2.71 |  19.65 |      7.3 |
| oltp\_insert             |  1.34 |   7.98 |      6.0 |
| oltp\_read\_write        |  5.09 |  36.89 |      7.2 |
| oltp\_update\_index      |  1.42 |   9.22 |      6.5 |
| oltp\_update\_non\_index |  1.39 |   6.43 |      4.6 |
| oltp\_write\_only        |  2.18 |   26.2 |     12.0 |
| types\_delete\_insert    |  2.81 | 158.63 |     56.5 |
| writes\_mean\_multiplier |       |        |     12.6 |

| Overall Mean Multiple | 8.2 |
|-----------------------|-----|
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>

### New Format (`__DOLT__`)

Below are the results of running `sysbench` MySQL tests against Dolt
SQL Server for the most recent release of Dolt in the [new 
storage format](https://www.dolthub.com/blog/2022-08-12-new-format-migraiton/).
This is not updated automatically with each release yet.
To get this performance, create your database with `dolt init --new-format`. 

|       Read Tests        | MySQL |  Dolt  | Multiple |
|------------------------ |-------|--------|----------|
| covering\_index_scan    |   2.0 |  2.81  |      1.5 |
| groupby\_scan           |  12.3 | 24.83  |      2.0 |
| index\_join             |  1.18 |  6.32  |      5.4 |
| index\_join_scan        |  1.12 |  7.98  |      7.0 |
| index\_scan             | 30.26 | 44.17  |      1.4 |
| oltp\_point_select      |  0.15 |  0.50  |      3.3 |
| oltp\_read\_only        |  2.97 |  8.74  |      2.9 |
| select\_random\_points  |  0.30 |  0.83  |      2.8 |
| select\_random\_ranges  |  0.35 |  1.23  |      3.5 |
| table_scan              | 30.81 | 52.89  |      1.7 |
| types\_table\_scan      | 68.05 | 539.7  |      7.7 |
| reads\_mean\_multiplier |       |        |      3.4 |

|       Write Tests        | MySQL |  Dolt  | Multiple |
|--------------------------|-------|--------|----------|
| bulk\_insert             | 0.001 |  0.001 |      1.0 |
| oltp\_delete\_insert     |  2.91 |  11.04 |      3.5 |
| oltp\_insert             |  1.44 |   2.91 |      1.9 |
| oltp\_read\_write        |  5.18 |  17.63 |      3.4 |
| oltp\_update\_index      |  1.44 |   4.91 |      3.0 |
| oltp\_update\_non\_index |  1.50 |   5.28 |      3.3 |
| oltp\_write\_only        |  2.22 |   8.58 |      3.8 |
| types\_delete\_insert    |  3.07 |  12.75 |      4.2 |
| writes\_mean\_multiplier |       |        |      3.0 |

| Overall Mean Multiple | 3.2 |
|-----------------------|-----|
<br/>
As you can see, the new format is about 3X faster than the current default format.