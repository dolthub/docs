---
title: Latency
---

Latency is measured using a standard suite of tests called [`sysbench`](https://github.com/akopytov/sysbench).

Latency is benchmarked for Doltgres release 0.12.0.

| Read Tests                   | PostgreSQL | DoltgreSQL | Multiple |
| ---------------------------- | ---------- | ---------- | -------- |
| covering_index_scan_postgres | 1.82       | 4.25       | 2.3      |
| groupby_scan_postgres        | 5.37       | 43.39      | 8.1      |
| index_join_postgres          | 1.96       | 10.65      | 5.4      |
| index_join_scan_postgres     | 0.74       | 9.56       | 12.9     |
| index_scan_postgres          | 18.28      | 106.75     | 5.8      |
| oltp_point_select            | 0.14       | 0.51       | 3.6      |
| oltp_read_only               | 2.52       | 12.98      | 5.2      |
| select_random_points         | 0.21       | 1.12       | 5.3      |
| select_random_ranges         | 0.41       | 1.37       | 3.3      |
| table_scan_postgres          | 18.28      | 106.75     | 5.8      |
| types_table_scan_postgres    | 44.98      | 223.34     | 5.0      |
| reads_mean_multiplier        |            |            | 5.7      |

| Write Tests                  | PostgreSQL | DoltgreSQL | Multiple |
| ---------------------------- | ---------- | ---------- | -------- |
| oltp_delete_insert_postgres  | 2.43       | 6.55       | 2.7      |
| oltp_insert                  | 0.97       | 3.25       | 3.4      |
| oltp_read_write              | 4.25       | 19.29      | 4.5      |
| oltp_update_index            | 1.03       | 3.07       | 3.0      |
| oltp_update_non_index        | 1.03       | 2.97       | 2.9      |
| oltp_write_only              | 1.64       | 6.32       | 3.9      |
| types_delete_insert_postgres | 2.03       | 6.21       | 3.1      |
| writes_mean_multiplier       |            |            | 3.4      |

| Overall Mean Multiple | 4.8 |
| --------------------- | --- |

<br/>
