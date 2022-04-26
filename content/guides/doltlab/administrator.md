---
title: "Administrator Guide"
---

In DoltLab's current version, there is no Administrator (Admin) web-based UI or dashboard as it is still in development. In the meantime,
the following information can help DoltLab Admins manually perform some common adminstration tasks, see below for details.

1. [File Issues and View Release Notes](#issues-release-notes)
2. [Backup DoltLab Data](#backup-restore-volumes)
3. [Upgrade DoltLab Versions Without Data Loss](#upgrade-doltlab)
4. [Send Service Logs To DoltLab Team](#send-service-logs)
5. [Connect with the DoltLab Team](#connect-with-doltlab-team)
6. [Authenticate a Dolt Client to use DoltLab Account](#auth-dolt-client)
7. [View Service Metrics](#view-service-metrics)
8. [Troubleshoot SMTP Server Connection Problems](#troubleshoot-smtp-connection)

<h1 id="issues-release-notes">File Issues and View Release Notes</h1>

DoltLab's source code is currenly closed, but you can file DoltLab issues or view DoltLab's [release notes](https://github.com/dolthub/doltlab-issues/releases) in our [issues repository](https://github.com/dolthub/doltlab-issues).

<h1 id="backup-restore-volumes">Backup and Restore Volumes</h1>

DoltLab currently persists all data to local disk using Docker volumes. To backup or restore DoltLab's data, we recommend the following steps which follow Docker's official [volume backup and restore documentation](https://docs.docker.com/storage/volumes/#backup-restore-or-migrate-data-volumes), with the exception of DoltLab's postgres server. To backup the postgres server we recommend dumping the database with `pg_dump` and restoring the database from the dump using `psql`.

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

<h2 id="upgrade-v030-plus"><ins>Upgrade from DoltLab <code>v0.3.0+</code></ins></h2>

DoltLab versions >= `v0.3.0` support schema migrations without data loss. To upgrade to a DoltLab version after `v0.3.0`, simply stop your old version of DoltLab, then download and unzip the newer DoltLab version to the same location as your previous version. This will ensure that when you [start the new version](./installation.md#start-doltlab) of DoltLab using the `start-doltlab.sh` script, the old DoltLab version's Docker volumes get attached to the new version's containers.

```bash
# stop old DoltLab
cd doltlab
docker-compose stop
cd ../
rm -rf doltlab

# download and unzip newer DoltLab
curl -OL https://doltlab-releases.s3.amazonaws.com/linux/amd64/doltlab-latest.zip
unzip doltlab-latest.zip -d doltlab

# start DoltLab
cd doltlab
./start-doltlab.sh
```

<h2 id="upgrade-v020-v030"><ins>Upgrade from DoltLab <code>v0.2.0</code> to <code>v0.3.0</code></ins></h2>

To upgrade without data loss, follow the same instructions for upgrading found in the [Upgrade from DoltLab <code>v0.1.0</code> <code>v0.2.0</code>](#upgrade-v010-v020) section.

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

<h1 id="connect-with-doltlab-team">Connect with the DoltLab Team</h1>

If you need to connect to a DoltLab team member, the best way to do so is on [Discord](https://discord.com/invite/RFwfYpu), in the `#doltlab` server.

<h1 id="auth-dolt-client">Authenticate a Dolt Client to use a DoltLab Account</h1>

As of Dolt `v0.39.0`, the [dolt login](../../reference/cli.md#dolt-login) command can be used to authenticate against DoltLab instances.

To authenticate a client against DoltLab with this command, use the `--auth-endpoint`, `--login-url`, and `--insecure` arguments to point your Dolt client at the DoltLab instance you want to authenticate against.

`--auth-endpoint` should point at the [DoltLab RemoteAPI Server](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-remoteapi-server) running on port `50051`.
`--login-url` should point at the DoltLab instance's credentials page.
`--insecure` a boolean flag, should be used since DoltLab does not currently support TLS `gRPC` connections.

```bash
dolt login --insecure --auth-endpoint doltlab.dolthub.com:50051 --login-url http://doltlab.dolthub.com/settings/credentials
```

Running the command will open your browser window to the `--login-url` with credentials populated in the "Public Key" field. Simply add a "Description" and click "Create", then return to your terminal to see your Dolt client successfully authenticated.

```bash
Credentials created successfully.
pub key: 9pg8rrkaqouuno4rihdlkb6pvaf16t134dscb68dlg0u0261rmtg
/.dolt/creds/cepi47m5sojotm8s2e8rkqm9fdjocidsc42canggvb8e0.jwk
Opening a browser to:
	http://doltlab.dolthub.com/settings/credentials#9pg8rrkaqouuno4rihdlkb6pvaf16t134dscb68dlg0u0261rmtg
Please associate your key with your account.
Checking remote server looking for key association.
requesting update
requesting update



Key successfully associated with user: <user> email <email>
```

For Dolt clients < `v0.39.0`, or to authenticate without using the `dolt login` command, first run the [dolt creds new](../../reference/cli.md#dolt-creds-new) command, which will output a new public key:

```bash
dolt creds new
Credentials created successfully.
pub key: fef0kj7ia389i5atv8mcb31ksg9h3i6cji7aunm4jea9tccdl2cg
```

Copy the generated public key and run the [dolt creds use](../../reference/cli.md#dolt-creds-use) command:

```bash
dolt creds use fef0kj7ia389i5atv8mcb31ksg9h3i6cji7aunm4jea9tccdl2cg
```

Next, login to your DoltLab account, click your profile image, then click "Settings" and then "Credentials".

Paste the public key into the "Public Key" field, write a description in the "Description" field, then click "Create".

Your Dolt client is now authenticated for this DoltLab account.

<h1 id="view-service-metrics">View Service Metrics</h1>

As of DoltLab `v0.3.0`, [Prometheus](https://prometheus.io/) [gRPC](https://grpc.io/) service metrics for [DoltLab's Remote API Server](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-remoteapi-server), `doltlabremoteapi`, and [DoltLab's API server](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-api-server), `doltlabapi`, are available for viewing.

These metrics are are published by [DoltLab's Envoy proxy](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-envoy-proxy-server), `doltlabenvoy`, on port `7770` at endpoints corresponding to their container name. 

For example, you can view the `doltlabremoteapi` service metrics for our DoltLab demo instance here, [http://doltlab.dolthub.com:7770/doltlabremoteapi](http://doltlab.dolthub.com:7770/doltlabremoteapi). Or, you can view the `doltlabapi` service metrics here, [http://doltlab.dolthub.com:7770/doltlabapi](http://doltlab.dolthub.com:7770/doltlabapi).

Ensure that ingress connections to port `7770` are open on your DoltLab instance's host to enable metrics viewing.

<h1 id="troubleshoot-smtp-connection">Troubleshoot SMTP Server Connection Problems</h1>

DoltLab requires a connection to an existing SMTP server in order for users to create accounts, verify email addresses, reset forgotten passwords, and collaborate on databases.

Starting with DoltLab `v0.4.1`, the [default user](./installation.md#doltlab-default-user) `admin` is created when DoltLab starts up, which allows admins to sign in to their DoltLab instance
even if they are experiencing SMTP server connection issues.

To help troubleshoot and resolve SMTP server connection issues, we've published the following [go tool](https://gist.github.com/coffeegoddd/66f5aeec98640ff8a22a1b6910826667) to help diagnose the SMTP connection issues on the host running DoltLab.

To get started using this tool, please make sure that `go` is in your `PATH` and is >= `1.18`:

```bash
go version
go version go1.18 linux/amd64
```

Then, make a new directory, `smtp_connection_helper`, and `cd` into it. Copy the contents [main.go](https://gist.github.com/coffeegoddd/66f5aeec98640ff8a22a1b6910826667) into a file called `main.go`, then run:

```bash
go mod init smtp_connection_helper
go mod tidy
```

The tool can now be run with `go run .` followed by the appropriate arguments to connect to your SMTP server. Here is the tool's `--help` text:

```bash
go run . --help


'smtp_connection_helper' is a simple tool used to ensure you can successfully connect to an smtp server.
If the connection is successful, this tool will send a test email to a single recipient from a single sender.

Usage:

go run . \
--host <smtp hostname> \
--port <smtp port> \
--from <email address> \
--to <email address> \
--message {This is a test email message sent with smtp_connection_helper!} \
--subject {Testing SMTP Server Connection} \
--auth <plain|external|anonymous|oauthbearer|disable> \
[--username smtp username] \
[--password smtp password] \
[--token smtp oauth token] \
[--identity smtp identity] \
[--trace anonymous trace]



```

To send and email using `plain` authentication, run:

```bash
go run . \
--host existing.smtp.server.hostname \
--port 587 \ # STARTTLS port
--auth plain \
--username XXXXXXXX \
--password YYYYYYY \
--from email@address.com \
--to email@address.com
Sending email with auth method: plain
Successfully sent email!
```
