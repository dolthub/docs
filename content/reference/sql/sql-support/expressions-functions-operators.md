---
title: "Expressions, Functions, and Operators"
---

# Expressions, Functions, Operators

## Statements

| Component         | Supported | Notes and limitations                                       |
| :---------------- | :-------- | :---------------------------------------------------------- |
| Common statements | ✅        | See the [supported statements doc](supported-statements.md) |

## Clauses

| Component           | Supported | Notes and limitations                                                                              |
| :------------------ | :-------- | :------------------------------------------------------------------------------------------------- |
| `WHERE`             | ✅        |                                                                                                    |
| `HAVING`            | ✅        |                                                                                                    |
| `LIMIT`             | ✅        |                                                                                                    |
| `OFFSET`            | ✅        |                                                                                                    |
| `GROUP BY`          | ✅        | Group-by columns can be referred to by their ordinal \(e.g. `1`, `2`\), a MySQL dialect extension. |
| `ORDER BY`          | ✅        | Order-by columns can be referred to by their ordinal \(e.g. `1`, `2`\), a MySQL dialect extension. |
| Aggregate functions | ✅        |                                                                                                    |
| `DISTINCT`          | ✅        |                                                                                                    |
| `ALL`               | ✅        |                                                                                                    |

## Table expressions

| Component              | Supported | Notes and limitations                                                                                                   |
| :--------------------- | :-------- | :---------------------------------------------------------------------------------------------------------------------- |
| Tables and views       | ✅        |                                                                                                                         |
| Table and view aliases | ✅        |                                                                                                                         |
| Joins                  | ✅        | `LEFT OUTER`, `RIGHT OUTER`, `INNER`, `NATURAL`, and `CROSS JOINS` are supported. `FULL OUTER` joins are not supported. |
| Subqueries             | ✅        |                                                                                                                         |
| `UNION`                | ✅        |                                                                                                                         |

## Scalar expressions

| Component                 | Supported | Notes and limitations |
| :------------------------ | :-------- | :-------------------- |
| Common operators          | ✅        |                       |
| `IF`                      | ✅        |                       |
| `CASE`                    | ✅        |                       |
| `NULLIF`                  | ✅        |                       |
| `COALESCE`                | ✅        |                       |
| `IFNULL`                  | ✅        |                       |
| `AND`                     | ✅        |                       |
| `OR`                      | ✅        |                       |
| `LIKE`                    | ✅        |                       |
| `IN`                      | ✅        |                       |
| `INTERVAL`                | ✅        |                       |
| Scalar subqueries         | ✅        |                       |
| Column ordinal references | ✅        |                       |

## Functions and operators

**Currently supporting 302 of 438 MySQL functions.**

Most functions are simple to implement. If you need one that isn't implemented, [please file an issue](https://github.com/dolthub/dolt/issues). We can fulfill most requests for new functions within 24 hours.

