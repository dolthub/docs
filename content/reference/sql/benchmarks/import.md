---
title: Import
---

# Bulk Import Benchmarking

Dolt supports three modes of import:

1. [`LOAD DATA INFILE`](https://dev.mysql.com/doc/refman/8.0/en/load-data.html) SQL-server command.
2. [`dolt table import`](../../cli.md#dolt-table-import) CLI command.
3. `dolt sql < import.sql` batch script import.

We recommend (1) > (2) > (3) for large import performance. `dolt table import` is the most convenient and only slightly slower than `LOAD DATA INFILE`. Refer to the [import tutorial blog](https://www.dolthub.com/blog/2022-11-21-import-perf/) for a walkthrough of the different techniques.

## Import comparison

Each result row reports the runtime for a MySQL import of a certain table schema (`test_name` and `detail`), row count (`row_cnt`), and sorting (`sorting`). `sql_mult` and `cli_mult` distinguish the Dolt SQL (sql-server `LOAD DATA`) and CLI (`dolt table import`) latencies as a multiple of the MySQL latency for the same test conditions. All MySQL tests report the `LOAD DATA` latency.

We are about 2x slower than MySQL for most import conditions. We are slightly slower importing blobs, reflecting how Dolt chunks blobs individually as prolly trees rather than a single byte array. Both Dolt and MySQL are less efficient importing sql scripts with standalone INSERT rows compared to batched insert script (we have a tool [here](https://github.com/dolthub/insert-batcher) to batch INSERT scripts).

| test_name       | detail       | row_cnt | sorted | mysql_time | sql_mult | cli_mult |
| --------------- | ------------ | ------- | ------ | ---------- | -------- | -------- |
| batching        | LOAD DATA    | 10000   | 1      | 0.08       | 0.88     |          |
| batching        | batch sql    | 10000   | 1      | 0.13       | 1.62     |          |
| batching        | by line sql  | 10000   | 1      | 0.13       | 1.54     |          |
| blob            | 1 blob       | 200000  | 1      | 1.29       | 3.52     | 3.78     |
| blob            | 2 blobs      | 200000  | 1      | 1.29       | 4.85     | 4.92     |
| blob            | no blob      | 200000  | 1      | 1.3        | 1.58     | 1.67     |
| col type        | datetime     | 200000  | 1      | 1.21       | 2.01     | 2.14     |
| col type        | varchar      | 200000  | 1      | 1          | 2.26     | 2.44     |
| config width    | 2 cols       | 200000  | 1      | 1.13       | 1.51     | 1.55     |
| config width    | 32 cols      | 200000  | 1      | 2.61       | 1.78     | 2.62     |
| config width    | 8 cols       | 200000  | 1      | 1.39       | 1.71     | 1.95     |
| pk type         | float        | 200000  | 1      | 1.28       | 1.37     | 1.38     |
| pk type         | int          | 200000  | 1      | 1.15       | 1.47     | 1.57     |
| pk type         | varchar      | 200000  | 1      | 2.22       | 1.7      | 1.92     |
| row count       | 1.6mm        | 1600000 | 1      | 8.02       | 1.78     | 1.85     |
| row count       | 400k         | 400000  | 1      | 2.06       | 1.66     | 1.68     |
| row count       | 800k         | 800000  | 1      | 4.1        | 1.75     | 1.79     |
| secondary index | four index   | 200000  | 1      | 5.86       | 1.29     | 1.39     |
| secondary index | no secondary | 200000  | 1      | 1.34       | 1.46     | 1.6      |
| secondary index | one index    | 200000  | 1      | 1.73       | 1.6      | 1.7      |
| secondary index | two index    | 200000  | 1      | 3.19       | 1.37     | 1.46     |
| sorting         | shuffled 1mm | 1000000 | 0      | 8.01       | 1.86     | 1.92     |
| sorting         | sorted 1mm   | 1000000 | 1      | 8.57       | 1.71     | 1.8      |
