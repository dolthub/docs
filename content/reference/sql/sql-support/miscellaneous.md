---
title: Miscellaneous
---

# Miscellaneous

## Misc features

| Component                         | Supported | Notes and limitations                                                                                                 |
|:----------------------------------|:----------|:----------------------------------------------------------------------------------------------------------------------|
| Information schema                | ✅         |                                                                                                                       |
| Views                             | ✅         |                                                                                                                       |
| Window functions                  | 🟠         | Some functions not supported, see [window function docs](./expressions-functions-operators.md#window-functions)       |
| Common table expressions \(CTEs\) | ✅         |                                                                                                                       |
| Stored procedures                 | 🟠         | Only a few statements are not yet supported, see [compound statements](./supported-statements.md#compound-statements) |
| Cursors                           | ✅         |                                                                                                                       |
| Triggers                          | ✅         |                                                                                                                       |

## Client Compatibility

Some MySQL features are client features, not server features. Dolt ships with a client (ie. [`dolt sql`](../../cli/cli.md#dolt-sql)) and a server ([`dolt sql-server`](../../cli/cli.md#dolt-sql-server)). The Dolt client is not as sophisticated as the `mysql` client. To access these features you can use the `mysql` client that ships with MySQL.

| Feature                         | Supported | Notes and limitations                                                                                    |
|:--------------------------------|:----------|:---------------------------------------------------------------------------------------------------------|
| SOURCE                          | ❌        | Works with Dolt via the `mysql` client                                                                    |
| LOAD DATA LOCAL INFILE          | ❌        | LOAD DATA INFILE works with the Dolt client. The LOCAL option only works with Dolt via the `mysql` client |

## Join hints

Dolt supports the following join hints:

| name                     | supported | detail                                                                                          |
|--------------------------|-----------|-------------------------------------------------------------------------------------------------|
| JOIN_ORDER(<table1>,...) | ✅         | Join tree in scope should use the following join execution order. Must include all table names. |
| LOOKUP_JOIN(<t1>,<t2>)   | ✅         | Use LOOKUP strategy joining two tables.                                                         |
| MERGE_JOIN(<t1>,<t2>)    | ✅         | Use MERGE strategy joining two tables.                                                          |
| HASH_JOIN(<t1>,<t2>)     | ✅         | Use HASH strategy joining two tables.                                                           |
| INNER_JOIN(<t1>,<t2>)    | ✅         | Use INNER strategy joining two tables.                                                          |
| SEMI_JOIN(<t1>,<t2>)     | ✅         | Use SEMI strategy joining two tables (for `EXISTS` or `IN` queries).                            |
| ANTI_JOIN(<t1>,<t2>)     | ✅         | Use ANTI strategy joining two tables (for `NOT EXISTS` or `NOT IN` queries).                    |
| JOIN_FIXED_ORDER         | ❌         | Join tree uses in-place table order for execution.                                              |
| NO_ICP                   | ❌         | Disable indexed range scans on index using filters.                                             |

Join hints are indicated immediately after a `SELECT` token in a special
comment format `/*+ */`. Multiple hints should be separated by spaces:

```sql
SELECT /*+ JOIN_ORDER(arg1,arg2) */ 1
SELECT /*+ JOIN_ORDER(arg1,arg2) NO_ICP */ 1
```

Join hints currently require a full set of valid hints for all to be
applied. For example, if we have a three table join we can enforce
JOIN_ORDER on its own, join strategies on their own, or both order
and strategy:

```sql
SELECT /*+ JOIN_ORDER(xy,uv,ab) LOOKUP_JOIN(xy,uv) HASH_JOIN(uv,ab) */ 1
FROM xy
JOIN uv on x = u
JOIN ab on a = u;
```

Additional notes:
- If one hint is invalid given the execution options, no hints are applied and the engine falls back to default costing.
- Join operator hints are order-insensitive
- Join operator hints apply as long as the indicated tables are subsets of the join left/right.

## Table Statistics

### ANALYZE table

Dolt currently supports table statistics for index and join costing.

Statistics are collected by running `ANALYZE TABLE <table, ...>`.

Here is an example of how to initialize and observe statistics:

```sql
CREATE TABLE xy (x int primary key, y int);
INSERT INTO xy values (1,1), (2,2);
ANALYZE TABLE xy;
SELECT * from information_schema.tables;
+-------------+------------+-------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| SCHEMA_NAME | TABLE_NAME | COLUMN_NAME | HISTOGRAM                                                                                                                                                                                                                                                                                                                                                      |
+-------------+------------+-------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| tmp4        | xy         | x           | {"statistic": {"avg_size": 0, "buckets": [{"bound_count": 1, "distinct_count": 2, "mcv_counts": [1,1], "mcvs": [[1],[2]], "null_count": 0, "row_count": 2, "upper_bound": [2]}], "columns": ["x"], "created_at": "2023-11-14T11:33:32.250178-08:00", "distinct_count": 2, "null_count": 2, "qualifier": "tmp4.xy.PRIMARY", "row_count": 2, "types:": ["int"]}} |
+-------------+------------+-------------+----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

Statistics are persisted in database's chunk store in a `refs/stats` ref stored separately from the commit graph. Each database has its own statistics store. The contents of the `refs/stats` reflect a single point-in-time for a single branch and are un-versioned. The contents of this ref in the current database can be inspected with the `dolt_statistics` system table. 

```sql
create table horses (id int primary key, name varchar(10), key(name));
insert into horses select x, 'Steve' from (with recursive inputs(x) as (select 1 union select x+1 from inputs where x < 1000) select * from inputs) dt;
analyze table horses;
select `index`, `position`, row_count, distinct_count, columns, upper_bound, upper_bound_cnt, mcv1 from dolt_statistics;
+---------+----------+-----------+----------------+----------+-------------+-----------------+-----------+
| index   | position | row_count | distinct_count | columns  | upper_bound | upper_bound_cnt | mcv1      |
+---------+----------+-----------+----------------+----------+-------------+-----------------+-----------+
| primary | 0        | 344       | 344            | ["id"]   | [344]       | 1               | [344]     |
| primary | 1        | 125       | 125            | ["id"]   | [469]       | 1               | [469]     |
| primary | 2        | 249       | 249            | ["id"]   | [718]       | 1               | [718]     |
| primary | 3        | 112       | 112            | ["id"]   | [830]       | 1               | [830]     |
| primary | 4        | 170       | 170            | ["id"]   | [1000]      | 1               | [1000]    |
| name    | 5        | 260       | 1              | ["name"] | ["Steve"]   | 260             | ["Steve"] |
| name    | 6        | 237       | 1              | ["name"] | ["Steve"]   | 237             | ["Steve"] |
| name    | 7        | 137       | 1              | ["name"] | ["Steve"]   | 137             | ["Steve"] |
| name    | 8        | 188       | 1              | ["name"] | ["Steve"]   | 188             | ["Steve"] |
| name    | 9        | 178       | 1              | ["name"] | ["Steve"]   | 178             | ["Steve"] |
+---------+----------+-----------+----------------+----------+-------------+-----------------+-----------+
```

### Auto-Refresh

Static statistics become stale quickly for tables that change frequently. Users can choose to manually manage run `ANALYZE` statements, or use some form of auto-refresh.

Auto-refresh statistic updates work the same way as partial `ANALYZE` updates. A table's "former" and "new" chunk set will 1) share common chunks preexisting in "former" 2) differ by deleted chunks only in the "former" table, and 3) differ by new chunks in the "new" table. This mirrors Dolt's inherent structural sharing. Rather than forcing an update on every refresh interval, we can toggle how many changes triggers the update.

When the auto-refresh threshold is 0%, the auto-refresh thread behaves like a cron job that runs `ANALYZE` periodically.

Setting a non-zero threshold defers updates until after a certain fraction of chunks are edited. For example, a 100% difference threshold updates stats when:

1) The table was previously empty and now contains data.

2) The table grew or shrank such that the tree height grew or shrank, and therefore the target fanout level changed.

3) Inserts added twice as many chunks.

4) Deletes removed 100% of the preexisting chunks.

5) 50% of the chunks were edited (an in-place edit deletes one chunk and adds one chunk, for a total of two changes relative to the original chunk)

Any combination of edits/inserts/deletes that exceeds the trigger threshold will also update stats.

We enable refresh with one mandatory and two optional system variables:

```sql
dolt sql -q "set @@PERSIST.dolt_stats_auto_refresh_enabled   = 1;"
dolt sql -q "set @@PERSIST.dolt_stats_auto_refresh_interval  = 120;"
dolt sql -q "set @@PERSIST.dolt_stats_auto_refresh_threshold = 0.5"
```

The first enables auto-refresh. It is a global variable that must be set during `dolt sql-server` startup and affects all databases in a server context. Databases added or dropped to a running server automatically opt-in to statistics refresh if enabled.

The second two variables configure 1) how often a timer wakes up to check stats freshness (seconds), and 2) the threshold updating a table's active statistics (new+deleted/previous chunks as a percentage between 0-1). For example, `dolt_stats_auto_refresh_interval = 600` means the server only attempt to update stats every 10 minutes, regardless of how much a table has changed. Setting `dolt_stats_auto_refresh_threshold = 0` forces stats to update in response to any table change.

A last variable blocks statistics from loading from disk on startup, or writing to disk on ANALYZE:

```sql
dolt sql -q "set @@PERSIST.dolt_stats_memory_only = 1"
```

### Performance

Lowering check intervals and update thresholds increases the refresh read and write load. Refreshing statistics uses shortcuts to avoid reading from disk when possible, but in most cases at least needs to read the target fanout level of the tree from disk to compare previous and current chunk sets. Exceeding the refresh threshold reads all data from disk associated with the new chunk ranges, which will be the most expensive impact of auto-refresh. Dolt uses ordinal offsets to avoid reading unnecessary data, but the tree growing or shrinking by a level forces a full tablescan.

For example, setting the check interval to 0 seconds (constant), the update threshold to 0 (any change triggers refresh) reduces the `oltp_read_write` sysbench benchmark's throughput by 15%. An increase in the update threshold for a 0-interval reduces throughput even more. On the other hand, basically any non-zero interval reduces the fraction of time spent performing stats updates to a negligible level:

| interval(s) | threshold(%) | latency  |
|------------|---------------|----------|
| 0          | 0             | -15%     |
| 0          | 1             | -46%     |
| 0          | 10            | -45%     |
| 1          | 0             | -.1%     |
| 1          | 1             | 0%       |

A small set of TPC-C run with one thread has a similar pattern compared to the baseline values, comparing queries per second (qps) now:

| interval(s) | threshold(%) | qps  |
|-------------|--------------|------|
| 0           | 0            | -15% |
| 0           | 1            | -26% |
| 0           | 10           | -10% |
| 1           | 0            | -4%  |
| 1           | 1            | 0%   |

Statistics' usefulness is rarely improved by immediate updates. Updating every minute or hour is probably fine for most workloads. If you do need quick statistics updates, performing them immediately instead of in batches appears to be preferable with the current implementation tradeoffs.

Statistics also have read performance implications, expensing more compute cycles to obtain better join cost estimates. Histograms with the maximum bucket fanout will be the most expensive to use. That said, at the time of writing this sysbench read benchmarks are not impacted by stats estimate overhead. Behavior for custom workloads will depend on read/write/freshness trade-offs.

## Collations and character sets

Dolt supports a subset of the character sets and collations that MySQL supports.
Notably, the default character set is `utf8mb4`, while the default collation is `utf8mb4_0900_bin` (a case-sensitive collation).
This default was chosen as it has the fastest implementation, and also from a legacy perspective, as before proper collation support was added, it was the only real collation that we supported.
This differs from a standard MySQL instance, which defaults to `utf8mb4_0900_ai_ci` (a case-insensitive collation).
Character sets and collations are added upon request, so please [file an issue](https://github.com/dolthub/dolt/issues) if a character set or collation that you need is missing.

| Collation                   | Character Set | Supported |
|:----------------------------|:--------------|:----------|
| armscii8_bin                | armscii8      | ❌         |
| armscii8_general_ci         | armscii8      | ❌         |
| ascii_bin                   | ascii         | ✅         |
| ascii_general_ci            | ascii         | ✅         |
| big5_bin                    | big5          | ❌         |
| big5_chinese_ci             | big5          | ❌         |
| binary                      | binary        | ✅         |
| cp1250_bin                  | cp1250        | ❌         |
| cp1250_croatian_ci          | cp1250        | ❌         |
| cp1250_czech_cs             | cp1250        | ❌         |
| cp1250_general_ci           | cp1250        | ❌         |
| cp1250_polish_ci            | cp1250        | ❌         |
| cp1251_bin                  | cp1251        | ❌         |
| cp1251_bulgarian_ci         | cp1251        | ❌         |
| cp1251_general_ci           | cp1251        | ❌         |
| cp1251_general_cs           | cp1251        | ❌         |
| cp1251_ukrainian_ci         | cp1251        | ❌         |
| cp1256_bin                  | cp1256        | ✅         |
| cp1256_general_ci           | cp1256        | ✅         |
| cp1257_bin                  | cp1257        | ✅         |
| cp1257_general_ci           | cp1257        | ✅         |
| cp1257_lithuanian_ci        | cp1257        | ✅         |
| cp850_bin                   | cp850         | ❌         |
| cp850_general_ci            | cp850         | ❌         |
| cp852_bin                   | cp852         | ❌         |
| cp852_general_ci            | cp852         | ❌         |
| cp866_bin                   | cp866         | ❌         |
| cp866_general_ci            | cp866         | ❌         |
| cp932_bin                   | cp932         | ❌         |
| cp932_japanese_ci           | cp932         | ❌         |
| dec8_bin                    | dec8          | ✅         |
| dec8_swedish_ci             | dec8          | ✅         |
| eucjpms_bin                 | eucjpms       | ❌         |
| eucjpms_japanese_ci         | eucjpms       | ❌         |
| euckr_bin                   | euckr         | ❌         |
| euckr_korean_ci             | euckr         | ❌         |
| gb18030_bin                 | gb18030       | ❌         |
| gb18030_chinese_ci          | gb18030       | ❌         |
| gb18030_unicode_520_ci      | gb18030       | ❌         |
| gb2312_bin                  | gb2312        | ❌         |
| gb2312_chinese_ci           | gb2312        | ❌         |
| gbk_bin                     | gbk           | ❌         |
| gbk_chinese_ci              | gbk           | ❌         |
| geostd8_bin                 | geostd8       | ✅         |
| geostd8_general_ci          | geostd8       | ✅         |
| greek_bin                   | greek         | ❌         |
| greek_general_ci            | greek         | ❌         |
| hebrew_bin                  | hebrew        | ❌         |
| hebrew_general_ci           | hebrew        | ❌         |
| hp8_bin                     | hp8           | ❌         |
| hp8_english_ci              | hp8           | ❌         |
| keybcs2_bin                 | keybcs2       | ❌         |
| keybcs2_general_ci          | keybcs2       | ❌         |
| koi8r_bin                   | koi8r         | ❌         |
| koi8r_general_ci            | koi8r         | ❌         |
| koi8u_bin                   | koi8u         | ❌         |
| koi8u_general_ci            | koi8u         | ❌         |
| latin1_bin                  | latin1        | ✅         |
| latin1_danish_ci            | latin1        | ✅         |
| latin1_general_ci           | latin1        | ✅         |
| latin1_general_cs           | latin1        | ✅         |
| latin1_german1_ci           | latin1        | ✅         |
| latin1_german2_ci           | latin1        | ✅         |
| latin1_spanish_ci           | latin1        | ✅         |
| latin1_swedish_ci           | latin1        | ✅         |
| latin2_bin                  | latin2        | ❌         |
| latin2_croatian_ci          | latin2        | ❌         |
| latin2_czech_cs             | latin2        | ❌         |
| latin2_general_ci           | latin2        | ❌         |
| latin2_hungarian_ci         | latin2        | ❌         |
| latin5_bin                  | latin5        | ❌         |
| latin5_turkish_ci           | latin5        | ❌         |
| latin7_bin                  | latin7        | ✅         |
| latin7_estonian_cs          | latin7        | ✅         |
| latin7_general_ci           | latin7        | ✅         |
| latin7_general_cs           | latin7        | ✅         |
| macce_bin                   | macce         | ❌         |
| macce_general_ci            | macce         | ❌         |
| macroman_bin                | macroman      | ❌         |
| macroman_general_ci         | macroman      | ❌         |
| sjis_bin                    | sjis          | ❌         |
| sjis_japanese_ci            | sjis          | ❌         |
| swe7_bin                    | swe7          | ✅         |
| swe7_swedish_ci             | swe7          | ✅         |
| tis620_bin                  | tis620        | ❌         |
| tis620_thai_ci              | tis620        | ❌         |
| ucs2_bin                    | ucs2          | ❌         |
| ucs2_croatian_ci            | ucs2          | ❌         |
| ucs2_czech_ci               | ucs2          | ❌         |
| ucs2_danish_ci              | ucs2          | ❌         |
| ucs2_esperanto_ci           | ucs2          | ❌         |
| ucs2_estonian_ci            | ucs2          | ❌         |
| ucs2_general_ci             | ucs2          | ❌         |
| ucs2_general_mysql500_ci    | ucs2          | ❌         |
| ucs2_german2_ci             | ucs2          | ❌         |
| ucs2_hungarian_ci           | ucs2          | ❌         |
| ucs2_icelandic_ci           | ucs2          | ❌         |
| ucs2_latvian_ci             | ucs2          | ❌         |
| ucs2_lithuanian_ci          | ucs2          | ❌         |
| ucs2_persian_ci             | ucs2          | ❌         |
| ucs2_polish_ci              | ucs2          | ❌         |
| ucs2_roman_ci               | ucs2          | ❌         |
| ucs2_romanian_ci            | ucs2          | ❌         |
| ucs2_sinhala_ci             | ucs2          | ❌         |
| ucs2_slovak_ci              | ucs2          | ❌         |
| ucs2_slovenian_ci           | ucs2          | ❌         |
| ucs2_spanish2_ci            | ucs2          | ❌         |
| ucs2_spanish_ci             | ucs2          | ❌         |
| ucs2_swedish_ci             | ucs2          | ❌         |
| ucs2_turkish_ci             | ucs2          | ❌         |
| ucs2_unicode_520_ci         | ucs2          | ❌         |
| ucs2_unicode_ci             | ucs2          | ❌         |
| ucs2_vietnamese_ci          | ucs2          | ❌         |
| ujis_bin                    | ujis          | ❌         |
| ujis_japanese_ci            | ujis          | ❌         |
| utf16_bin                   | utf16         | ✅         |
| utf16_croatian_ci           | utf16         | ✅         |
| utf16_czech_ci              | utf16         | ✅         |
| utf16_danish_ci             | utf16         | ✅         |
| utf16_esperanto_ci          | utf16         | ✅         |
| utf16_estonian_ci           | utf16         | ✅         |
| utf16_general_ci            | utf16         | ✅         |
| utf16_german2_ci            | utf16         | ✅         |
| utf16_hungarian_ci          | utf16         | ✅         |
| utf16_icelandic_ci          | utf16         | ✅         |
| utf16_latvian_ci            | utf16         | ✅         |
| utf16_lithuanian_ci         | utf16         | ✅         |
| utf16_persian_ci            | utf16         | ✅         |
| utf16_polish_ci             | utf16         | ✅         |
| utf16_roman_ci              | utf16         | ✅         |
| utf16_romanian_ci           | utf16         | ✅         |
| utf16_sinhala_ci            | utf16         | ✅         |
| utf16_slovak_ci             | utf16         | ✅         |
| utf16_slovenian_ci          | utf16         | ✅         |
| utf16_spanish2_ci           | utf16         | ✅         |
| utf16_spanish_ci            | utf16         | ✅         |
| utf16_swedish_ci            | utf16         | ✅         |
| utf16_turkish_ci            | utf16         | ✅         |
| utf16_unicode_520_ci        | utf16         | ✅         |
| utf16_unicode_ci            | utf16         | ✅         |
| utf16_vietnamese_ci         | utf16         | ✅         |
| utf16le_bin                 | utf16le       | ❌         |
| utf16le_general_ci          | utf16le       | ❌         |
| utf32_bin                   | utf32         | ✅         |
| utf32_croatian_ci           | utf32         | ✅         |
| utf32_czech_ci              | utf32         | ✅         |
| utf32_danish_ci             | utf32         | ✅         |
| utf32_esperanto_ci          | utf32         | ✅         |
| utf32_estonian_ci           | utf32         | ✅         |
| utf32_general_ci            | utf32         | ✅         |
| utf32_german2_ci            | utf32         | ✅         |
| utf32_hungarian_ci          | utf32         | ✅         |
| utf32_icelandic_ci          | utf32         | ✅         |
| utf32_latvian_ci            | utf32         | ✅         |
| utf32_lithuanian_ci         | utf32         | ✅         |
| utf32_persian_ci            | utf32         | ✅         |
| utf32_polish_ci             | utf32         | ✅         |
| utf32_roman_ci              | utf32         | ✅         |
| utf32_romanian_ci           | utf32         | ✅         |
| utf32_sinhala_ci            | utf32         | ✅         |
| utf32_slovak_ci             | utf32         | ✅         |
| utf32_slovenian_ci          | utf32         | ✅         |
| utf32_spanish2_ci           | utf32         | ✅         |
| utf32_spanish_ci            | utf32         | ✅         |
| utf32_swedish_ci            | utf32         | ✅         |
| utf32_turkish_ci            | utf32         | ✅         |
| utf32_unicode_520_ci        | utf32         | ✅         |
| utf32_unicode_ci            | utf32         | ✅         |
| utf32_vietnamese_ci         | utf32         | ✅         |
| utf8mb3_bin                 | utf8mb3       | ✅         |
| utf8mb3_croatian_ci         | utf8mb3       | ✅         |
| utf8mb3_czech_ci            | utf8mb3       | ✅         |
| utf8mb3_danish_ci           | utf8mb3       | ✅         |
| utf8mb3_esperanto_ci        | utf8mb3       | ✅         |
| utf8mb3_estonian_ci         | utf8mb3       | ✅         |
| utf8mb3_general_ci          | utf8mb3       | ✅         |
| utf8mb3_general_mysql500_ci | utf8mb3       | ✅         |
| utf8mb3_german2_ci          | utf8mb3       | ✅         |
| utf8mb3_hungarian_ci        | utf8mb3       | ✅         |
| utf8mb3_icelandic_ci        | utf8mb3       | ✅         |
| utf8mb3_latvian_ci          | utf8mb3       | ✅         |
| utf8mb3_lithuanian_ci       | utf8mb3       | ✅         |
| utf8mb3_persian_ci          | utf8mb3       | ✅         |
| utf8mb3_polish_ci           | utf8mb3       | ✅         |
| utf8mb3_roman_ci            | utf8mb3       | ✅         |
| utf8mb3_romanian_ci         | utf8mb3       | ✅         |
| utf8mb3_sinhala_ci          | utf8mb3       | ✅         |
| utf8mb3_slovak_ci           | utf8mb3       | ✅         |
| utf8mb3_slovenian_ci        | utf8mb3       | ✅         |
| utf8mb3_spanish2_ci         | utf8mb3       | ✅         |
| utf8mb3_spanish_ci          | utf8mb3       | ✅         |
| utf8mb3_swedish_ci          | utf8mb3       | ✅         |
| utf8mb3_tolower_ci          | utf8mb3       | ✅         |
| utf8mb3_turkish_ci          | utf8mb3       | ✅         |
| utf8mb3_unicode_520_ci      | utf8mb3       | ✅         |
| utf8mb3_unicode_ci          | utf8mb3       | ✅         |
| utf8mb3_vietnamese_ci       | utf8mb3       | ✅         |
| utf8mb4_0900_ai_ci          | utf8mb4       | ✅         |
| utf8mb4_0900_as_ci          | utf8mb4       | ✅         |
| utf8mb4_0900_as_cs          | utf8mb4       | ✅         |
| utf8mb4_0900_bin            | utf8mb4       | ✅         |
| utf8mb4_bg_0900_ai_ci       | utf8mb4       | ❌         |
| utf8mb4_bg_0900_as_cs       | utf8mb4       | ❌         |
| utf8mb4_bin                 | utf8mb4       | ✅         |
| utf8mb4_bs_0900_ai_ci       | utf8mb4       | ❌         |
| utf8mb4_bs_0900_as_cs       | utf8mb4       | ❌         |
| utf8mb4_croatian_ci         | utf8mb4       | ✅         |
| utf8mb4_cs_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_cs_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_czech_ci            | utf8mb4       | ✅         |
| utf8mb4_da_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_da_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_danish_ci           | utf8mb4       | ✅         |
| utf8mb4_de_pb_0900_ai_ci    | utf8mb4       | ✅         |
| utf8mb4_de_pb_0900_as_cs    | utf8mb4       | ✅         |
| utf8mb4_eo_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_eo_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_es_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_es_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_es_trad_0900_ai_ci  | utf8mb4       | ✅         |
| utf8mb4_es_trad_0900_as_cs  | utf8mb4       | ✅         |
| utf8mb4_esperanto_ci        | utf8mb4       | ✅         |
| utf8mb4_estonian_ci         | utf8mb4       | ✅         |
| utf8mb4_et_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_et_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_general_ci          | utf8mb4       | ✅         |
| utf8mb4_german2_ci          | utf8mb4       | ✅         |
| utf8mb4_gl_0900_ai_ci       | utf8mb4       | ❌         |
| utf8mb4_gl_0900_as_cs       | utf8mb4       | ❌         |
| utf8mb4_hr_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_hr_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_hu_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_hu_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_hungarian_ci        | utf8mb4       | ✅         |
| utf8mb4_icelandic_ci        | utf8mb4       | ✅         |
| utf8mb4_is_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_is_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_ja_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_ja_0900_as_cs_ks    | utf8mb4       | ✅         |
| utf8mb4_la_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_la_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_latvian_ci          | utf8mb4       | ✅         |
| utf8mb4_lithuanian_ci       | utf8mb4       | ✅         |
| utf8mb4_lt_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_lt_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_lv_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_lv_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_mn_cyrl_0900_ai_ci  | utf8mb4       | ❌         |
| utf8mb4_mn_cyrl_0900_as_cs  | utf8mb4       | ❌         |
| utf8mb4_nb_0900_ai_ci       | utf8mb4       | ❌         |
| utf8mb4_nb_0900_as_cs       | utf8mb4       | ❌         |
| utf8mb4_nn_0900_ai_ci       | utf8mb4       | ❌         |
| utf8mb4_nn_0900_as_cs       | utf8mb4       | ❌         |
| utf8mb4_persian_ci          | utf8mb4       | ✅         |
| utf8mb4_pl_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_pl_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_polish_ci           | utf8mb4       | ✅         |
| utf8mb4_ro_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_ro_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_roman_ci            | utf8mb4       | ✅         |
| utf8mb4_romanian_ci         | utf8mb4       | ✅         |
| utf8mb4_ru_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_ru_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_sinhala_ci          | utf8mb4       | ✅         |
| utf8mb4_sk_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_sk_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_sl_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_sl_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_slovak_ci           | utf8mb4       | ✅         |
| utf8mb4_slovenian_ci        | utf8mb4       | ✅         |
| utf8mb4_spanish2_ci         | utf8mb4       | ✅         |
| utf8mb4_spanish_ci          | utf8mb4       | ✅         |
| utf8mb4_sr_latn_0900_ai_ci  | utf8mb4       | ❌         |
| utf8mb4_sr_latn_0900_as_cs  | utf8mb4       | ❌         |
| utf8mb4_sv_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_sv_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_swedish_ci          | utf8mb4       | ✅         |
| utf8mb4_tr_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_tr_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_turkish_ci          | utf8mb4       | ✅         |
| utf8mb4_unicode_520_ci      | utf8mb4       | ✅         |
| utf8mb4_unicode_ci          | utf8mb4       | ✅         |
| utf8mb4_vi_0900_ai_ci       | utf8mb4       | ✅         |
| utf8mb4_vi_0900_as_cs       | utf8mb4       | ✅         |
| utf8mb4_vietnamese_ci       | utf8mb4       | ✅         |
| utf8mb4_zh_0900_as_cs       | utf8mb4       | ✅         |
