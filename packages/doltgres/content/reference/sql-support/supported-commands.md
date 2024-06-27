---
title: Supported SQL Commands
---

# Basic SQL 

## Data Description (DDL)

| SQL Commands             | Parses | Works | Notes and limitations  |
|:-------------------------|:------:|:-----:|:-----------------------|
| ALTER TABLE              |   ✅   |  ❌   |                        |
| CREATE DATABASE          |   ✅   |  🟠   |                        |
| CREATE TABLE             |   ✅   |  🟠   |                        |
| DROP DATABASE            |   ✅   |  🟠   |                        |
| DROP TABLE               |   ✅   |  🟠   |                        |

## Data Manipulation (DML)

| SQL Commands             | Parses | Works | Notes and limitations  |
|:-------------------------|:------:|:-----:|:-----------------------|
| CALL                      |   ✅   |   ✅  |                       |
| DELETE                    |   🟠   |  🟠   |                       |
| INSERT                    |   🟠   |  🟠   |                       |
| SELECT                    |   🟠   |  🟠   |                       |
| UPDATE                    |   🟠   |  🟠   |                       |
| VALUES                    |   🟠   |  🟠   |                       |

# All SQL 

## Access management statements

| SQL Commands             | Parses | Works | Notes and limitations  |
|:-------------------------|:------:|:-----:|:-----------------------|
| ALTER DEFAULT PRIVILEGES |   ✅    |   ❌   |                        |
| ALTER GROUP              |   ❌    |   ❌   |                        |
| ALTER ROLE               |   ❌    |   ❌   |                        |
| ALTER USER               |   ❌    |   ❌   |                        |
| ALTER USER MAPPING       |   ❌    |   ❌   |                        |
| CREATE GROUP             |   🟠   |   ❌   |                        |
| CREATE ROLE              |   🟠   |   ❌   |                        |
| CREATE USER              |   🟠   |   ❌   |                        |
| CREATE USER MAPPING      |   ❌    |   ❌   |                        |
| DROP GROUP               |   ✅    |   ❌   |                        |
| DROP ROLE                |   ✅    |   ❌   |                        |
| DROP USER                |   ✅    |   ❌   |                        |
| DROP USER MAPPING        |   ❌    |   ❌   |                        |
| GRANT                    |   ✅    |   ❌   |                        |
| REASSIGN OWNED           |   ❌    |   ❌   |                        |
| REVOKE                   |   ✅    |   ❌   |                        |

## Data definition statements

