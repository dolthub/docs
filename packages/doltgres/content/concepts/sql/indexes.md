---
title: Secondary Indexes
---

# Secondary Indexes

## What is a Secondary Index?

A secondary index can be added to any column or set of columns to convert lookup queries involving
those columns into indexed lookups. Indexed lookups can be accomplished in constant time (ie. O(1)).

Secondary indexes are stored as separate data structures on disk or in memory. Thus, the use of
secondary indexes uses more storage and increases insert and update time.

Secondary indexes are called "secondary" to distinguish them from [primary keys](./primary-key.md)
which also provide indexed lookups.

## How to use Secondary Indexes

Add secondary indexes to columns that are often accessed with a where clause that you would like to
return fast. For these columns you will need to tolerate slightly reduced insert and update
performance. Additionally, you should have the disk space available to store the indexes.

You create indexes using the `CREATE INDEX` SQL statement.

## Difference between Postgres Secondary Indexes and Doltgres Secondary Indexes

Functionally, Doltgres and Postgres indexes are equivalent.

## Interaction with Doltgres Version Control

Doltgres indexes are versioned along with the core table they reference. Practically, this means
querying a historical version is as fast as querying the current version because the index is intact
for the historical version.

Doltgres will merge indexes as part of a Doltgres merge. This can be used to offload index creation
to a branch or offline clone.

## Example

```
create index index1 on complex(c1);
```
