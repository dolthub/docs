---
title: Replication
---

# Replication

## What is Replication?

Replication is the ability for an RDBMS to synchronize a master server with one or more read replicas. In this configuration, the master database serves reads and writes while the replicas serve just reads.

## How to use Replication

Replication is used for disaster recovery and to increase read throughput by distributing read load.

For disaster recovery, if your master server goes offline, your database can still serve read traffic from its replicas. Often a manual or automated process can elect and configure a replica to be the master instance limiting downtime.

To increase read throughput, multiple replicas can be used to scale reads horizontally. If you have N replicas and your master still takes reads, each read replica serves 1/N+1 percent of the read traffic.

## Differences between MySQL Replication and Dolt Replication

Dolt does not support MySQL style replication. [MySQL supports multiple types of replication](https://dev.mysql.com/doc/refman/8.0/en/replication.html), most based on the [MySQL binary log](https://dev.mysql.com/doc/refman/8.0/en/replication-howto.html). Dolt does not have a binary log.

Dolt leverages Git-style [remotes](../git/remotes.md) to facilitate replication. The master and replicas configure the same remote. On the master, you configure "push on write" and on the replicas you configure "pull on read". 

## Interaction with Dolt Version Control

Dolt uses remotes to synchronize between master and read replicas.

## Example

### Set up master to "Push on Write"
```
dolt sql -q "SET PERSIST @@GLOBAL.dolt_replicate_to_remote = 'origin'"
```

### Set up replica to "Pull on Read"
```
dolt sql -q "SET PERSIST @@GLOBAL.dolt_read_replica_remote = 'origin'"
```

### Set up which HEADS to replicate
```
dolt sql -q "SET PERSIST @@GLOBAL.dolt_replicate_heads = 'main,feature1'"
```

### Set up all HEADS to replicate
```
dolt sql -q "SET PERSIST @@GLOBAL.dolt_replicate_all_heads = 1'"
```