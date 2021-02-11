---
title: Supported SQL Features
---

# SQL Support

Dolt's goal is to be a drop-in replacement for MySQL, with every query and statement that works in MySQL behaving identically in Dolt. For most syntax and technical questions, you should feel free to refer to the [MySQL user manual](https://dev.mysql.com/doc/refman/8.0/en/select.html). Any deviation from the MySQL manual should be documented on this page, or else indicates a bug. Please [file issues](https://github.com/dolthub/dolt/issues) with any incompatibilities you discover.

### Data types

| Data type | Supported | Notes |
| :--- | :--- | :--- |
| `BOOLEAN` | ✓ | Alias for `TINYINT` |
| `INTEGER` | ✓ |  |
| `TINYINT` | ✓ |  |
| `SMALLINT` | ✓ |  |
| `MEDIUMINT` | ✓ |  |
| `INT` | ✓ |  |
| `BIGINT` | ✓ |  |
| `DECIMAL` | ✓ | Max \(precision + scale\) is 65 |
| `FLOAT` | ✓ |  |
| `DOUBLE` | ✓ |  |
| `BIT` | ✓ |  |
| `DATE` | ✓ |  |
| `TIME` | ✓ |  |
| `DATETIME` | ✓ |  |
| `TIMESTAMP` | ✓ |  |
| `YEAR` | ✓ |  |
| `CHAR` | ✓ |  |
| `VARCHAR` | ✓ |  |
| `BINARY` | ✓ |  |
| `VARBINARY` | ✓ |  |
| `BLOB` | ✓ |  |
| `TINYTEXT` | ✓ |  |
| `TEXT` | ✓ |  |
| `MEDIUMTEXT` | ✓ |  |
| `LONGTEXT` | ✓ |  |
| `ENUM` | ✓ |  |
| `SET` | ✓ |  |
| `GEOMETRY` | X |  |
| `POINT` | X |  |
| `LINESTRING` | X |  |
| `POLYGON` | X |  |
| `MULTIPOINT` | X |  |
| `MULTILINESTRING` | X |  |
| `MULTIPOLYGON` | X |  |
| `GEOMETRYCOLLECTION` | X |  |
| `JSON` | X |  |

### Constraints

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Not Null | ✓ |  |
| Unique | ✓ | Unique constraints are supported via creation of indexes with `UNIQUE` keys. |
| Primary Key | ✓ | Dolt tables must have a primary key. |
| Check | X |  |
| Foreign Key | ✓ |  |
| Default Value | ✓ |  |

