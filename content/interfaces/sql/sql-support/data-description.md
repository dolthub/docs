---
title: Data Description
---

# Data Description

## Data types

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
| `TINYBLOB` | ✓ |  |
| `BLOB` | ✓ |  |
| `MEDIUMBLOB` | ✓ |  |
| `LONGBLOB` | ✓ |  |
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
| `JSON` | ✓ |  |

## Constraints

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Not Null | ✓ |  |
| Unique | ✓ | Unique constraints are supported via creation of indexes with `UNIQUE` keys. |
| Primary Key | ✓ |  |
| Check | ✓ |  |
| Foreign Key | ✓ |  |
| Default Value | ✓ |  |

## Transactions

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `BEGIN` | O | `BEGIN` parses correctly, but is a no-op: it doesn't create a checkpoint that can be returned to with `ROLLBACK`. |
| `COMMIT` | ✓ | `COMMIT` will write any pending changes to the working set when `@@autocommit = false` |
| `COMMIT(MESSAGE)` | ✓ | The `COMMIT()` function creates a commit of the current database state and returns the hash of this new commit. See [concurrency](../concurrency.md) for details. |
| `LOCK TABLES` | X | `LOCK TABLES` parses correctly but does not prevent access to those tables from other sessions. |
| `ROLLBACK` | X | `ROLLBACK` parses correctly but is a no-op. |
| `SAVEPOINT` | X |  |
| `SET @@autocommit = 1` | ✓ | When `@@autocommit = true`, changes to data will update the working set after every statement. When `@@autocommit = false`, the working set will only be updated after `COMMIT` statements. |

## Indexes

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Indexes | ✓ |  |
| Multi-column indexes | ✓ |  |
| Full-text indexes | X |  |
| Spatial indexes | X |  |

## Schema

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `ALTER TABLE` statements | O | Some limitations. See the [supported statements doc](supported-statements.md). |
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
