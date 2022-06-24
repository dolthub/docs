---
title: Transactions
---

# Transactions

## What is a Transaction?

A transaction is the unit of change isolation is a database. 

## How to use Transactions

Transactions are generally used to manage concurrent writes to the same data in a database. If two writers attempt to write the same data, one writer is allowed to commit their transaction and the other is rolled back. Changes being made in a transaction can only be seen by the current session. 

A transaction is started with a `BEGIN` statement. A transaction is ended with a `COMMIT` or `ROLLBACK` statement. A commit persists the changes made. A rollback puts the state of the database back to the way it was when the transaction began.

Note, most clients operate by default with `AUTOCOMMIT` on. `AUTOCOMMIT` abstracts transactions from the user by wrapping each SQL write query in a `BEGIN` and `COMMIT`, effetively making each write query a transaction.

## Difference between MySQL Transaction and Dolt Transaction

Dolt can be thought of having two layers of transactions. The first layer accessed with `BEGIN` and `COMMIT` SQL statements is the same as MySQL. Dolt adds an additional second layer with branches and Dolt commits. Branches can be thought of as long running transactions that may or may not be merged. 

## Interaction with Dolt Version Control

Traditional SQL transactions exist in isolation from Dolt version control features. 

## Example

```
SET AUTOCOMMIT = 0;
mysql> select * from docs;
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
| 3  | 0  |
| 4  | 4  |
+----+----+
mysql> BEGIN
    -> ;
mysql> delete from docs where pk=4;
mysql> select * from docs;
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
| 3  | 0  |
+----+----+
mysql> rollback;
mysql> select * from docs;
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