---
title: Conflicts
---

# Conflicts

## What is a Conflict?

A conflict is a signal to a user that a [merge](./merge.md) has produced a database that requires further action. The merge algorithm could not infer the state of the database based on the merge rules after the merge. Further input is required to tell Dolt what the resulting merged database should contain.

In Dolt, conflicts can occur on schema and data. 

### Data

On data, conflicts are detected on a cell-level. If two operations modify the same row, column pair to be different values, a conflict is detected. 

### Schema

Two branches must add, delete or modify a similarly named table, column, index or constraint to generate a schema conflict, otherwise the changes are mergeable.

If two branches modify the same named table, column foreign key, index or check constraint, consult the following tables for conflict detection.

#### Tables

| Left Branch | Right Branch | Caveat                                       | Mergeable       |
| ----------- | ------------ | -------------------------------------------- | --------------- |
| Add t1      | Add t1       | Same Schema                                  | Yes             |
| Add t1      | Add t1       | Different Schema                             | Schema Conflict |
| Delete t1   | Delete t1    |                                              | Yes             |
| Modify t1   | Delete t1    |                                              | Schema Conflict |
| Modify t1   | Modify t1    | Same Schema                                  | Yes             |
| Modify t1   | Modify t1    | Different Schema                             | Schema Conflict |

#### Columns

| Left Branch | Right Branch | Caveat                                       | Mergeable       |
| ----------- | ------------ | -------------------------------------------- | --------------- |
| Delete c1   | Delete c1    |                                              | Yes             |
| Modify c1   | Delete c1    |                                              | Schema Conflict |
| Add c1      | Add c1       | Same Type, Same Constraints, Same Data       | Yes             |
| Add c1      | Add c1       | Different Type                               | Schema Conflict |
| Add c1      | Add c1       | Same Type, Different Constraints             | Schema Conflict |
| Add c1      | Add c1       | Same Type, Same Constraints, Different Data  | Data Conflict   |
| Modify c1   | Modify c1    | Same Type, Same Constraints, Same Data       | Yes             |
| Modify c1   | Modify c1    | Incompatible Type Change                     | Schema Conflict |
| Modify c1   | Modify c1    | Compatible Type Change                       | Yes             |
| Modify c1   | Modify c1    | Same Type, Different Constraints             | Schema Conflict |
| Modify c1   | Modify c1    | Same Type, Same Constraints, Different Data  | Data Conflict   |

#### Foreign Keys

| Left Branch | Right Branch | Caveat                                       | Mergeable       |
| ----------- | ------------ | -------------------------------------------- | --------------- |
| Add fk1     | Add fk1      | Same definition                              | Yes             |
| Add fk1     | Add fk1      | Different definition                         | Schema Conflict |
| Delete t1   | Delete t1    |                                              | Yes             |
| Modify fk1  | Delete fk1   |                                              | Schema Conflict |
| Modify fk1  | Modify fk1   | Same definition                              | Yes             |
| Modify fk1  | Modify fk1   | Different definition                         | Schema Conflict |

#### Indexes

| Left Branch | Right Branch | Caveat                                       | Mergeable       |
| ----------- | ------------ | -------------------------------------------- | --------------- |
| Add i1      | Add i1       | Same definition                              | Yes             |
| Add i1      | Add i1       | Different definition                         | Schema Conflict |
| Delete i1   | Delete i1    |                                              | Yes             |
| Modify i1   | Delete i1    |                                              | Schema Conflict |
| Modify i1   | Modify i1    | Same definition                              | Yes             |
| Modify i1   | Modify i1    | Different definition                         | Schema Conflict |

#### Check Constraints

| Left Branch | Right Branch | Caveat                                       | Mergeable       |
| ----------- | ------------ | -------------------------------------------- | --------------- |
| Add ck1     | Add ck1      | Same definition                              | Yes             |
| Add ck1     | Add ck1      | Different definition                         | Schema Conflict |
| Delete ck1  | Delete ck1   |                                              | Yes             |
| Modify ck1  | Delete ck1   |                                              | Schema Conflict |
| Modify ck1  | Modify ck1   | Same definition                              | Yes             |
| Modify ck1  | Modify ck1   | Different definition                         | Schema Conflict |

## How to use Conflicts

Conflicts signal to the user that a merge is risky. In the event of a conflict, you can either redo the changes on the tip of the branch you are merging into or resolve the conflicts. 

