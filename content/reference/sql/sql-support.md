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
