---
title: Start DoltLab (Pre-Installer)
---

<h1 id="start-doltlab-pre-installer">Start DoltLab (Pre-Installer)</h1>

The following describes how to start an older version of DoltLab, <= `v2.0.8`, that does not contain the `installer` binary that the latest versions of DoltLab do. These versions of DoltLab use the `.start-doltlab.sh` script included in DoltLab's `.zip` file.

This script requires the following environment variables to be set in your DoltLab host environment/shell.

> Note, the `./start-doltlab.sh` script contains references to some of these environment variables, but not all, as some are referenced elsewhere.

```bash
# required
export HOST_IP=<host ip address or domain name>
export DOLT_PASSWORD=<password>
export DOLTHUBAPI_PASSWORD=<password>
export EMAIL_USERNAME=<SMTP email username>
export EMAIL_PASSWORD=<SMTP email password>
export EMAIL_PORT=<STMP email port>
export EMAIL_HOST=<SMTP email host>
export NO_REPLY_EMAIL=<email address used as the "from" address for DoltLab emails>

# required for DoltLab Enterprise
export DOLTLAB_ENTERPRISE_ONLINE_PRODUCT_CODE=<product code>
export DOLTLAB_ENTERPRISE_ONLINE_SHARED_KEY=<shared key>
export DOLTLAB_ENTERPRISE_ONLINE_API_KEY=<API key>
export DOLTLAB_ENTERPRISE_ONLINE_LICENSE_KEY=<license key>
export DOLTLAB_ENTERPRISE_HARDWARE_ID=<hardware ID>

# optional, supported in DoltLab >= v1.0.6
export TLS_CERT_CHAIN=<path to TLS certificate chain>
export TLS_PRIVATE_KEY=<path to TLS private key>
```

> For DoltLab version <= `v0.8.4` include `export POSTGRES_USER="dolthubapi"` and rename `DOLT_PASSWORD` to `POSTGRES_PASSWORD`.

`HOST_IP`, should be the IP address or domain name of the Linux host running DoltLab.<br/>
`DOLT_PASSWORD`, and `DOLTHUBAPI_PASSWORD` may be set to any valid Dolt password.<br/>
`EMAIL_USERNAME`, should be a valid username authorized to use existing SMTP server.<br/>
`EMAIL_PASSWORD`, should be the password for the aforementioned username of the SMTP server.<br/>
`EMAIL_PORT`, port to the existing SMTP server. By default, this is assumed to be a `STARTTLS` port. To use an implicit TLS port, [please follow these steps](./administrator.md#smtp-implicit-tls).<br/>
`EMAIL_HOST`, should be the host of the existing SMTP server.<br/>
`NO_REPLY_EMAIL` should be the email address that sends DoltLab emails.<br/>
`DOLTLAB_ENTERPRISE_ONLINE_PRODUCT_CODE`, used by DoltLab Enterprise only.<br/>
`DOLTLAB_ENTERPRISE_ONLINE_SHARED_KEY`, used by DoltLab Enterprise only.<br/>
`DOLTLAB_ENTERPRISE_ONLINE_API_KEY`, used by DoltLab Enterprise only.<br/>
`DOLTLAB_ENTERPRISE_ONLINE_LICENSE_KEY`, used by DoltLab Enterprise only.<br/>
`DOLTLAB_ENTERPRISE_HARDWARE_ID`, use `./get_machine_id` binary to get the hardware ID and use the output as this value (DoltLab Enterprise only)<br/>
`TLS_CERT_CHAIN` required if running DoltLab >= `v1.0.6` with TLS, should be the the absolute path to a TLS certificate chain.<br/>
`TLS_PRIVATE_KEY` required if running DoltLab >= `v1.0.6` with TLS, should be the the absolute path to a TLS private key.<br/>

To use DoltLab with TLS, ensure the certificate is for the `HOST_IP` of your DoltLab host. We recommend creating a TLS certificate with [certbot](https://certbot.eff.org/).

It's import to note that the first time you run `./start-doltlab.sh`, DoltLab uses the supplied `DOLT_PASSWORD` and `DOLTHUBAPI_PASSWORD` to initialize DoltLab's application database using the following SQL statements:

```sql
CREATE USER 'dolthubadmin' IDENTIFIED BY '$DOLT_PASSWORD';
CREATE USER 'dolthubapi' IDENTIFIED BY '$DOLTHUBAPI_PASSWORD';
GRANT ALL ON *.* TO 'dolthubadmin';
GRANT ALL ON dolthubapi.* TO 'dolthubapi';
```

DoltLab's main API, `doltlabapi`, will connect to the application database as the `dolthubapi` SQL user.

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
./start-doltlab.sh # runs doltlab on HTTP using docker-compose.yaml in daemon mode
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

To run DoltLab with TLS instead run:

```bash
./start-doltlab.sh https # runs doltlab on HTTPS using docker-compose-tls.yaml in daemon mode
```

And navigating to `https://${HOST_IP}:443` in a web browser should show the DoltLab homepage.

# Next Steps

- [DoltLab Administrator Guide]()
