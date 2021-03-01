---
title: Audit and Time Travel
---

Not only does Dolt store the complete state of the database at every commit, but it exposes this state in SQL.

## Audit
Audit becomes trivial as no elaborate support tables or backups are required. Users can write simple SQL queries:
```sql
SELECT
  id,
  name,
FROM
  persons
AS OF
  'dev'
```

Users can also access full commit metadata in Dolt system tables.

## Time Travel
This ability allows users to time travel through their data. A model that has repeatedly produced new versions of a table can be analyzed through time using simple queries to associate values with timestamps, all without writing elaborate schemas or special database configurations.
