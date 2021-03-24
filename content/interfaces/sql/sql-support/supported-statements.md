---
title: Supported Statements
---

# Supported Statements

## Data manipulation statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `CALL` | ✓ |  |
| `CREATE TABLE AS` | X | `INSERT INTO SELECT *` is supported. |
| `CREATE TABLE LIKE` | ✓ |  |
| `DO` | X |  |
| `DELETE` | ✓ | No support for referring to more than one table in a single `DELETE` statement. |
| `HANDLER` | X |  |
| `IMPORT TABLE` | X | Use `dolt table import` |
| `INSERT` | ✓ | Including support for `ON DUPLICATE KEY` clauses. |
| `LOAD DATA` | ✓ |  |
| `LOAD XML` | X | Use `dolt table import` |
| `REPLACE` | ✓ |  |
| `SELECT` | ✓ | Most select statements, including `UNION` and `JOIN`, are supported. |
| `SELECT FROM AS OF` | ✓ | Selecting from a table as of any known revision or commit timestamp is supported. See [AS OF queries](../concurrency.md). |
| `SELECT FOR UPDATE` | X | Locking and concurrency are currently very limited. |
| `SUBQUERIES` | ✓ | Subqueries work, but must be given aliases. Some limitations apply. |
| `TABLE` | X | Equivalent to `SELECT * FROM TABLE` without a `WHERE` clause. |
| `TRUNCATE` | ✓ |  |
| `UPDATE` | ✓ | No support for referring to more than one table in a single `UPDATE` statement. |
| `VALUES` | X |  |
| `WITH` | X | Common table expressions \(CTEs\) are not yet supported |

## Data definition statements

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
| `CHANGE COLUMN` | ✓ |  |
| `CREATE DATABASE` | O | Create an in-memory database the length of a session. Creating new dolt databases that persist outside of a session is not yet supported. |
| `CREATE EVENT` | X |  |
| `CREATE FUNCTION` | X |  |
| `CREATE INDEX` | O | Fulltext and spatial indexes are not supported. |
| `CREATE SCHEMA` | O | Create an in memory database the length of a session. Creating new dolt databases that persist outside of a session is not yet supported. |
| `CREATE TABLE` | ✓ | Tables must have primary keys. |
| `CREATE TABLE AS` | X |  |
| `CREATE TRIGGER` | ✓ |  |
| `CREATE VIEW` | ✓ |  |
| `DESCRIBE TABLE` | ✓ |  |
| `DROP COLUMN` | ✓ |  |
| `DROP CONSTRAINT` | ✓ |  |
| `DROP DATABASE` | O | Deletes only in-memory database. To delete a repository you must delete its directory on disk. |
| `DROP EVENT` | X |  |
| `DROP FUNCTION` | X |  |
| `DROP INDEX` | ✓ |  |
| `DROP SCHEMA` | O | Deletes only in-memory database. To delete a repository you must delete its directory on disk. |
| `DROP TABLE` | ✓ |  |
| `DROP PARTITION` | X |  |
| `DROP PROCEDURE` | ✓ |  |
| `DROP TRIGGER` | ✓ |  |
| `DROP VIEW` | ✓ |  |
| `MODIFY COLUMN` | ✓ |  |
| `RENAME COLUMN` | ✓ |  |
| `RENAME CONSTRAINT` | X |  |
| `RENAME DATABASE` | X | Database names are read-only, but can be configured in the server config. |
| `RENAME INDEX` | X |  |
| `RENAME TABLE` | ✓ |  |
| `SHOW COLUMNS` | ✓ |  |
| `SHOW CONSTRAINTS` | X |  |
| `SHOW CREATE FUNCTION` | X |  |
| `SHOW CREATE PROCEDURE` | X |  |
| `SHOW CREATE TABLE` | ✓ |  |
| `SHOW CREATE VIEW` | ✓ |  |
| `SHOW DATABASES` | ✓ |  |
| `SHOW FUNCTION CODE` | X |  |
| `SHOW FUNCTION STATUS` | X |  |
| `SHOW INDEX` | X |  |
| `SHOW PROCEDURE CODE` | X |  |
| `SHOW PROCEDURE STATUS` | ✓ |  |
| `SHOW SCHEMAS` | ✓ |  |
| `SHOW TABLES` | ✓ | `SHOW FULL TABLES` reveals whether a table is a base table or a view. |
| `TRUNCATE TABLE` | ✓ |  |

## Transactional statements

Transactional semantics are a work in progress. Dolt isn't like other databases: a "commit" in dolt creates a new entry in the repository revision graph, as opposed to updating one or more rows atomically as in other databases. By default, updating data through SQL statements modifies the working set of the repository. Committing changes to the repository requires the use of `dolt add` and `dolt commmit` from the command line. But it's also possible for advanced users to create commits and branches directly through SQL statements.

Not much work has been put into supporting the true transaction and concurrency primitives necessary to be an application server, but limited support for transactions does exist. Specifically, when running the SQL server with `@@autocommit = false`, the working set will not be updated with changes until a `COMMIT` statement is executed.

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `BEGIN` | O | `BEGIN` parses correctly, but is a no-op: it doesn't create a checkpoint that can be returned to with `ROLLBACK`. |
| `COMMIT` | ✓ | `COMMIT` will write any pending changes to the working set when `@@autocommit = false` |
| `COMMIT(MESSAGE)` | ✓ | The `COMMIT()` function creates a commit of the current database state and returns the hash of this new commit. See [concurrency](../concurrency.md) for details. |
| `LOCK TABLES` | X | `LOCK TABLES` parses correctly but does not prevent access to those tables from other sessions. |
| `ROLLBACK` | X | `ROLLBACK` parses correctly but is a no-op. |
| `SAVEPOINT` | X |  |
| `RELEASE SAVEPOINT` | X |  |
| `ROLLBACK TO SAVEPOINT` | X |  |
| `SET @@autocommit = 1` | ✓ | When `@@autocommit = true`, changes to data will update the working set after every statement. When `@@autocommit = false`, the working set will only be updated after `COMMIT` statements. |
| `SET TRANSACTION` | X | Different isolation levels are not yet supported. |
| `START TRANSACTION` | O | `START TRANSACTION` parses correctly, but is a no-op: it doesn't create a checkpoint that can be returned to with `ROLLBACK`. |
| `UNLOCK TABLES` | ✓ | `UNLOCK TABLES` parses correctly, but since `LOCK TABLES` doesn't prevent concurrent access it's essentially a no-op. |

## Prepared statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `PREPARE` | ✓ |  |
| `EXECUTE` | ✓ |  |

## Access management statements

Access management via SQL statements is not yet supported. This table will be updated as access management features are implemented. Please [file an issue](https://github.com/dolthub/dolt/issues) if lack of SQL access management is blocking your use of Dolt, and we will prioritize accordingly.

A root user name and password can be specified in the config for [`sql-server`](../../cli.md#dolt-sql-server). This user has full privileges on the running database.

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

## Session management statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `SET` | ✓ |  |
| `SET CHARACTER SET` | O | \`SET CHARACTER SET\` parses correctly, but Dolt supports only the \`utf8mb4\` collation |
| `SET NAMES` | O | \`SET NAMES\` parses correctly, but Dolt supports only the \`utf8mb4\` collation for identifiers |
| `KILL QUERY` | ✓ |  |

## Utility statements

| Statement | Supported | Notes and limitations |
| :--- | :--- | :--- |
| `EXPLAIN` | ✓ |  |
| `USE` | ✓ |  |
