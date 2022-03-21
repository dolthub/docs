---
title: "Installation"
---

The latest version of DoltLab is `v0.2.0` and to get started running your own DoltLab `v0.2.0` instance, you can follow the steps below. To see release notes for [DoltLab's releases](https://github.com/dolthub/doltlab-issues/releases) or to report and track DoltLab issues, visit DoltLab's [issues repository](https://github.com/dolthub/doltlab-issues).

Please note, that to upgrading to a newer version of DoltLab will require you to kill the older version of DoltLab and install the newer one, which may result in data loss.

<h1 id="recommended-minimum-hardware"><ins>Recommended Minimum Hardware</ins></h1>

DoltLab is currently available for Linux and we recommend the following _minimum_ hardware for running your own DoltLab instance:

* 4 CPU and 16 GB of memory
* 100 GBs of disk (DoltLab's container images alone require about 4 GBs of disk). Depending on your use case, this may not be enough to back all database data, and user uploaded files.
* Ubuntu 18.04/20.04 Operating System
* Host IP must be accessible on the public internet.
* Host should allow egress `TCP` connections.
* The following `TCP` ports _must_ be open on the host:
  * `22`, for `ssh` connections.
  * `80`, for ingress `HTTP` connections.
  * `100`, for ingress connections to DoltLab's [remote data file server]().
  * `50051`, for ingress connections to DoltLab's [remote API]().
  * `4321`, for ingress connections to DoltLab's [file upload service API]().

<!-- TODO: add links to blogs/guides for provisioning host on AWS and for building a doltlab AMI-->

<h1 id="install-doltlab-dependencies"><ins>Step 1: Install DoltLab's Dependencies on the Host</ins></h1>

Once you've provisioned a Linux host and [properly configured it's networking interface](#recommended-minimum-hardware), you can now install DoltLab's dependencies. 

If your host is running Ubuntu 18.04/20.04, the quickest way to install these dependencies is with this [ubuntu-bootstrap.sh](https://gist.github.com/coffeegoddd/f6cacad2a6da423ca27cd0bebc67fd80) script. This script will also download and unzip DoltLab at the specified `DOLTLAB_VERSION` to a local `doltlab` directory.

To use it run:

```bash
export DOLTLAB_VERSION=v0.2.0
chmod +x ubuntu-bootstrap.sh
sudo ./ubuntu-bootstrap.sh with-sudo "$DOLTLAB_VERSION"
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

<div id="download-doltlab">Next, download and unzip DoltLab:</div>
To use it run:

```bash
export DOLTLAB_VERSION=v0.2.0
curl -LO https://doltlab-releases.s3.amazonaws.com/linux/amd64/doltlab-${DOLTLAB_VERSION}.zip
unzip doltlab-${DOLTLAB_VERSION}.zip -d doltlab
cd doltlab
```

<h1 id="start-doltlab"><ins>Step 2: Start DoltLab</ins></h1>

The recommended way to run DoltLab is with the `start-doltlab.sh` script included in DoltLab's zip folder. This script requires the following environment variables to be set:

```bash
export HOST_IP=<Host IP>
export POSTGRES_PASSWORD=<Password>
export DOLTHUBAPI_PASSWORD=<Password>
export POSTGRES_USER="dolthubadmin"
export EMAIL_USERNAME=<SMTP Email Username>
export EMAIL_PASSWORD=<SMTP Email Password>
export EMAIL_PORT=<STMP Email Port>
export EMAIL_HOST=<SMTP Email Host>
export NO_REPLY_EMAIL=<An Email Address to Receive No Reply Messages>
```

`HOST_IP` should be the IP address or DNS name of the Linux host running DoltLab.<br/>
`POSTGRES_PASSWORD` and `DOLTHUBAPI_PASSWORD` may be set to any valid PostgreSQL password.<br/>
`POSTGRES_USER` _must_ be "dolthubadmin".<br/>
`EMAIL_USERNAME` should be a valid username authorized to use existing STMP server.<br/>
`EMAIL_PASSWORD` should be the password for the aformentioned username of the SMTP server.<br/>
`EMAIL_PORT` should be the port of the existing SMTP server.<br/>
`EMAIL_HOST` should be the host of the existing SMTP server.<br/>
`NO_REPLY_EMAIL` should be the email address that receives noreply messages.<br/>

Once these variables are set, simple run the `start-doltlab.sh` script:

```bash
./start-doltlab.sh # runs doltlab using docker-compose in daemon mode
```

The running DoltLab processes can be viewed with `docker ps`:

```bash
docker ps
CONTAINER ID   IMAGE                                                             COMMAND                  CREATED      STATUS      PORTS                                                                                     NAMES
c1087c9f6004   public.ecr.aws/dolthub/doltlab/dolthub-server:v0.2.0              "docker-entrypoint.s…"   9 days ago   Up 9 days   3000/tcp                                                                                  doltlab_doltlabui_1
a63aade4a36e   public.ecr.aws/dolthub/doltlab/dolthubapi-graphql-server:v0.2.0   "docker-entrypoint.s…"   9 days ago   Up 9 days   9000/tcp                                                                                  doltlab_doltlabgraphql_1
5b2cad62d4e5   public.ecr.aws/dolthub/doltlab/dolthubapi-server:v0.2.0           "/app/go/services/do…"   9 days ago   Up 9 days                                                                                             doltlab_doltlabapi_1
e6268950f987   public.ecr.aws/dolthub/doltlab/doltremoteapi-server:v0.2.0        "/app/go/services/do…"   9 days ago   Up 9 days   0.0.0.0:100->100/tcp, :::100->100/tcp, 0.0.0.0:50051->50051/tcp, :::50051->50051/tcp      doltlab_doltlabremoteapi_1
52f39c016537   public.ecr.aws/dolthub/doltlab/fileserviceapi-server:v0.2.0       "/app/go/services/fi…"   9 days ago   Up 9 days                                                                                             doltlab_doltlabfileserviceapi_1
0f952e7c7007   envoyproxy/envoy-alpine:v1.18-latest                              "/docker-entrypoint.…"   9 days ago   Up 9 days   0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:4321->4321/tcp, :::4321->4321/tcp, 10000/tcp   doltlab_doltlabenvoy_1
204e0274798b   public.ecr.aws/dolthub/doltlab/postgres-server:v0.2.0             "docker-entrypoint.s…"   9 days ago   Up 9 days   5432/tcp                                                                                  doltlab_doltlabdb_1
```

And navigating to `http://${HOST_IP}:80` in a web browser should show the DoltLab homepage.
