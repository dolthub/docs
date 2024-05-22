---
title: Installer configuration file reference
---

# Installer configuration file reference

```yaml
# installer_config.yaml

version: "v2.1.4"
host: "127.0.0.1"
docker_network: "doltlab"
metrics_disabled: false
whitelist_all_users: true
scheme: "http"
services:
  doltlabdb:
    host: "127.0.0.1"
    port: 3306
    admin_password: "*****"
    dolthubapi_password: "*****"
    tls_skip_verify: true
  doltlabapi:
    host: "127.0.0.1"
    port: 9443
    csv_port: 9444
  doltlabremoteapi:
    host: "127.0.0.1"
    port: 50051
    file_server_port: 100
  doltlabfileserviceapi:
    host: "127.0.0.1"
    port: 4321
  doltlabgraphql:
    host: "127.0.0.1"
    port: 9000
  doltlabui:
    host: "127.0.0.1"
    port: 80
default_user:
  name: "admin"
  email: "admin@localhost"
  password: "*****"
smtp:
  host: "scheme: "http""
  port: 587
  auth_method: "plain"
  no_reply_email: "user@email.com"
  username: "user@email.com"
  password: "*****"
  oauth_token: "*****"
  identity: "doltlab"
  trace: "doltlab"
  client_hostname: "doltlab"
  implicit_tls: false
  insecure_tls: false
tls:
  cert_chain: "/path/to/cert.pem"
  private_key: "/path/to/key.pem"
jobs:
  concurrency_limit: 10
  concurrency_loop_seconds: 30
  max_retries: 5
enterprise:
  online_product_code: "*****"
  online_shared_key: "*****"
  online_api_key: "*****"
  online_license_key: "*****"
  saml:
    metadata_descriptor_file: "/path/to/metadata/descriptor"
    cert_common_name: "doltlab"
  customize:
    logo: "/path/to/custom/logo"
    email_templates: true
    color_overrides:
      rgb_accent_1: "10, 10, 10"
      rgb_background_accent_1: "10, 10, 10"
      rgb_background_gradient_start: "10, 10, 10"
      rgb_button_1: "10, 10, 10"
      rgb_button_2: "10, 10, 10"
      rgb_link_1: "10, 10, 10"
      rgb_link_2: "10, 10, 10"
      rgb_link_light: "10, 10, 10"
  automated_backups:
    remote_url: "{aws,gs,oci}://remotebackupurl"
    aws_region: "us-west-2"
    aws_profile: "backup_profile"
    aws_shared_credentials_file: "/path/to/aws/shared/credentials/file"
    aws_config_file: "/path/to/aws/config/file"
    google_credentials_file: "/path/to/gcloud/credentials/file"
    oci_config_file: "/path/to/oci/config/file"
    oci_key_file: "/path/to/oci/key/file"
  multihost:
    doltlabdb_only: true
    doltlabapi_only: true
    doltlabfileserviceapi_only: true
    doltlabgraphql_only: true
    doltlabui_only: true
  super_admins: ["admin1@localhost", "admin2@localhost"]
```

The following are top-level `installer_config.yaml` options:

