# Supported Statements

## Data manipulation statements

| Statement           | Supported | Notes and limitations                                                             |
| ------------------- | --------- | --------------------------------------------------------------------------------- |
| `CALL`              | ✅         |                                                                                   |
| `CREATE TABLE AS`   | ❌         | `INSERT INTO SELECT *` is supported.                                              |
| `CREATE TABLE LIKE` | ✅         |                                                                                   |
| `DO`                | ❌         |                                                                                   |
| `DELETE`            | ✅         | No support for referring to more than one table in a single `DELETE` statement.   |
| `HANDLER`           | ❌         |                                                                                   |
| `IMPORT TABLE`      | ❌         | Use `dolt table import`                                                           |
| `INSERT`            | ✅         | Including support for `ON DUPLICATE KEY` clauses.                                 |
| `LOAD DATA`         | ✅         |                                                                                   |
| `LOAD XML`          | ❌         | Use `dolt table import`                                                           |
| `REPLACE`           | ✅         |                                                                                   |
| `SELECT`            | ✅         | Most select statements, including `UNION` and `JOIN`, are supported.              |
| `SELECT FROM AS OF` | ✅         | Selecting from a table as of any known revision or commit timestamp is supported. |
| `SELECT FOR UPDATE` | ❌         | Row-level locks are not supported.                                                |
| `SUBQUERIES`        | ✅         | Subqueries work, but must be given aliases. Some limitations apply.               |
| `TABLE`             | ❌         | Equivalent to `SELECT * FROM TABLE` without a `WHERE` clause.                     |
| `TRUNCATE`          | ✅         |                                                                                   |
| `UPDATE`            | ✅         | No support for referring to more than one table in a single `UPDATE` statement.   |
| `VALUES`            | ✅         |                                                                                   |
| `WITH`              | ✅         |                                                                                   |
| `SELECT INTO`       | ✅         | Selecting into a file is not supported.                                           |

## Data definition statements

