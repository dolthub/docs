---
title: Using remotes
---

# What are Remotes?

Just like Git, Dolt supports syncing with a [remote database](../../../concepts/dolt/git/remotes.md). A remote is a copy of your database that is distinct from your local copy. It usually is stored on a separate host or service for fault tolerance. The primary use cases are disaster recovery and collaboration. More conceptual description of remotes can be found [here](../../../concepts/dolt/git/remotes.md).

# Configuring Remotes

Remotes are configured using the [`remote` command](../../cli/cli.md#dolt-remote). You configure a remote with a name and a URL. When you want to use the remote, you refer to it by name. When you clone a remote, a remote named `origin` is automatically configured for you.

<h1 id="pushing-to-remote">Pushing to a Remote</h1>

Let's go through an example of how you can push data from a local Dolt database to a remote. In this example, we'll use the running Dolt server we created in the [Getting Started](https://docs.dolthub.com/introduction/getting-started/database) section to push a branch to [DoltHub.com](https://www.dolthub.com).

To do this, we'll need to authenticate our Dolt server against the remote so that it can perform writes.

First, we'll need to create an account or [sign-in](https://www.dolthub.com/signin) if we already one.

Next, we're going to create a database on DoltHub.com that will serve as the remote for our local Dolt server.

![Empty database as remote](../../../../content/.gitbook/assets/empty_database_as_remote.png)

Next, we can run the command [dolt login](https://docs.dolthub.com/cli-reference/cli#dolt-login) from our local Dolt CLI client. This command will help us authenticate our local client to DoltHub.com, associating our client with our DoltHub identity.

```
dolt login
Credentials created successfully.
pub key: l5bfb43fmqu8u8b59m8fp5cb8o1jcpt8281u94t80us35u6fgavg
/Users/dustin/.dolt/creds/6h68h8brsfu9580rqupi3h9icfhtd5s28ikoguejqqesq.jwk
Opening a browser to:
	https://dolthub.com/settings/credentials#l5bfb43fmqu8u8b59m8fp5cb8o1jcpt8281u94t80us35u6fgavg
Please associate your key with your account.
Checking remote server looking for key association.
Retrying in 2
```

This command opens a web browser to DoltHub's credentials page where it will populate the Public Key field with a newly generated public key. In this example that public key is `pub key: l5bfb43fmqu8u8b59m8fp5cb8o1jcpt8281u94t80us35u6fgavg`.

On the credentials page, we just need to provide a description for our new key and click "Add".

![Add Dolt client credentials](../../../../content/.gitbook/assets/add_getting_started_creds.png)

Our local Dolt client (and running Dolt server) are now successfully authenticated to push to DoltHub databases where we have write access. The final output of `dolt login` will read:

```
Key successfully associated with user: coffeegoddd email dustin@dolthub.com
```

Using a MySQL client connected to the running Dolt server, let's give pushing to DoltHub.com a try. We're going to push our `main` branch, so first we check it out:

```
mysql> call dolt_checkout('main');
+--------+---------------------------+
| status | message                   |
+--------+---------------------------+
|      0 | Switched to branch 'main' |
+--------+---------------------------+
1 row in set (0.02 sec)
```

Now, we need to add the remote address for the DoltHub database we created to the Dolt server:

```
mysql> call dolt_remote('add', 'origin', 'coffeegoddd/getting_started');
+--------+
| status |
+--------+
|      0 |
+--------+
1 row in set (0.03 sec)
```

And then we can push:

```
mysql> call dolt_push('origin', 'main');
+--------+
| status |
+--------+
|      0 |
+--------+
1 row in set (0.77 sec)
```

And the data from our local Dolt server is now available on DoltHub.com!

![DoltHub database has changes](../../../../content/.gitbook/assets/dolthub_database_has_changes.png)

## Pushing from Dolt running in a container

In the example above, the local Dolt client and running Dolt server were successfully authenticated against DoltHub.com because neither was running in a containerized environment.

As a result, both the client and server were able to reference the same local directory Dolt uses to manage its global state. This directory can be set by defining `DOLT_ROOT_PATH`, but by default, is created at `$HOME/.dolt`. This directory houses global (client and server) configuration as well as all remote credentials, which are located in `$HOME/.dolt/creds`.

It's important to be aware of this global state directory in the event you wanted to authenticate a Dolt server running from within a container. To do so, you should run `dolt login` using a Dolt CLI client outside of the containerized environment to create new remote credentials, then mount your local `$HOME/.dolt` directory to the `DOLT_ROOT_PATH` of the container. This ensures that the Dolt server in the container has the credentials to write to your remote.

# Remote Actions

Sync functionality is supported via the [`clone`](../../cli/cli.md#dolt-clone), [`fetch`](../../cli/cli.md#dolt-fetch), [`push`](../../cli/cli.md#dolt-push), and [`pull`](../../cli/cli.md#dolt-pull).

# Remote Options

## DoltHub

[DoltHub](https://www.dolthub.com) is a remote operated by DoltHub Inc. Public repositories are free. Private repositories are free up to a Gigabyte. After a Gigabyte, private repositories are $50 a month and scale up in cost after 100GB. DoltHub adds a web GUI to your remotes along with Forks, Pull Requests, and Issues.

See the [Getting Started Guide for DoltHub](../../../products/dolthub/data-sharing.md) on how to get started with a DoltHub remote.

## DoltLab

[DoltLab](https://www.doltlab.com) is a version of [DoltHub](https://www.dolthub.com) you can deploy in your own network. It looks very similar to DoltHub. See the [DoltLab Guide](https://docs.doltlab.com/installation) if you are interested in using DoltLab as a remote.

## Filesystem

Filesystem based remotes allow you to push/pull data from any location that can be accessed via the filesystem. This may be a directory on your local disk, or any other storage location that can be mounted to the filesystem. To add a filesystem based remote use a URL with the `file://` protocol.

**Linux / OSX Examples**

- Adding a remote

```
dolt remote add origin file:///Users/brian/datasets/menus
```

- Cloning

```
dolt clone file:///Users/brian/datasets/menus
```

**Windows Examples**

- Adding a remote

```
dolt remote add origin file:///c:/Users/brian/datasets/menus
```

- Cloning

```
dolt clone file:///c:/Users/brian/datasets/menus
```

It's important to note that a directory-based remote is not the same as a workspace for a dolt clone, and the directory listed above as a remote file URL is not a dolt repository created or cloned with the [Dolt](https://doltdb.com) cli. Similarly, a [Dolt](https://doltdb.com) repository directory's file URL [cannot be used as a remote directly](https://github.com/dolthub/dolt/issues/1860).

## AWS

AWS remotes use a combination of DynamoDB and S3. The Dynamo table can be created with any name but must have a primary
key with the name "db".

![Create a Dynamo Table with a primary key of: db](../../../.gitbook/assets/create_dynamo_table.png)

This single DynamoDB table can be used for multiple unrelated remote repositories. Once you have a DynamoDB table, and an S3 bucket setup you can add an AWS remote using a URL with the protocol `aws://`. To add a remote named "origin" to my "menus" repository using an S3 bucket named `dolt_remotes_s3_storage` and a DynamoDB table named `dolt_dynamo_table` you would run:

```
dolt remote add origin aws://[dolt_dynamo_table:dolt_remotes_s3_storage]/menus
```

This same URL can then be used to clone this database by another user.

```
dolt clone aws://[dolt_remotes:dolt_remotes_storage]/menus
```

In order to initialize your system to be able to connect to your AWS cloud resources see [Amazon's documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) on configuring your credential file. [Dolt](https://doltdb.com) also provides additional parameters you may need to provide when adding an AWS remote such as `aws-creds-profile`, and `aws-region`.`aws-creds-profile` allows you to select a profile from your credential file. If it is not provided then the default profile is used. `aws-region` allows you to specify the region in which your DynamoDB table and S3 bucket are located. If not provided, it will use the default region from the current profile.

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

## OCI

Oracle Cloud Infrastructure (OCI) remotes use Oracle Cloud Object Storage. You can create or use an existing OCI bucket to host one or more [Dolt](https://doltdb.com) remotes. To add an OCI remote provide a URL with the `oci://` protocol like so:

```
dolt remote add origin oci://BUCKET/path/for/remote
```

In order to initialize [Dolt](https://doltdb.com) to use your OCI credentials you will need to install the `oci` command line tool and run `oci session authenticate`. See the [Oracle document](https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/clitoken.htm) for details.

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

This starts a server listening on port 50051 for our grpc requests, and runs a file server on port 1234 which provides upload, and download functionality similar to S3 / GCS locally. We use the url `http://localhost:50051/test-org/test-repo` when adding a remote or cloning from this remote server.

## Dolt sql-server

A running [Dolt](https://doltdb.com) `sql-server` can expose all the databases on it through an HTTP(s) remote endpoint. To configure this, you include a `remotesapi:` configuration stanza inside the `config.yaml` file given to `sql-server` command. The stanza currently supports a single integer field, `port:`, which defines the TCP port the remotesapi endpoint will be exposed on. Providing a port will cause the sql-server process to run a remotesapi endpoint on the provided port. The listening IP address is the same as for the SQL server itself. If the MySQL server itself is configured with a TLS key and certificate then the endpoint will use the same TLS configuration as the SQL server endpoint itself and it will require HTTPS.

Authenticating to the remotesapi exposed on a `sql-server` works differently than authenticating to a typical HTTPS Dolt remote. Authentication to a sql-server remote is based on SQL users, passwords and grants, as opposed to the `dolt creds` functionality which is used above in DoltHub and DoltLab remotes. The Dolt client's `clone`, `fetch`, `pull`, and `push` commands support a `--user` parameter, which can be used to supply a username for authentication when interacting with the remote. The password to be used is supplied through an environment variable, `DOLT_REMOTE_PASSWORD`, which should be set to the appropriate value when the `clone`/`fetch`/`pull`/`push` command is run. This username and password correspond to a configured SQL user on the sql-server.

### Reading from sql-server
The `clone`,`fetch`, and `pull` operations require the SQL user must have a grant for the `CLONE_ADMIN` privilege on the server to which they are connecting. Here is an end-to-end example showing exposing the remotesapi on a running sql-server, granting a user permissions to a database on it, and then cloning that database from a Dolt client.

We configure the remotesapi to run on the `sql-server` and run the sql-server process:

```
$ cat config.yaml
remotesapi:
  port: 8080
$ dolt sql -q "create database exampledb"
$ dolt sql -q "create user 'exampleuser'@'%' identified by 'examplepassword'"
$ dolt sql -q "grant clone_admin on *.* to 'exampleuser'@'%'"
$ dolt sql-server --config config.yaml &
```

At this point, `dolt sql-server` is running on port `:3306` and its remotesapi endpoint is running on port `:8080`. We can clone `exampledb` from it:

```
$ DOLT_REMOTE_PASSWORD=examplepassword dolt clone --user exampleuser https://localhost:8080/exampledb exampledb
$ cd exampledb
$ dolt log --oneline
q17m6q60c9qnu85kf37r1bb78bdq7pac (HEAD -> main, remotes/origin/main) Initialize data repository
```

The `--user` and `DOLT_REMOTE_PASSWORD` settings are not stored in the local state of the remote configuration for the `clone`. All future `fetch` and `pull` invocations from the clone directory need to supply them in order to authenticate to the remote.

### Writing to sql-server
The `push` operation require the SQL user must have super user privileges to push the the server. Super user access is granted with the following command:

```
$ dolt sql -q "GRANT ALL PRIVILEGES ON exampledb.* TO 'exampleuser'@'%' WITH GRANT OPTION"
```

Similar to the read case described above, the `DOLT_REMOTE_PASSWORD` environment variable and the `--user` argument are used to authenticate:

```
$ DOLT_REMOTE_PASSWORD=examplepassword dolt push origin --user exampleuser HEAD:main
```