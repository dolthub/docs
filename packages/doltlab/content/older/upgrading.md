---
title: Upgrading DoltLab
---

This page describes how to upgrade your DoltLab instance. We always recommend upgrading to the latest version of DoltLab, as older releases do not get patch updates.

Also note that upgrading to a newer version of DoltLab will require downtime, as the old version of DoltLab will need to be stopped in order to install the newer one.

Additionally, some early versions have different database schemas than newer ones. If the Docker volumes of an old version of DoltLab contain non-precious or test-only data, then DoltLab administrators can simply remove these Docker volumes and run the their DoltLab start script from the newer DoltLab version. This script will simply create new Docker volumes with the appropriate schema for that DoltLab version.

# Upgrade from DoltLab <code>v2.1.6</code> to <code>v2.2.0+</code>

There are important differences to be aware of when upgrading from DoltLab `v2.1.6` to DoltLab >= `v2.2.0`. In DoltLab >= `v2.2.0`, organizations and teams are exclusive to DoltLab Enterprise.

This means that if you're old DoltLab instance uses organizations or teams, after upgrading to DoltLab >= `v2.2.0`, you will see 404 errors when attempting to view the profile pages for existing organizations or teams. Any databases owned by those organizations will still be available, and function normally.

Additionally, use of an SMTP server is also exclusive to DoltLab Enterprise. This means that new users created on your DoltLab instance will be automatically verified, database collaborator invitations will be automatically accepted, and two-factor authentication will be disabled.

If a user needs to reset their password, the DoltLab administrator can reset the password on the user's behalf by navigating to Profile > Settings > Reset user passwords.