| Statement               | Supported | Notes and limitations                                                                   |
| ----------------------- | --------- | --------------------------------------------------------------------------------------- |
| `ADD COLUMN`            | ✅         |                                                                                         |
| `ADD CHECK`             | ✅         |                                                                                         |
| `ADD CONSTRAINT`        | ✅         |                                                                                         |
| `ADD FOREIGN KEY`       | ✅         |                                                                                         |
| `ADD PARTITION`         | ❌         |                                                                                         |
| `ALTER COLUMN`          | 🟠        | Name and order changes are supported. Some but not all type changes are supported.      |
| `ALTER DATABASE`        | ❌         |                                                                                         |
| `ALTER INDEX`           | ❌         | Indexes can be created and dropped, but not altered.                                    |
| `ALTER PRIMARY KEY`     | ✅         |                                                                                         |
| `ALTER TABLE`           | ✅         | Not all `ALTER TABLE` statements are supported. See the rest of this table for details. |
| `ALTER TYPE`            | 🟠        | Some type changes are supported but not all.                                            |
| `ALTER VIEW`            | ❌         | Views can be created and dropped, but not altered.                                      |
| `CHANGE COLUMN`         | ✅         |                                                                                         |
| `CREATE DATABASE`       | ✅         | Creates a new dolt database rooted relative to the server directory                     |
| `CREATE EVENT`          | ❌         |                                                                                         |
| `CREATE FUNCTION`       | ❌         |                                                                                         |
| `CREATE INDEX`          | 🟠        | Fulltext and spatial indexes are not supported.                                         |
| `CREATE SCHEMA`         | ✅         | Creates a new dolt database rooted relative to the server directory                     |
| `CREATE TABLE`          | ✅         |                                                                                         |
| `CREATE TABLE AS`       | ❌         |                                                                                         |
| `CREATE TRIGGER`        | ✅         |                                                                                         |
| `CREATE VIEW`           | ✅         |                                                                                         |
| `DESCRIBE TABLE`        | ✅         |                                                                                         |
| `DROP COLUMN`           | ✅         |                                                                                         |
| `DROP CONSTRAINT`       | ✅         |                                                                                         |
| `DROP DATABASE`         | ✅         | Deletes the dolt data directory. This is unrecoverable.                                 |
| `DROP EVENT`            | ❌         |                                                                                         |
| `DROP FUNCTION`         | ❌         |                                                                                         |
| `DROP INDEX`            | ✅         |                                                                                         |
| `DROP SCHEMA`           | ✅         | Deletes the dolt data directory. This is unrecoverable.                                 |
| `DROP TABLE`            | ✅         |                                                                                         |
| `DROP PARTITION`        | ❌         |                                                                                         |
| `DROP PROCEDURE`        | ✅         |                                                                                         |
| `DROP TRIGGER`          | ✅         |                                                                                         |
| `DROP VIEW`             | ✅         |                                                                                         |
| `MODIFY COLUMN`         | ✅         |                                                                                         |
| `RENAME COLUMN`         | ✅         |                                                                                         |
| `RENAME CONSTRAINT`     | ❌         |                                                                                         |
| `RENAME DATABASE`       | ❌         | Database names are read-only, but can be configured in the server config.               |
| `RENAME INDEX`          | ❌         |                                                                                         |
| `RENAME TABLE`          | ✅         |                                                                                         |
| `SHOW COLUMNS`          | ✅         |                                                                                         |
| `SHOW CONSTRAINTS`      | ❌         |                                                                                         |
| `SHOW CREATE FUNCTION`  | ❌         |                                                                                         |
| `SHOW CREATE PROCEDURE` | ✅         |                                                                                         |
| `SHOW CREATE TABLE`     | ✅         |                                                                                         |
| `SHOW CREATE VIEW`      | ✅         |                                                                                         |
| `SHOW DATABASES`        | ✅         |                                                                                         |
| `SHOW FUNCTION CODE`    | ❌         |                                                                                         |
| `SHOW FUNCTION STATUS`  | ❌         |                                                                                         |
| `SHOW GRANTS`           | 🟠        | Database privileges, table privileges, and role assumption are not yet implemented.     |
| `SHOW INDEX`            | ❌         |                                                                                         |
| `SHOW PRIVILEGES`       | ✅         |                                                                                         |
| `SHOW PROCEDURE CODE`   | ❌         |                                                                                         |
| `SHOW PROCEDURE STATUS` | ✅         |                                                                                         |
| `SHOW SCHEMAS`          | ✅         |                                                                                         |
| `SHOW TABLES`           | ✅         | `SHOW FULL TABLES` reveals whether a table is a base table or a view.                   |
| `TRUNCATE TABLE`        | ✅         |                                                                                         |

## Transactional statements

Dolt supports atomic transactions like other SQL databases. It's also possible for clients to connect to different heads, which means they will never see each other's edits until a merge between heads is performed. See [Using Branches](../version-control/branches.md) for more detail.

Dolt has two levels of persistence:

1. The SQL transaction layer, where a `COMMIT` statement atomically updates the working set for the connected head
2. The Dolt commit layer, where commits are added to the Dolt commit graph with an author, a parent commit, etc.

