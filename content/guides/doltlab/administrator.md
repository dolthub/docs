---
title: "Administrator Guide"
---

In DoltLab's current version, there is no Administrator (Admin) web-based UI or dashboard as it is still in development. In the meantime,
the following information can help DoltLab Admins manually perform some common adminstration tasks, see below for details.

1. [File Issues and View Release Notes](#issues-release-notes)
2. [Backup DoltLab Data](#backup-restore-volumes)
3. [Upgrade DoltLab Versions Without Data Loss](#upgrade-doltlab)
4. [Send Service Logs To DoltLab Team](#send-service-logs)
5. [Connect with a DoltLab Team Member]()

<h1 id="issues-release-notes">File Issues and View Release Notes</h1>

DoltLab's source code is currenly closed-source, but you can file DoltLab issues or view DoltLab's [release notes](https://github.com/dolthub/doltlab-issues/releases) in our [issues repository](https://github.com/dolthub/doltlab-issues).

<h1 id="backup-restore-volumes">Backup and Restore Volumes</h1>

DoltLab currently persists all data to local disk using Docker volumes. To backup or restore DoltLab's data, we recommend the following steps which adhere to Docker's official [volume backup and restore documentation](https://docs.docker.com/storage/volumes/#backup-restore-or-migrate-data-volumes), with the exception of DoltLab's PostgreSQL server, which we recommend slighlty different backup and restore pattern for.

<h2 id="backup-restore-remote-data-user-data"><ins>Backing Up and Restoring Remote Data and User Uploaded Data</ins></h2>

To backup DoltLab's remote data, the database data for all database on a given DoltLab instance, leave DoltLab's services up and run:

```bash
# backup remote data stored in DoltLab RemoteAPI's volume and save to a tar file
docker run --rm --volumes-from doltlab_doltlabremoteapi_1 -v $(pwd):/backup ubuntu tar cvf /backup/remote-data.tar /doltlab-remote-storage
```

This will create a tar file called `remote-data.tar` in your working directory.

To backup user uploaded files, run:

```bash
# backup remote data stored in DoltLab RemoteAPI's volume and save to a tar file
docker run --rm --volumes-from doltlab_doltlabfileserviceapi_1 -v $(pwd):/backup ubuntu tar cvf /backup/user-uploaded-data.tar /doltlab-user-uploads
```

This will create a tar file called `user-uploaded-data.tar` in your working directory.

Before restoring DoltLab's volumes from a backup, first, stop the running DoltLab services, `prune` the Docker containers, and remove the old volume(s):

```bash
cd doltlab

# stop the DoltLab services
docker-compose stop

# prune containers
docker container prune

# remove the remote data volume
docker volume rm doltlab_doltlab-remote-storage

# remove the user uploaded data
docker volume rm doltlab_doltlab-user-uploads
```

Next, [start DoltLab's services](./installation.md#start-doltlab) using the `start-doltlab.sh` script. After the script completes, `cd` into the directory containing the `remote-data.tar` backup file and run:

```bash
# restore remote data from tar
docker run --rm --volumes-from doltlab_doltlabremoteapi_1 -v $(pwd):/backup ubuntu bash -c "cd /doltlab-remote-storage && tar xvf /backup/remote-data.tar --strip 1"
```

To restore user uploaded data, `cd` into the directory containing `user-uploaded-data.tar` and run:

```bash
# restore remote data from tar
docker run --rm --volumes-from doltlab_doltlabfileserviceapi_1 -v $(pwd):/backup ubuntu bash -c "cd /doltlab-user-uploads && tar xvf /backup/user-uploaded-data.tar --strip 1"
```

<h2 id="backup-restore-postgres-data"><ins>Backing Up and Restoring PostgreSQL Data</ins></h2>

For backing up data from DoltLab's postgres server, we recommend executing a data dump with `pg_dump`. To do so, keep DoltLab's services up and run:

```bash
# dump postgres to postgres-dump.sql
docker run --rm --network doltlab_doltlab -e PGPASSWORD=<POSTGRES_PASSWORD> -v $(pwd):/doltlab-db-dumps postgres:13-bullseye bash -c "pg_dump --host=doltlab_doltlabdb_1 --port=5432 --username=dolthubadmin dolthubapi > /doltlab-db-dumps/postgres-dump.sql"
```

The value of `PGPASSWORD` should be the `POSTGRES_PASSWORD` set when DoltLab was first deployed.

To restore a postgres server from `postgres-dump.sql`, first stop the running DoltLab services, remove the stopped containers, and remove the old postgres server volume:
```bash
cd doltlab

# stop DoltLab
docker-compose stop

# remove containers
docker container prune

# remove old postgres data volume
docker volume rm doltlab_doltlabdb-data
```

Next, edit the `postgres-dump.sql` file by adding the line `SET session_replication_role = replica;` near the top of the file:

```sql
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

/* We add this to disable triggers and rules during import */
SET session_replication_role = replica;
...
```

[Start DoltLab's services](./installation.md#start-doltlab) again using the `start-doltlab.sh` script. After the script completes, `cd` into the directory containing the `postgres-dump.sql` file and run:

```bash
# import the postgres dump into the running server
docker run --rm --network doltlab_doltlab -e PGPASSWORD=<POSTGRES_PASSWORD> -v $(pwd):/doltlab-db-dumps postgres:13-bullseye bash -c "psql --host=doltlab_doltlabdb_1 --port=5432 --username=dolthubadmin dolthubapi < /doltlab-db-dumps/postgres-dump.sql"
```

<h1 id="send-service-logs">Send Service Logs to DoltLab Team</h1>

DoltLab is comprised of [multiple services](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/) running in a single Docker network via Docker compose. Logs for a particular service can be viewed using the `docker logs <container name>` command. For example, to view to logs of `doltlabapi` service, run:

```bash
docker logs doltlab_doltlabapi_1
```

If you need to send service logs to the DoltLab team, first locate the logs on the host using the `docker inspect` command, then `cp` the logs to your working directory:

```bash
DOLTLABAPI_LOGS=$(docker inspect --format='{{.LogPath}}' doltlab_doltlabapi_1)
cp "$DOLTLABAPI_LOGS" ./doltlab-api-logs.json
```

Next change permissions on the copied file to enable reads by running:

```bash
chmod 0644 ./doltlab-api-logs.json
```

Finally, download the copied log file from your DoltLab host using `scp`. You can then send this and any other log files to the DoltLab team member you're working with via email.

<h1 id="upgrade-doltlab">Upgrading DoltLab</h1>

Upgrading to newer versions of DoltLab requires downtime. This means that DoltLab Admins will need to kill the old version of DoltLab, and install the newer one.

In addition, some early versions have different database schemas than newer ones. If the docker volumes of an old version of DoltLab contain non-precious or test-only data, then DoltLab Admins can simply remove these Docker volumes and run the `start-doltlab.sh` script from the newer DoltLab version. This script will simply create new Docker volumes with the appropriate schema for that DoltLab version.

If you want to upgrade your DoltLab version without losing any data, please follow the upgrade guidelines below.

<h2 id="upgrade-v010-v020"><ins>Upgrade from DoltLab <code>v0.1.0</code> to <code>v0.2.0</code> Without Data Loss</ins></h2>

To upgrade DoltLab `v0.1.0` to `v0.2.0`, leave DoltLab `v0.1.0`'s services running and connect a PostgreSQL client from inside the `doltlab_doltlab` Docker network to the running `doltlab_doltlabdb_1` server. On the DoltLab host machine, run:

```bash
# dump data from DoltLab v0.1.0's postgres server to doltlab-db-dumps
docker run --rm --network doltlab_doltlab -e PGPASSWORD=<POSTGRES_PASSWORD> -v $(pwd):/doltlab-db-dumps postgres:13-bullseye bash -c "pg_dump --data-only --host=doltlab_doltlabdb_1 --port=5432 --username=dolthubadmin dolthubapi > /doltlab-db-dumps/doltlab-v0.1.0-dump-data-only.sql"
```

The value of `PGPASSWORD` should be the `POSTGRES_PASSWORD` set when DoltLab `v0.1.0` was first deployed. You should now see the SQL dump file called `doltlab-v0.1.0-dump-data-only.sql`.

Next, edit the `doltlab-v0.1.0-dump-data-only.sql` file by adding the line `SET session_replication_role = replica;` near the top of the file:

```sql
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

/* We add this to disable triggers and rules during import */
SET session_replication_role = replica;
...
```

You can now stop the DoltLab `v0.1.0` services and delete the Docker caches and stopped containers on the host by running:

```bash
cd doltlab

# stop DoltLab
docker-compose stop

# remove containers
docker container prune
```

<!-- TODO: have them backup data first? -->

Next, remove the Docker volume used with DoltLab `v0.1.0`'s `doltlab_doltlabdb_1` postgres server by running:

```bash
docker volume rm doltlab_doltlabdb-data
```

[Download DoltLab](./installation.md#download-doltlab) `v0.2.0`, unzip it's contents, and [start DoltLab](./installation.md#start-doltlab) `v0.2.0`'s services by running the `start-doltlab.sh` script.

After the script completes, confirm DoltLab `v0.2.0`'s services are running with `docker ps`:

```bash
docker ps
CONTAINER ID   IMAGE                                                             COMMAND                  CREATED       STATUS       PORTS                                                                                     NAMES
3f47c64db5af   public.ecr.aws/dolthub/doltlab/dolthub-server:v0.2.0              "docker-entrypoint.s…"   2 hours ago   Up 2 hours   3000/tcp                                                                                  doltlab_doltlabui_1
444819d72e64   public.ecr.aws/dolthub/doltlab/dolthubapi-graphql-server:v0.2.0   "docker-entrypoint.s…"   2 hours ago   Up 2 hours   9000/tcp                                                                                  doltlab_doltlabgraphql_1
d2f5583a19fb   public.ecr.aws/dolthub/doltlab/dolthubapi-server:v0.2.0           "/app/go/services/do…"   2 hours ago   Up 2 hours                                                                                             doltlab_doltlabapi_1
defdd789c7c3   public.ecr.aws/dolthub/doltlab/doltremoteapi-server:v0.2.0        "/app/go/services/do…"   2 hours ago   Up 2 hours   0.0.0.0:100->100/tcp, :::100->100/tcp, 0.0.0.0:50051->50051/tcp, :::50051->50051/tcp      doltlab_doltlabremoteapi_1
93d8c28b9762   public.ecr.aws/dolthub/doltlab/fileserviceapi-server:v0.2.0       "/app/go/services/fi…"   2 hours ago   Up 2 hours                                                                                             doltlab_doltlabfileserviceapi_1
e3adba4e26ce   envoyproxy/envoy-alpine:v1.18-latest                              "/docker-entrypoint.…"   2 hours ago   Up 2 hours   0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:4321->4321/tcp, :::4321->4321/tcp, 10000/tcp   doltlab_doltlabenvoy_1
20dbd21a94ff   public.ecr.aws/dolthub/doltlab/postgres-server:v0.2.0             "docker-entrypoint.s…"   2 hours ago   Up 2 hours   5432/tcp                                                                                  doltlab_doltlabdb_1
```

Now, connect a PostgreSQL client from inside the `doltlab_doltlab` Docker network to the running `doltlab_doltlabdb_1` server to perform the data dump import. Then, update the `has_dolt` column in the `users` table.

```bash
# import the data dump into the running DoltLab v0.2.0 postgres server
docker run --rm --network doltlab_doltlab -e PGPASSWORD=<POSTGRES_PASSWORD> -v $(pwd)/doltlab-db-dumps:/doltlab-db-dumps postgres:13-bullseye bash -c "psql --host=doltlab_doltlabdb_1 --port=5432 --username=dolthubadmin dolthubapi < /doltlab-db-dumps/doltlab-v0.1.0-dump-data-only.sql"

# update the users table to prevent DoltLab v0.2.0 error
docker run --rm --network doltlab_doltlab -e PGPASSWORD=<POSTGRES_PASSWORD> -v $(pwd)/doltlab-db-dumps:/doltlab-db-dumps postgres:13-bullseye bash -c "psql --host=doltlab_doltlabdb_1 --port=5432 --username=dolthubadmin dolthubapi -c 'update users set has_dolt = 'false';'"
```

You have now completed the upgrade, and should no be running DoltLab `v0.2.0` with your postgres data from DoltLab `v0.1.0`.