Finally, in the `installer_config.yaml`, the [smtp](../reference/installer/configuration-file.md#smtp) configuration is now part of the [enterprise](../reference/installer/configuration-file.md#enterprise) configuration section. Please see [connecting DoltLab to an SMTP server](../guides/enterprise.md#connect-doltlab-to-an-smtp-server) for more information.

Aside from the `smtp` configuration change in the `installer_config.yaml`, no other changes are need to `installer_config.yaml` to upgrade to DoltLab `v2.2.0`, simply ensuring that the `version` is `v2.2.0` is sufficient.

# Upgrade from DoltLab <code>v2.1.4</code> to <code>v2.1.5+</code>

When upgrading from DoltLab `v2.1.4` that uses an `installer_config.yaml` to newer DoltLab, which also uses that configuration file, you can simply reuse your previous `installer_config.yaml` with the newer DoltLab version.

First, be sure to stop your running DoltLab instance with `./stop.sh`.

Simply copy the old file into the same directory as the new DoltLab's [installer](../reference/installer.md) binary, and rerun it.

Be sure rename your old `doltlab` directory and unzip the new version of DoltLab using the name `doltlab`. Currently, [changing the parent directory name will change cause Docker to load the wrong data volumes](https://github.com/dolthub/doltlab-issues/issues/90).

```bash
mv doltlab doltlab-old
unzip doltlab-v2.1.5.zip -d doltlab
cp doltlab-old/installer_config.yaml doltlab/
cd doltlab
./installer
./start.sh
```

You can also run the [installer](../reference/installer.md) for the newer version of DoltLab with the [config](../reference/installer/cli.md#config) flag:

```bash
./installer --config=doltlab-old/installer_config.yaml
```

# Upgrade from DoltLab <code>v2.1.3</code> to <code>v2.1.4+</code>

DoltLab `v2.1.4` no longer writes or maintains a `.secrets` directory co-located with the `installer`. Instead, DoltLab >= `v2.1.4` ships with a configuration file that the `installer` uses called `./installer_config.yaml`.

The default configuration file contains default values for all passwords the DoltLab requires, and is much simpler to maintain. Please see the [Installer Configuration File Reference](../reference/installer/configuration-file.md) for more information.

# Upgrade from DoltLab <code>v2.1.2</code> to <code>v2.1.3+</code>

DoltLab `v2.1.2` wrote generated passwords to a `.secrets` directory co-located with the `installer`.

Before upgrading to a newer DoltLab version, collect the values of these passwords from the `.secrets` directory of the DoltLab instance you will replace. It is important to reuse these same values in the newer installation of DoltLab, since the older version was initialized with these values.

After collecting the values, when running the `installer` for the newer DoltLab for the first time, supply the values to the `installer` using their corresponding flag argument to ensure the `installer` will use them and not generate new values, which will cause your instance to crash.

- `./.secrets/default_user_pass.priv`, use `--default-user-password` with the `installer` to save the password for the default user.
- `./.secrets/dolt_admin_password.priv`, use `--doltlabdb-admin-password` with the `installer` to save the `dolthubadmin` password for DoltLab's application database.
- `./.secrets/dolt_dolthubapi_password.priv`, use `--doltlabdb-dolthubapi-password` with the `installer` to save the `dolthubapi` password for DoltLab's application database.
- `./.secrets/smtp_username.priv`, use `--smtp-username` with the `installer` to save the SMTP username for an SMTP server. This is only required if your previous installation was connected to an SMTP server using `login` or `plain` authentication.
- `./.secrets/smtp_password.priv`, use `--smtp-password` with the `installer` to save the SMTP password for an SMTP server. This is only required if your previous installation was connected to an SMTP server using `login` or `plain` authentication.
- `./.secrets/smtp_oauth_token.priv`, use `--smtp-oauth-token` with the `installer` to save the SMTP oauth token for an SMTP server. This is only required if your previous installation was connected to an SMTP server using `oauthbearer` authentication.

# Upgrade from DoltLab <code>v2.0.8</code> to <code>v2.1.0+</code>

The upgrade process for DoltLab `v2.0.8` to `v2.1.0` has not changed, and only requires replacing DoltLab `v2.0.8` with DoltLab `v2.1.0`, the way previous upgrades did.

However, DoltLab `v2.1.0` requires configuring DoltLab using the included `installer` binary. This binary uses flag arguments to replace environment variables that were required by DoltLab <= `v2.0.8`. Please see the list of environment variables below, and use their counterpart flags arguments with the `installer` instead.

`HOST_IP`, the IP address or domain name of the Linux host running DoltLab. Use `--host` with the `installer`.<br/>
`DOLT_PASSWORD`, the `dolthubadmin` password for DoltLab's application database. Use `--doltlabdb-admin-password` with the `installer`.<br/>
`DOLTHUBAPI_PASSWORD`, the `dolthubapi` password for DoltLab's application database. Use `--doltlabdb-dolthubapi-password` with the `installer`.<br/>
`EMAIL_USERNAME`, the username authorized to use existing SMTP server. Use `--smtp-username` with the `installer`.<br/>
`EMAIL_PASSWORD`, the password for the aforementioned username of the SMTP server. Use `--smtp-password` with the `installer`.<br/>
`EMAIL_PORT`, the port of an SMTP server. Use `--smtp-port` with the `installer`.<br/>
`EMAIL_HOST`, the host of an SMTP server. Use `--smtp-host` with the `installer`.<br/>
`NO_REPLY_EMAIL`, the email address that sends DoltLab emails. Use `--no-reply-email` with the `installer`.<br/>
`DOLTLAB_ENTERPRISE_ONLINE_PRODUCT_CODE`, the DoltLab Enterprise product code. Use `--enterprise-online-product-code` with the `installer`.<br/>
`DOLTLAB_ENTERPRISE_ONLINE_SHARED_KEY`, the DoltLab Enterprise shared key. Use `--enterprise-online-shared-key` with the `installer`.<br/>
`DOLTLAB_ENTERPRISE_ONLINE_API_KEY`, the DoltLab Enterprise api key. Use `--enterprise-online-api-key` with the `installer`.<br/>
`DOLTLAB_ENTERPRISE_ONLINE_LICENSE_KEY`, the DoltLab Enterprise license key. Use `--enterprise-online-license-key` with the `installer`.<br/>
`TLS_CERT_CHAIN`, the absolute path to a TLS certificate chain. Use `--tls-cert-chain` with the `installer`. <br/>
`TLS_PRIVATE_KEY`, the absolute path to a TLS private key. Use `--tls-private-key` with the `installer`.<br/>

# Upgrade from DoltLab <code>v1.1.1</code> to <code>v2.0.0+</code>

The upgrade process for DoltLab `v1.1.1` to `v2.0.0` has not changed, and only requires replacing DoltLab `v1.1.1` with DoltLab `v2.0.0`, the way previous upgrades did.

However, DoltLab `v2.0.0` is the first version of DoltLab that supports Enterprise mode, a configuration exclusive to DoltLab Enterprise customers. Prior to `v2.0.0`, DoltLab was released with enterprise features _included_. However, these exclusive features are now unsupported by DoltLab `v2.0.0` for non-enterprise customers.

If you are currently using the any of the following enterprise features in DoltLab <= `v1.1.1`, you will lose them by upgrading to DoltLab `v2.0.0`:

- [Custom Automated Emails](../guides/enterprise.md#customize-automated-emails)
- [Custom Logo](../guides/enterprise.md#use-custom-logo)
- [Custom Color Themes](../guides/enterprise.md#customize-colors)
- [Super Admins](../guides/enterprise.md#add-super-admins)

# Upgrade from DoltLab <code>v0.8.4</code> to <code>v1.0.0+</code>

DoltLab `v0.8.4` is the final version of DoltLab released using PostgreSQL as the database backing DoltLab's API. Starting with DoltLab `v1.0.0`, DoltLab runs on Dolt.

If your current DoltLab instance is older than `v0.8.4`, you must first upgrade to this version _before_ upgrading to DoltLab `v1.0.0`. This ensures your DoltLab instance contains the necessary schema changes required to run the database migration script included with DoltLab `v1.0.0` called `./migrate_postgres_dolt.sh`.

`./migrate_postgres_dolt.sh` will copy all existing PostgreSQL data from your old DoltLab instance into DoltLab `v1.0.0`'s Dolt database.

Let's walkthrough how to perform this upgrade and database migration with an example.

On a host running DoltLab `v0.8.4`, we first stop DoltLab with `docker-compose stop`. Next, we download and unzip DoltLab `v1.0.0` to the same location as the previous version of DoltLab.

Before running the migration script, we will start DoltLab `v1.0.0` for the first time using the `./start-doltlab.sh` script, then once DoltLab is started, shut it back down. Doing this quick, start-then-stop will create the new Docker volumes required for running DoltLab `v1.0.0` and the migration script. Now, we can run `./migrate_postgres_dolt.sh` included with DoltLab `v1.0.0` and supply the environment variable values we used for our DoltLab `v0.8.4` instance. This script will automatically move our data from PostgreSQL to Dolt:

```bash
POSTGRES_PASSWORD=<POSTGRES_PASSWORD> \
DOLT_PASSWORD=<DOLT_PASSWORD> \
DOLTHUBAPI_PASSWORD=<DOLTHUBAPI_PASSWORD> \
./migrate_postgres_dolt.sh
```

Once the script completes, DoltLab `v1.0.0` can be started and all data from `v0.8.4` will be present.

# Upgrade from DoltLab <code>v0.6.0</code> to <code>v0.7.0+</code>

Starting with DoltLab `v0.7.0`, the `./start-doltlab.sh` script will create a `doltlab` docker network externally, instead of allowing Docker Compose to create the network automatically. If you're upgrading to `v0.7.0` or higher from an earlier DoltLab version, remove any `doltlab` or `*_doltlab` networks on the host before installing `v0.7.0`.

# Upgrade from DoltLab <code>v0.3.0+</code>

DoltLab versions >= `v0.3.0` support schema migrations without data loss. To upgrade to a DoltLab version after `v0.3.0`, simply stop your old version of DoltLab, then download and unzip the newer DoltLab version to the same location as your previous version. This will ensure that when you [start the new version](./installation/README.md#start-doltlab) of DoltLab using the `start-doltlab.sh` script, the old DoltLab version's Docker volumes get attached to the new version's containers.

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

# Upgrade from DoltLab <code>v0.2.0</code> to <code>v0.3.0</code>

To upgrade without data loss, follow the same instructions for upgrading found in the [Upgrade from DoltLab <code>v0.1.0</code> <code>v0.2.0</code>](#upgrade-v010-v020) section.

# Upgrade from DoltLab <code>v0.1.0</code> to <code>v0.2.0</code> Without Data Loss

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

[Download DoltLab](./installation/README.md#download-doltlab) `v0.2.0`, unzip it's contents, and [start DoltLab](./installation/README.md#start-doltlab) `v0.2.0`'s services by running the `start-doltlab.sh` script.

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