| Statement               | Supported | Notes and limitations                                                                                                                                                             |
| ----------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BEGIN`                 | ✅         | Synonym for `START TRANSACTION`                                                                                                                                                   |
| `COMMIT`                | ✅         |                                                                                                                                                                                   |
| `CALL DOLT_COMMIT()`    | ✅         | `DOLT_COMMIT()` creates a new Dolt commit using the content of the STAGED HEAD. [See docs on DOLT\_COMMIT() for details.](../version-control/dolt-sql-procedures.md#dolt\_commit) |
| `LOCK TABLES`           | ❌         | `LOCK TABLES` parses correctly but does not prevent access to those tables from other sessions.                                                                                   |
| `ROLLBACK`              | ✅         |                                                                                                                                                                                   |
| `SAVEPOINT`             | ✅         |                                                                                                                                                                                   |
| `RELEASE SAVEPOINT`     | ✅         |                                                                                                                                                                                   |
| `ROLLBACK TO SAVEPOINT` | ✅         |                                                                                                                                                                                   |
| `@@autocommit`          | ✅         |                                                                                                                                                                                   |
| `SET TRANSACTION`       | ❌         | Different isolation levels are not yet supported.                                                                                                                                 |
| `START TRANSACTION`     | ✅         |                                                                                                                                                                                   |
| `UNLOCK TABLES`         | 🟠        | `UNLOCK TABLES` parses correctly, but since `LOCK TABLES` doesn't prevent concurrent access it's essentially a no-op.                                                             |

## Prepared statements

| Statement | Supported | Notes and limitations                                                                                       |
| --------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| `PREPARE` | 🟠        | Prepared statements work in the SQL server context using com\_prepare. PREPARE in a query is not supported. |
| `EXECUTE` | 🟠        | Prepared statements work in the SQL server context using com\_prepare. EXCEUTE in a query is not supported. |

## Access management statements

More information on how Dolt handles access management may be found in the [access management page](../server/access-management.md).

| Statement          | Supported | Notes and limitations                                       |
| ------------------ | --------- | ----------------------------------------------------------- |
| `ALTER USER`       | ❌         |                                                             |
| `CREATE ROLE`      | ✅         |                                                             |
| `CREATE USER`      | 🟠        | Only supports basic user creation with an optional password |
| `DROP ROLE`        | ✅         |                                                             |
| `DROP USER`        | ✅         |                                                             |
| `GRANT`            | 🟠        | Only handles static privileges down to the table level      |
| `RENAME USER`      | ❌         |                                                             |
| `REVOKE`           | 🟠        | Only handles static privileges down to the table level      |
| `SET DEFAULT ROLE` | ❌         |                                                             |
| `SET PASSWORD`     | ❌         |                                                             |
| `SET ROLE`         | ❌         |                                                             |

## Session management statements

| Statement           | Supported | Notes and limitations |
| ------------------- | --------- | --------------------- |
| `SET`               | ✅         |                       |
| `SET CHARACTER SET` | ✅         |                       |
| `SET NAMES`         | ✅         |                       |
| `KILL QUERY`        | ✅         |                       |

## Utility statements

| Statement | Supported | Notes and limitations |
| --------- | --------- | --------------------- |
| `EXPLAIN` | ✅         |                       |
| `USE`     | ✅         |                       |

## Compound statements

| Statement               | Supported | Notes and limitations                                                     |
| ----------------------- | --------- | ------------------------------------------------------------------------- |
| `BEGIN END`             | ✅         |                                                                           |
| `STATEMENT LABELS`      | 🟠        | Labels are only supported for `LOOP`.                                     |
| `DECLARE`               | ✅         | Fully supports declaring variables.                                       |
| `DECLARE ... CONDITION` | ✅         |                                                                           |
| `DECLARE ... HANDLER`   | 🟠        | Partially supports handling the `NOT FOUND` condition when using cursors. |
| `DECLARE ... CURSOR`    | ✅         |                                                                           |
| `SET`                   | ✅         |                                                                           |
| `CASE`                  | ✅         |                                                                           |
| `IF`                    | ✅         |                                                                           |
| `ITERATE`               | ✅         |                                                                           |
| `LEAVE`                 | ✅         |                                                                           |
| `LOOP`                  | ✅         |                                                                           |
| `REPEAT`                | ✅         |                                                                           |
| `RETURN`                | ❌         |                                                                           |
| `WHILE`                 | ❌         |                                                                           |
| `CLOSE`                 | ✅         |                                                                           |
| `FETCH`                 | ✅         |                                                                           |
| `OPEN`                  | ✅         |                                                                           |
