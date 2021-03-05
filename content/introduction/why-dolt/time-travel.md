---
title: Time Travel
---

# Time Travel

Dolt's commit graph storage layer models each state committed state of the database as a commit, along with associated metadata. The entire commit history can be queried in SQL:

![Dolt Storage and Query Layers](../../.gitbook/assets/dolt-time-travel-commit-graph.png)

## Time Travel

The ability to the query any state of the database means that values implicitly become time series. If the results of a model run are output to a table, we can easily track the values those outputs take on through time:

```sql
SELECT
  `value`
FROM
  `dolt_history_my_model_values`
WHERE
  `id` = 1
ORDER BY
  `commit_date` DESC
```

This underlying commit graph also means any query can be parameterized with historical state:

```sql
SELECT
  `id`,
  `value`,
FROM
  `my_model_values`
AS OF
  'dev'
```

## Audit

All states are associated with a commit object, which stores metadata:

```sql
SELECT
  `committer`,
  `commit_date`,
FROM
  `dolt_history_my_model_values`
WHERE
  `commit_hash` = '2v3vrf8ta478a5e1h4aihaj73q7kh96a'
```

This allows users to resolve any value to a state, which can optionally be checked out.

