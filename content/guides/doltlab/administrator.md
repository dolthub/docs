# Administrator Guide

In DoltLab's current version, there is no Administrator (Admin) web-based UI or dashboard as it is still in development. In the meantime, the following information can help DoltLab Admins manually perform some common administration tasks, see below for details.

1. [File Issues and View Release Notes](administrator.md#issues-release-notes)
2. [Backup DoltLab Data](administrator.md#backup-restore-volumes)
3. [Upgrade DoltLab Versions Without Data Loss](administrator.md#upgrade-doltlab)
4. [Send Service Logs To DoltLab Team](administrator.md#send-service-logs)
5. [Connect with the DoltLab Team](administrator.md#connect-with-doltlab-team)
6. [Authenticate a Dolt Client to use DoltLab Account](administrator.md#auth-dolt-client)
7. [Monitor DoltLab with cAdvisor and Prometheus](administrator.md#prometheus)
8. [Connect to an SMTP Server with Implicit TLS](administrator.md#smtp-implicit-tls)
9. [Troubleshoot SMTP Server Connection Problems](administrator.md#troubleshoot-smtp-connection)
10. [Prevent Unauthorized User Account Creation](administrator.md#prevent-unauthorized-users)
11. [Use an external PostgreSQL server with DoltLab](administrator.md#use-external-postgres)
12. [Expose DoltLab on a closed host with ngrok](administrator.md#expose-doltlab-ngrok)
13. [DoltLab Jobs](administrator.md#doltlab-jobs)
14. [Disable Usage Metrics](administrator.md#disable-metrics)
15. [Migrate Old Format DoltLab Databases](administrator.md#migrate-doltlab-databases)

## File Issues and View Release Notes <a href="#issues-release-notes" id="issues-release-notes"></a>

DoltLab's source code is currently closed, but you can file DoltLab issues or view DoltLab's [release notes](https://github.com/dolthub/doltlab-issues/releases) in our [issues repository](https://github.com/dolthub/doltlab-issues).

## Backup and Restore Volumes <a href="#backup-restore-volumes" id="backup-restore-volumes"></a>

DoltLab currently persists all data to local disk using Docker volumes. To backup or restore DoltLab's data, we recommend the following steps which follow Docker's official [volume backup and restore documentation](https://docs.docker.com/storage/volumes/#back-up-restore-or-migrate-data-volumes), with the exception of DoltLab's postgres server. To backup the postgres server we recommend dumping the database with `pg_dump` and restoring the database from the dump using `psql`.

### Backing Up and Restoring Remote Data and User Uploaded Data <a href="#backup-restore-remote-data-user-data" id="backup-restore-remote-data-user-data"></a>

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

Next, [start DoltLab's services](installation.md#start-doltlab) using the `start-doltlab.sh` script. After the script completes, `cd` into the directory containing the `remote-data.tar` backup file and run:

```bash
# restore remote data from tar
docker run --rm --volumes-from doltlab_doltlabremoteapi_1 -v $(pwd):/backup ubuntu bash -c "cd /doltlab-remote-storage && tar xvf /backup/remote-data.tar --strip 1"
```

To restore user uploaded data, `cd` into the directory containing `user-uploaded-data.tar` and run:

```bash
# restore remote data from tar
docker run --rm --volumes-from doltlab_doltlabfileserviceapi_1 -v $(pwd):/backup ubuntu bash -c "cd /doltlab-user-uploads && tar xvf /backup/user-uploaded-data.tar --strip 1"
```

### Backing Up and Restoring PostgreSQL Data <a href="#backup-restore-postgres-data" id="backup-restore-postgres-data"></a>

For backing up data from DoltLab's postgres server, we recommend executing a data dump with `pg_dump`. To do so, keep DoltLab's services up and run:

> For DoltLab `v0.7.0` and later, use `--network doltlab` below.

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

[Start DoltLab's services](installation.md#start-doltlab) again using the `start-doltlab.sh` script. After the script completes, `cd` into the directory containing the `postgres-dump.sql` file and run:

> For DoltLab `v0.7.0` and later, use `--network doltlab` below.

```bash
# import the postgres dump into the running server
docker run --rm --network doltlab_doltlab -e PGPASSWORD=<POSTGRES_PASSWORD> -v $(pwd):/doltlab-db-dumps postgres:13-bullseye bash -c "psql --host=doltlab_doltlabdb_1 --port=5432 --username=dolthubadmin dolthubapi < /doltlab-db-dumps/postgres-dump.sql"
```

## Send Service Logs to DoltLab Team <a href="#send-service-logs" id="send-service-logs"></a>

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

## Upgrading DoltLab <a href="#upgrade-doltlab" id="upgrade-doltlab"></a>

Upgrading to newer versions of DoltLab requires downtime. This means that DoltLab Admins will need to kill the old version of DoltLab, and install the newer one.

In addition, some early versions have different database schemas than newer ones. If the docker volumes of an old version of DoltLab contain non-precious or test-only data, then DoltLab Admins can simply remove these Docker volumes and run the `start-doltlab.sh` script from the newer DoltLab version. This script will simply create new Docker volumes with the appropriate schema for that DoltLab version.

If you want to upgrade your DoltLab version without losing any data, please follow the upgrade guidelines below.

### Upgrade from DoltLab `v0.6.0` to `v0.7.0+` <a href="#upgrade-v060-v070" id="upgrade-v060-v070"></a>

Starting with DoltLab `v0.7.0`, the `./start-doltlab.sh` script will create a `doltlab` docker network externally, instead of allowing Docker Compose to create the network automatically. If you're upgrading to `v0.7.0` or higher from an earlier DoltLab version, remove any `doltlab` or `*_doltlab` networks on the host before installing `v0.7.0`.

### Upgrade from DoltLab `v0.3.0+` <a href="#upgrade-v030-plus" id="upgrade-v030-plus"></a>

DoltLab versions >= `v0.3.0` support schema migrations without data loss. To upgrade to a DoltLab version after `v0.3.0`, simply stop your old version of DoltLab, then download and unzip the newer DoltLab version to the same location as your previous version. This will ensure that when you [start the new version](installation.md#start-doltlab) of DoltLab using the `start-doltlab.sh` script, the old DoltLab version's Docker volumes get attached to the new version's containers.

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

### Upgrade from DoltLab `v0.2.0` to `v0.3.0` <a href="#upgrade-v020-v030" id="upgrade-v020-v030"></a>

To upgrade without data loss, follow the same instructions for upgrading found in the [Upgrade from DoltLab `v0.1.0` `v0.2.0`](administrator.md#upgrade-v010-v020) section.

### Upgrade from DoltLab `v0.1.0` to `v0.2.0` Without Data Loss <a href="#upgrade-v010-v020" id="upgrade-v010-v020"></a>

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

Next, remove the Docker volume used with DoltLab `v0.1.0`'s `doltlab_doltlabdb_1` postgres server by running:

```bash
docker volume rm doltlab_doltlabdb-data
```

[Download DoltLab](installation.md#download-doltlab) `v0.2.0`, unzip it's contents, and [start DoltLab](installation.md#start-doltlab) `v0.2.0`'s services by running the `start-doltlab.sh` script.

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

## Connect with the DoltLab Team <a href="#connect-with-doltlab-team" id="connect-with-doltlab-team"></a>

If you need to connect to a DoltLab team member, the best way to do so is on [Discord](https://discord.com/invite/RFwfYpu), in the `#doltlab` server.

## Authenticate a Dolt Client to use a DoltLab Account <a href="#auth-dolt-client" id="auth-dolt-client"></a>

As of Dolt `v0.39.0`, the [dolt login](../../cli-reference/cli.md#dolt-login) command can be used to authenticate against DoltLab instances.

To authenticate a client against DoltLab with this command, use the `--auth-endpoint`, `--login-url`, and `--insecure` arguments to point your Dolt client at the DoltLab instance you want to authenticate against.

`--auth-endpoint` should point at the [DoltLab RemoteAPI Server](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-remoteapi-server) running on port `50051`. `--login-url` should point at the DoltLab instance's credentials page. `--insecure` a boolean flag, should be used since DoltLab does not currently support TLS `gRPC` connections.

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

For Dolt clients < `v0.39.0`, or to authenticate without using the `dolt login` command, first run the [dolt creds new](../../cli-reference/cli.md#dolt-creds-new) command, which will output a new public key:

```bash
dolt creds new
Credentials created successfully.
pub key: fef0kj7ia389i5atv8mcb31ksg9h3i6cji7aunm4jea9tccdl2cg
```

Copy the generated public key and run the [dolt creds use](../../cli-reference/cli.md#dolt-creds-use) command:

```bash
dolt creds use fef0kj7ia389i5atv8mcb31ksg9h3i6cji7aunm4jea9tccdl2cg
```

Next, login to your DoltLab account, click your profile image, then click "Settings" and then "Credentials".

Paste the public key into the "Public Key" field, write a description in the "Description" field, then click "Create".

Your Dolt client is now authenticated for this DoltLab account.

## Monitor DoltLab with cAdvisor and Prometheus <a href="#prometheus" id="prometheus"></a>

As of DoltLab `v0.3.0`, [Prometheus](https://prometheus.io/) [gRPC](https://grpc.io/) service metrics for [DoltLab's Remote API Server](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-remoteapi-server), `doltlabremoteapi`, and [DoltLab's Main API server](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-api-server), `doltlabapi`, are published on port `7770`.

The metrics endpoints for these services are available at endpoints corresponding to their container name. For DoltLab's Remote API, thats `:7770/doltlabremoteapi`, and for DoltLab's Main API that's `:7770/doltlabapi`.

You can view the `doltlabremoteapi` service metrics for our DoltLab demo instance here, [http://doltlab.dolthub.com:7770/doltlabremoteapi](http://doltlab.dolthub.com:7770/doltlabremoteapi) and you can view the `doltlabapi` service metrics here [http://doltlab.dolthub.com:7770/doltlabapi](http://doltlab.dolthub.com:7770/doltlabapi).

To make these endpoints available to Prometheus, open port `7770` on your DoltLab host.

We recommend monitoring DoltLab with [cAdvisor](https://github.com/google/cadvisor), which will expose container resource and performance metrics to Prometheus. Before running `cAdvisor`, open port `8080` on your DoltLab host as well. `cAdvisor` will display DoltLab's running containers via a web UI on `:8080/docker` and will publish Prometheus metrics for DoltLab's container at `:8080/metrics` by default.

Run `cAdvisor` as a Docker container in daemon mode with:

```bash
docker run -d -v /:/rootfs:ro -v /var/run:/var/run:rw -v /sys:/sys:ro -v /var/lib/docker/:/var/lib/docker:ro -v /dev/disk/:/dev/disk:ro -p 8080:8080 --name=cadvisor --privileged gcr.io/cadvisor/cadvisor:v0.39.3
```

To run a Prometheus server on your DoltLab host machine, first open port `9090` on the DoltLab host. Then, write the following `prometheus.yml` file on the host:

```yaml
global:
  scrape_interval:     5s
  evaluation_interval: 10s
scrape_configs:
  - job_name: cadivsor
    static_configs:
      - targets: ['host.docker.internal:8080']
  - job_name: prometheus
    static_configs:
      - targets: ['localhost:9090']
  - job_name: doltlabremoteapi
    metrics_path: '/doltlabremoteapi'
    static_configs:
      - targets: ['host.docker.internal:7770']
  - job_name: doltlabapi
    metrics_path: '/doltlabapi'
    static_configs:
      - targets: ['host.docker.internal:7770']
```

Then, start the Prometheus server as a Docker container running in daemon mode:

```bash
docker run -d --add-host host.docker.internal:host-gateway --name=prometheus -p 9090:9090 -v "$(pwd)"/prometheus.yml:/etc/prometheus/prometheus.yml:ro prom/prometheus:latest --config.file=/etc/prometheus/prometheus.yml
```

`--add-host host.docker.internal:host-gateway` is only required if running the Prometheus server on the DoltLab host. If running it elsewhere, this argument may be omitted, and the `host.docker.internal` hostname in `prometheus.yml` can be changed to the hostname of your DoltLab host.

## Connect to an SMTP Server with Implicit TLS <a href="#smtp-implicit-tls" id="smtp-implicit-tls"></a>

Starting with DoltLab `v0.4.2`, connections to existing SMTP servers using implicit TLS (on port `465`, for example) are supported. To connect using implicit TLS, edit the `docker-compose.yaml` included in the DoltLab zip. Under the `doltlabapi` section, in the `command` block, add the following argument:

```yaml
...
doltlabapi:
  ...
  command:
    ...
    -emailImplicitTLS
    ...
```

After adding the argument, restart DoltLab for it to take effect. Additionally, TLS verification can be skipped by adding the additional argument `-emailInsecureTLS`.

## Troubleshoot SMTP Server Connection Problems <a href="#troubleshoot-smtp-connection" id="troubleshoot-smtp-connection"></a>

DoltLab requires a connection to an existing SMTP server in order for users to create accounts, verify email addresses, reset forgotten passwords, and collaborate on databases.

Starting with DoltLab `v0.4.1`, the [default user](installation.md#doltlab-default-user) `admin` is created when DoltLab starts up, which allows admins to sign in to their DoltLab instance even if they are experiencing SMTP server connection issues.

To help troubleshoot and resolve SMTP server connection issues, we've published the following [go tool](https://gist.github.com/coffeegoddd/66f5aeec98640ff8a22a1b6910826667) to help diagnose the SMTP connection issues on the host running DoltLab.

Starting with DoltLab `v0.4.2`, this tool is now included as an executable binary in DoltLab's zip, called `smtp_connection_helper`.

For usage run `./smtp_connection_helper --help` which will output:

```bash

'smtp_connection_helper' is a simple tool used to ensure you can successfully connect to an smtp server.
If the connection is successful, this tool will send a test email to a single recipient from a single sender.
By default 'smtp_connection_helper' will attempt to connect to the SMTP server with STARTTLS. To use implicit TLS, use --implicit-tls

Usage:

./smtp_connection_helper \
--host <smtp hostname> \
--port <smtp port> \
--from <email address> \
--to <email address> \
--message {This is a test email message sent with smtp_connection_helper!} \
--subject {Testing SMTP Server Connection} \
--client-hostname {localhost} \
--auth <plain|login|external|anonymous|oauthbearer|disable> \
[--username smtp username] \
[--password smtp password] \
[--token smtp oauth token] \
[--identity smtp identity] \
[--trace anonymous trace] \
[--implicit-tls] \
[--insecure]


```

To send a test email using `plain` authentication, run:

```bash
./smtp_connection_helper \
--host existing.smtp.server.hostname \
--port 587 \ #STARTTLS port
--auth plain \
--username XXXXXXXX \
--password YYYYYYY \
--from email@address.com \
--to email@address.com
Sending email with auth method: plain
Successfully sent email!
```

To send a test email using `plain` authentication with implicit TLS, run:

```bash
./smtp_connection_helper \
--host existing.smtp.server.hostname \
--port 465 \ #TLS Wrapper Port
--implicit-tls \
--auth plain \
--username XXXXXXXX \
--password YYYYYYY \
--from email@address.com \
--to email@address.com
Sending email with auth method: plain
Successfully sent email!
```

## Prevent Unauthorized User Account Creation <a href="#prevent-unauthorized-users" id="prevent-unauthorized-users"></a>

DoltLab for non-enterprise use currently supports explicit email whitelisting to prevent account creation by unauthorized users.

To enable DoltLab's email whitelisting feature, edit the `docker-compose.yaml` file included in DoltLab's zip.

Under the `doltlabapi` section, in the `command` block, remove the argument `-dolthubWhitelistAllowAll`. Restart your DoltLab instance for this to take effect.

Once DoltLab is restarted, your DoltLab instance will now check a PostgreSQL table called `email_whitelist_elements` before permitting account creation. Only user's with email addresses present in this table will be able to create accounts on your DoltLab instance.

To whitelist an email for account creation in your instance, you will need to insert their email address into the `email_whitelist_elements` table.

As of DoltLab `v0.4.2`, a script to easily connect to your DoltLab instance's running PostgreSQL server is included in the zip, called `shell-db.sh`.

Use this script by supplying the `POSTGRES_PASSWORD` you used to start your DoltLab instance, as `PGPASSWORD` here. Run:

```bash
PGPASSWORD=<your postgres password> ./shell-db.sh
```

You will see a `dolthubapi=#` PostgresSQL prompt connected to your DoltLab instance.

You can now execute the following `INSERT` to allow a specific user with `example@address.com` to create an account on your DolLab instance:

```sql
INSERT INTO email_whitelist_elements (email_address, updated_at, created_at) VALUES ('example@address.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

## Use an external PostgreSQL server with DoltLab <a href="#use-external-postgres" id="use-external-postgres"></a>

You can connect a DoltLab instance to an external PostgreSQL server version `13` or later. To connect, in DoltLab's `docker-compose.yaml`, supply the host and port for the external server to `doltlabapi`'s `-pghost` and `-pgport` arguments.

```yaml
  doltlabapi:
    ...
    command:
      ...
      -pghost <host>
      -pgport <port>
      ...
```

You can also remove the `doltlabdb` section and all references to it and `doltlabdb-data` in the `docker-compose.yaml` file.

Before (re)starting DoltLab with this change, you will also need to execute the following statements in your external PostgreSQL server:

```sql
CREATE ROLE dolthubapi WITH LOGIN PASSWORD '$DOLTHUBAPI_PASSWORD';
CREATE DATABASE dolthubapi;
GRANT ALL PRIVILEGES ON DATABASE dolthubapi TO dolthubapi;
CREATE EXTENSION citext SCHEMA public;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dolthubapi;
```

## Expose a DoltLab instance with ngrok <a href="#expose-doltlab-ngrok" id="expose-doltlab-ngrok"></a>

As of DoltLab `v0.5.5`, DoltLab instances can be exposed with [ngrok](https://ngrok.com/). ["How to expose DoltLab with ngrok"](https://www.dolthub.com/blog/2022-08-08-expose-doltlab-with-ngrok/) contains the instructions for this process, however, we do not recommend doing this for production DoltLab instances. This process requires one of DoltLab's services to be run _without_ authentication, which may expose sensitive data. Do this at your own risk.

## DoltLab Jobs <a href="#doltlab-jobs" id="doltlab-jobs"></a>

Jobs were [recently introduced](https://www.dolthub.com/blog/2022-10-07-dolthub-jobs-and-doltlab-v0.6.0/) on [DoltHub](https://www.dolthub.com) and are available now on DoltLab ^`v0.7.0`. DoltLab Jobs are stand-alone, long-running Docker containers that perform specific tasks for DoltLab users behind the scenes. DoltLab `v0.7.0` includes a single Job type, the Import Job, for large file imports. But, additional Jobs will be added in subsequent versions of DoltLab.

As a result of the new Jobs infrastructure, DoltLab now requires more memory and disk. The amount of each of these depends on how users will use your instance. Here are the current end user limits of DoltLab Jobs as of `v0.7.0`:

| Job Type    | Database Size Limit | File Size Limit                    |
| ----------- | ------------------- | ---------------------------------- |
| File Import | 150 GB              | 1 GB for `.csv`, 200 MB for `.sql` |

If you want to run a DoltLab instance that can support these end user limits, we recommend running DoltLab on a host with at least 64 GB of memory, and 20 TBs of disk. These recommended amounts will decrease as we continue to improve Dolt's resource efficiency and utilization.

### Import Jobs <a href="#doltlab-job-import" id="doltlab-job-import"></a>

Under the hood, when a user uploads a file to DoltLab, a new Job is kicked off that copies that file into a new Docker container running a `dolt` binary. This Job container executes `dolt table import <file>` or `dolt sql < <file>`, depending on the file type of the uploaded file, which imports the data into a clone of the target database. The container finishes by opening a pull request containing the imported data.

What's import to note about the Import Job process is how it can impact disk and memory utilization on a DoltLab host.

For example, let's say a user uploads a 100 MB `.csv` on a 10 GB DoltLab database. First, the uploaded file is downloaded into the Job container, writing, temporarily, the 100 MB file to disk. Second, the target database is cloned into the container, using an additional 10 GB's of disk. Finally, the import process begins with `dolt table import <file>`, which uses additional disk (a variable amount), in the form of [temporary files](https://www.dolthub.com/blog/2021-08-13-generational-gc/) that Dolt writes to disk in order to perform the import.

Importing also uses a variable amount of memory depending on the size of the cloned database and the size of the file being imported. In our example, the import completes in about 30 seconds, but uses about 5 GB of memory at its peak.

For this reason, we recommend running DoltLab on a host with as much disk and memory as you can, especially if your users plan on doing large file imports, or a large number of imports in parallel.

Import performance, memory and disk utilization are all areas of concentration for our team in the coming months. We are committed to bringing all of these down for Dolt, DoltHub, and DoltLab, so stay tuned for updates.

## Disable Usage Metrics <a href="#disable-metrics" id="disable-metrics"></a>

By default, DoltLab collects first-party metrics for deployed instances. We use DoltLab's metrics to determine how many resources to allocate toward its development and improvement.

As of `v0.7.0`, DoltLab does not collect third-party metrics, and additionally, DoltLab's first-party metrics can be disabled. To disable metrics, edit the `start-doltlab.sh` script and remove `run_with_metrics` from the `_main` function.

## Migrate Old Format DoltLab Databases <a href="#migrate-doltlab-databases" id="migrate-doltlab-databases"></a>

Unlike [DoltHub](https://www.dolthub.com), DoltLab does not support automatic database migration for old format Dolt databases. Instead, old format database hosted on DoltLab need to be migrated manually. To migrate a DoltLab database:

1. Create a new database on DoltLab.
2. Clone the database you want to migrate.
3. Run `dolt migrate` in the cloned database.
4. Add the remote of the new DoltLab database to the cloned database with `dolt remote add <remote name> http://<host ip>:50051/<owner>/<new db name>`.
5. Push the migrated clone to the new database with `dolt push <remote name> <branch name>`.
