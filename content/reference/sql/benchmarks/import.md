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

Below are the results of the import benchmark. Like the [latency](latency.md) section, our goal is to get this to within 2-4x MySQL's performance. 

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
