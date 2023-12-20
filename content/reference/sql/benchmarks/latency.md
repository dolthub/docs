---
title: Latency
---

# Latency and Throughput

Our approach to SQL performance benchmarking is to use `sysbench`, an
industry standard benchmarking tool.

## Performance Roadmap

Dolt is slower than MySQL. The goal is to get Dolt to match 
MySQL latency for common operations. Dolt is currently 2X slower 
than MySQL, approximately 1.5X on writes and 2.5X on reads. The 
`multiple` column represents this relationship with regard to a 
particular benchmark.

It's important recognize that these are industry standard tests, and
are OLTP oriented. Performance results may vary but Dolt is 
generally competitive on latency with MySQL and Postgres.

## Benchmark Data

Below are the results of running `sysbench` MySQL tests against Dolt
SQL Server for the most recent release of Dolt in the current default 
storage format. We will update this with every release. The tests 
attempt to run as many queries as possible in a fixed 2 minute time 
window. The `Dolt` and `MySQL` columns show the median latency in 
milliseconds (ms) of each query during that 2 minute time window.

The Dolt version is `1.29.6`.

<!-- START___DOLT___LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.14 |   2.86 |      1.3 |
| groupby\_scan           | 13.22 |  17.32 |      1.3 |
| index\_join             |  1.34 |   4.91 |      3.7 |
| index\_join\_scan       |  1.25 |   2.11 |      1.7 |
| index\_scan             | 34.33 |  64.47 |      1.9 |
| oltp\_point\_select     |  0.17 |   0.44 |      2.6 |
| oltp\_read\_only        |  3.36 |    7.7 |      2.3 |
| select\_random\_points  |  0.32 |   0.73 |      2.3 |
| select\_random\_ranges  |  0.39 |   0.87 |      2.2 |
| table\_scan             | 34.33 |  64.47 |      1.9 |
| types\_table\_scan      | 74.46 | 173.58 |      2.3 |
| reads\_mean\_multiplier |       |        |      2.1 |

|       Write Tests        | MySQL | Dolt | Multiple |
|--------------------------|-------|------|----------|
| oltp\_delete\_insert     |  6.21 | 6.21 |      1.0 |
| oltp\_insert             |  2.91 | 3.02 |      1.0 |
| oltp\_read\_write        |  7.56 | 15.0 |      2.0 |
| oltp\_update\_index      |  3.07 | 3.19 |      1.0 |
| oltp\_update\_non\_index |  3.19 | 3.13 |      1.0 |
| oltp\_write\_only        |  4.25 |  7.3 |      1.7 |
| types\_delete\_insert    |  5.99 | 6.79 |      1.1 |
| writes\_mean\_multiplier |       |      |      1.3 |

| Overall Mean Multiple | 1.7 |
|-----------------------|-----|
<!-- END___DOLT___LATENCY_RESULTS_TABLE -->
<br/>

> NOTE: There was a recent change in these benchmarks.
> On the night of October 31, both MySQL and Dolt write benchmarks
> got slower but MySQL's got slower more. On writes, Dolt went from 1.3X MySQL
> with no single measure faster than MySQL to 1.1X MySQL with five
> individual measures faster than MySQL. This does not correspond to a
> change in the MySQL or Dolt version.
>
> We narrowed this performance change down to a change
> in AWS Elastic Block Store latencies. Dolt relies on fsyncing
> to disk less than MySQL and thus is less sensitive to disk latency.
> We suspect some change to EBS increased disk latencies on October 31.
> 
> We chose to keep this benchmark because both Hosted Dolt and AWS RDS
> MySQL rely on EBS for disk. We are closely monitoring this benchmark and
> will be publishing more on the topic soon. 