| SQL Commands                     | Parses | Works | Notes and limitations |
|:---------------------------------|:------:|:-----:|:----------------------|
| ALTER AGGREGATE                  |   ✅    |   ❌   |                       |
| ALTER COLLATION                  |   ✅    |   ❌   |                       |
| ALTER CONVERSION                 |   ✅    |   ❌   |                       |
| ALTER DATABASE                   |   ✅    |   ❌   |                       |
| ALTER DOMAIN                     |   ✅    |   ❌   |                       |
| ALTER EVENT TRIGGER              |   ❌    |   ❌   |                       |
| ALTER EXTENSION                  |   ❌    |   ❌   |                       |
| ALTER FOREIGN DATA WRAPPER       |   ❌    |   ❌   |                       |
| ALTER FOREIGN TABLE              |   ❌    |   ❌   |                       |
| ALTER FUNCTION                   |   ✅    |   ❌   |                       |
| ALTER INDEX                      |   ✅    |   ❌   |                       |
| ALTER LANGUAGE                   |   ✅    |   ❌   |                       |
| ALTER LARGE OBJECT               |   ❌    |   ❌   |                       |
| ALTER MATERIALIZED VIEW          |   ✅    |   ❌   |                       |
| ALTER OPERATOR                   |   ❌    |   ❌   |                       |
| ALTER OPERATOR CLASS             |   ❌    |   ❌   |                       |
| ALTER OPERATOR FAMILY            |   ❌    |   ❌   |                       |
| ALTER POLICY                     |   ❌    |   ❌   |                       |
| ALTER PROCEDURE                  |   ✅    |   ❌   |                       |
| ALTER PUBLICATION                |   ❌    |   ❌   |                       |
| ALTER ROUTINE                    |   ❌    |   ❌   |                       |
| ALTER RULE                       |   ❌    |   ❌   |                       |
| ALTER SCHEMA                     |   ✅    |   ❌   |                       |
| ALTER SEQUENCE                   |   ✅    |   ❌   |                       |
| ALTER SERVER                     |   ❌    |   ❌   |                       |
| ALTER STATISTICS                 |   ❌    |   ❌   |                       |
| ALTER SUBSCRIPTION               |   ❌    |   ❌   |                       |
| ALTER SYSTEM                     |   ❌    |   ❌   |                       |
| ALTER TABLE                      |   ✅    |   ❌   |                       |
| ALTER TABLESPACE                 |   ❌    |   ❌   |                       |
| ALTER TEXT SEARCH CONFIGURATION  |   ❌    |   ❌   |                       |
| ALTER TEXT SEARCH DICTIONARY     |   ❌    |   ❌   |                       |
| ALTER TEXT SEARCH PARSER         |   ❌    |   ❌   |                       |
| ALTER TEXT SEARCH TEMPLATE       |   ❌    |   ❌   |                       |
| ALTER TRIGGER                    |   ✅    |   ❌   |                       |
| ALTER TYPE                       |   ✅    |   ❌   |                       |
| ALTER VIEW                       |   ✅    |   ❌   |                       |
| COMMENT                          |   ✅    |   ❌   |                       |
| CREATE ACCESS METHOD             |   ❌    |   ❌   |                       |
| CREATE AGGREGATE                 |   ✅    |   ❌   |                       |
| CREATE CAST                      |   ❌    |   ❌   |                       |
| CREATE COLLATION                 |   ❌    |   ❌   |                       |
| CREATE CONVERSION                |   ❌    |   ❌   |                       |
| CREATE DATABASE                  |   ✅    |  🟠   |                       |
| CREATE DOMAIN                    |   ✅    |   ❌   |                       |
| CREATE EVENT TRIGGER             |   ❌    |   ❌   |                       |
| CREATE EXTENSION                 |   ✅    |   ❌   |                       |
| CREATE FOREIGN DATA WRAPPER      |   ❌    |   ❌   |                       |
| CREATE FOREIGN TABLE             |   ❌    |   ❌   |                       |
| CREATE FUNCTION                  |   ✅    |   ❌   |                       |
| CREATE INDEX                     |   ✅    |   ❌   |                       |
| CREATE LANGUAGE                  |   ✅    |   ❌   |                       |
| CREATE MATERIALIZED VIEW         |   ✅    |   ❌   |                       |
| CREATE OPERATOR                  |   ❌    |   ❌   |                       |
| CREATE OPERATOR CLASS            |   ❌    |   ❌   |                       |
| CREATE OPERATOR FAMILY           |   ❌    |   ❌   |                       |
| CREATE POLICY                    |   ❌    |   ❌   |                       |
| CREATE PROCEDURE                 |   ✅    |   ❌   |                       |
| CREATE PUBLICATION               |   ❌    |   ❌   |                       |
| CREATE RULE                      |   ❌    |   ❌   |                       |
| CREATE SCHEMA                    |   ✅    |   ❌   |                       |
| CREATE SEQUENCE                  |   ✅    |   ❌   |                       |
| CREATE SERVER                    |   ❌    |   ❌   |                       |
| CREATE STATISTICS                |   ❌    |   ❌   |                       |
| CREATE SUBSCRIPTION              |   ❌    |   ❌   |                       |
| CREATE TABLE                     |   ✅    |  🟠   |                       |
| CREATE TABLESPACE                |   ❌    |   ❌   |                       |
| CREATE TEXT SEARCH CONFIGURATION |   ❌    |   ❌   |                       |
| CREATE TEXT SEARCH DICTIONARY    |   ❌    |   ❌   |                       |
| CREATE TEXT SEARCH PARSER        |   ❌    |   ❌   |                       |
| CREATE TEXT SEARCH TEMPLATE      |   ❌    |   ❌   |                       |
| CREATE TRANSFORM                 |   ❌    |   ❌   |                       |
| CREATE TRIGGER                   |   ✅    |   ❌   |                       |
| CREATE TYPE                      |   ✅    |   ❌   |                       |
| CREATE VIEW                      |   ✅    |  🟠   |                       |
| DROP ACCESS METHOD               |   ❌    |   ❌   |                       |
| DROP AGGREGATE                   |   ✅    |   ❌   |                       |
| DROP CAST                        |   ❌    |   ❌   |                       |
| DROP COLLATION                   |   ❌    |   ❌   |                       |
| DROP CONVERSION                  |   ❌    |   ❌   |                       |
| DROP DATABASE                    |   ✅    |  🟠   |                       |
| DROP DOMAIN                      |   ✅    |   ❌   |                       |
| DROP EVENT TRIGGER               |   ❌    |   ❌   |                       |
| DROP EXTENSION                   |   ✅    |   ❌   |                       |
| DROP FOREIGN DATA WRAPPER        |   ❌    |   ❌   |                       |
| DROP FOREIGN TABLE               |   ❌    |   ❌   |                       |
| DROP FUNCTION                    |   ✅    |   ❌   |                       |
| DROP INDEX                       |   ✅    |  🟠   |                       |
| DROP LANGUAGE                    |   ✅    |   ❌   |                       |
| DROP MATERIALIZED VIEW           |   ✅    |  🟠   |                       |
| DROP OPERATOR                    |   ❌    |   ❌   |                       |
| DROP OPERATOR CLASS              |   ❌    |   ❌   |                       |
| DROP OPERATOR FAMILY             |   ❌    |   ❌   |                       |
| DROP OWNED                       |   ❌    |   ❌   |                       |
| DROP POLICY                      |   ❌    |   ❌   |                       |
| DROP PROCEDURE                   |   ✅    |   ❌   |                       |
| DROP PUBLICATION                 |   ❌    |   ❌   |                       |
| DROP ROUTINE                     |   ❌    |   ❌   |                       |
| DROP RULE                        |   ❌    |   ❌   |                       |
| DROP SCHEMA                      |   ✅    |   ❌   |                       |
| DROP SEQUENCE                    |   ✅    |   ❌   |                       |
| DROP SERVER                      |   ❌    |   ❌   |                       |
| DROP STATISTICS                  |   ❌    |   ❌   |                       |
| DROP SUBSCRIPTION                |   ❌    |   ❌   |                       |
| DROP TABLE                       |   ✅    |  🟠   |                       |
| DROP TABLESPACE                  |   ❌    |   ❌   |                       |
| DROP TEXT SEARCH CONFIGURATION   |   ❌    |   ❌   |                       |
| DROP TEXT SEARCH DICTIONARY      |   ❌    |   ❌   |                       |
| DROP TEXT SEARCH PARSER          |   ❌    |   ❌   |                       |
| DROP TEXT SEARCH TEMPLATE        |   ❌    |   ❌   |                       |
| DROP TRANSFORM                   |   ❌    |   ❌   |                       |
| DROP TRIGGER                     |   ✅    |  🟠   |                       |
| DROP TYPE                        |   ✅    |   ❌   |                       |
| DROP VIEW                        |   ✅    |  🟠   |                       |
| SECURITY LABEL                   |   ❌    |   ❌   |                       |

