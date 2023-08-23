---
title: "Installation"
---

The latest version of DoltLab is `v1.0.6` and to get started running your own DoltLab instance, you can follow the steps below. To see release notes for [DoltLab's releases](https://github.com/dolthub/doltlab-issues/releases) or to report and track DoltLab issues, visit DoltLab's [issues repository](https://github.com/dolthub/doltlab-issues).

Please note, that to upgrading to a newer version of DoltLab will require you to kill the older version of DoltLab and install the newer one, which may result in data loss.

> Starting with DoltLab `v0.6.0`, Dolt's new storage format (__DOLT__) is the default format for new databases.

> We recommend upgrading your Dolt CLI to ^`v0.5.14` as well. This version initializes new databases with the new storage format.


<h1 id="recommended-minimum-hardware"><ins>Recommended Minimum Hardware</ins></h1>

DoltLab is currently available for Linux and we recommend the following _minimum_ hardware for running your own DoltLab instance:

* 4 CPU and 16 GB of memory
* 100 GBs of disk (DoltLab's container images alone require about 4 GBs of disk). Depending on your use case, this may not be enough to back all database data, and user uploaded files.
* Ubuntu 18.04/20.04 Operating System
* Host IP must be discoverable by the Dolt CLI and web browser.
* Host should allow egress `TCP` connections.
* The following `TCP` ports _must_ be open on the host:
  * `22`, for `ssh` connections.
  * `80`, for ingress `HTTP` connections, or `443` for ingress `HTTPS` connections (supported in DoltLab >= `v1.0.6`).
  * `100`, for ingress connections to DoltLab's [remote data file server](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-remoteapi-server), or `143` to use TLS (supported in DoltLab >= `v1.0.6`).
  * `50051`, for ingress connections to DoltLab's [remote API](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-remoteapi-server), or `50043` to use TLS (supported in DoltLab >= `v1.0.6`).
  * `4321`, for ingress connections to DoltLab's [file upload service API](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-file-service-api-server), or `5443` to use TLS (supported in DoltLab >= `v1.0.6`).

> Starting with DoltLab `v0.7.0`, DoltLab uses more variable disk and memory on its host in order to run DoltLab Jobs. As a result, the minimum memory and disk requirements listed above might be too low for your use case. Please read the section on [DoltLab Jobs](./administrator.md#doltlab-jobs) in the Administrator Guide to find out more about how Jobs can impact your DoltLab instance.

<h1 id="install-doltlab-dependencies"><ins>Step 1: Install DoltLab's Dependencies on the Host</ins></h1>

Once you've provisioned a Linux host and [properly configured it's networking interface](#recommended-minimum-hardware), you can now install DoltLab's dependencies. 

If your host is running Ubuntu 18.04/20.04, the quickest way to install these dependencies is with this [ubuntu-bootstrap.sh](https://gist.github.com/coffeegoddd/f6cacad2a6da423ca27cd0bebc67fd80) script. CentOS 7 users can use the [centos-bootstrap.sh](https://gist.github.com/coffeegoddd/655669b436dbf28d78d5610749350811) script. These scripts will also download and unzip DoltLab at the specified `DOLTLAB_VERSION` to a local `doltlab` directory.

To use them:

```bash
export DOLTLAB_VERSION=v1.0.6
chmod +x ubuntu-bootstrap.sh
sudo ./ubuntu-bootstrap.sh with-sudo "$DOLTLAB_VERSION"
cd doltlab
sudo newgrp docker # login as root to run docker without sudo
```

```bash
export DOLTLAB_VERSION=v1.0.6
chmod +x centos-bootstrap.sh
sudo ./centos-bootstrap.sh with-sudo "$DOLTLAB_VERSION"
cd doltlab
sudo newgrp docker # login as root to run docker without sudo
```

Otherwise, install the following dependencies on your host:

> [curl](https://www.tecmint.com/install-curl-in-linux/)<br/>
> [unzip](https://www.tecmint.com/install-zip-and-unzip-in-linux/)<br/>
> [docker](https://docs.docker.com/engine/install/)<br/>
> [docker-compose](https://docs.docker.com/compose/install/)<br/>
> [amazon-ecr-credential-helper](https://github.com/awslabs/amazon-ecr-credential-helper)<br/>

Once these are installed, follow the [post-installation](https://docs.docker.com/engine/install/linux-postinstall/) steps for Docker to ensure you can run it without `sudo`, then verify with:

```bash
docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

<h1 id="download-doltlab"><ins>Step 2: Download DoltLab</ins></h1>

Next, download and unzip DoltLab. To install the latest version of DoltLab run:

```bash
curl -LO https://doltlab-releases.s3.amazonaws.com/linux/amd64/doltlab-latest.zip
unzip doltlab-latest.zip -d doltlab
cd doltlab
```

To install a specific version, run:
```bash
export DOLTLAB_VERSION=v1.0.6
curl -LO https://doltlab-releases.s3.amazonaws.com/linux/amd64/doltlab-${DOLTLAB_VERSION}.zip
unzip doltlab-${DOLTLAB_VERSION}.zip -d doltlab
cd doltlab
```

Inside the unzipped `doltlab` directory, you'll find the following items:

* templates
* envoy.tmpl
* envoy-tls.tmpl
* gentokenenckey
* send_doltlab_deployed_event
* smtp_connection_helper
* migrate_postgres_dolt.sh
* dolt_db_cli.sh
* shell-db.sh
* docker-compose.yaml
* docker-compose-tls.yaml
* start-doltlab.sh

`templates` contains email templates used by `doltlabapi` to send automated emails to users of your DoltLab instance. You can customize emails by
editing these files before starting your DoltLab instance. For more information on the contents of these files and how to change them, see the [Customize automated emails](./administrator.md#customize-automated-emails) section of the Administrator guide.  

`envoy.tmpl` is an template file used to create the [Envoy](https://www.envoyproxy.io/) proxy configuration file called `envoy.yaml`.

`envoy-tls.tmpl` is included in DoltLab >= `v1.0.6` and is used to create an `envoy.yaml` file that uses TLS.

`gentokenenckey`, short for "generate token encryption key" is a binary used to generate token encryption keys used by DoltLab. The code is available [here](https://gist.github.com/coffeegoddd/9b1acb07baaa72c8173a2e7b11dacb80).

`send_doltlab_deployed_event` is a binary that sends a single request to our metrics server, letting us track how many DoltLab instances get deployed each day. This information helps us properly fund and staff our DoltLab team. The source for this binary is [here](https://gist.github.com/coffeegoddd/cc1c7c765af56f6523bc5faffbc19e7a).

`smtp_connection_helper` is a binary used to help troubleshoot any issues your DoltLab instance might have when establishing a connection to your existing SMTP server. This tool uses similar code to DoltLab's email service and should successfully send a test email if the connection to the SMTP server was configured correctly. The source code for the tool is available [here](https://gist.github.com/coffeegoddd/66f5aeec98640ff8a22a1b6910826667) and basic instructions for using the tool are [here](./administrator.md#troubleshoot-smtp-connection).

`migrate_postgres_dolt.sh` is a script available in DoltLab `v1.0.0`+. Prior to DoltLab `v1.0.0`, DoltLab used PostgreSQL as its database. But now, starting with `v1.0.0`, DoltLab uses Dolt as its database. This script is used when upgrading from an older DoltLab instance to DoltLab `v1.0.0` and will copy the data from the existing, older DoltLab instance into the new Dolt database backing DoltLab `v1.0.0`. Please see [the guide](./administrator.md#upgrade-v080-v100) for using this script to copy existing data during upgrade.

`dolt_db_cli.sh` is a script available in DoltLab `v1.0.0`+, useful for restoring DoltLab's Dolt server from a backup. 

`shell-db.sh` is a script that will open a shell to your running DoltLab's database server. For DoltLab versions lower than `v1.0.0`, this database server is PostgreSQL. To use this script with those versions, supply the `POSTGRES_PASSWORD` value you set when starting DoltLab as the environment variable `PGPASSWORD`. A successful connection will display a `dolthubapi=#` prompt.

For DoltLab `v1.0.0` and later, Dolt is the database server. To connect to it, supply the `DOLT_PASSWORD` environment variable value you set when starting DoltLab. A successful connection will display a `mysql>` prompt.

`docker-compose.yaml` is a complete [Docker Compose](https://docs.docker.com/compose/) configuration file that will spin up all the services required to run DoltLab.

`docker-compose-tls.yaml` is included in DoltLab >= `v1.0.6` and will spin up DoltLab using TLS.

`start-doltlab.sh` is a helper script designed to quickly and easily start DoltLab. See the following section for more information about how to use this script.

<h1 id="start-doltlab"><ins>Step 3: Start DoltLab</ins></h1>

The recommended way to run DoltLab is with the `start-doltlab.sh` script included in DoltLab's zip folder. This script requires the following environment variables to be set:

```bash
# required
export HOST_IP=<Host IP>
export DOLT_PASSWORD=<Password>
export DOLTHUBAPI_PASSWORD=<Password>
export EMAIL_USERNAME=<SMTP Email Username>
export EMAIL_PASSWORD=<SMTP Email Password>
export EMAIL_PORT=<STMP Email Port>
export EMAIL_HOST=<SMTP Email Host>
export NO_REPLY_EMAIL=<An Email Address to Receive No Reply Messages>

# optional, supported in DoltLab >= v1.0.6
export TLS_CERT_CHAIN=<path to TLS certificate chain>
export TLS_PRIVATE_KEY=<path to TLS private key>
```

> For DoltLab version <= `v0.8.4` include `export POSTGRES_USER="dolthubapi"` and rename `DOLT_PASSWORD` to `POSTGRES_PASSWORD`.

`HOST_IP` should be the IP address or DNS name of the Linux host running DoltLab.<br/>
`DOLT_PASSWORD` and `DOLTHUBAPI_PASSWORD` may be set to any valid Dolt password.<br/>
`EMAIL_USERNAME` should be a valid username authorized to use existing SMTP server.<br/>
`EMAIL_PASSWORD` should be the password for the aforementioned username of the SMTP server.<br/>
`EMAIL_PORT` a `STARTTLS` port to the existing SMTP server is assumed by default. To use an implicit TLS port, [please follow these steps](./administrator.md#smtp-implicit-tls).<br/>
`EMAIL_HOST` should be the host of the existing SMTP server.<br/>
`NO_REPLY_EMAIL` should be the email address that receives no-reply messages.<br/>
`TLS_CERT_CHAIN` required if running DoltLab >= `v1.0.6` with TLS, should be the the absolute path to a TLS certificate chain.<br/>
`TLS_PRIVATE_KEY` required if running DoltLab >= `v1.0.6` with TLS, should be the the absolute path to a TLS private key.<br/>

<h5 id="doltlab-smtp-auth">Supported SMTP Authentication methods</h5>

Starting in DoltLab `v0.3.1`, admins can use different SMTP authentication protocols to connect to an existing
SMTP server. By default, `./start-doltlab.sh` sets the environment variable `EMAIL_AUTH_METHOD` to `plain`.

Supported `EMAIL_AUTH_METHOD` options are `plain`, `login`, `anonymous`, `external`, `oauthbearer`, or `disable`.

`plain` requires the environment variables `EMAIL_USERNAME` and `EMAIL_PASSWORD` to be set and uses the optional environment variable `EMAIL_IDENTITY`.
`login` requires the environment variables `EMAIL_USERNAME` and `EMAIL_PASSWORD` to be set. This is used by Microsoft 365 (`smtp.office365.com`).
`anonymous` uses the optional environment variable `EMAIL_TRACE`.
`external` uses the optional environment variable `EMAIL_IDENTITY`.
`oauthbearer` requires the environment variables `EMAIL_USERNAME` and `EMAIL_OAUTH_TOKEN` to be set.
`disable` will result in an unauthenticated SMTP server connection.

If you are experiencing any SMTP server connection issues (or DoltLab account creation issues) please see [the SMTP troubleshooting guide](./administrator.md#troubleshoot-smtp-connection).

<h5 id="doltlab-default-user">Default user `admin`</h5>

Starting with DoltLab `v0.4.1`, the default user `admin` is created,
when [DoltLab's API server](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-api-server) starts.

This default user allows DoltLab admins to immediately sign in to DoltLab and begin using the product, even if their DoltLab instance is not successfully connected to an SMTP server.

By default, the `./start-doltlab.sh` script will create a default user `DEFAULT_USER=admin` with password `DEFAULT_USER_PASSWORD=DoltLab1234` and the email address `DEFAULT_USER_EMAIL=$NO_REPLY_EMAIL`, which gets its value from the supplied `NO_REPLY_EMAIL` environment variable.
To overwrite these default values, simply change the values of their corresponding environment variables.

Once these variables are set, simply run the `start-doltlab.sh` script:

```bash
./start-doltlab.sh # runs doltlab using docker-compose in daemon mode
```

The running DoltLab processes can be viewed with `docker ps`:

```bash
docker ps
CONTAINER ID   IMAGE                                                             COMMAND                  CREATED      STATUS      PORTS                                                                                     NAMES
c691644170a0   public.ecr.aws/doltlab/dolthub-server:v1.0.0              "docker-entrypoint.s…"   2 hours ago     Up 2 hours               3000/tcp                                                                                                                                                                    doltlab_doltlabui_1
47e6a04d4187   public.ecr.aws/doltlab/dolthubapi-graphql-server:v1.0.0   "docker-entrypoint.s…"   2 hours ago     Up 2 hours               9000/tcp                                                                                                                                                                    doltlab_doltlabgraphql_1
6123d50a3306   public.ecr.aws/doltlab/dolthubapi-server:v1.0.0           "/app/go/services/do…"   2 hours ago     Up 2 hours                                                                                                                                                                                           doltlab_doltlabapi_1
85bd6dc8166c   public.ecr.aws/doltlab/doltremoteapi-server:v1.0.0        "/app/go/services/do…"   2 hours ago     Up 2 hours               0.0.0.0:50051->50051/tcp, :::50051->50051/tcp                                                                                                                               doltlab_doltlabremoteapi_1
cc4000a24ea0   public.ecr.aws/doltlab/fileserviceapi-server:v1.0.0       "/app/go/services/fi…"   2 hours ago     Up 2 hours                                                                                                                                                                                           doltlab_doltlabfileserviceapi_1
c1faa01b05ce   public.ecr.aws/doltlab/dolt-sql-server:v1.0.0             "tini -- docker-entr…"   2 hours ago     Up 2 hours               3306/tcp, 33060/tcp                                                                                                                                                         doltlab_doltlabdb_1
9d6826cfb0c3   envoyproxy/envoy-alpine:v1.18-latest                                                    "/docker-entrypoint.…"   2 hours ago     Up 2 hours               0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:100->100/tcp, :::100->100/tcp, 0.0.0.0:4321->4321/tcp, :::4321->4321/tcp, 0.0.0.0:7770->7770/tcp, :::7770->7770/tcp, 10000/tcp   doltlab_doltlabenvoy_1
```

And navigating to `http://${HOST_IP}:80` in a web browser should show the DoltLab homepage.
