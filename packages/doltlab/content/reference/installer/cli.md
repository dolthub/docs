---
title: Installer command line reference
---

# Installer command line reference

## automated-dolt-backups-backup-on-boot

_Boolean_. If true, will create a backup when the `backup-syncer` service comes online, DoltLab Enterprise only (default true).

Configuration file equivalent [backup_on_boot](./configuration-file.md#backup_on_boot).

## automated-dolt-backups-cron-schedule

_String_. The cron schedule to use for automated doltlabdb backups, DoltLab Enterprise only, (default "0 0 * * *").

Configuration file equivalent [cron_schedule](./configuration-file.md#cron_schedule).

## automated-dolt-backups-url

_String_. Dolt remote url used for creating automated backups of DoltLab's Dolt server, DoltLab Enterprise only.

Configuration file equivalent [remote_url](./configuration-file.md#remote_url).

## aws-config-file

_String_. AWS configuration file, used for configuring automated `doltlabdb` backups to AWS, DoltLab Enterprise only.

Configuration file equivalent [aws_config_file](./configuration-file.md#aws_config_file).

## aws-profile

_String_. AWS profile, used for configuring `doltlabdb` automated AWS backups, DoltLab Enterprise only.

Configuration file equivalent [aws_profile](./configuration-file.md#aws_profile).

## aws-region

_String_. AWS region, used for configuring `doltlabdb` automated AWS backups, DoltLab Enterprise only.

Configuration file equivalent [aws_region](./configuration-file.md#aws_region).

## aws-shared-credentials-file

_String_. Absolute path to an AWS shared credentials file, used for configuring `doltlabdb` automated aws backups, DoltLab Enterprise only.

Configuration file equivalent [aws_shared_credentials_file](./configuration-file.md#aws_shared_credentials_file).

## centos

_Boolean_. If true will generate a script to install DoltLab's dependencies on CentOS.

## config

_String_. Absolute path to `installer` configuration file. By default, the `installer` will look for `installer_config.yaml` in its same directory.

## custom-color-rgb-accent-1

_String_. Supply a comma-separated RGB value for `accent_1`, DoltLab Enterprise only.

Configuration file equivalent [rgb_accent_1](./configuration-file.md#rgb_accent_1).

## custom-color-rgb-background-accent-1

_String_. Supply a comma-separated RGB value for `background_accent_1`, DoltLab Enterprise only.

Configuration file equivalent [rgb_background_accent_1](./configuration-file.md#rgb_background_accent_1).

## custom-color-rgb-background-gradient-start

_String_. Supply a comma-separated RGB value for `background_gradient_start`, DoltLab Enterprise only.

Configuration file equivalent [rgb_background_gradient_start](./configuration-file.md#rgb_background_gradient_start).

## custom-color-rgb-button-1

_String_. Supply a comma-separated RGB value for `button_1`, DoltLab Enterprise only.

Configuration file equivalent [rgb_button_1](./configuration-file.md#rgb_button_1).

## custom-color-rgb-button-2

_String_. Supply a comma-separated RGB value for `button_2`, DoltLab Enterprise only.

Configuration file equivalent [rgb_button_2](./configuration-file.md#rgb_button_2).

## custom-color-rgb-link-1

_String_. Supply a comma-separated RGB value for `link_1`, DoltLab Enterprise only.

Configuration file equivalent [rgb_link_1](./configuration-file.md#rgb_link_1).

## custom-color-rgb-link-2

_String_. Supply a comma-separated RGB value for `link_2`, DoltLab Enterprise only.

Configuration file equivalent [rgb_link_2](./configuration-file.md#rgb_link_2).

## custom-color-rgb-link-light

_String_. Supply a comma-separated RGB value for `link_light`, DoltLab Enterprise only.

Configuration file equivalent [rgb_link_light](./configuration-file.md#rgb_link_light).

## custom-color-rgb-primary

_String_. Supply a comma-separated RGB value for `primary`, DoltLab Enterprise only.

Configuration file equivalent [rgb_primary](./configuration-file.md#rgb_primary).

## custom-color-rgb-code-background

_String_. Supply a comma-separated RGB value for `code_background`, DoltLab Enterprise only.

Configuration file equivalent [rgb_code_background](./configuration-file.md#rgb_code_background).

## custom-email-templates

_Boolean_. If true, will generate email templates that can be customized, DoltLab Enterprise only.

Configuration file equivalent [email_templates](./configuration-file.md#email_templates).

## custom-logo

_String_. Absolute path to an image file to replace DoltLab's logo, DoltLab Enterprise only.

Configuration file equivalent [logo](./configuration-file.md#logo).

## default-user

_String_. The desired username of the default DoltLab user, (default "admin").

Configuration file equivalent [name](./configuration-file.md#name).

## default-user-email

_String_. The email address used to create the default DoltLab user.

Configuration file equivalent [email](./configuration-file.md#email).

## default-user-password

_String_. The password used to create the default DoltLab user.

Configuration file equivalent [password](./configuration-file.md#default-user-password).

## disable-usage-metrics

_Boolean_. If true, will not collect first-party metrics.

Configuration file equivalent [metrics_disabled](./configuration-file.md#metrics_disabled).

## docker-network

_String_. The docker network to run DoltLab in, (default "doltlab").

Configuration file equivalent [docker_network](./configuration-file.md#docker_network).

## doltlabapi-csv-port

_Number_. The port for `doltlabapi`'s CSV service.

Configuration file equivalent [csv_port](./configuration-file.md#csv_port).

## doltlabapi-host

_String_. The hostname or IP address of `doltlabapi`.

Configuration file equivalent [host](./configuration-file.md#doltlabapi-host).

## doltlabapi-only

_Boolean_. If true, will only run `doltlabapi` on the host. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only.

Configuration file equivalent [doltlabapi_only](./configuration-file.md#doltlabapi_only).

## doltlabapi-port

_Number_. The port for `doltlabapi`.

Configuration file equivalent [port](./configuration-file.md#doltlabapi-port).

## -doltlabdb-admin-password

_String_. The `dolthubadmin` SQL user password of the `doltlabdb` instance.

Configuration file equivalent [admin_password](./configuration-file.md#admin_password).

## doltlabdb-dolthubapi-password

_String_. The `dolthubapi` SQL user password of the `doltlabdb` instance.

Configuration file equivalent [dolthubapi_password](./configuration-file.md#dolthubapi_password).

## doltlabdb-host

_String_. The hostname or IP address of `doltlabdb`.

Configuration file equivalent [host](./configuration-file.md#doltlabdb-host).

## doltlabdb-only

_Boolean_. If true, will only run `doltlabdb` on the host. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only.

Configuration file equivalent [doltlabdb_only](./configuration-file.md#doltlabdb_only)

## doltlabdb-port

_Number_. The port of `doltlabdb`.

Configuration file equivalent [port](./configuration-file.md#doltlabdb-port).

## doltlabdb-tls-skip-verify

_Boolean_. If true, will disable TLS verification for connection to `doltlabdb`.

Configuration file equivalent [tls_skip_verify](./configuration-file.md#tls_skip_verify).

## doltlabfileserviceapi-host

_String_. The hostname or IP address for `doltlabfileserviceapi`.

Configuration file equivalent [host](./configuration-file.md#doltlabfileserviceapi-host).

## doltlabfileserviceapi-only

_Boolean_. If true, will only run `doltlabfileserviceapi` on the host. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only.

Configuration file equivalent [doltlabfileserviceapi_only](./configuration-file.md#doltlabfileserviceapi_only).

## doltlabfileserviceapi-port

_Number_. The port for `doltlabfileserviceapi`.

Configuration file equivalent [port](./configuration-file.md#doltlabfileserviceapi-port).

## doltlabgraphql-host

_String_. The hostname or IP address for `doltlabgraphql`.

Configuration file equivalent [host](./configuration-file.md#doltlabgrapqhl-host).

## doltlabgraphql-only

_Boolean_. If true, will only run `doltlabgraphql` on the host. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only.

Configuration file equivalent [doltlabgraphql_only](./configuration-file.md#doltlabgraphql_only).

## doltlabgraphql-port

_Number_. The port for `doltlabgraphql`.

Configuration file equivalent [port](./configuration-file.md#doltlabgrapqhl-port).

## doltlabremoteapi-file-server-port

_Number_. The port for `doltlabremoteapi`'s file server.

Configuration file equivalent [file_server_port](./configuration-file.md#file_server_port).

## doltlabremoteapi-host

_String_. The hostname for `doltlabremoteapi`.

Configuration file equivalent [host](./configuration-file.md#doltlabremoteapi-host).

## doltlabremoteapi-only

_Boolean_. If true, will only run `doltlabremoteapi` on the host. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only.

Configuration file equivalent [doltlabremoteapi_only](./configuration-file.md#doltlabremoteapi_only).

## doltlabremoteapi-port

_Number_. The port for `doltlabremoteapi`.

Configuration file equivalent [port](#doltlabremoteapi-port).

## doltlabui-host

_String_. The hostname or IP address of `doltlabui`.

Configuration file equivalent [host](./configuration-file.md#doltlabui-host).

## doltlabui-only

_Boolean_. If true, will only run `doltlabui` on the host. This is used for running DoltLab services across multiple hosts. DoltLab Enterprise only.

Configuration file equivalent [doltlabui_only](./configuration-file.md#doltlabui_only).

## doltlabui-port

_Number_. The port for `doltlabui`.

Configuration file equivalent [port](./configuration-file.md#doltlabui-port).

## enterprise-online-api-key

_String_. The api key for DoltLab Enterprise.

Configuration file equivalent [online_api_key](./configuration-file.md#online_api_key).

## enterprise-online-license-key

_String_. The license key for DoltLab Enterprise.

Configuration file equivalent [online_license_key](./configuration-file.md#online_license_key).

## enterprise-online-product-code

_String_. The product code for DoltLab Enterprise.

Configuration file equivalent [online_product_code](./configuration-file.md#online_product_code).

## enterprise-online-shared-key

_String_. The shared key for DoltLab Enterprise.

Configuration file equivalent [online_shared_key](./configuration-file.md#online_shared_key).

## google-creds-file

_String_. Absolute path to a Google application credentials file, used for configuring automated `doltlabdb backups` to Google Cloud Storage, DoltLab Enterprise only.

Configuration file equivalent [google_credentials_file](./configuration-file.md#google_credentials_file).

## help

_Boolean_. Print `installer` usage information.

## host

_String_. The hostname or IP address of the host running DoltLab or one of its services.

Configuration file equivalent [host](./configuration-file.md#host).

## https

_Boolean_. If true, will set the url scheme of DoltLab to `https://`.

Configuration file equivalent [scheme](./configuration-file.md#scheme).

## job-concurrency-limit

_Number_. The limit of concurrent `running` Jobs.

Configuration file equivalent [concurrency_limit](./configuration-file.md#concurrency_limit).

## job-concurrency-loop-seconds

_Number_. The number of seconds to wait before attempting to schedule more `pending` Jobs.

Configuration file equivalent [concurrency_loop_seconds](./configuration-file.md#concurrency_loop_seconds).

## job-max-retries

_Number_. The number of times to retry `failed` Jobs.

Configuration file equivalent [max_retries](./configuration-file.md#max_retries).

## no-reply-email

_String_. The email address used as the "from" address in emails sent from DoltLab.

Configuration file equivalent [no_reply_email](./configuration-file.md#no_reply_email).

## oci-config-file

_String_. Absolute path to an Oracle Cloud config file, used for configuring automated doltlabdb backups to Oracle Cloud, DoltLab Enterprise only.

Configuration file equivalent [oci_config_file](./configuration-file.md#oci_config_file).

## oci-key-file

_String_. Absolute path to an Oracle Cloud key file, used for configuring automated doltlabdb backups to Oracle Cloud, DoltLab Enterprise only.

Configuration file equivalent [oci_key_file](./configuration-file.md#oci_key_file).

## smtp-auth-method

_String_. The authentication method of an SMTP server, one of `plain`, `login`, `anonymous`, `external`, `oauthbearer`, or `disable`.

Configuration file equivalent [auth_method](./configuration-file.md#auth_method).

## smtp-client-hostname

_String_. The client hostname of an SMTP server.

Configuration file equivalent [client_hostname](./configuration-file.md#client_hostname).

## smtp-host

_String_. The hostname of an SMTP server.

Configuration file equivalent [host](./configuration-file.md#smtp-host).

## smtp-identity

_String_. The identity of an SMTP server.

Configuration file equivalent [identity](./configuration-file.md#identity).

## smtp-implicit-tls

_Boolean_. If true, will use implicit TLS when DoltLab connects to the SMTP server.

Configuration file equivalent [implicit_tls](./configuration-file.md#implicit_tls).

## smtp-insecure-tls

_String_. If true, will skip TLS verification when DoltLab connects to the SMTP server.

Configuration file equivalent [insecure_tls](./configuration-file.md#insecure_tls).

## smtp-oauth-token

_String_. The Oauth token used for authenticating against an SMTP server.

Configuration file equivalent [oauth_token](./configuration-file.md#oauth_token).

## smtp-password

_String_. The password used for authenticating against an SMTP server.

Configuration file equivalent [password](./configuration-file.md#smtp-password).

## smtp-port

_Number_. The port of an SMTP server.

Configuration file equivalent [port](./configuration-file.md#smtp-port).

## smtp-trace

_String_. The trace of an SMTP server.

Configuration file equivalent [trace](./configuration-file.md#trace).

## smtp-username

_String_. The username used for authenticating against an SMTP server.

Configuration file equivalent [username](./configuration-file.md#username).

## sso-saml-cert-common-name

_String_. The common name used for generating the SAML signing certificate, DoltLab Enterprise only.

Configuration file equivalent [cert_common_name](./configuration-file.md#cert_common_name).

## sso-saml-metadata-descriptor

_String_. Absolute path to the SAML metadata descriptor file from an identity provider, DoltLab Enterprise only.

Configuration file equivalent [metadata_descriptor_file](./configuration-file.md#metadata_descriptor_file).

## super-admin-email

_String_. The email address of a DoltLab user granted "super admin" privileges. Can be supplied multiple times. DoltLab Enterprise only.

Configuration file equivalent [super_admins](./configuration-file.md#super_admins).

## tls-cert-chain

_String_. Absolute path to TLS certificate chain with `.pem` extension.

Configuration file equivalent [cert_chain](./configuration-file.md#cert_chain).

## tls-private-key

_String_. Absolute path to TLS private key with `.pem` extension.

Configuration file equivalent [private_key](./configuration-file.md#private_key).

## ubuntu

_Boolean_. If true will generate a script to install DoltLab's dependencies on Ubuntu.

## whitelist-all-users

_Boolean_. If true, allows all users create accounts on a DoltLab instance, (default true).

Configuration file equivalent [whitelist_all_users](./configuration-file.md#whitelist_all_users).