In the case of conflict resolution Dolt supports two automated resolution strategies, ours or theirs. You can choose to keep the state of schema or data on the branch you are on or the branch you are merging.

If you would like to manually resolve conflicts, you can set the value of the row that has the conflict to whatever you would like and then resolve the conflict by deleting the corresponding conflict row in `dolt_conflicts_<tablename>`. 

## Difference between Git conflicts and Dolt conflicts

Conflicts are a major divergence from Git in Dolt. Conceptually, Dolt and Git conflicts are similar, but in practice the Dolt conflict management workflow and user interface is very different.

In Dolt, conflicts are stored in the `dolt_conflicts` set of tables. Each table in your database has an associated `dolt_conflicts` table. For instance if you have a table named `docs`, there is a system table named `dolt_conflicts_docs`. This replaces the `>>>` and `<<<` syntax that is inserted into your files in Git when conflicts occur. 

Dolt conflicts can occur on schema or data. In Git, conflicts can only occur on lines in files. So Dolt has two types of conflicts whereas Git has one type.

In the case of foreign keys, Dolt can produce invalid merges even after conflicts are resolved. In Dolt, this merge will not be able to be committed until the foreign key violations are resolved. In Git, a repository with no conflict markers is a valid repository and can be committed.

## Example

### Generating a Conflict

```
docs $ dolt sql -q "select * from docs"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
+----+----+
docs $ dolt branch make-conflicts
docs $ dolt sql -q "update docs set c1=10 where pk=1"
Query OK, 1 row affected
Rows matched: 1  Changed: 1  Warnings: 0
docs $ dolt sql -q "select * from docs"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 10 |
| 2  | 2  |
+----+----+
docs $ dolt add docs
docs $ dolt commit -m "Made pk=1, c1=10"
commit jjkqslpnbbvjh7efdhcsqdh68ekl0leb
Author: Tim Sehn <tim@dolthub.com>
Date:   Mon Dec 06 16:40:12 -0800 2021

	Made pk=1, c1=10

docs $ dolt checkout make-conflicts
Switched to branch 'make-conflicts'
docs $ dolt sql -q "select * from docs"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
+----+----+
docs $ dolt sql -q "update docs set c1=0 where pk=1"
Query OK, 1 row affected
Rows matched: 1  Changed: 1  Warnings: 0
docs $ dolt sql -q "select * from docs"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 0  |
| 2  | 2  |
+----+----+
docs $ dolt add docs
docs $ dolt commit -m "Made pk=1, c1=0"
commit 5gmleh5ksmtsdeeaqeagpsitpug4ntoj
Author: Tim Sehn <tim@dolthub.com>
Date:   Mon Dec 06 16:40:54 -0800 2021

	Made pk=1, c1=0

docs $ dolt checkout main
Switched to branch 'main'
docs $ dolt merge make-conflicts
Updating jjkqslpnbbvjh7efdhcsqdh68ekl0leb..5gmleh5ksmtsdeeaqeagpsitpug4ntoj
Auto-merging docs
CONFLICT (content): Merge conflict in docs
Automatic merge failed; fix conflicts and then commit the result.
docs $ dolt conflicts cat docs
+-----+--------+----+----+
|     |        | pk | c1 |
+-----+--------+----+----+
|     | base   | 1  | 1  |
|  *  | ours   | 1  | 10 |
|  *  | theirs | 1  | 0  |
+-----+--------+----+----+
```

### Resolving a Conflict

```
docs $ dolt conflicts cat docs
+-----+--------+----+----+
|     |        | pk | c1 |
+-----+--------+----+----+
|     | base   | 1  | 1  |
|  *  | ours   | 1  | 10 |
|  *  | theirs | 1  | 0  |
+-----+--------+----+----+
docs $ dolt conflicts resolve --ours docs
docs $ dolt conflicts cat docs
docs $ dolt sql -q "select * from docs"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 10 |
| 2  | 2  |
+----+----+
docs $ dolt add docs
docs $ dolt commit -m "Resolved conflict"
commit c8mff2tp5b3tg4j4u07dnmp912btltim
Merge: jjkqslpnbbvjh7efdhcsqdh68ekl0leb 5gmleh5ksmtsdeeaqeagpsitpug4ntoj
Author: Tim Sehn <tim@dolthub.com>
Date:   Mon Dec 06 16:44:22 -0800 2021

	Resolved conflict

```
