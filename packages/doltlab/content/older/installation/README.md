---
title: Installation
---

Below you'll find the minimum recommended hardware needed to successfully install and operate a DoltLab instance.

You must have a host(s) running a supported operating system, hardware that meets or surpasses the minimum recommended hardware, the required networking configuration, and all dependencies installed the host(s) in order to run DoltLab.

# Supported operating systems

- [Linux](./installation/pre-installer-linux.md)

# Minimum recommended hardware

DoltLab requires the following minimum system resources:

* 4 CPU
* 16 GB of memory
* 300 GB of disk (DoltLab's container images alone require about 4 GBs of disk).

# Networking requirements

DoltLab requires the following networking configuration:

* The IP address or domain name of the host must be discoverable by the Dolt CLI and web browser.
* Hosts must allow egress `TCP` connections.
* The following ports _must_ allow `TCP` connections:
  * `22`, for `ssh` connections.
  * `80`, for ingress `HTTP` connections.
  * `443` for ingress `HTTPS` connections, if DoltLab will use TLS.
  * `100`, for ingress connections to DoltLab's [remote data file server](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-remoteapi-server).
  * `50051`, for ingress connections to DoltLab's [remote API](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-remoteapi-server).
  * `4321`, for ingress connections to DoltLab's [file upload service API](https://www.dolthub.com/blog/2022-02-25-doltlab-101-services-and-roadmap/#doltlab-file-service-api-server).

# Dependencies

DoltLab requires the following dependencies:

> [curl](https://www.tecmint.com/install-curl-in-linux/)<br/>
> [unzip](https://www.tecmint.com/install-zip-and-unzip-in-linux/)<br/>
> [docker](https://docs.docker.com/engine/install/)<br/>
> [docker-compose](https://docs.docker.com/compose/install/)<br/>
> [amazon-ecr-credential-helper](https://github.com/awslabs/amazon-ecr-credential-helper)<br/>
> Access to an [SMTP server](https://aws.amazon.com/what-is/smtp/), like [smtp.gmail.com](https://support.google.com/a/answer/176600?hl=en).

To help streamline dependency installation, we've created the following scripts for installing DoltLab's dependencies on supported distributions:

- [Ubuntu](https://github.com/dolthub/doltlab-issues/blob/main/scripts/ubuntu_install.sh)
- [Centos](https://github.com/dolthub/doltlab-issues/blob/main/scripts/centos_install.sh)

Once DoltLab's dependencies are installed, we recommend following the [post-installation](https://docs.docker.com/engine/install/linux-postinstall/) steps for Docker that will allow you to run `docker` commands without using `sudo`.
