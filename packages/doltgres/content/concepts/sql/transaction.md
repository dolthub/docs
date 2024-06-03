---
title: Transactions
---

# Transactions

## What is a Transaction?

A transaction is the unit of change isolation is a database.

## How to use Transactions

Transactions are generally used to manage concurrent writes to the same data in a database. If two
writers attempt to write the same data, one writer is allowed to commit their transaction and the
other is rolled back. Changes being made in a transaction can only be seen by the current session.

A transaction is started with a `BEGIN` statement. A transaction is ended with a `COMMIT` or
`ROLLBACK` statement. A commit persists the changes made. A rollback puts the state of the database
back to the way it was when the transaction began.

Postgres and Doltgres both automatically commit every statement that wasn't explicitly placed in a
transaction with a `BEGIN` statement.

## Difference between Postgres Transaction and Doltgres Transaction

Doltgres uses the Read Committed transaction model whereas Postgres supports [all transaction
isolation levels](https://www.postgresql.org/docs/current/transaction-iso.html).

## Interaction with Doltgres Version Control

Traditional SQL transactions exist in isolation from Doltgres version control features.

Doltgres can be thought of having two layers of transactions. The first layer accessed with `BEGIN`
and `COMMIT` SQL statements is the same as Postgres. Doltgres adds an additional second layer with
branches and Doltgres commits. Branches can be thought of as long running transactions that may or
may not be merged.

Note, you can make every transaction `COMMIT` a Doltgres commit by setting the [system
variable](./system-variables.md),
[`@@dolt_transaction_commit`](../../reference/sql/version-control/dolt-sysvars.md#dolt_transaction_commit)

## Example

```
BEGIN;
select * from docs;
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
| 3  | 0  |
| 4  | 4  |
+----+----+
delete from docs where pk=4;
select * from docs;
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
| 3  | 0  |
+----+----+
rollback;
select * from docs;
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
| 3  | 0  |
| 4  | 4  |
+----+----+
```
