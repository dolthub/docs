---
title: Triggers
---

# Triggers

## What is a Trigger?

Triggers are SQL statements you can set to run every time a row is inserted, updated, or deleted
from a particular table. Triggers receive the value of the row being inserted, updated, or deleted
like a parameter, and can change it in some cases.

Database users create triggers. Triggers are schema. Triggers are stored along with other schema elements in the database.

## How to use Triggers

Triggers are a general tool, but they are most commonly used to enforce complex constraints that
can't be expressed by foreign keys, nullness, types, or the `check` syntax.

Triggers in Doltgres are not yet supported. Check back for updates.

## Interaction with Doltgres Version Control

Triggers are versioned in the `dolt_schemas` table just like [views](./views.md). You add and commit
that table just like any other changed table after you create or modify a trigger.
