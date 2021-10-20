---
title: Availability
---

In the context of an OLTP database, availability is the ability
to tolerate and recover from failure. Durability, or storing backups of
data, is a basic prerequisite of availability. The more useful version
of availability involves servers communicating changes with one another,
load balancing read requests, and maintaining a responsive application
even when servers processing transactions fail.

## Backups

Storing snapshots of your database is technically a durability property
(the "D" in ACID). But not losing data is required for database
availablity.

Dolt has remotes, which backup some data. Dolt backups snapshot the
entire private state of a database, which is more appropriate for data
durability in an OLTP context.

Refer to the [cli documentation]() and the [backups blog]() for a more
thorough introduction.

## Read Replication

Replicating data between servers can increase your application's read query
throughput. If a read replica fails, your application is
still available. If a replication source fails, that is a bigger
problem that requires a [failover](#failover) solution.

Dolt supports simple read replication with two caveats:

- a remote is used as a replication middleman

- individual transactions are _not_ replicated, only commits are
    replicated.

In summary, we support replication where a source database pushes
on commit, and replicas pull on read. The stability of middleman is
required to maintain a line of communication between the primary server
and its replicas.

![Read replication](../../.gitbook/assets/dolt-read-replication.png)

## Failover

If the primary database processing writes in a read replication setup
fails, queries will either need to be routed to a standby server, or
queue/fail until the primary restarts. We do not have a purpose-built
solution or documentation specifically for failover recovery yet.

In the meantime, it is possible to use push/pull replication to maintain
a standby server. If the primary servre fails, the standby and proxy
would need to walk through a series of steps to create a new primary:

- Standby server disables read-only mode if it was being used as a read
    replica previously.

- Standby server recovers the most recent transactions, either from the
    remote middleman or a primary backup.

- Standby sets the replication source configuration to push on write.

- Proxy layer directs write queries to the formerly standby, now primary
    server.

## Multi-Master

We do not have specific solutions or documentation for running Dolt as
an OLTP database with multiple masters. It is possible to setup several
servers with a common remote middleman, but they would need to reconcile
merge conflicts in the same way an offline Dolt database does. Providing
a transactional layer to enforce multi-master (to avoid merge conflicts)
or a way to automatically resolve merge conflicts is necessary to run
Dolt as a multi-master database effectively.
