---
title: Conflicts
---

# Conflicts

## What is a Conflict?

A conflict is a signal to a user that a [merge](./merge.md) has produced a database that requires further action. The merge algorithm could not infer the state of the database based on the merge rules after the merge. Further input is required to tell Dolt what the resulting merged database should contain.

In Dolt, conflicts can occur on schema and data. On data, conflicts are detected on a cell-level. If two operations modify the same row, column pair, a conflict is detected. For schema conflict detection is more complicated.

The following rules are used to detect conflicts in schema:

1. If two branches add the same table, no conflict.
1. If two branches add a similarly named table that has different schema, conflict.
1. If the two merged branches add two differently named columns to the same table, no conflict.
1. If the two merged branches add similarly named columns to the same table with the same data, no conflict.
1. If the two merged branches add similarly named columns in the same table with different data, conflict.
1. If one branch deletes a column and the other branch does not modify that column in the same table, no conflict.
1. If one branch deletes a column and the other branch modifies that column in the same table, conflict.
1. If the two branches alter a column similarly in the same table, no conflict.
1. If two branches alter a column differently in the same table, conflict.

## How to use Conflicts

Conflicts signal to the user that a merge is risky. In the event of a conflict, you can either redo the changes on the tip of the branch you are merging into or resolve the conflicts. 

In the case of conflict resolution Dolt supports two automated resolution strategies, ours or theirs. You can choose to keep the state of schema or data on the branch you are on or the branch you are merging.

If you would like to manually resolve conflicts, you can set the value of the row that has the conflict to whatever you would like and then resolve the conflict by deleting the corresponding conflict row in `dolt_conflicts_<tablename>`. 

## Difference between Git conflicts and Dolt conflicts

Conflicts are a major divergence from Git in Dolt. Conceptually, Dolt and Git conflicts are similar, but in practice Dolt the Dolt conflict management workflow and user interface is very different.

In Dolt, conflicts are stored in the `dolt_conflicts` set of tables. Each table in your database has an associated `dolt_conflicts` table. For instance if you have a table named `docs`, there is a system table named `dolt_conflicts_docs`. This replaces the `>>>` and `<<<` syntax that is inserted into your files in Git when conflicts occur. 

Dolt conflicts can occur on schema or data. In Git, conflicts can only occur on lines in files. So Dolt has two types of conflicts whereas Git has one type.

In the case of foreign keys, Dolt can produce invalid merges even after conflicts are resolved. In Dolt, this merge will not be able to be committed until the foreign key violations are resolved. In Git, a repository with no conflict markers is a valid repository and can be committed.

## Example

```

```