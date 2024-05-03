---
title: "Administrator Guide (Pre-Installer)"
---

This guide will cover how to perform common DoltLab administrator configuration and tasks for versions <= `v2.0.8` which do not use the `installer` binary.

1. [Backup DoltLab data](#backup-restore-volumes)
2. [Authenticate a Dolt client to use DoltLab account](#auth-dolt-client)
3. [Monitor DoltLab with cAdvisor and Prometheus](#prometheus)
4. [Connect to an SMTP server with implicit TLS](#smtp-implicit-tls)
5. [Troubleshoot SMTP server connection problems](#troubleshoot-smtp-connection)
6. [Prevent unauthorized user account creation](#prevent-unauthorized-users)
7. [Use an external database server with DoltLab](#use-external-database)
8. [Expose DoltLab on a closed host with ngrok](#expose-doltlab-ngrok)
9. [DoltLab Jobs](#doltlab-jobs)
10. [Disable usage metrics](#disable-metrics)
11. [Migrate old format DoltLab databases](#migrate-doltlab-databases)
12. [Use a domain name with DoltLab](#use-domain)
13. [Run DoltLab on Hosted Dolt](#doltlab-hosted-dolt)
14. [Serve DoltLab over HTTPS with a TLS reverse proxy](#doltlab-https-proxy)
15. [Serve DoltLab over HTTPS natively](#doltlab-https-natively)
16. [Improve DoltLab performance](#doltlab-performance)
17. [Serve DoltLab behind an AWS Network Load Balancer](#doltlab-aws-nlb)

<h1 id="backup-restore-volumes">Backup and restore volumes</h1>

DoltLab persists all data to local disk using Docker volumes. To backup or restore DoltLab's data, we recommend the following steps which follow Docker's official [volume backup and restore documentation](https://docs.docker.com/storage/volumes/#back-up-restore-or-migrate-data-volumes), with the exception of DoltLab's PostgreSQL server.

DoltLab <= `v0.8.4` uses PostgreSQL as its database and DoltLab `v1.0.0`+ uses Dolt. To backup the PostgreSQL server we recommend dumping the database with `pg_dump` and restoring the database from the dump using `psql`. To backup the Dolt server we recommend using Docker's volume backup and restore process, or Dolt's built-in backup and restore features.

<h2 id="backup-restore-remote-data-user-data-dolt-server-data"><ins>Backing up and restoring remote data, user uploaded data, and Dolt server data with Docker</ins></h2>

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

To backup Dolt server data, run:

```bash
# backup Dolt's root volume
docker run --rm --volumes-from doltlab_doltlabdb_1 -v $(pwd):/backup ubuntu tar cvf /backup/doltlabdb-root.tar /.dolt

# backup Dolt's config volume
docker run --rm --volumes-from doltlab_doltlabdb_1 -v $(pwd):/backup ubuntu tar cvf /backup/doltlabdb-configs.tar /etc/dolt

# backup Dolt's data volume
docker run --rm --volumes-from doltlab_doltlabdb_1 -v $(pwd):/backup ubuntu tar cvf /backup/doltlabdb-data.tar /var/lib/dolt

# backup Dolt's local backup volume
docker run --rm --volumes-from doltlab_doltlabdb_1 -v $(pwd):/backup ubuntu tar cvf /backup/doltlabdb-backups.tar /backups
```

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

# remove the Dolt server root volume
docker volume rm doltlab_doltlabdb-dolt-root

# remove the Dolt server config volume
docker volume rm doltlab_doltlabdb-dolt-configs

# remove the Dolt server data volume
docker volume rm doltlab_doltlabdb-dolt-data

# remove the Dolt server local backups volume
docker volume rm doltlab_doltlabdb-dolt-backups
```

Next, [start DoltLab's services](../installation/start-doltlab.md) using the `start-doltlab.sh` script. After the script completes, stop DoltLab once more with `docker-compose stop`. Doing this will recreate the required containers so that their volumes can be updated with the commands below.

Once the services are stopped, `cd` into the directory containing the `remote-data.tar` backup file and run:

```bash
# restore remote data from tar
docker run --rm --volumes-from doltlab_doltlabremoteapi_1 -v $(pwd):/backup ubuntu bash -c "cd /doltlab-remote-storage && tar xvf /backup/remote-data.tar --strip 1"
```

To restore user uploaded data, `cd` into the directory containing `user-uploaded-data.tar` and run:

```bash
# restore remote data from tar
docker run --rm --volumes-from doltlab_doltlabfileserviceapi_1 -v $(pwd):/backup ubuntu bash -c "cd /doltlab-user-uploads && tar xvf /backup/user-uploaded-data.tar --strip 1"
```

To restore Dolt server root data, `cd` into the directory containing `doltlabdb-root.tar` and run:

```bash
# restore Dolt server root data from tar
docker run --rm --volumes-from doltlab_doltlabdb_1 -v $(pwd):/backup ubuntu bash -c "cd /.dolt && tar xvf /backup/doltlabdb-root.tar --strip 1"
```

To restore Dolt server config data, `cd` into the directory containing `doltlabdb-configs.tar` and run:

```bash
# restore Dolt server config data from tar
docker run --rm --volumes-from doltlab_doltlabdb_1 -v $(pwd):/backup ubuntu bash -c "cd /etc/dolt && tar xvf /backup/doltlabdb-configs.tar --strip 2"
```

To restore Dolt server data, `cd` into the directory containing `doltlabdb-data.tar` and run:

```bash
# restore Dolt server data from tar
docker run --rm --volumes-from doltlab_doltlabdb_1 -v $(pwd):/backup ubuntu bash -c "cd /var/lib/dolt && tar xvf /backup/doltlabdb-data.tar --strip 3"
```

To restore Dolt server local backup data, `cd` into the directory containing `doltlabdb-backups.tar` and run:

```bash
# restore Dolt server local backups data from tar
docker run --rm --volumes-from doltlab_doltlabdb_1 -v $(pwd):/backup ubuntu bash -c "cd /backups && tar xvf /backup/doltlabdb-backups.tar --strip 1"
```

You can now restart DoltLab, and should see all data restored from the `tar` files.

<h2 id="backup-restore-postgres-data"><ins>Backing up and restoring PostgreSQL data</ins></h2>

For DoltLab versions <= `v0.8.4`, to backup data from DoltLab's postgres server, we recommend executing a data dump with `pg_dump`. To do so, keep DoltLab's services up and run:

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

[Start DoltLab's services](./installation.md#start-doltlab) again using the `start-doltlab.sh` script. After the script completes, `cd` into the directory containing the `postgres-dump.sql` file and run:

> For DoltLab `v0.7.0` and later, use `--network doltlab` below.

```bash
# import the postgres dump into the running server
docker run --rm --network doltlab_doltlab -e PGPASSWORD=<POSTGRES_PASSWORD> -v $(pwd):/doltlab-db-dumps postgres:13-bullseye bash -c "psql --host=doltlab_doltlabdb_1 --port=5432 --username=dolthubadmin dolthubapi < /doltlab-db-dumps/postgres-dump.sql"
```

<h2 id="backup-restore-dolt-server-backup"><ins>Backing up and restoring the Dolt server with `dolt backup`</ins></h2>

DoltLab `v1.0.0`+ uses Dolt as its database. To back up the Dolt server of DoltLab using Dolt's built-in backup and restore features, keep DoltLab's services up and open a connection to the database. The quickest way to do this is with the `./shell-db.sh` script included with DoltLab:

```bash
DOLT_PASSWORD=<DOLT_PASSWORD> ./shell-db.sh
...
mysql>
```

Next, add a local backup using the `DOLT_BACKUP()` stored procedure. By default, DoltLab uses a Docker volume backed by the host's disk that allows you to create backups of the Dolt server. These backups will be located at `/backups` from within the Dolt server container. To create persistent backups, simply use `/backups` as the path prefix to the backup names:

```bash
mysql> call dolt_backup('add', 'local-backup', 'file:///backups/dolthubapi/2023/06/01');
+---------+
| success |
+---------+
|       1 |
+---------+
1 row in set (0.00 sec)
```

The above snippet will create a new backup stored at `/backups/dolthubapi/2023/06/01` within the Dolt server container, and persisted to the host using the Docker volume `doltlab_doltlabdb-dolt-backups`.

You can sync the backup with the `sync` command:

```bash
mysql> call dolt_backup('sync', 'local-backup');
+---------+
| success |
+---------+
|       1 |
+---------+
1 row in set (0.00 sec)
```

The local backup is now synced, and you can now disconnect the shell.

At the time of this writing, Dolt only supports restoring backups using the CLI. To restore the Dolt server from a local backup, stop DoltLab's services using `docker-compose stop`.
Then, use the `./dolt_db_cli.sh` included with DoltLab to open a container shell with access to the Dolt server volumes.

Delete the existing `./dolthubapi` directory located at `/var/lib/dolt` from within this container:

```bash
./dolt_db_cli.sh
root:/var/lib/dolt# ls
dolthubapi
root:/var/lib/dolt# rm -rf dolthubapi/
```

Doing this removes the existing Dolt server database. Now, use [dolt backup restore](https://docs.dolthub.com/cli-reference/cli#dolt-backup) to restore the database from the backup located at `/backups/dolthubapi/2023/06/01`:

```bash
root:/var/lib/dolt# dolt backup restore file:///backups/dolthubapi/2023/06/01 dolthubapi

root:/var/lib/dolt# ls
dolthubapi
```

The database has now been successfully restored, and you can now restart DoltLab.

<h1 id="auth-dolt-client">Authenticate a Dolt client to use a DoltLab account</h1>

As of Dolt `v0.39.0`, the [dolt login](https://docs.dolthub.com/cli-reference/cli#dolt-login) command can be used to authenticate against DoltLab instances.

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

For Dolt clients < `v0.39.0`, or to authenticate without using the `dolt login` command, first run the [dolt creds new](https://docs.dolthub.com/cli-reference/cli#dolt-creds-new) command, which will output a new public key:

```bash
dolt creds new
Credentials created successfully.
pub key: fef0kj7ia389i5atv8mcb31ksg9h3i6cji7aunm4jea9tccdl2cg
```

Copy the generated public key and run the [dolt creds use](https://docs.dolthub.com/cli-reference/cli#dolt-creds-use) command:

```bash
dolt creds use fef0kj7ia389i5atv8mcb31ksg9h3i6cji7aunm4jea9tccdl2cg
```

Next, login to your DoltLab account, click your profile image, then click "Settings" and then "Credentials".

Paste the public key into the "Public Key" field, write a description in the "Description" field, then click "Create".

Your Dolt client is now authenticated for this DoltLab account.

<h1 id="prometheus">Monitor DoltLab with cAdvisor and Prometheus</h1>

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
  scrape_interval: 5s
  evaluation_interval: 10s
scrape_configs:
  - job_name: cadivsor
    static_configs:
      - targets: ["host.docker.internal:8080"]
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]
  - job_name: doltlabremoteapi
    metrics_path: "/doltlabremoteapi"
    static_configs:
      - targets: ["host.docker.internal:7770"]
  - job_name: doltlabapi
    metrics_path: "/doltlabapi"
    static_configs:
      - targets: ["host.docker.internal:7770"]
```

Then, start the Prometheus server as a Docker container running in daemon mode:

```bash
docker run -d --add-host host.docker.internal:host-gateway --name=prometheus -p 9090:9090 -v "$(pwd)"/prometheus.yml:/etc/prometheus/prometheus.yml:ro prom/prometheus:latest --config.file=/etc/prometheus/prometheus.yml
```

`--add-host host.docker.internal:host-gateway` is only required if running the Prometheus server on the DoltLab host. If running it elsewhere, this argument may be omitted, and the `host.docker.internal` hostname in `prometheus.yml` can be changed to the hostname of your DoltLab host.

<h1 id="smtp-implicit-tls">Connect to an SMTP server with implicit TLS</h1>

For DoltLab >= `v0.4.2` and < `v2.1.0`, connections to existing SMTP servers using implicit TLS (on port `465`, for example) are supported. To connect using implicit TLS, edit the `docker-compose.yaml` included in the DoltLab zip. Under the `doltlabapi` section, in the `command` block, add the following argument:

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

<h1 id="troubleshoot-smtp-connection">Troubleshoot SMTP server connection problems</h1>

DoltLab requires a connection to an existing SMTP server in order for users to create accounts, verify email addresses, reset forgotten passwords, and collaborate on databases.

Starting with DoltLab `v0.4.1`, the default user `admin` is created when DoltLab starts up, which allows admins to sign-in to their DoltLab instance even if they are experiencing SMTP server connection issues.

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

To quickly get up and running with an existing SMTP server, we recommend using [Gmail's](https://www.gmail.com). Once you've created a Gmail account, navigate to [your account page](https://myaccount.google.com/) and click the [Security](https://myaccount.google.com/security) tab. Under the section "How you sign in to Google", click `2-Step Verification`. If you have not yet setup 2-Step Verification, follow the prompts on this page to enable it.

After 2-Step Verification is set up, at the bottom of the page click "App passwords". Select app `Mail` and select a device, then click "Generate" to generate a password. This generated password can be supplied along with your Gmail email address to send emails with `smtp_connection_helper` and DoltLab.

```bash
./smtp_connection_helper \
--host smtp.gmail.com \
--port 587 \
--auth plain \
--username example@gmail.com \
--password <generated App password> \
--from example@gmail.com \
--to email@address.com
Sending email with auth method: plain
Successfully sent email!
```

<h1 id="prevent-unauthorized-users">Prevent unauthorized user account creation</h1>

DoltLab for non-enterprise use currently supports explicit email whitelisting to prevent account creation by unauthorized users.

In DoltLab < `v2.1.0`, to enable DoltLab's email whitelisting feature, edit the `docker-compose.yaml` file included in DoltLab's zip.

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

For DoltLab >= `v1.0.0` the same script can be used to update the `email_whitelist_elements` table, but expects `DOLT_PASSWORD` in place of `PGPASSWORD`. It will also open a `mysql>` prompt.

<h1 id="use-external-database">Use an external database server with DoltLab</h1>

For DoltLab `v0.8.4` and earlier, you can connect a DoltLab instance to an external PostgreSQL server version `13` or later. To connect, in DoltLab's `docker-compose.yaml`, supply the host and port for the external server to `doltlabapi`'s `-pghost` and `-pgport` arguments.

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

For DoltLab `v1.0.0` or later, you can connect a DoltLab instance to an external Dolt server version `v1.0.0` or later. To connect, in DoltLab's `docker-compose.yaml`, supply the host and port for the external server to `doltlabapi`'s `-doltHost` and `-doltPort` arguments.

```yaml
  doltlabapi:
    ...
    command:
      ...
      -doltHost <host>
      -doltPort <port>
      ...
```

Like with the external PostgreSQL changes described above, you can remove the `doltlabdb` section and all references to it and `doltlabdb-dolt-data`, `doltlabdb-dolt-root`, `doltlabdb-dolt-configs`, and `doltlabdb-dolt-backups` in the `docker-compose.yaml` file.

Finally, before (re)starting DoltLab with this change, you will also need to execute the following statements in your external Dolt server:

```sql
CREATE USER 'dolthubadmin' IDENTIFIED BY '<password>';
CREATE USER 'dolthubapi' IDENTIFIED BY '<password>';
GRANT ALL ON *.* TO 'dolthubadmin';
GRANT ALL ON dolthubapi.* TO 'dolthubapi';
```

<h1 id="expose-doltlab-ngrok">Expose a DoltLab instance with ngrok</h1>

As of DoltLab `v0.5.5`, DoltLab instances can be exposed with [ngrok](https://ngrok.com/). ["How to expose DoltLab with ngrok"](https://www.dolthub.com/blog/2022-08-08-expose-doltlab-with-ngrok/) contains the instructions for this process, however, we do not recommend doing this for production DoltLab instances. This process requires one of DoltLab's services to be run _without_ authentication, which may expose sensitive data. Do this at your own risk.

<h1 id="doltlab-jobs">DoltLab Jobs</h1>

Jobs were [introduced](https://www.dolthub.com/blog/2022-10-07-dolthub-jobs-and-doltlab-v0.6.0/) on [DoltHub](https://www.dolthub.com) and are now available on DoltLab ^`v0.7.0`. DoltLab Jobs are stand-alone, long-running Docker containers that perform specific tasks for DoltLab users behind the scenes.

As a result of the Jobs infrastructure, DoltLab now requires more memory and disk. The amount of each of these depends on how users will use your instance.

We recommend running DoltLab on a host with at least 64 GB of memory, and 20 TBs of disk. These recommended amounts will decrease as we continue to improve Dolt's resource efficiency and utilization.

<h1 id="disable-metrics">Disable usage metrics</h1>

By default, DoltLab collects first-party metrics for deployed instances. We use DoltLab's metrics to determine how many resources to allocate toward its development and improvement.

As of `v0.7.0`, DoltLab does not collect third-party metrics, and additionally, DoltLab's first-party metrics can be disabled. To disable metrics, edit the `start-doltlab.sh` script and remove `run_with_metrics` from the `_main` function.

<h1 id="migrate-doltlab-databases">Migrate old format DoltLab databases</h1>

Unlike [DoltHub](https://www.dolthub.com), DoltLab does not support automatic database migration for old format Dolt databases. Instead, old format database hosted on DoltLab need to be migrated manually. To migrate a DoltLab database:

1. Create a new database on DoltLab.
2. Clone the database you want to migrate.
3. Run `dolt migrate` in the cloned database.
4. Add the remote of the new DoltLab database to the cloned database with `dolt remote add <remote name> http://<host ip>:50051/<owner>/<new db name>`.
5. Push the migrated clone to the new database with `dolt push <remote name> <branch name>`.

<h1 id="use-domain">Use a domain name with DoltLab</h1>

It's common practice to provision a domain name to use for a DoltLab instance. To do so, secure a domain name and map it to the _stable_, public IP address of the DoltLab host. Then, supply the domain name as the value to the `HOST_IP` environment variable when starting DoltLab. Let's look at an example using services offered by AWS.

Let's say we've have set up and run an EC2 instance with the latest version of DoltLab and have successfully configured its Security Group to allow ingress traffic on `80`, `100`, `4321`, and `50051`. By default, this host will have a public IP address assigned to it, but this IP is unstable and will change whenever the host is restarted.

First, we should attach a stable IP to this host. To do this in AWS, we can provision an [Elastic IP Address (EIP)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html#using-instance-addressing-eips-allocating).

Next, we should associate the EIP with our DoltLab host by following [these steps](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html#using-instance-addressing-eips-associating). Once this is done, the DoltLab host should be reachable by the EIP.

Finally, we can provision a domain name for the DoltLab host through [AWS Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html). After registering the new domain name, we need to create an `A` record that's attached to the EIP of the DoltLab host. To do so, follow the steps for creating records outlined [here](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-creating.html).

Your DoltLab host should now be accessible via your new domain name. You can now stop your DoltLab server and replace the value of the environment variable `HOST_IP` with the domain name, then restart DoltLab.

In the event you are configuring your domain name with an Elastic Load Balancer, ensure that it specifies Target Groups for each of the ports required to operate DoltLab, `80`, `100`, `4321`, and `50051`.

<h1 id="doltlab-hosted-dolt">Run DoltLab on Hosted Dolt</h1>

Starting with DoltLab `v1.0.0`, DoltLab can be configured to use a [Hosted Dolt](https://hosted.doltdb.com) instance as its application database. This allows DoltLab administrators to use the feature-rich SQL workbench Hosted Dolt provides to interact with their DoltLab database.

To configure a DoltLab to use a Hosted Dolt, follow the steps below as we create a sample DoltLab Hosted Dolt instance called `my-doltlab-db-1`.

<h2 id="doltlab-hosted-dolt-create-deployment">Create a Hosted Dolt deployment</h2>

To begin, you'll need to create a Hosted Dolt deployment that your DoltLab instance will connect to. We've created a [video tutorial](https://www.dolthub.com/blog/2022-05-20-hosted-dolt-howto/) for how to create your first Hosted Dolt deployment, but briefly, you'll need to create an account on [hosted.doltdb.com](https://hosted.doltdb.com) and then click the "Create Deployment" button.

You will then see a form where you can specify details about the host you need for your DoltLab instance:

![Create Deployment Page 1](../.gitbook/assets/create_deployment_1.png)

In the image above you can see that we defined our Hosted Dolt deployment name as `my-doltlab-db-1`, selected an AWS EC2 host with 2 CPU and 8 GB of RAM in region `us-west-2`. We've also requested 200 GB of disk. For DoltLab, these settings should be more than sufficient.

We have also requested a replica instance by checking the "Enable Replication" box, and specifying `1` replica, although replication is not required for DoltLab.

![Create Deployment Page 2](../.gitbook/assets/create_deployment_2.png)

If you want the ability to [clone this Hosted Dolt instance](https://www.dolthub.com/blog/2023-04-17-cloning-a-hosted-database/), check the box "Enable Dolt Credentials". And finally, if you want to use the SQL workbench feature for this hosted instance (which we recommend) you should also check the box "Create database users for the SQL Workbench".

You will see the hourly cost of running the Hosted Dolt instance displayed above the "Create Deployment" button. Click it, and wait for the deployment to reach the "Started" state.

![Hosted Deployment Started](../.gitbook/assets/hosted_deployment_started.png)

Once the deployment has come up, the deployment page will display the connection information for both the primary host and the replica, and each will be ready to use. Before connecting a DoltLab instance to the primary host, though, there are a few remaining steps to take to ensure the host has the proper state before connecting DoltLab.

First, click the "Configuration" tab and uncheck the box "behavior_disable_multistatements". DoltLab will need to execute multiple statements against this database when it starts up. You can also, optionally, change the log_level to "debug". This log level setting will make sure executed queries appear in the database logs, which is helpful for debugging.

![Hosted Deployment Configuration](../.gitbook/assets/hosted_deployment_configuration.png)

Click "Save Changes".

Next, navigate to the "Workbench" tab and check the box "Enable Writes". This will allow you to execute writes against this instance from the SQL workbench. Click "Update".

![Hosted Deployment Started](../.gitbook/assets/enable_writes.png)

Then, with writes enabled, on this same page, click "Create database" to create the database that DoltLab expects, called `dolthubapi`.

Finally, create the required users and grants that DoltLab requires by connecting to this deployment and running the following statements:

```sql
CREATE USER 'dolthubadmin' IDENTIFIED BY '<password>';
CREATE USER 'dolthubapi' IDENTIFIED BY '<password>';
GRANT ALL ON *.* TO 'dolthubadmin';
GRANT ALL ON dolthubapi.* TO 'dolthubapi';
```

You can do this by running these statements from the Hosted workbench SQL console, or by connecting to the database using the mysql client connection command on the "Connectivity" tab, and executing these statements from the SQL shell.

This instance is now ready for a DoltLab connection.

<h2 id="doltlab-hosted-dolt-edit-docker-compose">Edit DoltLab's Docker Compose file</h2>

To connect DoltLab to `my-doltlab-db-1`, ensure that your DoltLab instance is stopped, and remove references to `doltlabdb` in DoltLab's `docker-compose.yaml` file.

You can also remove references to `doltlabdb-dolt-data`, `doltlabdb-dolt-root`, `doltlabdb-dolt-configs`, and `doltlabdb-dolt-backups` from the `volumes` section, as these were only necessary for DoltLab's default Dolt server.

```yaml
  # commenting out all references to doltlabdb
  #
  #
  # doltlabdb:
  #  image: public.ecr.aws/dolthub/doltlab/dolt-sql-server:v1.0.2
  #  command:
  #    -l debug
  #  environment:
  #    DOLT_PASSWORD: "${DOLT_PASSWORD}"
  #    DOLTHUBAPI_PASSWORD: "${DOLTHUBAPI_PASSWORD}"
  #  networks:
  #    - default
  #  volumes:
  #    - doltlabdb-dolt-data:/var/lib/dolt
  #    - doltlabdb-dolt-root:/.dolt
  #    - doltlabdb-dolt-configs:/etc/dolt
  #    - doltlabdb-dolt-backups:/backups
  doltlabenvoy:
     image: envoyproxy/envoy-alpine:v1.18-latest
     command:
       -c /envoy.yaml
...
  doltlabui:
    depends_on:
      # - doltlabdb
      - doltlabenvoy
      - doltlabremoteapi
      - doltlabapi
      - doltlabgraphql
      - doltlabfileserviceapi
...
    networks:
      - default
networks:
  default:
    external:
      name: doltlab
volumes:
  # doltlabdb-dolt-data:
  # doltlabdb-dolt-root:
  # doltlabdb-dolt-configs:
  # doltlabdb-dolt-backups:
  doltlab-remote-storage:
  doltlab-user-uploads:
```

There's one additional edit to the `docker-compose.yaml` file to make before we can start DoltLab. Edit the value of the `-doltHost`argument in the `doltlabapi.command` section to match the host of the primary `my-doltlab-db-1` host. In our example, this would be `dolthub-my-doltlab-db-1.dbs.hosted.doltdb.com`.

```yaml
...
  doltlabapi:
...
    command:
      -doltlab
      -outboundInternalServiceEndpointHost doltlabenvoy
      -iterTokenEncKeysFile /iter_token.keys
      -iterTokenDecKeysFile /iter_token.keys
      -doltUser dolthubapi
      -doltHost dolthub-my-doltlab-db-1.dbs.hosted.doltdb.com # update the host to point to the primary deployment
      -doltPort 3306
      -tlsSkipVerify # hosted dolt requires TLS, but we will skip verification for now
...
```

You will also need to add the argument `-tlsSkipVerify` to the `doltlabapi.command` section. Save these changes to the file, and you can now start DoltLab using the `start-doltlab.sh` script.

Make sure that the `DOLT_PASSWORD` environment variable matches the password you used when creating user `dolthubadmin`, and `DOLTHUBAPI_PASSWORD` matches the password you used when creating user `dolthubapi`.

Once DoltLab is running successfully against `my-doltlab-db-1`, you can create a database on DoltLab, for example called `test-db`, and you will see live changes to the database reflected in the Hosted Dolt workbench:

![Hosted Dolt Workbench](../.gitbook/assets/hosted_dolt_workbench.png)

<h1 id="doltlab-https-proxy">Serve DoltLab over HTTPS with a TLS reverse proxy</h1>

Starting with DoltLab `v1.0.5`, it is possible to serve a DoltLab instance behind a TLS reverse proxy. You may want to do this if you want to serve your DoltLab instance over `HTTPS` instead of `HTTP`. Let's walkthrough an example of how to run a DoltLab instance behind an [nginx](https://www.nginx.com/) TLS proxy, running on the same host. We will use [doltlab.dolthub.com](https://doltlab.dolthub.com) as our example.

Before you begin you will need to create valid TLS certificates on the DoltLab host. You can provision these from a [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority) or do so with a free tool like [certbot](https://certbot.eff.org/). For this example we have created valid certs with `certbot`, `/etc/letsencrypt/live/doltlab.dolthub.com/fullchain.pem` and `/etc/letsencrypt/live/doltlab.dolthub.com/privkey.pem`.

For DoltLab < `v2.1.0`, shut down your DoltLab instance if it is currently running, then open four new ports on your DoltLab host. These ports will be used to forward requests to DoltLab's existing `HTTP` ports.

In our example we will using the following new ports: `443`, `143`, `5443`, and `50043`. `443` will route requests to port `80` where DoltLab's UI is served. `143` will forward requests to port `100` where DoltLab serves database data from. `5443` will forward requests to `4321`, which DoltLab uses to enable user file uploads. And, finally, `50043` will map to `50051`, the port used by clients for cloning, pushing, pulling, and fetching data.

At this time you can also close ports `80`, `100`, `4321`, and `50051` on the DoltLab host, as these no longer need to be reachable on the public internet.

Next, edit DoltLab's `docker-compose.yaml` and amend the arguments under `doltlabremoteapi.command`:

```yaml
  doltlabremoteapi:
...
    command:
      # change value of `-http-host`, adding the HOST_IP before the colon and the new TLS database data serving port (143) after the colon
      -http-host "doltlab.dolthub.com:143"
      -http-scheme "https" # add `-http-scheme` with value `https`
      -backingStoreHostNameOverrideKey ":143" # update this with TLS database data serving port as well
```

There are 2 arguments that need to change, and one new argument to add. As you can see from the above snippet, `-http-host` needs to be updated with the `HOST_IP` value followed by a colon and the new TLS database data serving port. Since we use `HOST_IP=doltlab.dolthub.com`, and we are mapping TLS port `143` to `HTTP` port `100`, our new value is `doltlab.dolthub.com:143`.

We also need to change the port in the value of `-backingStoreHostNameOverrideKey` to reflect this same TLS port, so our value here is `:143`.

Lastly, we need to add the argument `-http-scheme https` to this `command` block.

Next, edit the `doltlabapi.command` section:

```yaml
  doltlabapi:
...
    command:
      # change the url scheme to `https`
      -websiteURL "https://doltlab.dolthub.com"
      # change the scheme to `https` and the port to the new TLS file upload port (5443)
      -userImportUploadsFileServiceBrowserHost "https://doltlab.dolthub.com:5443"
```

Here we change the value of `-websiteURL` to have an `https` scheme. We also change the value of `-userImportUploadsFileServiceBrowserHost` so that the url scheme is `https` and the port after the colon is `5443`, the new TLS port we are using to forward requests to DoltLab's user file upload service running on `HTTP` port `4321`.

Save the changes to this file.

Next, [install nginx v1.13.10 or higher](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/) on the DoltLab host. For this example, the open source version can be installed on Ubuntu with:

```bash
sudo apt update
sudo apt install nginx
```

Ensure `nginx` is running with:

```bash
sudo systemctl status nginx
● nginx.service - nginx - high performance web server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2023-08-18 20:51:50 UTC; 3 days ago
       Docs: https://nginx.org/en/docs/
   Main PID: 2913065 (nginx)
      Tasks: 5 (limit: 18734)
     Memory: 9.8M
     CGroup: /system.slice/nginx.service
             ├─2913065 nginx: master process /usr/sbin/nginx -c /etc/nginx/nginx.conf
             ├─3844184 nginx: worker process
             ├─3844185 nginx: worker process
             ├─3844186 nginx: worker process
             └─3844187 nginx: worker process

Aug 18 20:51:50 ip-10-2-3-125 systemd[1]: Starting nginx - high performance web server...
Aug 18 20:51:50 ip-10-2-3-125 systemd[1]: Started nginx - high performance web server.
```

Then, edit the `nginx` configuration file located at `/etc/nginx/nginx.conf` to be the following:

```
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    # include /etc/nginx/conf.d/*.conf;

    client_max_body_size 1024M;

    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    server {
        listen 443 ssl;

        ssl_certificate     /etc/letsencrypt/live/doltlab.dolthub.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/doltlab.dolthub.com/privkey.pem;
        ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers         HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://127.0.0.1:80;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Port $server_port;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
        }
    }

    server {
        listen 143 ssl;

        ssl_certificate     /etc/letsencrypt/live/doltlab.dolthub.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/doltlab.dolthub.com/privkey.pem;
        ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers         HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://127.0.0.1:100;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Port $server_port;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
        }
    }

    server {
        listen 5443 ssl;

        ssl_certificate     /etc/letsencrypt/live/doltlab.dolthub.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/doltlab.dolthub.com/privkey.pem;
        ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers         HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://127.0.0.1:4321;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Port $server_port;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
        }
    }

    server {
        listen 50043 ssl http2;

        ssl_certificate     /etc/letsencrypt/live/doltlab.dolthub.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/doltlab.dolthub.com/privkey.pem;
        ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers         HIGH:!aNULL:!MD5;

        location / {
            grpc_pass grpc://127.0.0.1:50051;
        }
    }
}

```

The above configuration file includes `server` blocks that route the new TLS ports to the proper `HTTP` ports of DoltLab and use the TLS certificates we created earlier with `certbot`. Importantly, the `server` block for `50043` used by clients for cloning, pushing, pulling, and fetching must be configured with `http2` and as a `grpc_pass`.

Save the changes to the configuration file and reload `nginx` with: `nginx -s reload`. This will make the configuration changes take effect.

Finally, restart DoltLab using the `./start-doltlab.sh` script with two additional environment variables:

```bash
export USE_HTTPS=1 # enable https support in the DoltLab frontend
export DOLTLAB_REMOTE_PORT=50043 # set to new TLS port for cloning/pushing/pulling/fetching (50043)
...
./start-doltlab.sh
```

Once your DoltLab instance comes up, it will be served on `HTTPS` via the `nginx` TLS proxy.

<h1 id="doltlab-https-natively">Serve DoltLab over HTTPS natively</h1>

Starting with DoltLab `v1.0.6`, it is possible to run DoltLab over `HTTPS` with TLS natively. To do so, make sure that port `443` is open on the host running DoltLab (as well as the other required ports `100`, `4321`, and `50051`) and that you have a valid TLS certificate that uses the `HOST_IP` of the DoltLab host. We recommend creating a TLS certificate using [certbot](https://certbot.eff.org/).

For DoltLab < `v2.1.0`, to start DoltLab with TLS, you will run the `./start-doltlab.sh` script with the argument `https`, and will need to supply two additional environment variables:

```bash
...
export TLS_CERT_CHAIN=/path/to/tls/certificate/chain
export TLS_PRIVATE_KEY=/path/to/tls/private/key
./start-doltlab.sh https
```

Once the services are spun up, DoltLab will be available at `https://${HOST_IP}`.

<h1 id="doltlab-performance">Improve DoltLab Performance</h1>

Starting with DoltLab `v1.1.0`, it is possible to limit the number of concurrent Jobs running on a DoltLab host by adding optional arguments to the `doltlabapi` block of the `docker-compose.yaml` or `docker-compose-tls.yaml` files.

When user's upload files on a DoltLab instance, or merge a pull request, DoltLab creates a Job corresponding to this work. These Jobs spawn new Docker containers that performs the required work.

By default, DoltLab imposes no limit to the number of concurrent Jobs that can be spawned. As a result, a DoltLab host might experience resources exhaustion as the Docker engine uses all available host resources for managing it's containers.

For DoltLab < `v2.1.0` and >= `v1.1.0`, to prevent resource exhaustion, the following can be added to limit the number of concurrent Jobs, ensuring DoltLab will not run more jobs than the configured limit, at any one time:

```yaml
# docker-compose.yaml
---
doltlabapi:
---
command:
---
-jobConcurrencyLimit "5"
-jobConcurrencyLoopSeconds "10"
-jobMaxRetries "5"
```

`-jobConcurrencyLimit` limits number of concurrent Jobs a DoltLab instance will run at any given time. A value of `0` indicates no limit.

`-jobConcurrencyLoopSeconds` is the number of seconds Job Scheduler will wait before looking for more Jobs to schedule. Default is `10` seconds.

`jobMaxRetries` is the number of times the Job Scheduler will retry scheduling a Job before permanently giving up, requiring the Job to be recreated.

<h1 id="doltlab-aws-nlb">Serve DoltLab behind an AWS Network Load Balancer</h1>

The following section describes how to setup an [AWS Network Load Balancer (NLB)](https://aws.amazon.com/elasticloadbalancing/network-load-balancer/) for a DoltLab instance. This guide will be using DoltLab `v2.0.8`.

First, setup DoltLab `v2.0.8` on an [AWS EC2 host](https://aws.amazon.com/pm/ec2) in the same [Virtual Private Cloud (VPC)](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) where your NLB will run.

If this instance should _only_ be accessible by the NLB, ensure that the DoltLab host is created in a private subnet and does not have public IP address.

After setting up your DoltLab host, edit the host's inbound security group rules to allow all traffic on ports: `80/443`, `100`, `4321`, `50051`, and `2001`.

Because the host is in a private subnet with no public IP though, only the NLB will be able to connect to the host on these ports.

Next, edit the `envoy.tmpl` file included with DoltLab so that it includes the following listener for port `2001`:

```yaml
  - name: health_check_listener
    address:
      socket_address: { address: 0.0.0.0, port_value: 2001 }
    traffic_direction: inbound
    filter_chains:
      - filters:
        - name: envoy.filters.network.http_connection_manager
          typed_config:
            "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
            codec_type: auto
            stat_prefix: http
            route_config:
              virtual_hosts:
              - name: http
                domains: ["*"]
                routes:
                - match: { path: "/" }
                  direct_response:
                    status: "200"
                    body:
                      inline_string: "live\n"
            http_filters:
            - name: envoy.filters.http.router
            access_log:
            - name: envoy.access_loggers.stream
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.access_loggers.stream.v3.StdoutAccessLog
                log_format:
                  text_format_source:
                      [%START_TIME%]
                      "%REQ(:METHOD)% %REQ(X-ENVOY-ORIGINAL-PATH?:PATH)% %PROTOCOL%"
                      %RESPONSE_CODE% %GRPC_STATUS% %RESPONSE_FLAGS%
                      %BYTES_RECEIVED% %BYTES_SENT%
                      %DURATION% %RESP(X-ENVOY-UPSTREAM-SERVICE-TIME)%
                      "%DOWNSTREAM_REMOTE_ADDRESS_WITHOUT_PORT%"
                      "%REQ(USER-AGENT)%" "%REQ(X-REQUEST-ID)%" "%REQ(:AUTHORITY)%"
                      "%UPSTREAM_HOST%"
                      "%UPSTREAM_TRANSPORT_FAILURE_REASON%"
```

This listener will allow AWS to perform health checks against port `2001` during the NLB creation process.

Similarly, edit the `docker-compose.yaml` file to expose port `2001` in the `doltlabenvoy` block:

```yaml
  doltlabenvoy:
     ...
     ports:
      ...
       - "2001:2001"
```

Next, in AWS, create [target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-target-group.html) for each DoltLab port that the NLB will forward requests to. These ports are:
`80/443`, `100`, `4321`, and `50051`.

![Create Target Group Instances](../.gitbook/assets/doltlab_target_group_type.png)

When creating the target groups, select `Instances` as the target type. Then, select `TCP` as the port protocol, followed by the port to use for the target group. In this example we will map all target group ports to their corresponding DoltLab port, ie `80:80`, `100:100`, `4321:4321` and `50051:50051`. Select the same VPC used by your DoltLab host as well.

![Create Target Group TCP](../.gitbook/assets/doltlab_target_group_vpc.png)

During target group creation, in the `Health Checks` section, click `Advanced health check settings` and select `Override` to specify the port to perform health checks on. Here, enter `2001`, the port we added to DoltLab's envoy configuration file. We will use this same port for _all_ target group health checks.

![Create Target Group Health Checks](../.gitbook/assets/doltlab_target_group_health_checks.png)

After clicking `Next`, you will register targets for your new target group. Here you should see your DoltLab host. Select it and specify the port the target group will forward to.

![Create Target Group Health Register Targets](../.gitbook/assets/doltlab_target_group_register_targets.png)

Click `Include as pending below`, then click `Create target group`.

Once you've created your target groups you can create the NLB.

![Create NLB Select](../.gitbook/assets/doltlab_nlb_select_load_balancer.png)

Be sure to select the Network Load balancer as the other types of load balancers may require different configurations.

Then, create an NLB in the same VPC and subnet as your DoltLab host that uses `Scheme: Internet-facing` and `Ip address type: IPV4`.

![Create NLB Config](../.gitbook/assets/doltlab_nlb_basic_config.png)

Additionally, select the the same availabilty zone that your DoltLab host uses. You can use the `default` security group for your NLB, however the ingress rules for this group will need to be updated before inbound traffic will be able to reach your NLB.

![Create NLB Listeners](../.gitbook/assets/doltlab_nlb_listeners.png)

In the Listeners section, add listeners for each target group you created, specifying the NLB port to use for each one. But again, in this example we will forward on the same port. Click `Create load balancer`.

It make take a few minutes for the NLB to become ready. After it does, check each target group you created and ensure they are all healthy.

Next, edit the inbound rules for the security group attached to the NLB you created so that it allows connections on the listening ports.

![NLB Security group](../.gitbook/assets/doltlab_nlb_security_group.png)

On the NLB page you should now see the DNS name of your NLB which can be used to connect to your DoltLab instance.

Restart your DoltLab instance supplying this DNS name as the `HOST_IP`, and your DoltLab instance will now be running exclusively through the NLB.
