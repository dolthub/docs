---
title: Replication
---

# Replication

## What is Replication?

Replication is the ability for an RDBMS to synchronize a primary server with one or more read
replicas. In this configuration, the primary database serves reads and writes while the replicas
only serve reads.

## How to use Replication

Replication is used for disaster recovery and to increase read throughput by distributing read load.

For disaster recovery, if your primary server goes offline, your database can still serve read
traffic from its replicas. Often a manual or automated process can elect and configure a replica to
be the primary instance limiting downtime.

To increase read throughput, multiple replicas can be used to scale reads horizontally. If you have
N replicas and your primary still takes reads, each read replica serves 1/N+1 percent of the read
traffic. Note, in this set up your application must be aware of the replicas. The database does not
route requests automatically.

## Differences between Postgres Replication and Doltgres Replication

[Postgres supports multiple types of
replication](https://www.postgresql.org/docs/current/runtime-config-replication.html). Doltgres
supports a [logical replication mode](../../guides/replication-from-postgres.md), where you configure a
Doltgres sql-server as a replica for an existing Postgres database. Doltgres can **NOT** act as a
primary for replication to a Postgres database.

Doltgres supports two replication modes where Doltgres can act as a primary and replicate to other
Doltgres sql-servers. The first is called [Remote-Based
Replication](../../reference/sql/server/replication.md#replication-through-a-remote). In this mode
the primary and the read replicas are completely decoupled. The primary and the read replicas
leverage a shared, Git-style [remote](../git/remotes.md) to facilitate replication. On the primary,
you configure "push on write" and on the replicas you configure "pull on read". This mode only
replicates branch heads, which means that new dolt commits are required in order to replicate
writes.

The second mode is called [Direct-to-Standby
Replication](../../reference/sql/server/replication.md#direct-to-standby-replication). In this mode,
you configure a cluster of dolt sql-server instances to replicate **all** writes to each other. Each
server is configured to replicate writes to all other servers in the cluster. One server is
configured as the primary replica and it accepts writes. All other servers are configured as
standbys and only accept read requests.

## Interaction with Doltgres Version Control

Doltgres uses remotes to synchronize between primary and read replicas. Replication leverages
Doltgres's ability to produce differences between two versions of a database quickly.
