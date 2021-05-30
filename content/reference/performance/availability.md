---
title: Availability
---

Dolt's availability story is similar to a single Postgres or MySQL instance, and read-only replicas are on our roadmap. Dolt's multi-instance high availability provides weaker consistency in exchange for total process isolation.

### Single Instance

Dolt's single instance availability model is similar to a single instance of MySQL or Postgres. We are constrained by the performance of our query engine. We do not currently support read-only replicas, but that feature is on our roadmap.

### Multi Instance

Dolt multi-instance is completely decentralized, and new application instances each have their own server instance. New application instances obtain a server by cloning a remote and launching a Dolt SQL Server. Dolt's `pull` and `push` semantics provide a way to periodically reconcile changes. The architecture looks something like this:

![Multi-instance Dolt](../../.gitbook/assets/dolt-high-availability-multi-instance.png)

It is on our roadmap to improve the consistency primitives available in such an architecture, as currently users need to make decisions about how to implement consistency.
