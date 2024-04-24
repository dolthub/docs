---
title: Linux
---

<h1 id="install-doltlab-linux">Install DoltLab on Linux</h1>

This page covers how to install and start DoltLab on a Linux host. Before you begin, be sure the host meets the [minimum recommended hardware requirements](../installation.md#minimum-recommended-hardware), has the proper [networking configuration](../installation.md#networking-requirements), and all [dependencies](../installation.md#dependencies) installed.

DoltLab is released as a single `.zip` file that contains everything you need to run it. Release notes for each release can be viewed [here](./release-notes.md).

> NOTE: We highly recommend installing (and upgrading to) the latest DoltLab version whenever possible.

Download and unzip the latest version of DoltLab with:

```bash
curl -LO https://doltlab-releases.s3.amazonaws.com/linux/amd64/doltlab-latest.zip
unzip doltlab-latest.zip -d doltlab
cd doltlab
```

Or, to install a specific version of DoltLab, run:
```bash
export DOLTLAB_VERSION=v2.1.1
curl -LO https://doltlab-releases.s3.amazonaws.com/linux/amd64/doltlab-${DOLTLAB_VERSION}.zip
unzip doltlab-${DOLTLAB_VERSION}.zip -d doltlab
cd doltlab
```

The contents of the resulting `doltlab` directory can vary depending on the version installed. The following instructions will refer to DoltLab versions >= `v2.1.0` that contain the `installer` binary. For installation instructions for DoltLab <= `2.0.8`, please see the [pre-installer installation instructions](./pre-installer-linux.md).

Inside the `doltlab` directory you'll find the following binaries:

* installer
* smtp_connection_helper

The `installer` binary, is the primary interface for configuring a DoltLab instance. This tool will create all other assets DoltLab needs to run, based on the arguments you supply it.

The `smtp_connection_helper` binary can be used to help you troubleshoot any issues connecting your DoltLab instance to your existing SMTP server. This tool uses similar code to DoltLab's email service and sends a test email if the connection to the SMTP server is properly configured. The source code for the tool is available [here](https://gist.github.com/coffeegoddd/66f5aeec98640ff8a22a1b6910826667) and basic instructions for using the tool are [here](./administrator.md#troubleshoot-smtp-connection).

# Next Steps

- [Start DoltLab](./start-doltlab.md)
