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
