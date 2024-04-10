---
title: Replicating from a Postgres instance
---

Doltgres has the capability to replicate from a running Postgres server via Postgres's logical
replication feature. This is useful when you want to continue serving production traffic with your
existing Postgres server, but want to add auditing and diff capability via a live DoltgreSQL backup.

# Configuring the Postgres primary server

Logical replication must be enabled on your primary Postgres server via the `postgresql.conf` file,
followed by a server restart. Your config file may be in a different location from the one below.

```bash
% echo "wal_level = logical" >> /var/lib/postgresql/data/postgresql.conf
```

After enabling logical replication, create a publication for the tables you want replicated to dolt,
as well as a replication slot for the DoltgreSQL replica to connect to. From the `psql` shell, run
the following commands as an admin user:

```bash
% export DBNAME=postgres
% export TABLE=t1
% export SLOTNAME=doltgres_slot
% psql "dbname=$DBNAME replication=database" -c "CREATE PUBLICATION $SLOTNAME FOR TABLE $TABLE;"
% psql "dbname=$DBNAME replication=database" -c "CREATE_REPLICATION_SLOT $SLOTNAME LOGICAL pgoutput;"
```

This setup only needs to be run once. Change the value of the exported environment variables to
change which database and tables are exported to Doltgres. The publication name and the slot name do
not need to be the same, but are set to the same value above to make them easier to identify to
administrators.

You can also replicate all tables to Doltgres with the alternate syntax:

```sql
CREATE PUBLICATION $SLOTNAME FOR ALL TABLES;
```

Or to replicate more than one table, separate them with commas like so:

```sql
CREATE PUBLICATION $SLOTNAME FOR TABLE t1,t2,t3;
```

Postgres also allows replicating only certain rows by specifying a `WHERE` clause in the `CREATE
PUBLICATION` command. See the [Postgres
documentation](https://www.postgresql.org/docs/current/sql-createpublication.html) on this subject
for more detail.

# Configuring the Doltgres replica

`CREATE TABLE` and other DDL statements are not replicated from the primary. Every table being
replicated must exist on the replica before replication begins, so create them with `CREATE TABLE`
statements before starting the server in replication mode. Notes on replicated schemas:

- Column types do not need to exactly match the primary, but they must be compatible (e.g. `int8`
  and `int4`).
- The replicated table can have extra columns as long as they can contain `NULL`.
- It's possible to replicate only a subset of the columns from a table. See the [Postgres
  documentation](https://www.postgresql.org/docs/current/sql-createpublication.html) on this subject
  for more detail.

To run your Doltgres server in replica mode, include the following stanza in the `config.yaml`
provided to the server on the command line:

```yaml
postgres_replication:
  postgres_server_address: 127.0.0.1
  postgres_user: postgres
  postgres_password: password
  postgres_database: postgres
  postgres_port: 5432
  slot_name: doltgres_slot
```

The server will connect to postgres and log information for every replication message it receives.

To automatically create a Dolt commit for every replicated transaction, set the
`dolt_transaction_commit` parameter in the `behavior` stanza to true. This will let you see diffs
between any two replicated transactions on the primary.

```yaml
behavior:
  dolt_transaction_commit: true
```

In every other respect, a replication server is a normal Doltgres server, which means you can make
other connections to it and run other queries (including queries that may interfere with
replication).

# Importing initial data into DoltgreSQL

By default, Doltgres will begin replicating from WAL position `0/0` (the very beginning of table
history). For some primary servers, this location in the WAL may no longer be available because
Postgres periodically compresses old WAL data. In this case, it's necessary to start replication
after seeding the replica with a dump, via a multi-step process:

1. Create a snapshot of the data to be replicated on the primary with a tool like
   [`pg_dump`](https://www.postgresql.org/docs/current/backup-dump.html). Make sure writes to the
   primary are disabled during the dump process.
2. Record the current WAL location on the primary with `SELECT pg_current_wal_lsn();`
3. Re-enable writes to the primary.
4. Import the dump to the replica. `psql < pg_dump` can accomplish this on a running server.
5. Write the WAL location recorded in step 2 to the file `./.doltcfg/pg_wal_location`
6. Restart the Doltgres replica server with replication enabled as above.

Doltgres should now receive updates from the primary beginning at the point just after the snapshot
was taken.
