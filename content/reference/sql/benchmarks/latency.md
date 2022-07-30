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

The Dolt version is `0.40.20`.
<!-- START_LATENCY_RESULTS_TABLE -->
|       Read Tests        | MySQL | Dolt  | Multiple |
|-------------------------|-------|-------|----------|
| covering\_index\_scan   |  1.79 |  6.79 |      3.8 |
| groupby\_scan           | 12.08 | 32.53 |      2.7 |
| index\_join\_scan       |  3.96 | 33.72 |      8.5 |
| index\_scan             | 36.24 | 69.29 |      1.9 |
| oltp\_point\_select     |  0.15 |  0.58 |      3.9 |
| oltp\_read\_only        |  2.97 |  9.39 |      3.2 |
| select\_random\_points  |  0.29 |  1.39 |      4.8 |
| select\_random\_ranges  |  0.34 |  1.52 |      4.5 |
| table\_scan             | 36.24 | 64.47 |      1.8 |
| reads\_mean\_multiplier |       |       |      3.9 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| bulk\_insert             | 0.001 | 0.001 |      1.0 |
| oltp\_delete\_insert     |  3.07 | 19.65 |      6.4 |
| oltp\_insert             |   1.5 |  7.98 |      5.3 |
| oltp\_read\_write        |  5.18 | 36.89 |      7.1 |
| oltp\_update\_index      |  1.64 |  9.39 |      5.7 |
| oltp\_update\_non\_index |  1.58 |  6.55 |      4.1 |
| oltp\_write\_only        |  2.35 |  26.2 |     11.1 |
| writes\_mean\_multiplier |       |       |      5.8 |

| Overall Mean Multiple | 4.7 |
|-----------------------|-----|
<!-- END_LATENCY_RESULTS_TABLE -->
<br/>

# Bulk Import Benchmarking

Dolt offers the [`table import`](../../cli.md#dolt-table-import) command to load large CSV, JSON, XLSX and Parquet files into the database. MySQL offers 
similar functionality with its [`LOAD DATA`](https://dev.mysql.com/doc/refman/8.0/en/load-data.html) command. We created a custom benchmark to measure Dolt's import performance vis-a-vis MySQL.

## Benchmark Design

The current benchmark consists of 6 CSV files according to the following schema:

```sql
CREATE TABLE `test` (
  `pk` int NOT NULL,
  `c1` bigint DEFAULT NULL,
  `c2` char(1) DEFAULT NULL,
  `c3` datetime DEFAULT NULL,
  `c4` double DEFAULT NULL,
  `c5` tinyint DEFAULT NULL,
  `c6` float DEFAULT NULL,
  `c7` varchar(255) DEFAULT NULL,
  `c8` varbinary(255) DEFAULT NULL,
  `c9` text DEFAULT NULL,
  PRIMARY KEY (`pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;

```
The CSV files are designed as follows:

- A CSV file with 100k rows in sorted key order
- A CSV file with 100k rows in random key order
- A CSV file with 1m rows in sorted key order
- A CSV file with 1m rows in random key order
- A CSV file with 10m rows in sorted key order
- A CSV file with 10m rows in random key order

For each CSV file we measured how long it took for the relevant file to get loaded in and the number of rows that were
imported per second.

## Benchmark Results

Below are the results of the import benchmark. Like the above latency section, our goal is to get this to within 2-4x MySQL's
performance. 

```
|      name       | program | version | from_time | from_rps | program | version | to_time  | to_rps  | rps_multiplier |
|-----------------|---------|---------|-----------|----------|---------|---------|----------|---------|----------------|
| 100k-sorted.csv | dolt    | 0.40.20 | 13.03s    | 7672.1   | mysql   | 8.0.22  | 1.32s    | 75571.4 | 9.9            |
| 100k-random.csv | dolt    | 0.40.20 | 13.23s    | 7556.0   | mysql   | 8.0.22  | 1.38s    | 72207.3 | 9.6            |
| 1m-sorted.csv   | dolt    | 0.40.20 | 2m29.29s  | 6698.2   | mysql   | 8.0.22  | 13.3s    | 75173.9 | 11.2           |
| 1m-random.csv   | dolt    | 0.40.20 | 2m29.48s  | 6689.9   | mysql   | 8.0.22  | 12.76s   | 78361.3 | 11.7           |
| 10m-sorted.csv  | dolt    | 0.40.20 | 27m42.44s | 6015.2   | mysql   | 8.0.22  | 2m14.22s | 74505.5 | 12.4           |
| 10m-random.csv  | dolt    | 0.40.20 | 27m48.16s | 5994.6   | mysql   | 8.0.22  | 2m13.41s | 74956.6 | 12.5           |
```
