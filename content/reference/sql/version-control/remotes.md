---
title: Using remotes
---

# What are Remotes?

Just like Git, Dolt supports syncing with a [remote database](../../../concepts/dolt/git/remotes.md). A remote is a copy of your database that is distinct from your local copy. It usually is stored on a separate host or service for fault tolerance. The primary use cases are disaster recovery and collaboration. More conceptual description of remotes can be found [here](../../../concepts/dolt/git/remotes.md).

# Configuring Remotes

Remotes are configured using the [`remote` command](../../cli.md#dolt-remote). You configure a remote with a name and a URL. When you want to use the remote, you refer to it by name. When you clone a remote, a remote named `origin` is automatically configured for you.

# Remote Actions

Sync functionality is supported via the [`clone`](../../cli.md#dolt-clone), [`fetch`](../../cli.md#dolt-fetch), [`push`](../../cli.md#dolt-push), and [`pull`](../../cli.md#dolt-pull).

# Remote Options

## DoltHub

[DoltHub](https://www.dolthub.com) is a remote operated by DoltHub Inc. Public repositories are free. Private repositories are free up to a Gigabyte. After a Gigabyte, private repositories are $50 a month and scale up in cost after 100GB. DoltHub adds a web GUI to your remotes along with Forks, Pull Requests, and Issues.

See the [Getting Started Guide for DoltHub](../../../introduction/getting-started/data-sharing.md) on how to get started with a DoltHub remote.

## DoltLab

[DoltLab](https://www.doltlab.com) is a version of [DoltHub](https://www.dolthub.com) you can deploy in your own network. It looks very similar to DoltHub. See the [DoltLab Guide](../../../guides/doltlab/installation.md) if you are interested in using DoltLab as a remote.

## Filesystem

Filesystem based remotes allow you to push/pull data from any location that can be accessed via the filesystem. This may be a directory on your local disk, or any other storage location that can be mounted to the filesystem. To add a filesystem based remote use a URL with the `file://` protocol.

**Linux / OSX Examples**

 * Adding a remote 
```
dolt remote add origin file:///Users/brian/datasets/menus  
```
 * Cloning
```
dolt clone file:///Users/brian/datasets/menus
```

**Windows Examples**

 * Adding a remote
```
dolt remote add origin file:///c:/Users/brian/datasets/menus
```
 * Cloning 
```
dolt clone file:///c:/Users/brian/datasets/menus
```

It's important to note that a directory-based remote is not the same as a workspace for a dolt clone, and the directory listed above as a remote file URL is not a dolt repository created or cloned with the [Dolt](https://doltdb.com) cli. Similarly, a [Dolt](https://doltdb.com) repository directory's file URL [cannot be used as a remote directly](https://github.com/dolthub/dolt/issues/1860).

## AWS

AWS remotes use a combination of DynamoDB and S3. The Dynamo table can be created with any name but must have a primary
key with the name "db".

![Create a Dynamo Table with a primary key of: db](../images/create_dynamo_table.png)

This single DynamoDB table can be used for multiple unrelated remote repositories.  Once you have a DynamoDB table, and an S3 bucket setup you can add an AWS remote using a URL with the protocol `aws://`. To add a remote named "origin" to my "menus" repository using an S3 bucket named `dolt_remotes_s3_storage` and a DynamoDB table named `dolt_dynamo_table` you would run:

```
dolt remote add origin aws://[dolt_dynamo_table:dolt_remotes_s3_storage]/menus
```

This same URL can then be used to clone this database by another user.

```
dolt clone aws://[dolt_remotes:dolt_remotes_storage]/menus
```

In order to initialize your system to be able to connect to your AWS cloud resources see [Amazon's documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) on configuring your credential file. [Dolt](https://doltdb.com) also provides additional parameters you may need to provide when adding an AWS remote such as `aws-creds-profile`, and `aws-region`.`aws-creds-profile` allows you to select a profile from your credential file. If it is not provided then the default profile is used. `aws-region` allows you to specify the region in which your Dynamo DB table and S3 bucket are located. If not provided it will use the default region from the current profile.

```
dolt remote add --aws-creds-profile prod-profile --aws-region us-west-2 origin aws://[dolt_dynamo_table:dolt_remotes_s3_storage]/menus
```

or 

```
dolt clone --aws-creds-profile prod-profile --aws-region us-west-2 origin aws://[dolt_dynamo_table:dolt_remotes_s3_storage]/menus
```

## GCS

Google Cloud Platform remotes use Google Cloud Storage (GCS). You can create or use an existing GCS bucket to host one or more [Dolt](https://doltdb.com) remotes. To add a GCP remote provide a URL with the `gs://` protocol like so:

```
dolt remote add origin gs://BUCKET/path/for/remote
```

In order to initialize [Dolt](https://doltdb.com) to use your GCP credentials you will need to install the `gcloud` command line tool and run `gcloud auth login`. See the [Google document](https://cloud.google.com/sdk/gcloud/reference/auth/login) for details.

## HTTP(s) Remotes

[Dolt](https://doltdb.com) supports remotes which use the protocol `http://` and `https://`. Remote servers must implement the GRPC methods defined by the [ChunkStoreService interface](https://github.com/dolthub/dolt/blob/master/proto/dolt/services/remotesapi/v1alpha1/chunkstore.proto#L23). This is the way by which [DoltHub](https://dolthub.com) itself provides remote functionality. When you add a [DoltHub](https://dolthub.com) remote via `dolt remote add origin owner/repository` or do a `dolt clone owner/repository` [Dolt](https://doltdb.com) is just providing shorthand notation for the URL. When you run `dolt remote -v` you can see that [Dolt](https://doltdb.com) adds an `https://` URL with the host `doltremoteapi.dolthub.com` as can be seen here:

```
$dolt remote add origin Dolthub/menus

$dolt remote -v
origin https://doltremoteapi.dolthub.com/Dolthub/menus
```

[Dolt](https://doltdb.com) provides a [sample remote server](https://github.com/dolthub/dolt/tree/master/go/utils/remotesrv) that we use for integration testing which could be deployed to serve your remotes as well, though you would want to extend the sample functionality to support things like auth. In our integration tests we install and run the remote server locally:

```
remotesrv --http-port 1234 --dir ./remote_storage
```

This starts a server listening on port 50051 for our grpc requests, and runs a file server on port 1234 which provides upload, and download functionality similar to S3 / GCS locally.  We use the url `http://localhost:50051/test-org/test-repo` when adding a remote or cloning from this remote server.