### Transactions

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `BEGIN` | O | `BEGIN` parses correctly, but is a no-op: it doesn't create a checkpoint that can be returned to with `ROLLBACK`. |
| `COMMIT` | ✓ | `COMMIT` will write any pending changes to the working set when `@@autocommit = false` |
| `COMMIT(MESSAGE)` | ✓ | The `COMMIT()` function creates a commit of the current database state and returns the hash of this new commit. See [concurrency](https://github.com/dolthub/docs/tree/c572a91f53f4112a15930510a0c1966ae3c52394/content/reference/sql/sql.md#concurrency) for details. |
| `LOCK TABLES` | X | `LOCK TABLES` parses correctly but does not prevent access to those tables from other sessions. |
| `ROLLBACK` | X | `ROLLBACK` parses correctly but is a no-op. |
| `SAVEPOINT` | X |  |
| `SET @@autocommit = 1` | ✓ | When `@@autocommit = true`, changes to data will update the working set after every statement. When `@@autocommit = false`, the working set will only be updated after `COMMIT` statements. |

### Indexes

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Indexes | ✓ |  |
| Multi-column indexes | ✓ |  |
| Full-text indexes | X |  |
| Spatial indexes | X |  |

### Schema

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `ALTER TABLE` statements | O | Some limitations. See the [supported statements doc](https://github.com/dolthub/docs/tree/c572a91f53f4112a15930510a0c1966ae3c52394/content/reference/sql/sql.md#supported-statements). |
| Database renames | X | Database names are read-only, and configured by the server at startup. |
| Adding tables | ✓ |  |
| Dropping tables | ✓ |  |
| Table renames | ✓ |  |
| Adding views | ✓ |  |
| Dropping views | ✓ |  |
| View renames | X |  |
| Column renames | ✓ |  |
| Adding columns | ✓ |  |
| Removing columns | ✓ |  |
| Reordering columns | ✓ |  |
| Adding constraints | ✓ |  |
| Removing constaints | ✓ |  |
| Creating indexes | ✓ |  |
| Index renames | ✓ |  |
| Removing indexes | ✓ |  |
| `AUTO INCREMENT` | ✓ |  |

### Statements

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Common statements | ✓ | See the [supported statements doc](https://github.com/dolthub/docs/tree/c572a91f53f4112a15930510a0c1966ae3c52394/content/reference/sql/sql.md#supported-statements) |

### Clauses

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `WHERE` | ✓ |  |
| `HAVING` | ✓ |  |
| `LIMIT` | ✓ |  |
| `OFFSET` | ✓ |  |
| `GROUP BY` | ✓ | Group-by columns can be referred to by their ordinal \(e.g. `1`, `2`\), a MySQL dialect extension. |
| `ORDER BY` | ✓ | Order-by columns can be referred to by their ordinal \(e.g. `1`, `2`\), a MySQL dialect extension. |
| Aggregate functions | ✓ |  |
| `DISTINCT` | O | Only supported for certain expressions. |
| `ALL` | ✓ |  |

### Table expressions

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Tables and views | ✓ |  |
| Table and view aliases | ✓ |  |
| Joins | O | `LEFT INNER`, `RIGHT INNER`, `INNER`, `NATURAL`, and `CROSS JOINS` are supported. `OUTER` joins are not supported. |
| Subqueries | ✓ |  |
| `UNION` | ✓ |  |

### Scalar expressions

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Common operators | ✓ |  |
| `IF` | ✓ |  |
| `CASE` | ✓ |  |
| `NULLIF` | ✓ |  |
| `COALESCE` | ✓ |  |
| `IFNULL` | ✓ |  |
| `AND` | ✓ |  |
| `OR` | ✓ |  |
| `LIKE` | ✓ |  |
| `IN` | ✓ |  |
| `INTERVAL` | ✓ |  |
| Scalar subqueries | ✓ |  |
| Column ordinal references | ✓ |  |

### Functions and operators

**Currently supporting 129 of 436 MySQL functions.**

Most functions are simple to implement. If you need one that isn't implemented, [please file an issue](https://github.com/dolthub/dolt/issues). We can fulfill most requests for new functions within 24 hours.

| Component | Supported | Notes and limitations |  |
| :--- | :--- | :--- | :--- |
| `%` | ✓ |  |  |
| `&` | ✓ |  |  |
| \` | \` | ✓ |  |
| `*` | ✓ |  |  |
| `+` | ✓ |  |  |
| `->>` | ✓ |  |  |
| `->` | ✓ |  |  |
| `-` | ✓ |  |  |
| `/` | ✓ |  |  |
| `:=` | X |  |  |
| `<<` | ✓ |  |  |
| `<=>` | X |  |  |
| `<=` | ✓ |  |  |
| `<>`, `!=` | ✓ |  |  |
| `<` | ✓ |  |  |
| `=` | ✓ |  |  |
| `>=` | ✓ |  |  |
| `>>` | ✓ |  |  |
| `>` | ✓ |  |  |
| `^` | ✓ |  |  |
| `ABS()` | ✓ |  |  |
| `ACOS()` | ✓ |  |  |
| `ADDDATE()` | X |  |  |
| `ADDTIME()` | X |  |  |
| `AES_DECRYPT()` | X |  |  |
| `AES_ENCRYPT()` | X |  |  |
| `AND` | ✓ |  |  |
| `ANY_VALUE()` | X |  |  |
| `ARRAY_LENGTH()` | ✓ |  |  |
| `ASCII()` | ✓ |  |  |
| `ASIN()` | ✓ |  |  |
| `ASYMMETRIC_DECRYPT()` | X |  |  |
| `ASYMMETRIC_DERIVE()` | X |  |  |
| `ASYMMETRIC_ENCRYPT()` | X |  |  |
| `ASYMMETRIC_SIGN()` | X |  |  |
| `ASYMMETRIC_VERIFY()` | X |  |  |
| `ATAN()` | ✓ |  |  |
| `ATAN2()` | X |  |  |
| `AVG()` | ✓ |  |  |
| `BENCHMARK()` | X |  |  |
| `BETWEEN ... AND ...` | ✓ |  |  |
| `BIN()` | ✓ |  |  |
| `BIN_TO_UUID()` | X |  |  |
| `BIT_AND()` | X |  |  |
| `BIT_COUNT()` | X |  |  |
| `BIT_LENGTH()` | ✓ |  |  |
| `BIT_OR()` | X | \` | \` is supported |
| `BIT_XOR()` | X | `^` is supported |  |
| `CAN_ACCESS_COLUMN()` | X |  |  |
| `CAN_ACCESS_DATABASE()` | X |  |  |
| `CAN_ACCESS_TABLE()` | X |  |  |
| `CAN_ACCESS_VIEW()` | X |  |  |
| `CASE` | ✓ |  |  |
| `CAST()` | X |  |  |
| `CEIL()` | ✓ |  |  |
| `CEILING()` | ✓ |  |  |
| `CHAR()` | X |  |  |
| `CHARACTER_LENGTH()` | ✓ |  |  |
| `CHARSET()` | X |  |  |
| `CHAR_LENGTH()` | ✓ |  |  |
| `COALESCE()` | ✓ |  |  |
| `COERCIBILITY()` | X |  |  |
| `COLLATION()` | X |  |  |
| `COMMIT()` | ✓ | Creates a new Dolt commit and returns the hash of it. See [concurrency](https://github.com/dolthub/docs/tree/c572a91f53f4112a15930510a0c1966ae3c52394/content/reference/sql/sql.md#concurrency) |  |
| `COMPRESS()` | X |  |  |
| `CONCAT()` | ✓ |  |  |
| `CONCAT_WS()` | ✓ |  |  |
| `CONNECTION_ID()` | ✓ |  |  |
| `CONV()` | X |  |  |
| `CONVERT()` | X |  |  |
| `CONVERT_TZ()` | X |  |  |
| `COS()` | ✓ |  |  |
| `COT()` | ✓ |  |  |
| `COUNT()` | ✓ |  |  |
| `COUNT(DISTINCT)` | ✓ |  |  |
| `CRC32()` | ✓ |  |  |
| `CREATE_ASYMMETRIC_PRIV_KEY()` | X |  |  |
| `CREATE_ASYMMETRIC_PUB_KEY()` | X |  |  |
| `CREATE_DH_PARAMETERS()` | X |  |  |
| `CREATE_DIGEST()` | X |  |  |
| `CUME_DIST()` | X |  |  |
| `CURDATE()` | ✓ |  |  |
| `CURRENT_DATE()` | ✓ |  |  |
| `CURRENT_ROLE()` | X |  |  |
| `CURRENT_TIME()` | ✓ |  |  |
| `CURRENT_TIMESTAMP()` | ✓ |  |  |
| `CURRENT_USER()` | ✓ |  |  |
| `CURTIME()` | ✓ |  |  |
| `DATABASE()` | ✓ |  |  |
| `DATE()` | ✓ |  |  |
| `DATEDIFF()` | X |  |  |
| `DATETIME()` | ✓ |  |  |
| `DATE_ADD()` | ✓ |  |  |
| `DATE_FORMAT()` | ✓ |  |  |
| `DATE_SUB()` | ✓ |  |  |
| `DAY()` | ✓ |  |  |
| `DAYNAME()` | ✓ |  |  |
| `DAYOFMONTH()` | ✓ |  |  |
| `DAYOFWEEK()` | ✓ |  |  |
| `DAYOFYEAR()` | ✓ |  |  |
| `DEFAULT()` | X |  |  |
| `DEGREES()` | ✓ |  |  |
| `DENSE_RANK()` | X |  |  |
| `DIV` | ✓ |  |  |
| `ELT()` | X |  |  |
| `EXP()` | X |  |  |
| `EXPLODE()` | ✓ |  |  |
| `EXPORT_SET()` | X |  |  |
| `EXTRACT()` | X |  |  |
| `ExtractValue()` | X |  |  |
| `FIELD()` | X |  |  |
| `FIND_IN_SET()` | X |  |  |
| `FIRST()` | ✓ |  |  |
| `FIRST_VALUE()` | X |  |  |
| `FLOOR()` | ✓ |  |  |
| `FORMAT()` | X |  |  |
| `FORMAT_BYTES()` | X |  |  |
| `FORMAT_PICO_TIME()` | X |  |  |
| `FOUND_ROWS()` | X |  |  |
| `FROM_BASE64()` | ✓ |  |  |
| `FROM_DAYS()` | X |  |  |
| `FROM_UNIXTIME()` | X |  |  |
| `GET_DD_COLUMN_PRIVILEGES()` | X |  |  |
| `GET_DD_CREATE_OPTIONS()` | X |  |  |
| `GET_DD_INDEX_SUB_PART_LENGTH()` | X |  |  |
| `GET_FORMAT()` | X |  |  |
| `GET_LOCK()` | ✓ |  |  |
| `GREATEST()` | ✓ |  |  |
| `GROUPING()` | X |  |  |
| `GROUP_CONCAT()` | X |  |  |
| `GTID_SUBSET()` | X |  |  |
| `GTID_SUBTRACT()` | X |  |  |
| `GeomCollection()` | X |  |  |
| `GeometryCollection()` | X |  |  |
| `HASHOF()` | ✓ | Returns the hash of a reference, e.g. `HASHOF("master")`. See [concurrency](https://github.com/dolthub/docs/tree/c572a91f53f4112a15930510a0c1966ae3c52394/content/reference/sql/sql.md#concurrency) |  |
| `HEX()` | ✓ |  |  |
| `HOUR()` | ✓ |  |  |
| `ICU_VERSION()` | X |  |  |
| `IF()` | ✓ |  |  |
| `IFNULL()` | ✓ |  |  |
| `IN()` | ✓ |  |  |
| `INET6_ATON()` | X |  |  |
| `INET6_NTOA()` | X |  |  |
| `INET_ATON()` | X |  |  |
| `INET_NTOA()` | X |  |  |
| `INSERT()` | X |  |  |
| `INSTR()` | ✓ |  |  |
| `INTERVAL()` | ✓ |  |  |
| `IS NOT NULL` | ✓ |  |  |
| `IS NOT` | ✓ |  |  |
| `IS NULL` | ✓ |  |  |
| `ISNULL()` | X |  |  |
| `IS_BINARY()` | ✓ |  |  |
| `IS_FREE_LOCK()` | ✓ |  |  |
| `IS_IPV4()` | X |  |  |
| `IS_IPV4_COMPAT()` | X |  |  |
| `IS_IPV4_MAPPED()` | X |  |  |
| `IS_IPV6()` | X |  |  |
| `IS_USED_LOCK()` | ✓ |  |  |
| `IS_UUID()` | X |  |  |
| `IS` | ✓ |  |  |
| `JSON_ARRAY()` | X |  |  |
| `JSON_ARRAYAGG()` | X |  |  |
| `JSON_ARRAY_APPEND()` | X |  |  |
| `JSON_ARRAY_INSERT()` | X |  |  |
| `JSON_CONTAINS()` | X |  |  |
| `JSON_CONTAINS_PATH()` | X |  |  |
| `JSON_DEPTH()` | X |  |  |
| `JSON_EXTRACT()` | ✓ |  |  |
| `JSON_INSERT()` | X |  |  |
| `JSON_KEYS()` | X |  |  |
| `JSON_LENGTH()` | X |  |  |
| `JSON_MERGE()` | X |  |  |
| `JSON_MERGE_PATCH()` | X |  |  |
| `JSON_MERGE_PRESERVE()` | X |  |  |
| `JSON_OBJECT()` | X |  |  |
| `JSON_OBJECTAGG()` | X |  |  |
| `JSON_OVERLAPS()` | X |  |  |
| `JSON_PRETTY()` | X |  |  |
| `JSON_QUOTE()` | X |  |  |
| `JSON_REMOVE()` | X |  |  |
| `JSON_REPLACE()` | X |  |  |
| `JSON_SCHEMA_VALID()` | X |  |  |
| `JSON_SCHEMA_VALIDATION_REPORT()` | X |  |  |
| `JSON_SEARCH()` | X |  |  |
| `JSON_SET()` | X |  |  |
| `JSON_STORAGE_FREE()` | X |  |  |
| `JSON_STORAGE_SIZE()` | X |  |  |
| `JSON_TABLE()` | X |  |  |
| `JSON_TYPE()` | X |  |  |
| `JSON_UNQUOTE()` | ✓ |  |  |
| `JSON_VALID()` | X |  |  |
| `JSON_VALUE()` | X |  |  |
| `LAG()` | X |  |  |
| `LAST()` | ✓ |  |  |
| `LAST_DAY` | X |  |  |
| `LAST_INSERT_ID()` | X |  |  |
| `LAST_VALUE()` | X |  |  |
| `LCASE()` | X |  |  |
| `LEAD()` | X |  |  |
| `LEAST()` | ✓ |  |  |
| `LEFT()` | ✓ |  |  |
| `LENGTH()` | ✓ |  |  |
| `LIKE` | ✓ |  |  |
| `LN()` | ✓ |  |  |
| `LOAD_FILE()` | X |  |  |
| `LOCALTIME()` | X |  |  |
| `LOCALTIMESTAMP()` | X |  |  |
| `LOCATE()` | X |  |  |
| `LOG()` | ✓ |  |  |
| `LOG10()` | ✓ |  |  |
| `LOG2()` | ✓ |  |  |
| `LOWER()` | ✓ |  |  |
| `LPAD()` | ✓ |  |  |
| `LTRIM()` | ✓ |  |  |
| `LineString()` | X |  |  |
| `MAKEDATE()` | X |  |  |
| `MAKETIME()` | X |  |  |
| `MAKE_SET()` | X |  |  |
| `MASTER_POS_WAIT()` | X |  |  |
| `MATCH` | X |  |  |
| `MAX()` | ✓ |  |  |
| `MBRContains()` | X |  |  |
| `MBRCoveredBy()` | X |  |  |
| `MBRCovers()` | X |  |  |
| `MBRDisjoint()` | X |  |  |
| `MBREquals()` | X |  |  |
| `MBRIntersects()` | X |  |  |
| `MBROverlaps()` | X |  |  |
| `MBRTouches()` | X |  |  |
| `MBRWithin()` | X |  |  |
| `MD5()` | ✓ |  |  |
| `MEMBER OF()` | X |  |  |
| `MICROSECOND()` | ✓ |  |  |
| `MID()` | ✓ |  |  |
| `MIN()` | ✓ |  |  |
| `MINUTE()` | ✓ |  |  |
| `MOD()` | X | `%` is supported |  |
| `MONTH()` | ✓ |  |  |
| `MONTHNAME()` | ✓ |  |  |
| `MultiLineString()` | X |  |  |
| `MultiPoint()` | X |  |  |
| `MultiPolygon()` | X |  |  |
| `NAME_CONST()` | X |  |  |
| `NOT`, `!` | ✓ |  |  |
| `NOT BETWEEN ... AND ...` | ✓ |  |  |
| `NOT IN()` | ✓ |  |  |
| `NOT LIKE` | ✓ |  |  |
| `NOT MATCH` | X |  |  |
| `NOT REGEXP` | ✓ |  |  |
| `NOT RLIKE` | X | `NOT REGEXP` is supported |  |
| `NOT`, `!` | ✓ |  |  |
| `NOW()` | ✓ |  |  |
| `NTH_VALUE()` | X |  |  |
| `NTILE()` | X |  |  |
| `NULLIF()` | ✓ |  |  |
| `OCT()` | X |  |  |
| `OCTET_LENGTH()` | X |  |  |
| `ORD()` | X |  |  |
| `OR` | ✓ |  |  |
| `PERCENT_RANK()` | X |  |  |
| `PERIOD_ADD()` | X |  |  |
| `PERIOD_DIFF()` | X |  |  |
| `PI()` | X |  |  |
| `POSITION()` | X |  |  |
| `POW()` | ✓ |  |  |
| `POWER()` | ✓ |  |  |
| `PS_CURRENT_THREAD_ID()` | X |  |  |
| `PS_THREAD_ID()` | X |  |  |
| `Point()` | X |  |  |
| `Polygon()` | X |  |  |
| `QUARTER()` | X |  |  |
| `QUOTE()` | X |  |  |
| `RADIANS()` | ✓ |  |  |
| `RAND()` | ✓ |  |  |
| `RANDOM_BYTES()` | X |  |  |
| `RANK()` | X |  |  |
| `REGEXP_INSTR()` | X |  |  |
| `REGEXP_LIKE()` | X |  |  |
| `REGEXP_MATCHES()` | ✓ |  |  |
| `REGEXP_REPLACE()` | X |  |  |
| `REGEXP_SUBSTR()` | X |  |  |
| `REGEXP` | ✓ |  |  |
| `RELEASE_ALL_LOCKS()` | ✓ |  |  |
| `RELEASE_LOCK()` | ✓ |  |  |
| `REPEAT()` | ✓ |  |  |
| `REPLACE()` | ✓ |  |  |
| `REVERSE()` | ✓ |  |  |
| `RIGHT()` | X |  |  |
| `RLIKE` | X | `REGEXP` is supported |  |
| `ROLES_GRAPHML()` | X |  |  |
| `ROUND()` | ✓ |  |  |
| `ROW_COUNT()` | X |  |  |
| `ROW_NUMBER()` | X |  |  |
| `RPAD()` | ✓ |  |  |
| `RTRIM()` | ✓ |  |  |
| `SCHEMA()` | ✓ |  |  |
| `SECOND()` | ✓ |  |  |
| `SEC_TO_TIME()` | X |  |  |
| `SESSION_USER()` | X |  |  |
| `SHA()` | ✓ |  |  |
| `SHA1()` | ✓ |  |  |
| `SHA2()` | ✓ |  |  |
| `SIGN()` | ✓ |  |  |
| `SIN()` | ✓ |  |  |
| `SLEEP()` | ✓ |  |  |
| `SOUNDEX()` | ✓ |  |  |
| `SPACE()` | X |  |  |
| `SPLIT()` | ✓ |  |  |
| `SQRT()` | ✓ |  |  |
| `STATEMENT_DIGEST()` | X |  |  |
| `STATEMENT_DIGEST_TEXT()` | X |  |  |
| `STD()` | X |  |  |
| `STDDEV()` | X |  |  |
| `STDDEV_POP()` | X |  |  |
| `STDDEV_SAMP()` | X |  |  |
| `STRCMP()` | X |  |  |
| `STR_TO_DATE()` | X |  |  |
| `ST_Area()` | X |  |  |
| `ST_AsBinary()` | X |  |  |
| `ST_AsGeoJSON()` | X |  |  |
| `ST_AsText()` | X |  |  |
| `ST_Buffer()` | X |  |  |
| `ST_Buffer_Strategy()` | X |  |  |
| `ST_Centroid()` | X |  |  |
| `ST_Contains()` | X |  |  |
| `ST_ConvexHull()` | X |  |  |
| `ST_Crosses()` | X |  |  |
| `ST_Difference()` | X |  |  |
| `ST_Dimension()` | X |  |  |
| `ST_Disjoint()` | X |  |  |
| `ST_Distance()` | X |  |  |
| `ST_Distance_Sphere()` | X |  |  |
| `ST_EndPoint()` | X |  |  |
| `ST_Envelope()` | X |  |  |
| `ST_Equals()` | X |  |  |
| `ST_ExteriorRing()` | X |  |  |
| `ST_GeoHash()` | X |  |  |
| `ST_GeomCollFromText()` | X |  |  |
| `ST_GeomCollFromWKB()` | X |  |  |
| `ST_GeomFromGeoJSON()` | X |  |  |
| `ST_GeomFromText()` | X |  |  |
| `ST_GeomFromWKB()` | X |  |  |
| `ST_GeometryN()` | X |  |  |
| `ST_GeometryType()` | X |  |  |
| `ST_InteriorRingN()` | X |  |  |
| `ST_Intersection()` | X |  |  |
| `ST_Intersects()` | X |  |  |
| `ST_IsClosed()` | X |  |  |
| `ST_IsEmpty()` | X |  |  |
| `ST_IsSimple()` | X |  |  |
| `ST_IsValid()` | X |  |  |
| `ST_LatFromGeoHash()` | X |  |  |
| `ST_Latitude()` | X |  |  |
| `ST_Length()` | X |  |  |
| `ST_LineFromText()` | X |  |  |
| `ST_LineFromWKB()` | X |  |  |
| `ST_LongFromGeoHash()` | X |  |  |
| `ST_Longitude()` | X |  |  |
| `ST_MLineFromText()` | X |  |  |
| `ST_MLineFromWKB()` | X |  |  |
| `ST_MPointFromText()` | X |  |  |
| `ST_MPointFromWKB()` | X |  |  |
| `ST_MPolyFromText()` | X |  |  |
| `ST_MPolyFromWKB()` | X |  |  |
| `ST_MakeEnvelope()` | X |  |  |
| `ST_NumGeometries()` | X |  |  |
| `ST_NumInteriorRing()` | X |  |  |
| `ST_NumPoints()` | X |  |  |
| `ST_Overlaps()` | X |  |  |
| `ST_PointFromGeoHash()` | X |  |  |
| `ST_PointFromText()` | X |  |  |
| `ST_PointFromWKB()` | X |  |  |
| `ST_PointN()` | X |  |  |
| `ST_PolyFromText()` | X |  |  |
| `ST_PolyFromWKB()` | X |  |  |
| `ST_SRID()` | X |  |  |
| `ST_Simplify()` | X |  |  |
| `ST_StartPoint()` | X |  |  |
| `ST_SwapXY()` | X |  |  |
| `ST_SymDifference()` | X |  |  |
| `ST_Touches()` | X |  |  |
| `ST_Transform()` | X |  |  |
| `ST_Union()` | X |  |  |
| `ST_Validate()` | X |  |  |
| `ST_Within()` | X |  |  |
| `ST_X()` | X |  |  |
| `ST_Y()` | X |  |  |
| `SUBDATE()` | X |  |  |
| `SUBSTR()` | ✓ |  |  |
| `SUBSTRING()` | ✓ |  |  |
| `SUBSTRING_INDEX()` | ✓ |  |  |
| `SUBTIME()` | X |  |  |
| `SUM()` | ✓ |  |  |
| `SYSDATE()` | X |  |  |
| `SYSTEM_USER()` | X |  |  |
| `TAN()` | ✓ |  |  |
| `TIME()` | X |  |  |
| `TIMEDIFF()` | ✓ |  |  |
| `TIMESTAMP()` | ✓ |  |  |
| `TIMESTAMPADD()` | X |  |  |
| `TIMESTAMPDIFF()` | X |  |  |
| `TIME_FORMAT()` | X |  |  |
| `TIME_TO_SEC()` | ✓ |  |  |
| `TO_BASE64()` | ✓ |  |  |
| `TO_DAYS()` | X |  |  |
| `TO_SECONDS()` | X |  |  |
| `TRIM()` | ✓ |  |  |
| `TRUNCATE()` | X |  |  |
| `UCASE()` | X |  |  |
| `UNCOMPRESS()` | X |  |  |
| `UNCOMPRESSED_LENGTH()` | X |  |  |
| `UNHEX()` | ✓ |  |  |
| `UNIX_TIMESTAMP()` | ✓ |  |  |
| `UPPER()` | ✓ |  |  |
| `USER()` | ✓ |  |  |
| `UTC_DATE()` | X |  |  |
| `UTC_TIME()` | X |  |  |
| `UTC_TIMESTAMP()` | ✓ |  |  |
| `UUID()` | X |  |  |
| `UUID_SHORT()` | X |  |  |
| `UUID_TO_BIN()` | X |  |  |
| `UpdateXML()` | X |  |  |
| `VALIDATE_PASSWORD_STRENGTH()` | X |  |  |
| `VALUES()` | ✓ |  |  |
| `VARIANCE()` | X |  |  |
| `VAR_POP()` | X |  |  |
| `VAR_SAMP()` | X |  |  |
| `VERSION()` | ✓ |  |  |
| `WAIT_FOR_EXECUTED_GTID_SET()` | X |  |  |
| `WEEK()` | ✓ |  |  |
| `WEEKDAY()` | ✓ |  |  |
| `WEEKOFYEAR()` | ✓ |  |  |
| `WEIGHT_STRING()` | X |  |  |
| `YEAR()` | ✓ |  |  |
| `YEARWEEK()` | ✓ |  |  |

## Permissions

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Users | O | Only one user is configurable, and must be specified in the config file at startup. |
| Privileges | X | Only one user is configurable, and they have all privileges. |

### Misc features

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Information schema | ✓ |  |
| Views | ✓ |  |
| Window functions | X |  |
| Common table expressions \(CTEs\) | X |  |
| Stored procedures | X |  |
| Cursors | X |  |
| Triggers | ✓ |  |

### Collations and character sets

Dolt currently only supports a single collation and character set, the same one that Go uses: `utf8_bin` and `utf8mb4`. We will add support for more character sets and collations as required by customers. Please [file an issue](https://github.com/dolthub/dolt/issues) explaining your use case if current character set and collation support isn't sufficient.

## Supported Statements

Dolt's goal is to be a drop-in replacement for MySQL, with every query and statement that works in MySQL behaving identically in Dolt. For most syntax and technical questions, you should feel free to refer to the [MySQL user manual](https://dev.mysql.com/doc/refman/8.0/en/select.html). Any deviation from the MySQL manual should be documented on this page, or else indicates a bug. Please [file issues](https://github.com/dolthub/dolt/issues) with any incompatibilities you discover.

### Data manipulation statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `CALL` | X | Stored procedures are not yet implemented. |
| `CREATE TABLE AS` | X | `INSERT INTO SELECT *` is supported. |
| `CREATE TABLE LIKE` | ✓ |  |
| `DO` | X |  |
| `DELETE` | ✓ | No support for referring to more than one table in a single `DELETE` statement. |
| `HANDLER` | X |  |
| `IMPORT TABLE` | X | Use `dolt table import` |
| `INSERT` | ✓ | Including support for `ON DUPLICATE KEY` clauses. |
| `LOAD DATA` | X | Use `dolt table import` |
| `LOAD XML` | X | Use `dolt table import` |
| `REPLACE` | ✓ |  |
| `SELECT` | ✓ | Most select statements, including `UNION` and `JOIN`, are supported. |
| `SELECT FROM AS OF` | ✓ | Selecting from a table as of any known revision or commit timestamp is supported. See [AS OF queries](https://github.com/dolthub/docs/tree/c572a91f53f4112a15930510a0c1966ae3c52394/content/reference/sql/sql.md#querying-non-head-revisions-of-a-database). |
| `SELECT FOR UPDATE` | X | Locking and concurrency are currently very limited. |
| `SUBQUERIES` | ✓ | Subqueries work, but must be given aliases. Some limitations apply. |
| `TABLE` | X | Equivalent to `SELECT * FROM TABLE` without a `WHERE` clause. |
| `TRUNCATE` | ✓ |  |
| `UPDATE` | ✓ | No support for referring to more than one table in a single `UPDATE` statement. |
| `VALUES` | X |  |
| `WITH` | X | Common table expressions \(CTEs\) are not yet supported |

### Data definition statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `ADD COLUMN` | ✓ |  |
| `ADD CHECK` | X | `NOT NULL` is the only check currently possible. |
| `ADD CONSTRAINT` | X | `NOT NULL` is the only constraint currently possible. |
| `ADD FOREIGN KEY` | ✓ |  |
| `ADD PARTITION` | X |  |
| `ALTER COLUMN` | ✓ | Name and order changes are supported, but not type or primary key changes. |
| `ALTER DATABASE` | X |  |
| `ALTER INDEX` | X | Indexes can be created and dropped, but not altered. |
| `ALTER PRIMARY KEY` | X | Primary keys of tables cannot be changed. |
| `ALTER TABLE` | ✓ | Not all `ALTER TABLE` statements are supported. See the rest of this table for details. |
| `ALTER TYPE` | X | Column type changes are not supported. |
| `ALTER VIEW` | X | Views can be created and dropped, but not altered. |
| `CHANGE COLUMN` | O | Columns can be renamed and reordered, but type changes are not implemented. |
| `CREATE DATABASE` | X | Create new repositories with `dolt clone` or `dolt init` |
| `CREATE EVENT` | X |  |
| `CREATE FUNCTION` | X |  |
| `CREATE INDEX` | O | Unique indexes are not yet supported. Fulltext and spatial indexes are not supported. |
| `CREATE TABLE` | ✓ | Tables must have primary keys. |
| `CREATE TABLE AS` | X |  |
| `CREATE TRIGGER` | ✓ |  |
| `CREATE VIEW` | ✓ |  |
| `DESCRIBE TABLE` | ✓ |  |
| `DROP COLUMN` | ✓ |  |
| `DROP CONSTRAINT` | ✓ |  |
| `DROP DATABASE` | X | Delete a repository by deleting its directory on disk. |
| `DROP EVENT` | X |  |
| `DROP FUNCTION` | X |  |
| `DROP INDEX` | ✓ |  |
| `DROP TABLE` | ✓ |  |
| `DROP PARTITION` | X |  |
| `DROP TRIGGER` | ✓ |  |
| `DROP VIEW` | ✓ |  |
| `MODIFY COLUMN` | O | Columns can be renamed and reordered, but type changes are not implemented. |
| `RENAME COLUMN` | ✓ |  |
| `RENAME CONSTRAINT` | X |  |
| `RENAME DATABASE` | X | Database names are read-only, but can be configured in the server config. |
| `RENAME INDEX` | X |  |
| `RENAME TABLE` | ✓ |  |
| `SHOW COLUMNS` | ✓ |  |
| `SHOW CONSTRAINTS` | X |  |
| `SHOW CREATE TABLE` | ✓ |  |
| `SHOW CREATE VIEW` | ✓ |  |
| `SHOW DATABASES` | ✓ |  |
| `SHOW INDEX` | X |  |
| `SHOW SCHEMAS` | ✓ |  |
| `SHOW TABLES` | ✓ | `SHOW FULL TABLES` reveals whether a table is a base table or a view. |
| `TRUNCATE TABLE` | ✓ |  |

### Transactional statements

Transactional semantics are a work in progress. Dolt isn't like other databases: a "commit" in dolt creates a new entry in the repository revision graph, as opposed to updating one or more rows atomically as in other databases. By default, updating data through SQL statements modifies the working set of the repository. Committing changes to the repository requires the use of `dolt add` and `dolt commmit` from the command line. But it's also possible for advanced users to create commits and branches directly through SQL statements.

Not much work has been put into supporting the true transaction and concurrency primitives necessary to be an application server, but limited support for transactions does exist. Specifically, when running the SQL server with `@@autocommit = false`, the working set will not be updated with changes until a `COMMIT` statement is executed.

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `BEGIN` | O | `BEGIN` parses correctly, but is a no-op: it doesn't create a checkpoint that can be returned to with `ROLLBACK`. |
| `COMMIT` | ✓ | `COMMIT` will write any pending changes to the working set when `@@autocommit = false` |
| `COMMIT(MESSAGE)` | ✓ | The `COMMIT()` function creates a commit of the current database state and returns the hash of this new commit. See [concurrency](https://github.com/dolthub/docs/tree/c572a91f53f4112a15930510a0c1966ae3c52394/content/reference/sql/sql.md#concurrency) for details. |
| `LOCK TABLES` | X | `LOCK TABLES` parses correctly but does not prevent access to those tables from other sessions. |
| `ROLLBACK` | X | `ROLLBACK` parses correctly but is a no-op. |
| `SAVEPOINT` | X |  |
| `RELEASE SAVEPOINT` | X |  |
| `ROLLBACK TO SAVEPOINT` | X |  |
| `SET @@autocommit = 1` | ✓ | When `@@autocommit = true`, changes to data will update the working set after every statement. When `@@autocommit = false`, the working set will only be updated after `COMMIT` statements. |
| `SET TRANSACTION` | X | Different isolation levels are not yet supported. |
| `START TRANSACTION` | O | `START TRANSACTION` parses correctly, but is a no-op: it doesn't create a checkpoint that can be returned to with `ROLLBACK`. |
| `UNLOCK TABLES` | ✓ | `UNLOCK TABLES` parses correctly, but since `LOCK TABLES` doesn't prevent concurrent access it's essentially a no-op. |

### Prepared statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `PREPARE` | ✓ |  |
| `EXECUTE` | ✓ |  |

### Access management statements

Access management via SQL statements is not yet supported. This table will be updated as access management features are implemented. Please [file an issue](https://github.com/dolthub/dolt/issues) if lack of SQL access management is blocking your use of Dolt, and we will prioritize accordingly.

A root user name and password can be specified in the config for [`sql-server`](https://github.com/dolthub/docs/tree/bfdf7d8c4c511940b3281abe0290c8eb4097e6c0/cli/dolt-sql-server/README.md). This user has full privileges on the running database.

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `ALTER USER` | X |  |
| `CREATE ROLE` | X |  |
| `CREATE USER` | X |  |
| `DROP ROLE` | X |  |
| `DROP USER` | X |  |
| `GRANT` | X |  |
| `RENAME USER` | X |  |
| `REVOKE` | X |  |
| `SET DEFAULT ROLE` | X |  |
| `SET PASSWORD` | X |  |
| `SET ROLE` | X |  |

### Session management statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `SET` | ✓ |  |
| `SET CHARACTER SET` | O | \`SET CHARACTER SET\` parses correctly, but Dolt supports only the \`utf8mb4\` collation |
| `SET NAMES` | O | \`SET NAMES\` parses correctly, but Dolt supports only the \`utf8mb4\` collation for identifiers |
| `KILL QUERY` | ✓ |  |

### Utility statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `EXPLAIN` | ✓ |  |
| `USE` | ✓ |  |