- [version](#version)
- [host](#host)
- [docker_network](#docker_network)
- [metrics_disabled](#metrics_disabled)
- [whitelist_all_users](#whitelist_all_users)
- [services](#services)
- [default_user](#default_user)
- [smtp](#smtp)
- [scheme](#scheme)
- [tls](#tls)
- [jobs](#jobs)
- [enterprise](#enterprise)

## version

_String_. The version of the configuration file and DoltLab. _Required_.

```yaml
# installer_config.yaml
version: v2.1.4
```

## host

_String_. The hostname or IP address of the host running DoltLab. _Required_.

```yaml
# example installer_config.yaml
host: mydoltlab.mycompany.com
```

```yaml
# example installer_config.yaml
host: 123.456.78.90
```

Command line equivalent [host](./cli.md#host).

## docker_network

_String_. The name of the docker network used for DoltLab, defaults to `doltlab`. _Optional_.

```yaml
# example installer_config.yaml
docker_network: doltlab
```

Command line equivalent [docker-network](./cli.md#docker-network).

## metrics_disabled

_Boolean_. If true, disables first party usage metrics for a DoltLab instance, defaults to `false`. _Optional_.

```yaml
# example installer_config.yaml
metrics_disabled: false
```

Command line equivalent [disable-usage-metrics](./cli.md#disable-usage-metrics).

## whitelist_all_users

_Boolean_. If true, allows any user to create an account on a DoltLab instance, defaults to `true`. _Optional_

```yaml
# example installer_config.yaml
whitelist_all_users: true
```

See [prevent unauthorized user account creation](../../guides/administrator.md#prevent-unauthorized-user-account-creation) for more information.

Command line equivalent [white-list-all-users](./cli.md#white-list-all-users).

## services

_Dictionary_. Configuration options for DoltLab's various services. `doltlabdb` passwords are _Required_ in single host deployments, other service definitions are _Required_ for multi-host deployments.

- [doltlabdb](#doltlabdb)
- [doltlabapi](#doltlabapi)
- [doltlabremoteapi](#doltlabremoteapi)
- [doltlabfileserviceapi](#doltlabfileserviceapi)
- [doltlabgraphql](#doltlabgraphql)
- [doltlabui](#doltlabui)

### doltlabdb

_Dictionary_. Configuration options for `doltlabdb`.

- [host](#doltlabdb-host)
- [port](#doltlabdb-port)
- [admin_password](#admin_password)
- [dolthubapi_password](#dolthubapi_password)
- [tls_skip_verify](#tls_skip_verify)

<h4 id="doltlabdb-host">host</h4>

_String_. The host name or IP address of the host running `doltlabdb`. _Required_ for [configuring an external application database](../../guides/administrator.md#use-external-database) and for multi-host deployments.

```yaml
# example installer_config.yaml
services:
  doltlabdb:
    host: "127.0.0.1"
```

Command line equivalent [doltlabdb-host](./cli.md#doltlabdb-host).

<h4 id="doltlabdb-port">port</h4>

_Number_. The port for `doltlabdb`. _Required_ for [configuring an external application database](../../guides/administrator.md#use-external-database) and for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabdb:
    port: 3306
```

Command line equivalent [doltlabdb-port](./cli.md#doltlabdb-port).

#### admin_password

_String_. The password used to for creating user `dolthubadmin` in DoltLab's application database. _Required_.

```yaml
# example installer_config.yaml
services:
  doltlabdb:
    admin_password: "mypassword"
```

Command line equivalent [doltlabdb-admin-password](./cli.md#doltlabdb-admin-password).

#### dolthubapi_password

_String_. The password used to for creating user `dolthubapi` in DoltLab's application database. _Required_.

```yaml
# example installer_config.yaml
services:
  doltlabdb:
    dolthubapi_password: mypassword
```

Command line equivalent [doltlabdb-dolthubapi-password](./cli.md#doltlabdb-dolthubapi-password).

#### tls_skip_verify

_String_. If true, skips TLS verification during connection to `doltlabdb`. _Optional_.

```yaml
# example installer_config.yaml
services:
  doltlabdb:
    tls_skip_verify: false
```

Command line equivalent [doltlabdb-tls-skip-verify](./cli.md#doltlabdb-tls-skip-verify).

### doltlabapi

_Dictionary_. Configuration options for `doltlabapi`.

- [host](#doltlabapi-host)
- [port](#doltlabapi-port)
- [csv_port](#csv_port)

<h4 id="doltlabapi-host">host</h4>

_String_. The host name or IP address of the host running `doltlabapi`. _Required_ for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabapi:
    host: "127.0.0.1"
```

Command line equivalent [doltlabapi-host](./cli.md#doltlabapi-host).

<h4 id="doltlabapi-port">port</h4>

_Number_. The port for `doltlabapi`. _Required_ for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabapi:
    port: 3306
```

Command line equivalent [doltlabapi-port](./cli.md#doltlabapi-port).

#### csv_port

_Number_. The port for `doltlabapi`'s csv service. _Required_ for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabapi:
    csv_port: 3306
```

Command line equivalent [doltlabapi-csv-port](./cli.md#doltlabapi-csv-port).

### doltlabremoteapi

_Dictionary_. Configuration options for `doltlabremoteapi`.

- [host](#doltlabremoteapi-host)
- [port](#doltlabremoteapi-port)
- [file_server_port](#file_server_port)

<h4 id="doltlabremoteapi-host">host</h4>

_String_. The host name or IP address of the host running `doltlabremoteapi`. _Required_ for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabremoteapi:
    host: "127.0.0.1"
```

Command line equivalent [doltlabremoteapi-host](./cli.md#doltlabremoteapi-host).

<h4 id="doltlabremoteapi-port">port</h4>

_Number_. The port for `doltlabremoteapi`. _Required_ for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabremoteapi:
    port: 3306
```

Command line equivalent [doltlabremoteapi-port](./cli.md#doltlabremoteapi-port).

<h4 id="doltlabremoteapi-port">port</h4>

_Number_. The port for `doltlabremoteapi`'s file server. _Required_ for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabremoteapi:
    file_server_port: 100
```

Command line equivalent [doltlabremoteapi-file-server-port](./cli.md#doltlabremoteapi-file-server-port).

### doltlabfileserviceapi

_Dictionary_. Configuration options for `doltlabapifileserviceapi`.

- [host](#doltlabfileserviceapi-host)
- [port](#doltlabfileserviceapi-port)

<h4 id="doltlabfileserviceapi-host">host</h4>

_String_. The host name or IP address of the host running `doltlabfileserviceapi`. _Required_ for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabfileserviceapi:
    host: "127.0.0.1"
```

Command line equivalent [doltlabfileserviceapi-host](./cli.md#doltlabfileserviceapi-host).

<h4 id="doltlabfileserviceapi-port">port</h4>

_Number_. The port for `doltlabfileserviceapi`. _Required_ for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabfileserviceapi:
    port: 4321
```

Command line equivalent [doltlabfileserviceapi-port](./cli.md#doltlabfileserviceapi-port).

### doltlabgraphql

_Dictionary_. Configuration options for `doltlabgraphql`.

- [host](#doltlabgraphql-host)
- [port](#doltlabgraphql-port)

<h4 id="doltlabgraphql-host">host</h4>

_String_. The host name or IP address of the host running `doltlabgraphql`. _Required_ for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabgraphql:
    host: "127.0.0.1"
```

Command line equivalent [doltlabgraphql-host](./cli.md#doltlabgraphql-host).

<h4 id="doltlabgraphql-port">port</h4>

_Number_. The port for `doltlabgraphql`. _Required_ for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabgraphql:
    port: 9000
```

Command line equivalent [doltlabgraphql-port](./cli.md#doltlabgraphql-port).

### doltlabui

_Dictionary_. Configuration options for `doltlabui`.

- [host](#doltlabui-host)
- [port](#doltlabui-port)

<h4 id="doltlabui-host">host</h4>

_String_. The host name or IP address of the host running `doltlabui`. _Required_ for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabui:
    host: "127.0.0.1"
```

Command line equivalent [doltlabui-host](./cli.md#doltlabui-host).

<h4 id="doltlabui-port">port</h4>

_Number_. The port for `doltlabui`. _Required_ for [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts).

```yaml
# example installer_config.yaml
services:
  doltlabui:
    port: 80
```

Command line equivalent [doltlabui-port](./cli.md#doltlabui-port).

## default_user

_Dictionary_. Configuration options for DoltLab's default user. _Required_.

- [name](#name)
- [password](#default-user-password)
- [email](#email)

### name

_String_. The username of the default user. _Required_.

```yaml
# example installer_config.yaml
default_user:
  name: admin
```

Command line equivalent [default-user](./cli.md#default-user).

<h3 id="default-user-password">password</h3>

_String_. The password of the default user. _Required_.

```yaml
# example installer_config.yaml
default_user:
  password: mypassword
```

Command line equivalent [default-user-password](./cli.md#default-user-password).

### email

_String_. The email address of the default user. _Required_.

```yaml
# example installer_config.yaml
default_user:
  email: admin@localhost
```

Command line equivalent [default-user-email](./cli.md#default-user-email).

## smtp

_Dictionary_. The configuration options for an external SMTP server. _Optional_. See [connecting DoltLab to an SMTP server](../../guides/administrator.md#connect-doltlab-to-an-smtp-server) for more information.

- [auth_method](#auth_method)
- [host](#smtp-host)
- [port](#smtp-port)
- [no_reply_email](#no_reply_email)
- [username](#username)
- [password](#smtp-password)
- [oauth_token](#oauth-token)
- [identity](#identity)
- [trace](#trace)
- [implicit_tls](#implicit-tls)
- [insecure_tls](#insecure-tls)

### auth_method

_String_. The authentication method used by the SMTP server. _Required_. One of `plain`, `login`, `oauthbearer`, `anonymous`, `external`, and `disable`.

```yaml
# example installer_config.yaml
smtp:
  auth_method: plain
```

Command line equivalent [smtp-auth-method](./cli.md#smtp-auth-method).

<h3 id="smtp-host">host</h3>

_String_. The host name of the SMTP server. _Required_.

```yaml
# example installer_config.yaml
smtp:
  host: smtp.gmail.com
```

Command line equivalent [smtp-host](./cli.md#smtp-host).

<h3 id="smtp-port">port</h3>

_Number_. The port of the SMTP server. _Required_.

```yaml
# example installer_config.yaml
smtp:
  port: 587
```

Command line equivalent [smtp-port](./cli.md#smtp-port).

### no_reply_email

_String_. The email address used to send emails from DoltLab. _Required_.

```yaml
# example installer_config.yaml
smtp:
  no_reply_email: admin@localhost
```

Command line equivalent [no-reply-email](./cli.md#no-reply-email).

### username

_String_. The username used for connecting to the SMTP server. _Required_ for `auth_method` `login` and `plain`.

```yaml
# example installer_config.yaml
smtp:
  username: mysmtpusername
```

Command line equivalent [smtp-username](./cli.md#smtp-username).

<h3 id="smtp-password">password</h3>

_String_. The password used for connecting to the SMTP server. _Required_ for `auth_method` `login` and `plain`.

```yaml
# example installer_config.yaml
smtp:
  password: mypassword
```

Command line equivalent [smtp-password](./cli.md#smtp-password).

### oauth_token

_String_. The oauth token used for connecting to the SMTP server. _Required_ for `auth_method` `oauthbearer`.

```yaml
# example installer_config.yaml
smtp:
  oauth_token: myoauthtoken
```

Command line equivalent [smtp-oauth-token](./cli.md#smtp-oauth-token).

### identity

_String_. The SMTP server identity. _Optional_.
```yaml
# example installer_config.yaml
smtp:
  identity: mysmtpidentity
```

Command line equivalent [smtp-identity](./cli.md#smtp-identity).

### trace

_String_. The SMTP server trace. _Optional_.

```yaml
# example installer_config.yaml
smtp:
  trace: mysmtptrace
```

Command line equivalent [smtp-trace](./cli.md#smtp-trace).

### implicit_tls

_Boolean_. If true, uses implicit TLS to connect to the SMTP server. _Optional_.

```yaml
# example installer_config.yaml
smtp:
  implicit_tls: false
```

Command line equivalent [smtp-implicit-tls](./cli.md#smtp-implicit-tls).

### insecure_tls

_Boolean_. If true, uses insecure TLS to connect to the SMTP server. _Optional_.

```yaml
# example installer_config.yaml
smtp:
  insecure_tls: false
```

Command line equivalent [smtp-insecure-tls](./cli.md#smtp-insecure-tls).

## scheme

_String_. The HTTP scheme of the DoltLab deployment, defaults to `http`. _Optional_.

```yaml
# example installer_config.yaml
scheme: http
```

See [how to serve DoltLab over HTTPS](#doltlab-https-natively) for more information.

Command line equivalent [scheme](./cli.md#scheme).

## tls

_Dictionary_. TLS configuration options. _Optional_. See [serving DoltLab natively over HTTPS](../../guides/administrator.md#serve-doltlab-over-https-natively) for more information.

- [cert_chain](#cert_chain)
- [private_key](private_key)

### cert_chain

_String_. The absolute path to a TLS certificate chain with `.pem` extension. _Required_.

```yaml
# example installer_config.yaml
tls:
  cert_chain: /path/to/tls/cert/chain.pem
```

Command line equivalent [tls-cert-chain](./cli.md#tls-cert-chain).

### private_key

_String_. The absolute path to a TLS private key with `.pem` extension. _Required_.

```yaml
# example installer_config.yaml
tls:
  private_key: /path/to/tls/private/key.pem
```

Command line equivalent [tls-private-key](./cli.md#tls-private-key).

## jobs

_Dictionary_. Job configuration options. _Optional_. See [improving DoltLab performance](../../guides/administrator.md#improve-doltlab-performance) for more information.

- [concurrency_limit](#concurrency_limit)
- [concurrency_loop_seconds](#concurrency_loop_seconds)
- [max_retries](#max_retries)

### concurrency_limit

_Number_. The maximum number of concurrent Jobs. _Optional_.

```yaml
# example installer_config.yaml
jobs:
  concurrency_limit: 10
```

Command line equivalent [job-concurrency-limit](./cli.md#job-concurrency-limit).

### concurrency_loop_seconds

_Number_. The wait time in seconds before scheduling the next batch of jobs. _Optional_.

```yaml
# example installer_config.yaml
jobs:
  concurrency_loop_seconds: 30
```

Command line equivalent [job-concurrency-loop-seconds](#job-concurrency-loop-seconds).

### max_retries

_Number_. The maximum number of times to retry failed Jobs. _Optional_.

```yaml
# example installer_config.yaml
jobs:
  max_retries: 5
```

Command line equivalent [job-max-retries](./cli.md#job-max-retries).

## enterprise

_Dictionary_. Enterprise configuration options. _Optional_.

- [online_product_code](#online_product_code)
- [online_shared_key](#online_shared_key)
- [online_api_key](#online_api_key)
- [online_license_key](#online_license_key)
- [customize](#customize)
- [automated_backups](#automated_backups)
- [multihost](#multihost)
- [super_admins](#super_admins)
- [saml](#saml)

### online_product_code

_String_. The online product code for your Enterprise account. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  online_product_code: "myproductcode"
```

Command line equivalent [enterprise-online-product-code](./cli.md#enterprise-online-product-code).

### online_shared_key

_String_. The online shared key for your Enterprise account. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  online_shared_key: "mysharedkey"
```

Command line equivalent [enterprise-online-shared-key](./cli.md#enterprise-online-shared-key).

### online_api_key

_String_. The online api key for your Enterprise account. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  online_api_key: "myapikey"
```

Command line equivalent [enterprise-online-api-key](./cli.md#enterprise-online-api-key).

### online_license_key

_String_. The online license key for your Enterprise account. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  online_license_key: "mylicensekey"
```

Command line equivalent [enterprise-online-license-key](./cli.md#enterprise-online-license-key).

### customize

_Dictionary_. Customizable option configuration. _Optional_.

- [email_templates](#email_templates)
- [logo](#logo)
- [color_overrides](#color_overrides)

#### email_templates

_Boolean_. If true, generates email templates that can be customized. _Optional_. See [customizing DoltLab emails](../../guides/enterprise.md#customize-automated-emails) for more information.

```yaml
# example installer_config.yaml
enterprise:
  email_templates: true
```

Command line equivalent [custom-email-templates](./cli.md#custom-email-templates).

#### logo

_String_. Absolute path to custom logo file. _Optional_. See [customizing DoltLab's logo](../../guides/enterprise.md#use-custom-logo-on-doltlab-instance) for more information.

```yaml
# example installer_config.yaml
enterprise:
  logo: "/path/to/custom/logo.png"
```

Command line equivalent [custom-logo](./cli.md#custom-logo).

#### color_overrides

_Dictionary_. Color override options. _Optional_. See [customizing DoltLab colors](../../guides/enterprise.md#customize-doltlab-colors) for more information.

- [rgb_accent_1](#rgb_accent_1)
- [rgb_background_accent_1](#rgb_background_accent_1)
- [rgb_background_gradient_start](#rgb_background_gradient_start)
- [rgb_button_1](#rgb_button_1)
- [rgb_button_2](#rgb_button_2)
- [rgb_link_1](#rgb_link_1)
- [rgb_link_2](#rgb_link_2)
- [rgb_link_light](#rgb_link_light)
- [rgb_primary](#rgb_primary)
- [rgb_code_background](#rgb_code_background)

##### rgb_accent_1

_String_. Comma separated RGB color used to replace accent 1. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_accent_1: "5, 117, 245"
```

Command line equivalent [custom-color-rgb-accent-1]./cli.md(#custom-color-rgb-accent-1).

##### rgb_background_accent_1

_String_. Comma separated RGB color used to replace background accent 1. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_background_accent_1: "5, 117, 245"
```

Command line equivalent [custom-color-rgb-background-accent-1](./cli.md#custom-color-rgb-background-accent-1).

##### rgb_background_gradient_start

_String_. Comma separated RGB color used to replace background gradient start. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_background_gradient_start: "5, 117, 245"
```

Command line equivalent [custom-color-rgb-background-gradient-start](./cli.md#custom-color-rgb-background-gradient-start).

##### rgb_button_1

_String_. Comma separated RGB color used to replace button 1. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_button_1: "5, 117, 245"
```

Command line equivalent [custom-color-rgb-button-1](./cli.md#custom-color-rgb-button-1).

##### rgb_button_2

_String_. Comma separated RGB color used to replace button 2. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_button_2: "5, 117, 245"
```

Command line equivalent [custom-color-rgb-button-2](./cli.md#custom-color-rgb-button-2).

##### rgb_link_1

_String_. Comma separated RGB color used to replace link 1. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_link_1: "5, 117, 245"
```

Command line equivalent [custom-color-rgb-link-1](./cli.md#custom-color-rgb-link-1).

##### rgb_link_2

_String_. Comma separated RGB color used to replace link 2. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_link_2: "5, 117, 245"
```

Command line equivalent [custom-color-rgb-link-2](./cli.md#custom-color-rgb-link-2).

##### rgb_link_light

_String_. Comma separated RGB color used to replace link light. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_link_light: "5, 117, 245"
```

Command line equivalent [custom-color-rgb-link-light](./cli.md#custom-color-rgb-link-light).

##### rgb_primary

_String_. Comma separated RGB color used to replace primary. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_primary: "5, 117, 245"
```

Command line equivalent [custom-color-rgb-primary](./cli.md#custom-color-rgb-primary).

##### rgb_code_background

_String_. Comma separated RGB color used to replace code background. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_code_background: "5, 117, 245"
```

Command line equivalent [custom-color-rgb-code-background](./cli.md#custom-color-rgb-code-background).

### automated_backups

_Dictionary_. Automated backups options. _Optional_. See [automated backups](../../guides/enterprise.md#automated-remote-backups) for more information.

- [remote_url](#remote_url)
- [cron_schedule](#cron_schedule)
- [backup_on_boot](#backup_on_boot)
- [aws_region](#aws_region)
- [aws_profile](#aws_profile)
- [aws_shared_credentials_file](#aws_shared_credentials_file)
- [aws_config_file](#aws_config_file)
- [google_credentials_file](#google_credentials_file)
- [oci_config_file](#oci_config_file)
- [oci_key_file](#oci_key_file)

#### remote_url

_String_. Remote url for pushing `doltlabdb` backups. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    remote_url: "aws://[dolt_dynamo_table:dolt_remotes_s3_storage]/backup_name"
```

Command line equivalent [automated-dolt-backups-url](./cli.md#automated-dolt-backups-url).

#### cron_schedule

_String_. Cron schedule for backup frequency. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    cron_schedule: "*/15 * * * *"
```

Command line equivalent [automated-dolt-backups-cron-schedule](./cli.md#automated-dolt-backups-cron-schedule).

#### backup_on_boot

_Boolean_. If true, creates first backup when DoltLab is started. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    backup_on_boot: true
```

Command line equivalent [automated-dolt-backups-backup-on-boot](./cli.md#automated-dolt-backups-backup-on-boot).

#### aws_region

_String_. AWS region. _Required_ if `remote_url` has scheme `aws://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    aws_region: "us-west-2"
```

Command line equivalent [aws-region](./cli.md#aws-region).

#### aws_profile

_String_. AWS profile name. _Required_ if `remote_url` has scheme `aws://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    aws_profile: "doltlab_backuper"
```

Command line equivalent [aws-profile](./cli.md#aws-profile).

#### aws_shared_credentials_file

_String_. Absolute path to AWS shared credentials file. _Required_ if `remote_url` has scheme `aws://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    aws_shared_credentials_file: "/absolute/path/to/aws/credentials"
```

Command line equivalent [aws-shared-credentials-file](./cli.md#aws-shared-credentials-file).

#### aws_config_file

_String_. Absolute path to AWS config file. _Required_ if `remote_url` has scheme `aws://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    aws_config_file: "/absolute/path/to/aws/config"
```

Command line equivalent [aws-config-file](./cli.md#aws-config-file).

#### google_credentials_file

_String_. Absolute path to Google cloud application credentials file. _Required_ if `remote_url` has scheme `gs://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    google_credentials_file: "/absolute/path/to/gcloud/credentials"
```

Command line equivalent [google-creds-file](./cli.md#google-creds-file).

#### oci_config_file

_String_. Absolute path to Oracle cloud configuration file. _Required_ if `remote_url` has scheme `oci://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    oci_config_file: "/absolute/path/to/oci/config"
```

Command line equivalent [oci-config-file](./cli.md#oci-config-file).

#### oci_key_file

_String_. Absolute path to Oracle cloud key file. _Required_ if `remote_url` has scheme `oci://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    oci_key_file: "/absolute/path/to/oci/key"
```

Command line equivalent [oci-key-file](./cli.md#oci-key-file).

### multihost

_Dictionary_. Multi-host deployment options. _Optional_. See [configuring multi-host deployments](../../guides/enterprise.md#deploy-doltlab-across-multiple-hosts) for more information.

- [doltlabdb_only](#doltlabdb_only)
- [doltlabapi_only](#doltlabapi_only)
- [doltlabremoteapi_only](#doltlabremoteapi_only)
- [doltlabfileserviceapi_only](#doltlabfileserviceapi_only)
- [doltlabgraphql_only](#doltlabgraphql_only)
- [doltlabui_only](#doltlabui_only)

#### doltlabdb_only

_Boolean_. If true, makes deployment the `doltlabdb` service only. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  multihost:
    doltlabdb_only: true
```

Command line equivalent [doltlabdb-only](./cli.md#doltlabdb-only).

#### doltlabapi_only

_Boolean_. If true, makes deployment the `doltlabapi` service only. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  multihost:
    doltlabapi_only: true
```

Command line equivalent [doltlabapi-only](./cli.md#doltlabapi-only).

#### doltlabremoteapi_only

_Boolean_. If true, makes deployment the `doltlabremoteapi` service only. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  multihost:
    doltlabremoteapi_only: true
```

Command line equivalent [doltlabremoteapi-only](./cli.md#doltlabremoteapi-only).

#### doltlabfileserviceapi_only

_Boolean_. If true, makes deployment the `doltlabfileserviceapi` service only. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  multihost:
    doltlabfileserviceapi_only: true
```

Command line equivalent [doltlabfileserviceapi-only](./cli.md#doltlabfileserviceapi-only).

#### doltlabgraphql_only

_Boolean_. If true, makes deployment the `doltlabgraphql` service only. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  multihost:
    doltlabgraphql_only: true
```

Command line equivalent [doltlabgraphql-only](./cli.md#doltlabgraphql-only).

#### doltlabui_only

_Boolean_. If true, makes deployment the `doltlabui` service only. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  multihost:
    doltlabui_only: true
```

Command line equivalent [doltlabui-only](./cli.md#doltlabui-only).

#### super_admins

_String_ _Array_. Email addresses for users granted "super admin" privileges.

```yaml
# example installer_config.yaml
enterprise:
  super_admins: ["admin1@email.com", "admin2@gmail.com"]
```

Command line equivalent [super-admin-email](./cli.md#super-admin-email).

## saml

_Dictionary_. Saml single-sign-on options. _Optional_. See [saml configuration](../../guides/enterprise.md#configure-saml-single-sign-on) for more information.

- [metadata_descriptor_file](#metadata_descriptor_file)
- [cert_common_name](#cert_common_name)

### metadata_descriptor_file

_String_. Absolute path to metadata descriptor file. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  saml:
    metadata_descriptor_file: "/absolute/path/to/metadata/descriptor/file"
```

Command line equivalent [sso-saml-metadata-descriptor](./cli.md#sso-saml-metadata-descriptor).

### cert_common_name

_String_. Common name to use in generated SAML certificate. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  saml:
    cert_common_name: "mydoltlabcommonname"
```

Command line equivalent [sso-saml-cert-common-name](./cli.md#sso-saml-cert-common-name).
