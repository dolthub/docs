---
title: Choosing a Replication Mode 
---

# Choosing a Replication Mode

There are multiples ways to achieve replication and run
read-replicas with dolt sql-server. For some use cases, multiple options may meet
your needs, but they each have important architectural differences. Here are some
things to consider when choosing how to configure replication.

1) Direct-to-standby replication is designed to allow for controlled failover from a
   primary to a standby. Some inflight requests will fail, but all committed writes
   will be present on the standby after `CALL dolt_assume_cluster_role('standby',
   ...)` succeeds on the primary. After that the standby can be promoted to
   primary.  On the other hand, replication through a remote does not currently
   have a way to promote a read replica in a way that makes it look exactly like
   the primary which was replicating to it. Replication through a remote is good
   for scaling out read performance but it is not currently as good for high
   availability.

2) Direct-to-standby replication requires distinct configuration on each server in the
   cluster and it requires tight coupling and deployment of new configuration for
   any changes to cluster topology. Replication through a remote is much more
   decoupled. There is no need to change any configuration in order to add a new
   read replica, for example.

3) Direct-to-standby replication may experience lower replication lag in certain
   deployments, since replicating new writes directly to the running sql-server
   instance on the standby server may be expected to be faster than pushing new
   files to a remote storage solution and having the read replica download the
   files from there. On the other hand, direct-to-standby replication may be less scalable in
   the number of read replicas which it can gracefully handle, since the primary
   itself is responsible for pushing each write to each standby server.

4) The ability to replicate writes with direct-to-standby replication is not coupled with
   the creation of dolt commits on a dolt branch. This may make it more
   appropriate for your use case, depending on how your application creates and
   manages dolt commits.

5) As mentioned above, the default security posture of replication through remote-based replication
   and direct-to-standby replication are currently quite different. While the
   configuration shown on this page for direct-to-standby replication is relatively
   straightforward, to deploy in the real world requires bringing some form of
   external authentication and authorization, possibly in the form of PKI,
   certificates and a sidecar, or externally configured firewall rules.

Lastly, depending on your use case, it may be appropriate to utilize multiple forms
of replication at the same time. You might do so, for example, if you need
scalable and decoupled read replicas along with hot standbys for high
availability.  To do so, deploy a small cluster of servers with direct-to-standby
replication between them.  Configure those servers to replicate their writes to
a single remote. Then, deploy your read replicas as read replicas against that
remote, the same as you would have if you had only one primary. When configured
in this mode, only the primary replicates its writes to the configured remote
&mdash; standby servers in the cluster will be available to become primary and
take over write responsibilities, at which point the new primary will start
replicating new writes to the remote.
