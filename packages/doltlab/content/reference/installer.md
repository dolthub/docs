---
title: Installer
---

DoltLab ships with a binary called `installer` that serves as the primary interface for configuring a DoltLab deployment.

The `installer` uses a configuration file shipped with DoltLab called `installer_config.yaml`, as well as command line flags, to generate the static assets DoltLab needs to be deployed. Each field of the configuration file has a corresponding command line flag argument. Command line arguments take priority over related fields defined in the configuration file.

# Configuration File Reference

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

- [version](#installer-config-reference-version)
- [host](#installer-config-reference-host)
- [docker_network](#installer-config-reference-docker-network)
- [metrics_disabled](#installer-config-reference-metrics-disabled)
- [whitelist_all_users](#installer-config-whitelist-all-users)
- [services](#installer-config-reference-services)
- [default_user](#installer-config-reference-default-user)
- [smtp](#installer-config-reference-smtp)
- [scheme](#installer-config-reference-scheme)
- [tls](#installer-config-reference-tls)
- [jobs](#installer-config-reference-jobs)
- [enterprise](#installer-config-reference-enterprise)

<h2 id="installer-config-reference-version">version</h2>

_String_. The version of the configuration file and DoltLab. _Required_.

```yaml
# installer_config.yaml
version: v2.1.4
```

<h2 id="installer-config-reference-host">host</h2>

_String_. The hostname or IP address of the host running DoltLab. _Required_.

```yaml
# example installer_config.yaml
host: mydoltlab.mycompany.com
```

```yaml
# example installer_config.yaml
host: 123.456.78.90
```

Command line equivalent [--host](#host).

<h2 id="installer-config-reference-docker-network">docker_network</h2>

_String_. The name of the docker network used for DoltLab, defaults to `doltlab`. _Optional_.

```yaml
# example installer_config.yaml
docker_network: doltlab
```

Command line equivalent [--docker-network](#docker-network).

<h2 id="installer-config-reference-metrics-disabled">metrics_disabled</h2>

_Boolean_. If true, disables first party usage metrics for a DoltLab instance, defaults to `false`. _Optional_.

```yaml
# example installer_config.yaml
metrics_disabled: false
```

Command line equivalent [--disable-usage-metrics](#disable-usage-metrics).

<h2 id="installer-config-reference-whitelist-all-users">whitelist_all_users</h2>

_Boolean_. If true, allows any user to create an account on a DoltLab instance, defaults to `true`. _Optional_

```yaml
# example installer_config.yaml
whitelist_all_users: true
```

See [prevent unauthorized user account creation](#prevent-unauthorized-users) for more information.

Command line equivalent [--white-list-all-users](#white-list-all-users).

<h2 id="installer-config-reference-services">services</h2>

_Dictionary_. Configuration options for DoltLab's various services. `doltlabdb` passwords are _Required_ in single host deployments, other service definitions are _Required_ for multi-host deployments.

- [doltlabdb](#installer-config-reference-services-doltlabdb)
- [doltlabapi](#installer-config-reference-services-doltlabapi)
- [doltlabremoteapi](#installer-config-reference-services-doltlabremoteapi)
- [doltlabfileserviceapi](#installer-config-reference-services-doltlabfileserviceapi)
- [doltlabgraphql](#installer-config-reference-services-doltlabgraphql)
- [doltlabui](#installer-config-reference-services-doltlabui)

<h4 id="installer-config-reference-services-doltlabdb">doltlabdb</h4>

_Dictionary_. Configuration options for `doltlabdb`.

- [host](#installer-config-reference-services-doltlabdb-host)
- [port](#installer-config-reference-services-doltlabdb-port)
- [admin_password](#installer-config-reference-services-doltlabdb-admin-password)
- [dolthubapi_password](#installer-config-reference-services-doltlabdb-dolthubapi-password)

<h4 id="installer-config-reference-services-doltlabdb-host">host</h4>

_String_. The host name or IP address of the host running `doltlabdb`. _Required_ for [configuring an external application database](../guides/administrator.md#use-external-database) and for multi-host deployments.

```yaml
# example installer_config.yaml
services:
  doltlabdb:
    host: "127.0.0.1"
```

Command line equivalent [--doltlabdb-host](#doltlabdb-host).

<h4 id="installer-config-reference-services-doltlabdb-port">port</h4>

_Number_. The port for `doltlabdb`. _Required_ for [configuring an external application database](../guides/administrator.md#use-external-database) and for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabdb:
    port: 3306
```

Command line equivalent [--doltlabdb-port](#doltlabdb-port).

<h4 id="installer-config-reference-services-doltlabdb-admin-password">admin_password</h4>

_String_. The password used to for creating user `dolthubadmin` in DoltLab's application database. _Required_.

```yaml
# example installer_config.yaml
services:
  doltlabdb:
    admin_password: "mypassword"
```

Command line equivalent [--doltlabdb-admin-password](#doltlabdb-admin-password).

<h4 id="installer-config-reference-services-doltlabdb-dolthubapi-password">dolthubapi_password</h4>

_String_. The password used to for creating user `dolthubapi` in DoltLab's application database. _Required_.

```yaml
# example installer_config.yaml
services:
  doltlabdb:
    dolthubapi_password: mypassword
```

Command line equivalent [--doltlabdb-dolthubapi-password](#doltlabdb-dolthubapi-password).

<h4 id="installer-config-reference-services-doltlabapi">doltlabapi</h4>

_Dictionary_. Configuration options for `doltlabapi`.

- [host](#installer-config-reference-services-doltlabapi-host)
- [port](#installer-config-reference-services-doltlabapi-port)
- [csv_port](#installer-config-reference-services-doltlabapi-csv-port)

<h4 id="installer-config-reference-services-doltlabapi-host">host</h4>

_String_. The host name or IP address of the host running `doltlabapi`. _Required_ for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabapi:
    host: "127.0.0.1"
```

Command line equivalent [--doltlabapi-host](#doltlabapi-host).

<h4 id="installer-config-reference-services-doltlabapi-port">port</h4>

_Number_. The port for `doltlabapi`. _Required_ for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabapi:
    port: 3306
```

Command line equivalent [--doltlabapi-port](#doltlabapi-port).

<h4 id="installer-config-reference-services-doltlabapi-csv-port">csv_port</h4>

_Number_. The port for `doltlabapi`'s csv service. _Required_ for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabapi:
    csv_port: 3306
```

Command line equivalent [--doltlabapi-csv-port](#doltlabapi-csv-port).

<h4 id="installer-config-reference-services-doltlabremoteapi">doltlabremoteapi</h4>

_Dictionary_. Configuration options for `doltlabremoteapi`.

- [host](#installer-config-reference-services-doltlabremoteapi-host)
- [port](#installer-config-reference-services-doltlabremoteapi-port)
- [file_server_port](#installer-config-reference-services-doltlabremoteapi-file-server-port)

<h4 id="installer-config-reference-services-doltlabremoteapi-host">host</h4>

_String_. The host name or IP address of the host running `doltlabremoteapi`. _Required_ for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabremoteapi:
    host: "127.0.0.1"
```

Command line equivalent [--doltlabremoteapi-host](#doltlabremoteapi-host).

<h4 id="installer-config-reference-services-doltlabremoteapi-port">port</h4>

_Number_. The port for `doltlabremoteapi`. _Required_ for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabremoteapi:
    port: 3306
```

Command line equivalent [--doltlabremoteapi-port](#doltlabremoteapi-port).

<h4 id="installer-config-reference-services-doltlabremoteapi-file-server-port">port</h4>

_Number_. The port for `doltlabremoteapi`'s file server. _Required_ for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabremoteapi:
    file_server_port: 100
```

Command line equivalent [--doltlabremoteapi-file-server-port](#doltlabremoteapi-file-server-port).

<h4 id="installer-config-reference-services-doltlabfileserviceapi">doltlabfileserviceapi</h4>

_Dictionary_. Configuration options for `doltlabapifileserviceapi`.

- [host](#installer-config-reference-services-doltlabfileserviceapi-host)
- [port](#installer-config-reference-services-doltlabfileserviceapi-port)

<h4 id="installer-config-reference-services-doltlabfileserviceapi-host">host</h4>

_String_. The host name or IP address of the host running `doltlabfileserviceapi`. _Required_ for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabfileserviceapi:
    host: "127.0.0.1"
```

Command line equivalent [--doltlabfileserviceapi-host](#doltlabfileserviceapi-host).

<h4 id="installer-config-reference-services-doltlabfileserviceapi-port">port</h4>

_Number_. The port for `doltlabfileserviceapi`. _Required_ for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabfileserviceapi:
    port: 4321
```

Command line equivalent [--doltlabfileserviceapi-port](#doltlabfileserviceapi-port).

<h4 id="installer-config-reference-services-doltlabgraphql">doltlabgraphql</h4>

_Dictionary_. Configuration options for `doltlabgraphql`.

- [host](#installer-config-reference-services-doltlabgraphql-host)
- [port](#installer-config-reference-services-doltlabgraphql-port)

<h4 id="installer-config-reference-services-doltlabgraphql-host">host</h4>

_String_. The host name or IP address of the host running `doltlabgraphql`. _Required_ for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabgraphql:
    host: "127.0.0.1"
```

Command line equivalent [--doltlabgraphql-host](#doltlabgraphql-host).

<h4 id="installer-config-reference-services-doltlabgraphql-port">port</h4>

_Number_. The port for `doltlabgraphql`. _Required_ for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabgraphql:
    port: 9000
```

Command line equivalent [--doltlabgraphql-port](#doltlabgraphql-port).

<h4 id="installer-config-reference-services-doltlabui">doltlabui</h4>

_Dictionary_. Configuration options for `doltlabui`.

- [host](#installer-config-reference-services-doltlabui-host)
- [port](#installer-config-reference-services-doltlabui-port)

<h4 id="installer-config-reference-services-doltlabui-host">host</h4>

_String_. The host name or IP address of the host running `doltlabui`. _Required_ for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabui:
    host: "127.0.0.1"
```

Command line equivalent [--doltlabui-host](#doltlabui-host).

<h4 id="installer-config-reference-services-doltlabui-port">port</h4>

_Number_. The port for `doltlabui`. _Required_ for [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment).

```yaml
# example installer_config.yaml
services:
  doltlabui:
    port: 80
```

Command line equivalent [--doltlabui-port](#doltlabui-port).

<h2 id="installer-config-reference-default-user">default_user</h2>

_Dictionary_. Configuration options for DoltLab's default user. _Required_.

- [name](#installer-config-reference-services-default-user-name)
- [password](#installer-config-reference-services-default-user-password)
- [email](#installer-config-reference-services-default-user-email)

<h4 id="installer-config-reference-default-user-name">name</h4>

_String_. The username of the default user. _Required_.

```yaml
# example installer_config.yaml
default_user:
  name: admin
```

Command line equivalent [--default-user](#default-user).

<h4 id="installer-config-reference-default-user-password">password</h4>

_String_. The password of the default user. _Required_.

```yaml
# example installer_config.yaml
default_user:
  password: mypassword
```

Command line equivalent [--default-user-password](#default-user-password).

<h4 id="installer-config-reference-default-user-email">email</h4>

_String_. The email address of the default user. _Required_.

```yaml
# example installer_config.yaml
default_user:
  email: admin@localhost
```

Command line equivalent [--default-user-email](#default-user-email).

<h2 id="installer-config-reference-smtp">smtp</h2>

_Dictionary_. The configuration options for an external SMTP server. _Optional_. See [connecting DoltLab to an SMTP server](#connect-smtp-server) for more information.

- [auth_method](#installer-config-reference-smtp-auth-method)
- [host](#installer-config-reference-smtp-host)
- [port](#installer-config-reference-smtp-port)
- [no_reply_email](#installer-config-reference-smtp-no-reply-email)
- [username](#installer-config-reference-smtp-username)
- [password](#installer-config-reference-smtp-password)
- [oauth_token](#installer-config-reference-smtp-oauth-token)
- [identity](#installer-config-reference-smtp-identity)
- [trace](#installer-config-reference-smtp-trace)
- [implicit_tls](#installer-config-reference-smtp-implicit-tls)
- [insecure_tls](#installer-config-reference-smtp-insecure-tls)

<h4 id="installer-config-reference-smtp-auth-method">auth_method</h4>

_String_. The authentication method used by the SMTP server. _Required_. One of `plain`, `login`, `oauthbearer`, `anonymous`, `external`, and `disable`.

```yaml
# example installer_config.yaml
smtp:
  auth_method: plain
```

Command line equivalent [--smtp-auth-method](#smtp-auth-method).

<h4 id="installer-config-reference-smtp-host">host</h4>

_String_. The host name of the SMTP server. _Required_.

```yaml
# example installer_config.yaml
smtp:
  host: smtp.gmail.com
```

Command line equivalent [--smtp-host](#smtp-host).

<h4 id="installer-config-reference-smtp-port">port</h4>

_Number_. The port of the SMTP server. _Required_.

```yaml
# example installer_config.yaml
smtp:
  port: 587
```

Command line equivalent [--smtp-port](#smtp-port).

<h4 id="installer-config-reference-smtp-no-reply-email">no_reply_email</h4>

_String_. The email address used to send emails from DoltLab. _Required_.

```yaml
# example installer_config.yaml
smtp:
  no_reply_email: admin@localhost
```

Command line equivalent [--no-reply-email](#no-reply-email).

<h4 id="installer-config-reference-smtp-username">username</h4>

_String_. The username used for connecting to the SMTP server. _Required_ for `auth_method` `login` and `plain`.

```yaml
# example installer_config.yaml
smtp:
  username: mysmtpusername
```

Command line equivalent [--smtp-username](#smtp-username).

<h4 id="installer-config-reference-smtp-password">password</h4>

_String_. The password used for connecting to the SMTP server. _Required_ for `auth_method` `login` and `plain`.

```yaml
# example installer_config.yaml
smtp:
  password: mypassword
```

Command line equivalent [--smtp-password](#smtp-password).

<h4 id="installer-config-reference-smtp-oauth-token">oauth_token</h4>

_String_. The oauth token used for connecting to the SMTP server. _Required_ for `auth_method` `oauthbearer`.

```yaml
# example installer_config.yaml
smtp:
  oauth_token: myoauthtoken
```

Command line equivalent [--smtp-oauth-token](#smtp-oauth-token).

<h4 id="installer-config-reference-smtp-identity">identity</h4>

_String_. The SMTP server identity. _Optional_. See [connecting DoltLab to an SMTP server](#connect-smtp-server) for more information.

```yaml
# example installer_config.yaml
smtp:
  identity: mysmtpidentity
```

Command line equivalent [--smtp-identity](#smtp-identity).

<h4 id="installer-config-reference-smtp-trace">trace</h4>

_String_. The SMTP server trace. _Optional_. See [connecting DoltLab to an SMTP server](#connect-smtp-server) for more information.

```yaml
# example installer_config.yaml
smtp:
  trace: mysmtptrace
```

Command line equivalent [--smtp-trace](#smtp-trace).

<h4 id="installer-config-reference-smtp-implicit-tls">implicit_tls</h4>

_Boolean_. If true, uses implicit TLS to connect to the SMTP server. _Optional_. See [connecting DoltLab to an SMTP server](#connect-smtp-server) for more information.

```yaml
# example installer_config.yaml
smtp:
  implicit_tls: false
```

Command line equivalent [--smtp-implicit-tls](#smtp-implicit-tls).

<h4 id="installer-config-reference-smtp-insecure-tls">insecure_tls</h4>

_Boolean_. If true, uses insecure TLS to connect to the SMTP server. _Optional_. See [connecting DoltLab to an SMTP server](#connect-smtp-server) for more information.

```yaml
# example installer_config.yaml
smtp:
  insecure_tls: false
```

Command line equivalent [--smtp-insecure-tls](#smtp-insecure-tls).

<h2 id="installer-config-reference-scheme">scheme</h2>

_String_. The HTTP scheme of the DoltLab deployment, defaults to `http`. _Optional_.

```yaml
# example installer_config.yaml
scheme: http
```

See [how to serve DoltLab over HTTPS](#doltlab-https-natively) for more information.

Command line equivalent [--scheme](#scheme).

<h2 id="installer-config-reference-tls">tls</h2>

_Dictionary_. TLS configuration options. _Optional_. See [serving DoltLab natively over HTTPS](doltlab-https-natively) for more information.

- [cert_chain](#installer-config-reference-tls-cert-chain)
- [private_key](installer-config-reference-tls-private-key)

<h4 id="installer-config-reference-tls-cert-chain">cert_chain</h4>

_String_. The absolute path to a TLS certificate chain with `.pem` extension. _Required_.

```yaml
# example installer_config.yaml
tls:
  cert_chain: /path/to/tls/cert/chain.pem
```

Command line equivalent [--tls-cert-chain](#tls-cert-chain).

<h4 id="installer-config-reference-tls-private-key">private_key</h4>

_String_. The absolute path to a TLS private key with `.pem` extension. _Required_.

```yaml
# example installer_config.yaml
tls:
  private_key: /path/to/tls/private/key.pem
```

Command line equivalent [--tls-private-key](#tls-private-key).

<h2 id="installer-config-reference-jobs">jobs</h2>

_Dictionary_. Job configuration options. _Optional_. See [improving DoltLab performance](#doltlab-performance) for more information.

- [concurrency_limit](#installer-config-reference-jobs-concurrency-limit)
- [concurrency_loop_seconds](#installer-config-reference-jobs-concurrency-loop-seconds)
- [max_retries](#installer-config-reference-jobs-max-retries)

<h4 id="installer-config-reference-jobs-concurrency-limit">concurrency_limit</h4>

_Number_. The maximum number of concurrent Jobs. _Optional_.

```yaml
# example installer_config.yaml
jobs:
  concurrency_limit: 10
```

Command line equivalent [--job-concurrency-limit](#job-concurrency-limit).

<h4 id="installer-config-reference-jobs-concurrency-loop-seconds">concurrency_loop_seconds</h4>

_Number_. The wait time in seconds before scheduling the next batch of jobs. _Optional_.

```yaml
# example installer_config.yaml
jobs:
  concurrency_loop_seconds: 30
```

Command line equivalent [--job-concurrency-loop-seconds](#job-concurrency-loop-seconds).

<h4 id="installer-config-reference-jobs-max-retries">max_retries</h4>

_Number_. The maximum number of times to retry failed Jobs. _Optional_.

```yaml
# example installer_config.yaml
jobs:
  max_retries: 5
```

Command line equivalent [--job-max-retries](#job-max-retries).

<h2 id="installer-config-reference-enterprise">enterprise</h2>

_Dictionary_. Enterprise configuration options. _Optional_.

- [online_product_code](#installer-config-reference-enterprise-online-product-code)
- [online_shared_key](#installer-config-reference-enterprise-online-shared-key)
- [online_api_key](#installer-config-reference-enterprise-online-api-key)
- [online_license_key](#installer-config-reference-enterprise-online-license-key)
- [customize](#installer-config-reference-enterprise-customize)
- [automated_backups](#installer-config-reference-enterprise-automated-backups)
- [multihost](#installer-config-reference-enterprise-multihost)
- [super_admins](#installer-config-reference-enterprise-super-admins)
- [saml](#installer-config-reference-enterprise-saml)

<h4 id="installer-config-reference-enterprise-online-product-code">online_product_code</h4>

_String_. The online product code for your Enterprise account. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  online_product_code: "myproductcode"
```

Command line equivalent [--enterprise-online-product-code](#enterprise-online-product-code).

<h4 id="installer-config-reference-enterprise-online-shared-key">online_shared_key</h4>

_String_. The online shared key for your Enterprise account. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  online_shared_key: "mysharedkey"
```

Command line equivalent [--enterprise-online-shared-key](#enterprise-online-shared-key).

<h4 id="installer-config-reference-enterprise-online-api-key">online_api_key</h4>

_String_. The online api key for your Enterprise account. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  online_api_key: "myapikey"
```

Command line equivalent [--enterprise-online-api-key](#enterprise-online-api-key).

<h4 id="installer-config-reference-enterprise-online-license-key">online_license_key</h4>

_String_. The online license key for your Enterprise account. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  online_license_key: "mylicensekey"
```

Command line equivalent [--enterprise-online-license-key](#enterprise-online-license-key).

<h4 id="installer-config-reference-enterprise-customize">customize</h4>

_Dictionary_. Customizable option configuration. _Optional_.

- [email_templates](#installer-config-reference-enterprise-customize-email-templates)
- [logo](#installer-config-reference-enterprise-customize-logo)
- [color_overrides](#installer-config-reference-enterprise-customize-color-overrides)

<h4 id="installer-config-reference-enterprise-customize-email-templates">email_templates</h4>

_Boolean_. If true, generates email templates that can be customized. _Optional_. See [customizing DoltLab emails](../guides/enterprise.md#customize-automated-emails) for more information.

```yaml
# example installer_config.yaml
enterprise:
  email_templates: true
```

Command line equivalent [--custom-email-templates](#custom-email-templates).

<h4 id="installer-config-reference-enterprise-customize-logo">logo</h4>

_String_. Absolute path to custom logo file. _Optional_. See [customizing DoltLab's logo](../guides/enterprise.md#use-custom-logo) for more information.

```yaml
# example installer_config.yaml
enterprise:
  logo: "/path/to/custom/logo.png"
```

Command line equivalent [--custom-logo](#custom-logo).

<h4 id="installer-config-reference-enterprise-customize-color-overrides">color_overrides</h4>

_Dictionary_. Color override options. _Optional_. See [customizing DoltLab colors](../guides/enterprise.md#customize-colors) for more information.

- [rgb_accent_1](#installer-config-reference-enterprise-color-overrides-rgb-accent-1)
- [rgb_background_accent_1](#installer-config-reference-enterprise-color-overrides-rgb-background-accent-1)
- [rgb_background_gradient_start](#installer-config-reference-enterprise-color-overrides-rgb-background-gradient-start)
- [rgb_button_1](#installer-config-reference-enterprise-color-overrides-rgb-button-1)
- [rgb_button_2](#installer-config-reference-enterprise-color-overrides-rgb-button-2)
- [rgb_link_1](#installer-config-reference-enterprise-color-overrides-rgb-link-1)
- [rgb_link_2](#installer-config-reference-enterprise-color-overrides-rgb-link-2)
- [rgb_link_light](#installer-config-reference-enterprise-color-overrides-rgb-link-light)

<h4 id="installer-config-reference-enterprise-color-overrides-rgb-accent-1">rgb_accent_1</h4>

_String_. Comma separated RGB color used to replace accent 1. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_accent_1: "5, 117, 245"
```

Command line equivalent [--custom-color-rgb-accent-1](#custom-color-rgb-accent-1).

<h4 id="installer-config-reference-enterprise-color-overrides-rgb-background-accent-1">rgb_background_accent_1</h4>

_String_. Comma separated RGB color used to replace background accent 1. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_background_accent_1: "5, 117, 245"
```

Command line equivalent [--custom-color-rgb-background-accent-1](#custom-color-rgb-background-accent-1).

<h4 id="installer-config-reference-enterprise-color-overrides-rgb-background-gradient-start">rgb_background_gradient_start</h4>

_String_. Comma separated RGB color used to replace background gradient start. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_background_gradient_start: "5, 117, 245"
```

Command line equivalent [--custom-color-rgb-background-gradient-start](#custom-color-rgb-background-gradient-start).

<h4 id="installer-config-reference-enterprise-color-overrides-rgb-button-1">rgb_button_1</h4>

_String_. Comma separated RGB color used to replace button 1. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_button_1: "5, 117, 245"
```

Command line equivalent [--custom-color-rgb-button-1](#custom-color-rgb-button-1).

<h4 id="installer-config-reference-enterprise-color-overrides-rgb-button-2">rgb_button_2</h4>

_String_. Comma separated RGB color used to replace button 2. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_button_2: "5, 117, 245"
```

Command line equivalent [--custom-color-rgb-button-2](#custom-color-rgb-button-2).

<h4 id="installer-config-reference-enterprise-color-overrides-rgb-link-1">rgb_link_1</h4>

_String_. Comma separated RGB color used to replace link 1. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_link_1: "5, 117, 245"
```

Command line equivalent [--custom-color-rgb-link-1](#custom-color-rgb-link-1).

<h4 id="installer-config-reference-enterprise-color-overrides-rgb-link-2">rgb_link_2</h4>

_String_. Comma separated RGB color used to replace link 2. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_link_2: "5, 117, 245"
```

Command line equivalent [--custom-color-rgb-link-2](#custom-color-rgb-link-2).

<h4 id="installer-config-reference-enterprise-color-overrides-rgb-link-light">rgb_link_light</h4>

_String_. Comma separated RGB color used to replace link light. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  customize:
    color_overrides:
      rgb_link_light: "5, 117, 245"
```

Command line equivalent [--custom-color-rgb-link-light](#custom-color-rgb-link-light).

<h4 id="installer-config-reference-enterprise-automated-backups">automated_backups</h4>

_Dictionary_. Automated backups options. _Optional_. See [automated backups](../guides/enterprise.md#doltlab-automated-backups) for more information.

- [remote_url](#installer-config-reference-enterprise-automated-backups-remote-url)
- [cron_schedule](#installer-config-reference-enterprise-automated-backups-cron-schedule)
- [backup_on_boot](#installer-config-reference-enterprise-automated-backups-backup-on-boot)
- [aws_region](#installer-config-reference-enterprise-automated-backups-aws-region)
- [aws_profile](#installer-config-reference-enterprise-automated-backups-aws-profile)
- [aws_shared_credentials_file](#installer-config-reference-enterprise-automated-backups-aws-shared-credentials-file)
- [aws_config_file](#installer-config-reference-enterprise-automated-backups-aws-config-file)
- [google_credentials_file](#installer-config-reference-enterprise-automated-backups-google-credentials-file)
- [oci_config_file](#installer-config-reference-enterprise-automated-backups-oci-config-file)
- [oci_key_file](#installer-config-reference-enterprise-automated-backups-oci-key-file)

<h4 id="installer-config-reference-enterprise-automated-backups-remote-url">remote_url</h4>

_String_. Remote url for pushing `doltlabdb` backups. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    remote_url: "aws://[dolt_dynamo_table:dolt_remotes_s3_storage]/backup_name"
```

Command line equivalent [--automated-dolt-backups-url](#automated-dolt-backups-url).

<h4 id="installer-config-reference-enterprise-automated-backups-cron-schedule">cron_schedule</h4>

_String_. Cron schedule for backup frequency. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    cron_schedule: "*/15 * * * *"
```

Command line equivalent [--automated-dolt-backups-cron-schedule](#automated-dolt-backups-cron-schedule).

<h4 id="installer-config-reference-enterprise-automated-backups-backup-on-boot">backup_on_boot</h4>

_Boolean_. If true, creates first backup when DoltLab is started. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    backup_on_boot: true
```

Command line equivalent [--automated-dolt-backups-backup-on-boot](#automated-dolt-backups-backup-on-boot).

<h4 id="installer-config-reference-enterprise-automated-backups-aws-region">aws_region</h4>

_String_. AWS region. _Required_ if `remote_url` has scheme `aws://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    aws_region: "us-west-2"
```

Command line equivalent [--aws-region](#aws-region).

<h4 id="installer-config-reference-enterprise-automated-backups-aws-profile">aws_profile</h4>

_String_. AWS profile name. _Required_ if `remote_url` has scheme `aws://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    aws_profile: "doltlab_backuper"
```

Command line equivalent [--aws-profile](#aws-profile).

<h4 id="installer-config-reference-enterprise-automated-backups-aws-shared-credentials-file">aws_shared_credentials_file</h4>

_String_. Absolute path to AWS shared credentials file. _Required_ if `remote_url` has scheme `aws://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    aws_shared_credentials_file: "/absolute/path/to/aws/credentials"
```

Command line equivalent [--aws-shared-credentials-file](#aws-shared-credentials-file).

<h4 id="installer-config-reference-enterprise-automated-backups-aws-config-file">aws_config_file</h4>

_String_. Absolute path to AWS config file. _Required_ if `remote_url` has scheme `aws://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    aws_config_file: "/absolute/path/to/aws/config"
```

Command line equivalent [--aws-config-file](#aws-config-file).

<h4 id="installer-config-reference-enterprise-automated-backups-google-credentials-file">google_credentials_file</h4>

_String_. Absolute path to Google cloud application credentials file. _Required_ if `remote_url` has scheme `gs://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    google_credentials_file: "/absolute/path/to/gcloud/credentials"
```

Command line equivalent [--google-creds-file](#google-creds-file).

<h4 id="installer-config-reference-enterprise-automated-backups-oci-config-file">oci_config_file</h4>

_String_. Absolute path to Oracle cloud configuration file. _Required_ if `remote_url` has scheme `oci://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    oci_config_file: "/absolute/path/to/oci/config"
```

Command line equivalent [--oci-config-file](#oci-config-file).

<h4 id="installer-config-reference-enterprise-automated-backups-oci-key-file">oci_key_file</h4>

_String_. Absolute path to Oracle cloud key file. _Required_ if `remote_url` has scheme `oci://`.

```yaml
# example installer_config.yaml
enterprise:
  automated_backups:
    oci_key_file: "/absolute/path/to/oci/key"
```

Command line equivalent [--oci-key-file](#oci-key-file).

<h4 id="installer-config-reference-enterprise-multihost">multihost</h4>

_Dictionary_. Multi-host deployment options. _Optional_. See [configuring multi-host deployments](../guides/enterprise.md#multihost-deployment) for more information.

- [doltlabdb_only](#installer-config-reference-enterprise-multihost-doltlabdb-only)
- [doltlabapi_only](#installer-config-reference-enterprise-multihost-doltlabapi-only)
- [doltlabremoteapi_only](#installer-config-reference-enterprise-multihost-doltlabremoteapi-only)
- [doltlabfileserviceapi_only](#installer-config-reference-enterprise-multihost-doltlabfileserviceapi-only)
- [doltlabgraphql_only](#installer-config-reference-enterprise-multihost-doltlabgraphql-only)
- [doltlabui_only](#installer-config-reference-enterprise-multihost-doltlabui-only)

<h4 id="installer-config-reference-enterprise-multihost-doltlabdb-only">doltlabdb_only</h4>

_Boolean_. If true, makes deployment the `doltlabdb` service only. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  multihost:
    doltlabdb_only: true
```

Command line equivalent [--doltlabdb-only](#doltlabdb-only).

<h4 id="installer-config-reference-enterprise-multihost-doltlabapi-only">doltlabapi_only</h4>

_Boolean_. If true, makes deployment the `doltlabapi` service only. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  multihost:
    doltlabapi_only: true
```

Command line equivalent [--doltlabapi-only](#doltlabapi-only).

<h4 id="installer-config-reference-enterprise-multihost-doltlabremoteapi-only">doltlabremoteapi_only</h4>

_Boolean_. If true, makes deployment the `doltlabremoteapi` service only. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  multihost:
    doltlabremoteapi_only: true
```

Command line equivalent [--doltlabremoteapi-only](#doltlabremoteapi-only).

<h4 id="installer-config-reference-enterprise-multihost-doltlabfileserviceapi-only">doltlabfileserviceapi_only</h4>

_Boolean_. If true, makes deployment the `doltlabfileserviceapi` service only. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  multihost:
    doltlabfileserviceapi_only: true
```

Command line equivalent [--doltlabfileserviceapi-only](#doltlabfileserviceapi-only).

<h4 id="installer-config-reference-enterprise-multihost-doltlabgraphql-only">doltlabgraphql_only</h4>

_Boolean_. If true, makes deployment the `doltlabgraphql` service only. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  multihost:
    doltlabgraphql_only: true
```

Command line equivalent [--doltlabgraphql-only](#doltlabgraphql-only).

<h4 id="installer-config-reference-enterprise-multihost-doltlabui-only">doltlabui_only</h4>

_Boolean_. If true, makes deployment the `doltlabui` service only. _Optional_.

```yaml
# example installer_config.yaml
enterprise:
  multihost:
    doltlabui_only: true
```

Command line equivalent [--doltlabui-only](#doltlabui-only).

<h4 id="installer-config-reference-enterprise-super-admins">super_admins</h4>

_String_ _Array_. Email addresses for users granted "super admin" privileges.

```yaml
# example installer_config.yaml
enterprise:
  super_admins: ["admin1@email.com", "admin2@gmail.com"]
```

Command line equivalent [--super-admin-email](#super-admin-email).

<h4 id="installer-config-reference-enterprise-saml">saml</h4>

_Dictionary_. Saml single-sign-on options. _Optional_. See [saml configuration](../guides/enterprise.md#doltlab-single-sign-on) for more information.

- [metadata_descriptor_file](#installer-config-reference-enterprise-saml-metadata-descriptor-file)
- [cert_common_name](#installer-config-reference-enterprise-saml-cert-common-name)

<h4 id="installer-config-reference-enterprise-saml-metadata-descriptor-file">metadata_descriptor_file</h4>

_String_. Absolute path to metadata descriptor file. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  saml:
    metadata_descriptor_file: "/absolute/path/to/metadata/descriptor/file"
```

Command line equivalent [--sso-saml-metadata-descriptor](#sso-saml-metadata-descriptor).

<h4 id="installer-config-reference-enterprise-saml-cert-common-name">cert_common_name</h4>

_String_. Common name to use in generated SAML certificate. _Required_.

```yaml
# example installer_config.yaml
enterprise:
  saml:
    cert_common_name: "mydoltlabcommonname"
```

Command line equivalent [--sso-saml-cert-common-name](#sso-saml-cert-common-name).

# Command Line Interface Reference

```bash
Usage of ./installer:
  -automated-dolt-backups-backup-on-boot
    	if true, will create a backup when the backup-syncer service comes online, DoltLab Enterprise only (default true)
  -automated-dolt-backups-cron-schedule string
    	the cron schedule to use for automated doltlabdb backups, DoltLab Enterprise only (default "0 0 * * *")
  -automated-dolt-backups-url string
    	Dolt remote url used for creating automated backups of DoltLab's Dolt server, DoltLab Enterprise only
  -aws-config-file string
    	aws config file, used for configuring automated doltlabdb backups to aws, DoltLab Enterprise only
  -aws-profile string
    	aws profile, used for configuring automated doltlabdb automated aws backups, DoltLab Enterprise only
  -aws-region string
    	aws region, used for configuring automated doltlabdb automated aws backups, DoltLab Enterprise only
  -aws-shared-credentials-file string
    	aws shared credentials file, used for configuring automated doltlabdb automated aws backups, DoltLab Enterprise only
  -centos
    	if true will generate a script to install DoltLab's dependencies on CentOS
  -config string
    	path to installer config file
  -custom-color-rgb-accent-1 string
    	supply rgb value for custom color, DoltLab Enterprise only
  -custom-color-rgb-background-accent-1 string
    	supply rgb value for custom color, DoltLab Enterprise only
  -custom-color-rgb-background-gradient-start string
    	supply rgb value for custom color, DoltLab Enterprise only
  -custom-color-rgb-button-1 string
    	supply rgb value for custom color, DoltLab Enterprise only
  -custom-color-rgb-button-2 string
    	supply rgb value for custom color, DoltLab Enterprise only
  -custom-color-rgb-link-1 string
    	supply rgb value for custom color, DoltLab Enterprise only
  -custom-color-rgb-link-2 string
    	supply rgb value for custom color, DoltLab Enterprise only
  -custom-color-rgb-link-light string
    	supply rgb value for custom color, DoltLab Enterprise only
  -custom-email-templates
    	if true will generate email templates that can be customized, DoltLab Enterprise only
  -custom-logo string
    	path to image file to use as custom DoltLab logo, DoltLab Enterprise only
  -default-user string
    	the desired username of the default DoltLab user (default "admin")
  -default-user-email string
    	the email address used to create the default DoltLab user
  -default-user-password string
    	the password used to create the default DoltLab user
  -disable-usage-metrics
    	if true will not emit DoltLab metrics
  -docker-network string
    	the docker network to run DoltLab in (default "doltlab")
  -doltlabapi-csv-port int
    	port for doltlabapi's csv service in multi-host configuration, DoltLab Enterprise only
  -doltlabapi-host string
    	host name for doltlabapi in multi-host configuration, DoltLab Enterprise only
  -doltlabapi-only
    	if true, will only run doltlabapi. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only
  -doltlabapi-port int
    	port for doltlabapi in multi-host configuration, DoltLab Enterprise only
  -doltlabapi-token-file string
    	path to token file used to encrypt/decrypt DoltLab tokens sent from doltlabapi
  -doltlabbackupsyncer-only
    	if true, will only run doltlabbackupsyncer. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only
  -doltlabdb-admin-password string
    	admin password of the doltlabdb instance
  -doltlabdb-dolthubapi-password string
    	dolthubapi password of the doltlabdb instance
  -doltlabdb-host string
    	host name of the doltlabdb instance
  -doltlabdb-only
    	if true, will only run doltlabdb. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only
  -doltlabdb-port int
    	port of doltlabdb instance
  -doltlabdb-tls-skip-verify
    	if true will disable tls verification for doltlabdb
  -doltlabfileserviceapi-host string
    	host name for doltlabfileserviceapi in multi-host configuration, DoltLab Enterprise only
  -doltlabfileserviceapi-only
    	if true, will only run doltlabfileserviceapi. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only
  -doltlabfileserviceapi-port int
    	port for doltlabfileserviceapi in multi-host configuration, DoltLab Enterprise only
  -doltlabfileserviceapi-token-file string
    	path to token file used to encrypt/decrypt DoltLab tokens sent from doltlabfileserviceapi
  -doltlabgraphql-host string
    	host name for doltlabgraphql in multi-host configuration, DoltLab Enterprise only
  -doltlabgraphql-only
    	if true, will only run doltlabgraphql. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only
  -doltlabgraphql-port int
    	port for doltlabgraphql in multi-host configuration, DoltLab Enterprise only
  -doltlabremoteapi-file-server-port int
    	port for doltlabremoteapi file server in multi-host configuration, DoltLab Enterprise only
  -doltlabremoteapi-host string
    	host name for doltlabremoteapi in multi-host configuration, DoltLab Enterprise only
  -doltlabremoteapi-only
    	if true, will only run doltlabremoteapi. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only
  -doltlabremoteapi-port int
    	port for doltlabremoteapi in multi-host configuration, DoltLab Enterprise only
  -doltlabremoteapi-token-file string
    	path to token file used to encrypt/decrypt DoltLab tokens sent from doltlabremoteapi
  -doltlabui-host string
    	host name for doltlabui in multi-host configuration, DoltLab Enterprise only
  -doltlabui-only
    	if true, will only run doltlabui. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only
  -doltlabui-port int
    	port for doltlabui in multi-host configuration, DoltLab Enterprise only
  -enterprise-online-api-key string
    	api key for DoltLab Enterprise
  -enterprise-online-license-key string
    	license key for DoltLab Enterprise
  -enterprise-online-product-code string
    	product code for DoltLab Enterprise
  -enterprise-online-shared-key string
    	shared key for DoltLab Enterprise
  -google-creds-file string
    	google application credentials file, used for configuring automated doltlabdb backups to google cloud storage, DoltLab Enterprise only
  -health-check-port int
    	port to use for health checks against doltlabenvoy
  -help
    	print usage information
  -host string
    	host name of the instance running DoltLab
  -host-certs string
    	path to host certs (default "/etc/ssl/certs/ca-certificates.crt")
  -https
    	if true will set the url scheme of DoltLab to https
  -job-concurrency-limit int
    	concurrency limit of running jobs
  -job-concurrency-loop-seconds int
    	number of seconds to wait before checking for jobs to schedule
  -job-max-retries int
    	number of times to retry a failed job before giving up
  -no-reply-email string
    	email address used in no reply emails sent from DoltLab
  -oci-config-file string
    	oracle cloud config file, used for configuring automated doltlabdb backups to oracle cloud, DoltLab Enterprise only
  -oci-key-file string
    	oracle cloud key file, used for configuring automated doltlabdb backups to oracle cloud, DoltLab Enterprise only
  -smtp-auth-method string
    	smtp server authentication method, one of 'plain', 'login', 'anonymous', 'external', 'oauthbearer', 'disable'
  -smtp-client-multiHostHostname string
    	smtp client hostname
  -smtp-host string
    	smtp server host
  -smtp-identity string
    	smtp server identity
  -smtp-implicit-tls
    	if true will use implicit TLS for smtp connection
  -smtp-insecure-tls
    	if true will use insecure TLS smtp connection
  -smtp-oauth-token string
    	smtp server oauth token
  -smtp-password string
    	smtp server password
  -smtp-port int
    	smtp server port
  -smtp-trace string
    	smtp server trace
  -smtp-username string
    	smtp server username
  -sso-saml-cert-common-name string
    	common name used the saml signing certificate DoltLab generates, DoltLab Enterprise only
  -sso-saml-metadata-descriptor string
    	path to saml metadata descriptor which is used to configure saml sso, DoltLab Enterprise only
  -super-admin-email value
    	email address of super admin user
  -tls-cert-chain string
    	path to TLS certificate chain, required for serving DoltLab over HTTPS
  -tls-private-key string
    	path to TLS private key, required for serving DoltLab over HTTPS
  -ubuntu
    	if true will generate a script to install DoltLab's dependencies on Ubuntu
  -white-list-all-users
    	if true allows all users create accounts on this DoltLab instance (default true)
```