## Data manipulation statements

| SQL Commands              | Parses | Works | Notes and limitations |
|:--------------------------|:------:|:-----:|:----------------------|
| CALL                      |   ✅    |   ✅   |                       |
| CLOSE                     |   ❌    |   ❌   |                       |
| CREATE TABLE AS           |   ✅    |   ❌   |                       |
| CLUSTER                   |   ❌    |   ❌   |                       |
| COPY                      |   ❌    |   ❌   |                       |
| DECLARE                   |   ❌    |   ❌   |                       |
| DELETE                    |   🟠   |  🟠   |                       |
| DO                        |   ❌    |   ❌   |                       |
| FETCH                     |   ❌    |   ❌   |                       |
| IMPORT FOREIGN SCHEMA     |   ❌    |   ❌   |                       |
| INSERT                    |   🟠   |  🟠   |                       |
| LOAD                      |   ❌    |   ❌   |                       |
| MERGE                     |   ❌    |   ❌   |                       |
| MOVE                      |   ❌    |   ❌   |                       |
| REFRESH MATERIALIZED VIEW |   ✅    |   ❌   |                       |
| REINDEX                   |   ❌    |   ❌   |                       |
| SELECT                    |   🟠   |  🟠   |                       |
| SELECT INTO               |   ❌    |   ❌   |                       |
| TRUNCATE                  |   🟠   |  🟠   |                       |
| UPDATE                    |   🟠   |  🟠   |                       |
| VACUUM                    |   ❌    |   ❌   |                       |
| VALUES                    |   🟠   |  🟠   |                       |

