---
title: 'Expressions, Functions, and Operators'
---

# Expressions, Functions, Operators

## Statements

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Common statements | ✓ | See the [supported statements doc](https://github.com/dolthub/docs/tree/483390a96f3747775b02702ec2e76e6ba727f5ef/content/reference/sql/sql-support/supported-statements/README.md) |

## Clauses

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

## Table expressions

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Tables and views | ✓ |  |
| Table and view aliases | ✓ |  |
| Joins | O | `LEFT INNER`, `RIGHT INNER`, `INNER`, `NATURAL`, and `CROSS JOINS` are supported. `OUTER` joins are not supported. |
| Subqueries | ✓ |  |
| `UNION` | ✓ |  |

## Scalar expressions

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

## Functions and operators

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
| `<=>` | ✓ | Null-safe equals operator |  |
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
| `BIT_OR()` | X | `\|` is supported |  |
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
| `COMMIT()` | ✓ | Creates a new Dolt commit and returns the hash of it. See [concurrency](https://github.com/dolthub/docs/tree/483390a96f3747775b02702ec2e76e6ba727f5ef/content/reference/sql/sql-support/sql.md#concurrency) |  |
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
| `HASHOF()` | ✓ | Returns the hash of a reference, e.g. `HASHOF("master")`. See [concurrency](https://github.com/dolthub/docs/tree/483390a96f3747775b02702ec2e76e6ba727f5ef/content/reference/sql/sql-support/sql.md#concurrency) |  |
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
| `ROW_NUMBER()` | ✓ |  |  |
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

