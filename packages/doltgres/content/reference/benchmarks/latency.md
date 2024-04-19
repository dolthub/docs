---
title: Latency
---

Latency is measured using a standard suite of tests called [`sysbench`](https://github.com/akopytov/sysbench).

Latency is benchmarked for Doltgres release 0.4.0.

|       Read Tests        | Postgres | Doltgres | Multiple |
|-------------------------|------------|------------|----------|
| oltp\_point\_select     |       0.13 |       0.54 |      4.2 |
| oltp\_read\_only        |       2.35 |      12.75 |      5.4 |
| select\_random\_points  |        0.2 |       1.04 |      5.2 |
| select\_random\_ranges  |        0.4 |       1.03 |      2.6 |
| reads\_mean\_multiplier |            |            |      4.4 |

|       Write Tests        | Postgres | Doltgres | Multiple |
|--------------------------|------------|------------|----------|
| oltp\_insert             |       0.78 |       3.02 |      3.9 |
| oltp\_read\_write        |       3.89 |      20.37 |      5.2 |
| oltp\_update\_index      |       0.81 |       3.19 |      3.9 |
| oltp\_update\_non\_index |       0.78 |       3.13 |      4.0 |
| oltp\_write\_only        |       1.37 |       7.56 |      5.5 |
| writes\_mean\_multiplier |            |            |      4.5 |

| Overall Mean Multiple | 4.4 |
|-----------------------|-----|
<br/>