| Component                         | Supported    | Notes and limitations                                                                                                                         |
|:----------------------------------|:-------------|:----------------------------------------------------------------------------------------------------------------------------------------------|
| `%`                               | ✅            |                                                                                                                                               |
| `&`                               | ✅            |                                                                                                                                               |
| \`                                | ✅            |                                                                                                                                               |
| `*`                               | ✅            |                                                                                                                                               |
| `+`                               | ✅            |                                                                                                                                               |
| `->>`                             | ✅            |                                                                                                                                               |
| `->`                              | ✅            |                                                                                                                                               |
| `-`                               | ✅            |                                                                                                                                               |
| `/`                               | ✅            |                                                                                                                                               |
| `:=`                              | ✅            | Works as a synonym for `=`, but does not allow assignment in SELECT expressions ([GitHub Issue](https://github.com/dolthub/dolt/issues/4489)) |
| `<<`                              | ✅            |                                                                                                                                               |
| `<=>`                             | ✅            | Null-safe equals operator                                                                                                                     |
| `<=`                              | ✅            |                                                                                                                                               |
| `<>`, `!=`                        | ✅            |                                                                                                                                               |
| `<`                               | ✅            |                                                                                                                                               |
| `=`                               | ✅            |                                                                                                                                               |
| `>=`                              | ✅            |                                                                                                                                               |
| `>>`                              | ✅            |                                                                                                                                               |
| `>`                               | ✅            |                                                                                                                                               |
| `^`                               | ✅            |                                                                                                                                               |
| `ABS()`                           | ✅            |                                                                                                                                               |
| `ACOS()`                          | ✅            |                                                                                                                                               |
| `ADDDATE()`                       | ✅            |                                                                                                                                               |
| `ADDTIME()`                       | ❌            |                                                                                                                                               |
| `AES_DECRYPT()`                   | ❌            |                                                                                                                                               |
| `AES_ENCRYPT()`                   | ❌            |                                                                                                                                               |
| `AND`                             | ✅            |                                                                                                                                               |
| `ANY_VALUE()`                     | ✅            |                                                                                                                                               |
| `ARRAY_LENGTH()`                  | ✅            |                                                                                                                                               |
| `ASCII()`                         | ✅            |                                                                                                                                               |
| `ASIN()`                          | ✅            |                                                                                                                                               |
| `ASYMMETRIC_DECRYPT()`            | ❌            |                                                                                                                                               |
| `ASYMMETRIC_DERIVE()`             | ❌            |                                                                                                                                               |
| `ASYMMETRIC_ENCRYPT()`            | ❌            |                                                                                                                                               |
| `ASYMMETRIC_SIGN()`               | ❌            |                                                                                                                                               |
| `ASYMMETRIC_VERIFY()`             | ❌            |                                                                                                                                               |
| `ATAN()`                          | ✅            |                                                                                                                                               |
| `ATAN2()`                         | ✅            |                                                                                                                                               |
| `AVG()`                           | ✅            |                                                                                                                                               |
| `BENCHMARK()`                     | ❌            |                                                                                                                                               |
| `BETWEEN ... AND ...`             | ✅            |                                                                                                                                               |
| `BIN()`                           | ✅            |                                                                                                                                               |
| `BIN_TO_UUID()`                   | ✅            |                                                                                                                                               |
| `BIT_AND()`                       | ✅            |                                                                                                                                               |
| `BIT_COUNT()`                     | ✅            |                                                                                                                                               |
| `BIT_LENGTH()`                    | ✅            |                                                                                                                                               |
| `BIT_OR()`                        | ✅            | `\                                                                                                                                            |` is supported                                                 |
| `BIT_XOR()`                       | ✅            | `^` is supported                                                                                                                              |
| `CAN_ACCESS_COLUMN()`             | ❌            |                                                                                                                                               |
| `CAN_ACCESS_DATABASE()`           | ❌            |                                                                                                                                               |
| `CAN_ACCESS_TABLE()`              | ❌            |                                                                                                                                               |
| `CAN_ACCESS_VIEW()`               | ❌            |                                                                                                                                               |
| `CASE`                            | ✅            |                                                                                                                                               |
| `CAST()`                          | ✅            | Convert between types supported. Convert between charsets is not.                                                                             |
| `CEIL()`                          | ✅            |                                                                                                                                               |
| `CEILING()`                       | ✅            |                                                                                                                                               |
| `CHAR()`                          | ✅            |                                                                                                                                               |
| `CHARACTER_LENGTH()`              | ✅            |                                                                                                                                               |
| `CHARSET()`                       | ❌            |                                                                                                                                               |
| `CHAR_LENGTH()`                   | ✅            |                                                                                                                                               |
| `COALESCE()`                      | ✅            |                                                                                                                                               |
| `COERCIBILITY()`                  | ✅            |                                                                                                                                               |
| `COLLATION()`                     | ✅            |                                                                                                                                               |
| `COMPRESS()`                      | ❌            |                                                                                                                                               |
| `CONCAT()`                        | ✅            |                                                                                                                                               |
| `CONCAT_WS()`                     | ✅            |                                                                                                                                               |
| `CONNECTION_ID()`                 | ✅            |                                                                                                                                               |
| `CONV()`                          | ✅            |                                                                                                                                               |
| `CONVERT()`                       | ✅            | Converting between types is supported. Converting between charsets is not.                                                                    |
| `CONVERT_TZ()`                    | ✅            |                                                                                                                                               |
| `COS()`                           | ✅            |                                                                                                                                               |
| `COT()`                           | ✅            |                                                                                                                                               |
| `COUNT()`                         | ✅            |                                                                                                                                               |
| `COUNT(DISTINCT)`                 | ✅            |                                                                                                                                               |
| `CRC32()`                         | ✅            |                                                                                                                                               |
| `CREATE_ASYMMETRIC_PRIV_KEY()`    | ❌            |                                                                                                                                               |
| `CREATE_ASYMMETRIC_PUB_KEY()`     | ❌            |                                                                                                                                               |
| `CREATE_DH_PARAMETERS()`          | ❌            |                                                                                                                                               |
| `CREATE_DIGEST()`                 | ❌            |                                                                                                                                               |
| `CUME_DIST()`                     | ❌            |                                                                                                                                               |
| `CURDATE()`                       | ✅            |                                                                                                                                               |
| `CURRENT_DATE()`                  | ✅            |                                                                                                                                               |
| `CURRENT_ROLE()`                  | ❌            |                                                                                                                                               |
| `CURRENT_TIME()`                  | ✅            |                                                                                                                                               |
| `CURRENT_TIMESTAMP()`             | ✅            |                                                                                                                                               |
| `CURRENT_USER()`                  | ✅            |                                                                                                                                               |
| `CURTIME()`                       | ✅            |                                                                                                                                               |
| `DATABASE()`                      | ✅            |                                                                                                                                               |
| `DATE()`                          | ✅            |                                                                                                                                               |
| `DATEDIFF()`                      | ✅            |                                                                                                                                               |
| `DATETIME()`                      | ✅            |                                                                                                                                               |
| `DATE_ADD()`                      | ✅            |                                                                                                                                               |
| `DATE_FORMAT()`                   | ✅            |                                                                                                                                               |
| `DATE_SUB()`                      | ✅            |                                                                                                                                               |
| `DAY()`                           | ✅            |                                                                                                                                               |
| `DAYNAME()`                       | ✅            |                                                                                                                                               |
| `DAYOFMONTH()`                    | ✅            |                                                                                                                                               |
| `DAYOFWEEK()`                     | ✅            |                                                                                                                                               |
| `DAYOFYEAR()`                     | ✅            |                                                                                                                                               |
| `DEFAULT()`                       | ❌            |                                                                                                                                               |
| `DEGREES()`                       | ✅            |                                                                                                                                               |
| `DENSE_RANK()`                    | ✅            |                                                                                                                                               |
| `DIV`                             | ✅            |                                                                                                                                               |
| `ELT()`                           | ✅            |                                                                                                                                               |
| `EXP()`                           | ✅            |                                                                                                                                               |
| `EXPLODE()`                       | ✅            |                                                                                                                                               |
| `EXPORT_SET()`                    | ❌            |                                                                                                                                               |
| `EXTRACT()`                       | ✅            |                                                                                                                                               |
| `EXTRACTVALUE()`                  | ❌            |                                                                                                                                               |
| `FIELD()`                         | ✅            |                                                                                                                                               |
| `FIND_IN_SET()`                   | ✅            |                                                                                                                                               |
| `FIRST()`                         | ✅            |                                                                                                                                               |
| `FIRST_VALUE()`                   | ✅            |                                                                                                                                               |
| `FLOOR()`                         | ✅            |                                                                                                                                               |
| `FORMAT()`                        | ✅            |                                                                                                                                               |
| `FORMAT_BYTES()`                  | ❌            |                                                                                                                                               |
| `FORMAT_PICO_TIME()`              | ❌            |                                                                                                                                               |
| `FOUND_ROWS()`                    | ✅            |                                                                                                                                               |
| `FROM_BASE64()`                   | ✅            |                                                                                                                                               |
| `FROM_DAYS()`                     | ❌            |                                                                                                                                               |
| `FROM_UNIXTIME()`                 | ✅            |                                                                                                                                               |
| `GET_DD_COLUMN_PRIVILEGES()`      | ❌            |                                                                                                                                               |
| `GET_DD_CREATE_OPTIONS()`         | ❌            |                                                                                                                                               |
| `GET_DD_INDEX_SUB_PART_LENGTH()`  | ❌            |                                                                                                                                               |
| `GET_FORMAT()`                    | ❌            |                                                                                                                                               |
| `GET_LOCK()`                      | ✅            |                                                                                                                                               |
| `GREATEST()`                      | ✅            |                                                                                                                                               |
| `GROUPING()`                      | ❌            |                                                                                                                                               |
| `GROUP_CONCAT()`                  | ✅            |                                                                                                                                               |
| `GTID_SUBSET()`                   | ❌            |                                                                                                                                               |
| `GTID_SUBTRACT()`                 | ❌            |                                                                                                                                               |
| `GEOMCOLLECTION()`                | ✅            |                                                                                                                                               |
| `GEOMETRYCOLLECTION()`            | ✅            |                                                                                                                                               |
| `HASHOF()`                        | ✅            | Returns the hash of a reference, e.g. `HASHOF("master")`)                                                                                     |     |
| `HEX()`                           | ✅            |                                                                                                                                               |
| `HOUR()`                          | ✅            |                                                                                                                                               |
| `ICU_VERSION()`                   | ❌            |                                                                                                                                               |
| `IF()`                            | ✅            |                                                                                                                                               |
| `IFNULL()`                        | ✅            |                                                                                                                                               |
| `IN()`                            | ✅            |                                                                                                                                               |
| `INET6_ATON()`                    | ✅            |                                                                                                                                               |
| `INET6_NTOA()`                    | ✅            |                                                                                                                                               |
| `INET_ATON()`                     | ✅            |                                                                                                                                               |
| `INET_NTOA()`                     | ✅            |                                                                                                                                               |
| `INSERT()`                        | ❌            |                                                                                                                                               |
| `INSTR()`                         | ✅            |                                                                                                                                               |
| `INTERVAL()`                      | ✅            |                                                                                                                                               |
| `IS NOT NULL`                     | ✅            |                                                                                                                                               |
| `IS NOT`                          | ✅            |                                                                                                                                               |
| `IS NULL`                         | ✅            |                                                                                                                                               |
| `ISNULL()`                        | ✅            |                                                                                                                                               |
| `IS_BINARY()`                     | ✅            |                                                                                                                                               |
| `IS_FREE_LOCK()`                  | ✅            |                                                                                                                                               |
| `IS_IPV4()`                       | ✅            |                                                                                                                                               |
| `IS_IPV4_COMPAT()`                | ✅            |                                                                                                                                               |
| `IS_IPV4_MAPPED()`                | ✅            |                                                                                                                                               |
| `IS_IPV6()`                       | ✅            |                                                                                                                                               |
| `IS_USED_LOCK()`                  | ✅            |                                                                                                                                               |
| `IS_UUID()`                       | ✅            |                                                                                                                                               |
| `IS`                              | ✅            |                                                                                                                                               |
| `JSON_ARRAY()`                    | ✅            |                                                                                                                                               |
| `JSON_ARRAYAGG()`                 | ✅            |                                                                                                                                               |
| `JSON_ARRAY_APPEND()`             | ✅            |                                                                                                                                               |
| `JSON_ARRAY_INSERT()`             | ✅            |                                                                                                                                               |
| `JSON_CONTAINS()`                 | ✅            |                                                                                                                                               |
| `JSON_CONTAINS_PATH()`            | ✅            |                                                                                                                                               |
| `JSON_DEPTH()`                    | ✅            |                                                                                                                                               |
| `JSON_EXTRACT()`                  | ✅            |                                                                                                                                               |
| `JSON_INSERT()`                   | ✅            |                                                                                                                                               |
| `JSON_KEYS()`                     | ✅            |                                                                                                                                               |
| `JSON_LENGTH()`                   | ✅            |                                                                                                                                               |
| `JSON_MERGE()`                    | ✅            |                                                                                                                                               |
| `JSON_MERGE_PATCH()`              | ✅            |                                                                                                                                               |
| `JSON_MERGE_PRESERVE()`           | ✅            |                                                                                                                                               |
| `JSON_OBJECT()`                   | ✅            |                                                                                                                                               |
| `JSON_OBJECTAGG()`                | ✅            |                                                                                                                                               |
| `JSON_OVERLAPS()`                 | ✅            |                                                                                                                                               |
| `JSON_PRETTY()`                   | ❌            |                                                                                                                                               |
| `JSON_QUOTE()`                    | ❌            |                                                                                                                                               |
| `JSON_REMOVE()`                   | ✅            |                                                                                                                                               |
| `JSON_REPLACE()`                  | ✅            |                                                                                                                                               |
| `JSON_SCHEMA_VALID()`             | ❌            |                                                                                                                                               |
| `JSON_SCHEMA_VALIDATION_REPORT()` | ❌            |                                                                                                                                               |
| `JSON_SEARCH()`                   | ❌            |                                                                                                                                               |
| `JSON_SET()`                      | ✅            |                                                                                                                                               |
| `JSON_STORAGE_FREE()`             | ❌            |                                                                                                                                               |
| `JSON_STORAGE_SIZE()`             | ❌            |                                                                                                                                               |
| `JSON_TABLE()`                    | ✅            | `FOR ORDINALITY` and `NESTED` are not supported yet.                                                                                          |
| `JSON_TYPE()`                     | ✅            | Inconsistencies when using MySQL Native Types                                                                                                 |
| `JSON_UNQUOTE()`                  | ✅            |                                                                                                                                               |
| `JSON_VALID()`                    | ✅            |                                                                                                                                               |
| `JSON_VALUE()`                    | ✅            |                                                                                                                                               |
| `LAG()`                           | ✅            |                                                                                                                                               |
| `LAST()`                          | ✅            |                                                                                                                                               |
| `LAST_DAY`                        | ❌            |                                                                                                                                               |
| `LAST_INSERT_ID()`                | ✅            |                                                                                                                                               |
| `LAST_VALUE()`                    | ✅            |                                                                                                                                               |
| `LCASE()`                         | ✅            |                                                                                                                                               |
| `LEAD()`                          | ✅            |                                                                                                                                               |
| `LEAST()`                         | ✅            |                                                                                                                                               |
| `LEFT()`                          | ✅            |                                                                                                                                               |
| `LENGTH()`                        | ✅            |                                                                                                                                               |
| `LIKE`                            | ✅            |                                                                                                                                               |
| `LN()`                            | ✅            |                                                                                                                                               |
| `LOAD_FILE()`                     | ✅            |                                                                                                                                               |
| `LOCALTIME()`                     | ✅            |                                                                                                                                               |
| `LOCALTIMESTAMP()`                | ✅            |                                                                                                                                               |
| `LOCATE()`                        | ✅            |                                                                                                                                               |
| `LOG()`                           | ✅            |                                                                                                                                               |
| `LOG10()`                         | ✅            |                                                                                                                                               |
| `LOG2()`                          | ✅            |                                                                                                                                               |
| `LOWER()`                         | ✅            |                                                                                                                                               |
| `LPAD()`                          | ✅            |                                                                                                                                               |
| `LTRIM()`                         | ✅            |                                                                                                                                               |
| `LineString()`                    | ✅            |                                                                                                                                               |
| `MAKEDATE()`                      | ❌            |                                                                                                                                               |
| `MAKETIME()`                      | ❌            |                                                                                                                                               |
| `MAKE_SET()`                      | ❌            |                                                                                                                                               |
| `MASTER_POS_WAIT()`               | ❌            |                                                                                                                                               |
| `MATCH`                           | ❌            |                                                                                                                                               |
| `MAX()`                           | ✅            |                                                                                                                                               |
| `MBRContains()`                   | ❌            |                                                                                                                                               |
| `MBRCoveredBy()`                  | ❌            |                                                                                                                                               |
| `MBRCovers()`                     | ❌            |                                                                                                                                               |
| `MBRDisjoint()`                   | ❌            |                                                                                                                                               |
| `MBREquals()`                     | ❌            |                                                                                                                                               |
| `MBRIntersects()`                 | ❌            |                                                                                                                                               |
| `MBROverlaps()`                   | ❌            |                                                                                                                                               |
| `MBRTouches()`                    | ❌            |                                                                                                                                               |
| `MBRWithin()`                     | ❌            |                                                                                                                                               |
| `MD5()`                           | ✅            |                                                                                                                                               |
| `MEMBER OF()`                     | ❌            |                                                                                                                                               |
| `MICROSECOND()`                   | ✅            |                                                                                                                                               |
| `MID()`                           | ✅            |                                                                                                                                               |
| `MIN()`                           | ✅            |                                                                                                                                               |
| `MINUTE()`                        | ✅            |                                                                                                                                               |
| `MOD()`                           | ✅            |                                                                                                                                               |
| `MONTH()`                         | ✅            |                                                                                                                                               |
| `MONTHNAME()`                     | ✅            |                                                                                                                                               |
| `MultiLineString()`               | ✅            |                                                                                                                                               |
| `MultiPoint()`                    | ✅            |                                                                                                                                               |
| `MultiPolygon()`                  | ✅            |                                                                                                                                               |
| `NAME_CONST()`                    | ❌            |                                                                                                                                               |
| `NOT`, `!`                        | ✅            |                                                                                                                                               |
| `NOT BETWEEN ... AND ...`         | ✅            |                                                                                                                                               |
| `NOT IN()`                        | ✅            |                                                                                                                                               |
| `NOT LIKE`                        | ✅            |                                                                                                                                               |
| `NOT MATCH`                       | ❌            |                                                                                                                                               |
| `NOT REGEXP`                      | ✅            |                                                                                                                                               |
| `NOT RLIKE`                       | ❌            | `NOT REGEXP` is supported                                                                                                                     |
| `NOT`, `!`                        | ✅            |                                                                                                                                               |
| `NOW()`                           | ✅            |                                                                                                                                               |
| `NTH_VALUE()`                     | ❌            |                                                                                                                                               |
| `NTILE()`                         | ❌            |                                                                                                                                               |
| `NULLIF()`                        | ✅            |                                                                                                                                               |
| `OCT()`                           | ❌            |                                                                                                                                               |
| `OCTET_LENGTH()`                  | ✅            |                                                                                                                                               |
| `ORD()`                           | ✅            |                                                                                                                                               |
| `OR`                              | ✅            |                                                                                                                                               |
| `PERCENT_RANK()`                  | ✅            |                                                                                                                                               |
| `PERIOD_ADD()`                    | ❌            |                                                                                                                                               |
| `PERIOD_DIFF()`                   | ❌            |                                                                                                                                               |
| `PI()`                            | ✅            |                                                                                                                                               |
| `POSITION()`                      | ✅            |                                                                                                                                               |
| `POW()`                           | ✅            |                                                                                                                                               |
| `POWER()`                         | ✅            |                                                                                                                                               |
| `PS_CURRENT_THREAD_ID()`          | ❌            |                                                                                                                                               |
| `PS_THREAD_ID()`                  | ❌            |                                                                                                                                               |
| `POINT()`                         | ✅            |                                                                                                                                               |
| `POLYGON()`                       | ✅            |                                                                                                                                               |
| `QUARTER()`                       | ✅            |                                                                                                                                               |
| `QUOTE()`                         | ❌            |                                                                                                                                               |
| `RADIANS()`                       | ✅            |                                                                                                                                               |
| `RAND()`                          | ✅            |                                                                                                                                               |
| `RANDOM_BYTES()`                  | ✅            |                                                                                                                                               |
| `RANK()`                          | ✅            |                                                                                                                                               |
| `REGEXP_INSTR()`                  | ❌            |                                                                                                                                               |
| `REGEXP_LIKE()`                   | ✅            |                                                                                                                                               |
| `REGEXP_MATCHES()`                | ❌            |                                                                                                                                               |
| `REGEXP_REPLACE()`                | ✅            |                                                                                                                                               |
| `REGEXP_SUBSTR()`                 | ❌            |                                                                                                                                               |
| `REGEXP`                          | ✅            |                                                                                                                                               |
| `RELEASE_ALL_LOCKS()`             | ✅            |                                                                                                                                               |
| `RELEASE_LOCK()`                  | ✅            |                                                                                                                                               |
| `REPEAT()`                        | ✅            |                                                                                                                                               |
| `REPLACE()`                       | ✅            |                                                                                                                                               |
| `REVERSE()`                       | ✅            |                                                                                                                                               |
| `RIGHT()`                         | ✅            |                                                                                                                                               |
| `RLIKE`                           | ❌            | `REGEXP` is supported                                                                                                                         |
| `ROLES_GRAPHML()`                 | ❌            |                                                                                                                                               |
| `ROUND()`                         | ✅            |                                                                                                                                               |
| `ROW_COUNT()`                     | ✅            |                                                                                                                                               |
| `ROW_NUMBER()`                    | ✅            |                                                                                                                                               |
| `RPAD()`                          | ✅            |                                                                                                                                               |
| `RTRIM()`                         | ✅            |                                                                                                                                               |
| `SCHEMA()`                        | ✅            |                                                                                                                                               |
| `SECOND()`                        | ✅            |                                                                                                                                               |
| `SEC_TO_TIME()`                   | ❌            |                                                                                                                                               |
| `SESSION_USER()`                  | ❌            |                                                                                                                                               |
| `SHA()`                           | ✅            |                                                                                                                                               |
| `SHA1()`                          | ✅            |                                                                                                                                               |
| `SHA2()`                          | ✅            |                                                                                                                                               |
| `SIGN()`                          | ✅            |                                                                                                                                               |
| `SIN()`                           | ✅            |                                                                                                                                               |
| `SLEEP()`                         | ✅            |                                                                                                                                               |
| `SOUNDEX()`                       | ✅            |                                                                                                                                               |
| `SPACE()`                         | ✅            |                                                                                                                                               |
| `SPLIT()`                         | ✅            |                                                                                                                                               |
| `SQRT()`                          | ✅            |                                                                                                                                               |
| `STATEMENT_DIGEST()`              | ❌            |                                                                                                                                               |
| `STATEMENT_DIGEST_TEXT()`         | ❌            |                                                                                                                                               |
| `STD()`                           | ❌            |                                                                                                                                               |
| `STDDEV()`                        | ❌            |                                                                                                                                               |
| `STDDEV_POP()`                    | ❌            |                                                                                                                                               |
| `STDDEV_SAMP()`                   | ❌            |                                                                                                                                               |
| `STRCMP()`                        | ✅            |                                                                                                                                               |
| `STR_TO_DATE()`                   | ✅            |                                                                                                                                               |
| `ST_AREA()`                       | ✅            | Geodetic not yet supported                                                                                                                    |
| `ST_ASBINARY()`                   | ✅            |                                                                                                                                               |
| `ST_ASGEOJSON()`                  | ✅            |                                                                                                                                               |
| `ST_ASTEXT()`                     | ✅            |                                                                                                                                               |
| `ST_ASWKB()`                      | ✅            |                                                                                                                                               |
| `ST_ASWKT()`                      | ✅            |                                                                                                                                               |
| `ST_BUFFER()`                     | ❌            |                                                                                                                                               |
| `ST_BUFFER_STRATEGY()`            | ❌            |                                                                                                                                               |
| `ST_CENTROID()`                   | ❌            |                                                                                                                                               |
| `ST_CONTAINS()`                   | ❌            |                                                                                                                                               |
| `ST_CONVEXHULL()`                 | ❌            |                                                                                                                                               |
| `ST_CROSSES()`                    | ❌            |                                                                                                                                               |
| `ST_DIFFERENCE()`                 | ❌            |                                                                                                                                               |
| `ST_DIMENSION()`                  | ✅            |                                                                                                                                               |
| `ST_DISJOINT()`                   | ❌            |                                                                                                                                               |
| `ST_DISTANCE()`                   | ✅            | Geodetic not yet supported                                                                                                                    |
| `ST_DISTANCE_SPHERE()`            | ❌            |                                                                                                                                               |
| `ST_ENDPOINT()`                   | ✅            |                                                                                                                                               |
| `ST_ENVELOPE()`                   | ❌            |                                                                                                                                               |
| `ST_EQUALS()`                     | ✅            | Only supported for `POINT`s                                                                                                                   |
| `ST_EXTERIORRING()`               | ❌            |                                                                                                                                               |
| `ST_GEOHASH()`                    | ❌            |                                                                                                                                               |
| `ST_GEOMCOLLFROMTEXT()`           | ✅            |                                                                                                                                               |
| `ST_GEOMCOLLFROMWKB()`            | ✅            |                                                                                                                                               |
| `ST_GEOMFROMGEOJSON()`            | ✅            |                                                                                                                                               |
| `ST_GEOMFROMTEXT()`               | ✅            |                                                                                                                                               |
| `ST_GEOMFROMWKB()`                | ✅            |                                                                                                                                               |
| `ST_GEOMETRYN()`                  | ❌            |                                                                                                                                               |
| `ST_GEOMETRYTYPE()`               | ❌            |                                                                                                                                               |
| `ST_INTERIORRINGN()`              | ❌            |                                                                                                                                               |
| `ST_INTERSECTION()`               | ❌            |                                                                                                                                               |
| `ST_INTERSECTS()`                 | ✅            |                                                                                                                                               |
| `ST_ISCLOSED()`                   | ✅            |                                                                                                                                               |
| `ST_ISEMPTY()`                    | ❌            |                                                                                                                                               |
| `ST_ISSIMPLE()`                   | ❌            |                                                                                                                                               |
| `ST_ISVALID()`                    | ❌            |                                                                                                                                               |
| `ST_LATFROMGEOHASH()`             | ❌            |                                                                                                                                               |
| `ST_LATITUDE()`                   | ✅            |                                                                                                                                               |
| `ST_LENGTH()`                     | ✅            | Geodetic not yet supported                                                                                                                    |
| `ST_LINEFROMTEXT()`               | ✅            |                                                                                                                                               |
| `ST_LINEFROMWKB()`                | ✅            |                                                                                                                                               |
| `ST_LONGFROMGEOHASH()`            | ❌            |                                                                                                                                               |
| `ST_LONGITUDE()`                  | ✅            |                                                                                                                                               |
| `ST_MLINEFROMTEXT()`              | ✅            |                                                                                                                                               |
| `ST_MLINEFROMWKB()`               | ✅            |                                                                                                                                               |
| `ST_MPOINTFROMTEXT()`             | ✅            |                                                                                                                                               |
| `ST_MPOINTFROMWKB()`              | ✅            |                                                                                                                                               |
| `ST_MPOLYFROMTEXT()`              | ✅            |                                                                                                                                               |
| `ST_MPOLYFROMWKB()`               | ✅            |                                                                                                                                               |
| `ST_MAKEENVELOPE()`               | ❌            |                                                                                                                                               |
| `ST_NUMGEOMETRIES()`              | ❌            |                                                                                                                                               |
| `ST_NUMINTERIORRING()`            | ❌            |                                                                                                                                               |
| `ST_NUMPOINTS()`                  | ❌            |                                                                                                                                               |
| `ST_OVERLAPS()`                   | ❌            |                                                                                                                                               |
| `ST_PERIMETER()`                  | ✅            | Geodetic not yet supported. Not supported in MySQL. Follows PostGIS: https://postgis.net/docs/ST_Perimeter.html                               |
| `ST_POINTFROMGEOHASH()`           | ❌            |                                                                                                                                               |
| `ST_POINTFROMTEXT()`              | ✅            |                                                                                                                                               |
| `ST_POINTFROMWKB()`               | ✅            |                                                                                                                                               |
| `ST_POINTN()`                     | ❌            |                                                                                                                                               |
| `ST_POLYFROMTEXT()`               | ✅            |                                                                                                                                               |
| `ST_POLYFROMWKB()`                | ✅            |                                                                                                                                               |
| `ST_SRID()`                       | ✅            |                                                                                                                                               |
| `ST_SIMPLIFY()`                   | ❌            |                                                                                                                                               |
| `ST_STARTPOINT()`                 | ✅            |                                                                                                                                               |
| `ST_SWAPXY()`                     | ✅            |                                                                                                                                               |
| `ST_SYMDIFFERENCE()`              | ❌            |                                                                                                                                               |
| `ST_TOUCHES()`                    | ❌            |                                                                                                                                               |
| `ST_TRANSFORM()`                  | ❌            |                                                                                                                                               |
| `ST_UNION()`                      | ❌            |                                                                                                                                               |
| `ST_VALIDATE()`                   | ❌            |                                                                                                                                               |
| `ST_WITHIN()`                     | ✅            | Only supported for Point vs Geometry comparisons                                                                                              |
| `ST_X()`                          | ✅            |                                                                                                                                               |
| `ST_Y()`                          | ✅            |                                                                                                                                               |
| `SUBDATE()`                       | ✅            |                                                                                                                                               |
| `SUBSTR()`                        | ✅            |                                                                                                                                               |
| `SUBSTRING()`                     | ✅            |                                                                                                                                               |
| `SUBSTRING_INDEX()`               | ✅            |                                                                                                                                               |
| `SUBTIME()`                       | ❌            |                                                                                                                                               |
| `SUM()`                           | ✅            |                                                                                                                                               |
| `SYSDATE()`                       | ✅            |                                                                                                                                               |
| `SYSTEM_USER()`                   | ❌            |                                                                                                                                               |
| `TAN()`                           | ✅            |                                                                                                                                               |
| `TIME()`                          | ✅            |                                                                                                                                               |
| `TIMEDIFF()`                      | ✅            |                                                                                                                                               |
| `TIMESTAMP()`                     | ✅            |                                                                                                                                               |
| `TIMESTAMPADD()`                  | ❌            |                                                                                                                                               |
| `TIMESTAMPDIFF()`                 | ❌            |                                                                                                                                               |
| `TIME_FORMAT()`                   | ✅            |                                                                                                                                               |
| `TIME_TO_SEC()`                   | ✅            |                                                                                                                                               |
| `TO_BASE64()`                     | ✅            |                                                                                                                                               |
| `TO_DAYS()`                       | ❌            |                                                                                                                                               |
| `TO_SECONDS()`                    | ❌            |                                                                                                                                               |
| `TRIM()`                          | ✅            |                                                                                                                                               |
| `TRUNCATE()`                      | ❌            |                                                                                                                                               |
| `UCASE()`                         | ✅            |                                                                                                                                               |
| `UNCOMPRESS()`                    | ❌            |                                                                                                                                               |
| `UNCOMPRESSED_LENGTH()`           | ❌            |                                                                                                                                               |
| `UNHEX()`                         | ✅            |                                                                                                                                               |
| `UNIX_TIMESTAMP()`                | ✅            |                                                                                                                                               |
| `UPPER()`                         | ✅            |                                                                                                                                               |
| `USER()`                          | ✅            |                                                                                                                                               |
| `UTC_DATE()`                      | ❌            |                                                                                                                                               |
| `UTC_TIME()`                      | ❌            |                                                                                                                                               |
| `UTC_TIMESTAMP()`                 | ✅            |                                                                                                                                               |
| `UUID()`                          | ✅            |                                                                                                                                               |
| `UUID_SHORT()`                    | ❌            |                                                                                                                                               |
| `UUID_TO_BIN()`                   | ✅            |                                                                                                                                               |
| `UPDATEXML()`                     | ❌            |                                                                                                                                               |
| `VALIDATE_PASSWORD_STRENGTH()`    | ❌            |                                                                                                                                               |
| `VALUES()`                        | ✅            |                                                                                                                                               |
| `VARIANCE()`                      | ❌            |                                                                                                                                               |
| `VAR_POP()`                       | ❌            |                                                                                                                                               |
| `VAR_SAMP()`                      | ❌            |                                                                                                                                               |
| `VERSION()`                       | ✅            |                                                                                                                                               |
| `WAIT_FOR_EXECUTED_GTID_SET()`    | ❌            |                                                                                                                                               |
| `WEEK()`                          | ✅            |                                                                                                                                               |
| `WEEKDAY()`                       | ✅            |                                                                                                                                               |
| `WEEKOFYEAR()`                    | ✅            |                                                                                                                                               |
| `WEIGHT_STRING()`                 | ❌            |                                                                                                                                               |
| `YEAR()`                          | ✅            |                                                                                                                                               |
| `YEARWEEK()`                      | ✅            |                                                                                                                                               |

## Aggregate Functions

Refer to the [MySQL Aggregate Function Documentation](https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html) for more info.

| Component                         | Supported | Notes and limitations                                                                          |
| :-------------------------------- |:----------| :--------------------------------------------------------------------------------------------- |
| `AVG()`                           | ✅         |                                                                                                |
| `BIT_AND()`                       | ✅         |                                                                                                |
| `BIT_OR()`                        | ✅         |                                                                                                |
| `BIT_XOR()`                       | ✅         |                                                                                                |
| `COUNT()`                         | ✅         |                                                                                                |
| `COUNT(DISTINCT)`                 | ✅         |                                                                                                |
| `GROUP_CONCAT()`                  | ✅         |                                                                                                |
| `JSON_OBJECT_AGG()`               | ✅         |                                                                                                |
| `JSON_ARRAY_AGG()`                | ✅         |                                                                                                |
| `MAX()`                           | ✅         |                                                                                                |
| `MIN()`                           | ✅         |                                                                                                |
| `STD()`                           | ❌         |                                                                                                |
| `STDDEV()`                        | ❌         |                                                                                                |
| `STDDEV_POP()`                    | ❌         |                                                                                                |
| `STDDEV_SAMP()`                   | ❌         |                                                                                                |
| `SUM()`                           | ✅         |                                                                                                |
| `VAR_POP()`                       | ❌         |                                                                                                |
| `VAR_SAMP()`                      | ❌         |                                                                                                |
| `VARIANCE()`                      | ❌         |                                                                                                |

## Window Functions

Refer to the [MySQL Window Function Descriptions](https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html) for more info.

| Component                         | Supported | Notes and limitations                                                                          |
| :-------------------------------- | :-------- | :--------------------------------------------------------------------------------------------- |
| `CUME_DIST()`                     | ❌        |                                                                                                |
| `DENSE_RANK()`                    | ✅        |                                                                                                |
| `FIRST()`                         | ✅        |                                                                                                |
| `FIRST_VALUE`                     | ✅        |                                                                                                |
| `LAG`                             | ✅        |                                                                                                |
| `LAST_VALUE()`                    | ✅        |                                                                                                |
| `LAST()`                          | ✅        |                                                                                                |
| `LEAD()`                          | ✅        |                                                                                                |
| `NTH_VALUE()`                     | ❌        |                                                                                                |
| `NTILE()`                         | ❌        |                                                                                                |
| `PERCENT_RANK()`                  | ✅        |                                                                                                |
| `RANK()`                          | ✅        |                                                                                                |
| `ROW_NUMBER()`                    | ✅        |                                                                                                |
