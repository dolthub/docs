---
title: Pre-Installer Linux
---

<h1 id="install-doltlab-pre-installer-linux">Install DoltLab (pre-installer) on Linux</h1>

This page covers how to install and start older versions of DoltLab, up to `v2.0.8`, on a Linux host. We highly recommend installing the latest version of DoltLab, as no updates or bug fixes are added to earlier releases.

Before you begin, be sure the host meets the [minimum recommended hardware requirements](), has the proper [networking configuration](), and all [dependencies]() installed.

DoltLab is released as a single `.zip` file that contains everything you need to run it.

Download and unzip the latest version of DoltLab with:

```bash
export DOLTLAB_VERSION=v2.0.8
curl -LO https://doltlab-releases.s3.amazonaws.com/linux/amd64/doltlab-${DOLTLAB_VERSION}.zip
unzip doltlab-${DOLTLAB_VERSION}.zip -d doltlab
cd doltlab
```

Inside the resulting `doltlab` directory, you'll find the following items:

* templates
* envoy.tmpl
* envoy-tls.tmpl
* config_loader
* gentokenenckey
* send_doltlab_deployed_event
* smtp_connection_helper
* get_machine_id
* gen_saml_key
* gen_saml_cert
* gent_saml_certs.sh
* migrate_postgres_dolt.sh
* dolt_db_cli.sh
* shell-db.sh
* docker-compose.yaml
* docker-compose-tls.yaml
* start-doltlab.sh
* prometheus.yaml
* prometheus-alert.rules
* alertmanager.yaml

`templates` contains email templates used by `doltlabapi` to send automated emails to users of your DoltLab instance. Used by DoltLab Enterprise only.

`envoy.tmpl` is an template file used to create the [Envoy](https://www.envoyproxy.io/) proxy configuration file called `envoy.yaml`.

`envoy-tls.tmpl` is included in DoltLab >= `v1.0.6` and is used to create an `envoy.yaml` file that uses TLS.

`gentokenenckey`, short for "generate token encryption key" is a binary used to generate token encryption keys used by DoltLab. The code is available [here](https://gist.github.com/coffeegoddd/9b1acb07baaa72c8173a2e7b11dacb80).

`config_loader` is a binary used to process the `admin-config.yaml` file, if one exists. Enterprise only as of DoltLab >= `v2.0.0`.

`send_doltlab_deployed_event` is a binary that sends a single request to our metrics server, letting us track how many DoltLab instances get deployed each day. This information helps us properly fund and staff our DoltLab team. The source for this binary is [here](https://gist.github.com/coffeegoddd/cc1c7c765af56f6523bc5faffbc19e7a).

The `smtp_connection_helper` binary can be used to help you troubleshoot any issues connecting your DoltLab instance to your existing SMTP server. This tool uses similar code to DoltLab's email service and sends a test email if the connection to the SMTP server is properly configured. The source code for the tool is available [here](https://gist.github.com/coffeegoddd/66f5aeec98640ff8a22a1b6910826667) and basic instructions for using the tool are [here](./administrator.md#troubleshoot-smtp-connection).

`get_machine_id` is a binary used to determine the hardware ID of the DoltLab host. Used by DoltLab Enterprise only.

`gen_saml_key` is a binary used to generate a private key for configuring SAML single-sign-on. Used by DoltLab Enterprise only.

`gen_saml_cert` is a binary used to generate a signing certificate for SAML single-sign-on. Used by DoltLab Enterprise only.

`gen_saml_certs.sh` is a script that uses `gen_saml_key` and `gen_saml_cert` to create a signing certificate for SAML single-sign-on. Used by DoltLab Enterprise only. The script requires a single argument, the `common name` to use for the certificate.

`migrate_postgres_dolt.sh` is a script available in DoltLab `v1.0.0`+. Prior to DoltLab `v1.0.0`, DoltLab used PostgreSQL as its database. But, starting with `v1.0.0`, DoltLab uses Dolt as its database. This script is used when upgrading from an older DoltLab instance to DoltLab `v1.0.0` and will copy the data from the existing, older DoltLab instance into the new Dolt database backing DoltLab `v1.0.0`. Please see [the guide](./administrator.md#upgrade-v080-v100) for using this script to copy existing data during upgrade.

`dolt_db_cli.sh` is a script available in DoltLab `v1.0.0`+, useful for restoring DoltLab's Dolt server from a backup.

`shell-db.sh` is a script that will open a shell to your running DoltLab's database server. For DoltLab versions < `v1.0.0`, this database server is PostgreSQL. To use this script with those versions, supply the `POSTGRES_PASSWORD` value you set when starting DoltLab as the environment variable `PGPASSWORD`. For DoltLab > `v1.0.0`, supply `DOLT_PASSWORD` as an environment variable to this script. A successful connection will display a either a `dolthubapi=#` prompt or `mysql>` prompt.

`docker-compose.yaml` is a complete [Docker Compose](https://docs.docker.com/compose/) configuration file that will spin up all the services required to run DoltLab.

`docker-compose-tls.yaml` is included in DoltLab >= `v1.0.6` and will spin up DoltLab using TLS.

`start-doltlab.sh` is a helper script designed to quickly and easily start DoltLab. See the following section for more information about how to use this script.

`prometheus.yaml` is a [Prometheus](https://prometheus.io/) configuration file that can be used for observing real-time DoltLab service metrics. Used for DoltLab Enterprise automated backups.

`prometheus-alert.rules` is an alert rules file used for sending emails to DoltLab admins in the event of a backup failure. Used for DoltLab Enterprise automated backups.

`alertmanager.yaml` is a [AlertManager](https://prometheus.io/docs/alerting/latest/alertmanager/) configuration file for sending email alerts to DoltLab admins based on Prometheus metrics. Used for DoltLab Enterprise automated backups.

# Next Steps

- [Start DoltLab (Pre-Installer)](./start-doltlab-pre-installer.md)
