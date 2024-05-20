---
title: Installer
---

DoltLab ships with a binary called `installer` that serves as the primary interface for configuring a DoltLab deployment.

The `installer` uses a configuration file shipped with DoltLab called `installer_config.yaml`, as well as command line flags, to generate the static assets DoltLab needs to be deployed. Each field of the configuration file has a corresponding command line flag argument. Command line arguments take priority over related fields defined in the configuration file.

- [Configuration file reference](./installer/configuration-file.md)
- [Command line reference](./installer/cli.md)