## Prepared statements

| SQL Commands | Parses | Works | Notes and limitations |
|:-------------|:------:|:-----:|:----------------------|
| DEALLOCATE   |   ✅    |   ❌   |                       |
| PREPARE      |   ✅    |   ❌   |                       |
| EXECUTE      |   ✅    |   ❌   |                       |

## Session management statements

| SQL Commands              | Parses | Works | Notes and limitations |
|:--------------------------|:------:|:-----:|:----------------------|
| DISCARD                   |   🟠   |   ❌   |                       |
| RESET                     |   ✅    |   ❌   |                       |
| SET                       |   ✅    |  🟠   |                       |
| SET CONSTRAINTS           |   ✅    |   ❌   |                       |
| SET ROLE                  |   ✅    |   ❌   |                       |
| SET SESSION AUTHORIZATION |   ✅    |   ❌   |                       |
| SET TRANSACTION           |   🟠   |   ❌   |                       |
| SHOW                      |   ✅    |  🟠   |                       |

## Transactional statements

| SQL Commands          | Parses | Works | Notes and limitations |
|:----------------------|:------:|:-----:|:----------------------|
| ABORT                 |   ✅    |   ✅   |                       |
| BEGIN                 |   🟠   |  🟠   |                       |
| CHECKPOINT            |   ❌    |   ❌   |                       |
| COMMIT                |   ✅    |   ✅   |                       |
| COMMIT PREPARED       |   ❌    |   ❌   |                       |
| END                   |   ✅    |   ✅   |                       |
| LISTEN                |   ❌    |   ❌   |                       |
| LOCK                  |   ❌    |   ❌   |                       |
| NOTIFY                |   ❌    |   ❌   |                       |
| PREPARE TRANSACTION   |   ❌    |   ❌   |                       |
| RELEASE SAVEPOINT     |   ✅    |   ✅   |                       |
| ROLLBACK              |   ✅    |   ✅   |                       |
| ROLLBACK PREPARED     |   ❌    |   ❌   |                       |
| ROLLBACK TO SAVEPOINT |   ✅    |   ✅   |                       |
| SAVEPOINT             |   ✅    |   ✅   |                       |
| START TRANSACTION     |   🟠   |  🟠   |                       |
| UNLISTEN              |   ❌    |   ❌   |                       |

## Utility statements

| SQL Commands | Parses | Works | Notes and limitations |
|:-------------|:------:|:-----:|:----------------------|
| ANALYZE      |   ❌    |   ❌   |                       |
| EXPLAIN      |   ❌    |   ❌   |                       |
