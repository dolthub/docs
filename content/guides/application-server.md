---
title: Application Server
---

# Application Server

These instructions are for bootstrapping dolt as an application
database server. They assume you are starting from scratch on a
machine without dolt installed or running.

## Installation

Install dolt. Use an [installation script for your
platform](../getting-started/installation.md). For Linux, run the
following command:

```bash
sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | sudo bash'
```

This script puts the `dolt` binary in `/usr/local/bin`, which is
probably on your `$PATH`. If it isn't add it there or use use the
absolute path of the `dolt` binary for next steps.

Package manager support (`.deb` and `.rpm` distributions) is coming
soon.

## Configuration

Create a system account for the dolt user to run the server.

```bash
useradd -r -m -d /var/lib/doltdb dolt
```

Before running the server, you need to give it a user and email, which
it will use to create its commits. Choose a dolt system account for
your product or company.

```bash
$ sudo -u dolt dolt config --global --add user.email doltServer@company.com
$ sudo -u dolt dolt config --global --add user.name "Dolt Server Account"
```

You can override this user for future commits with the --author flag,
but this will be default author of every commit in the server.

## Database creation

Before running the dolt server for the first time, you need to create
a database. Choose a directory within `/var/lib/doltdb/databases`
where you want your dolt data to live. Name the directory the same as
the name of your database.

```bash
cd /var/lib/doltdb
sudo -u dolt mkdir -p databases/my_db
cd databases/my_db
sudo -u dolt dolt init
```

You should see output indicating that the database has been
initialized:

```bash
Successfully initialized dolt data repository.
```

## Start the server

Assuming you want your dolt server to always be running when the
machine is alive, you should configure it to run through the Linux
service management tool, `systemctl`. Some distributions of Linux do
not support this tool; consult their documentation for configuration
instructions.

Write the server's config file in your home directory, then move it to
where `systemctl` needs it to live.

```bash
cd ~
cat > doltdb.service <<EOF
[Unit]
Description=dolt SQL server
After=network.target

[Install]
WantedBy=multi-user.target

[Service]
User=dolt
Group=dolt
ExecStart=/usr/local/bin/dolt sql-server -u root -p pass
WorkingDirectory=/var/lib/doltdb/databases/my_db
KillSignal=SIGTERM
SendSIGKILL=no
EOF

sudo chown root:root doltdb.service
sudo chmod 644 doltdb.service
sudo mv doltdb.service /etc/systemd/system
```

Finally, start the server as a system daemon.

```bash
systemctl daemon-reload
systemctl enable doltdb.service
systemctl start doltdb
```

The dolt sql server will now be running as a daemon. Test connecting
to it with any SQL shell. Here we are using the mysql shell to connect.

```bash
mysql -h 127.0.0.1 -u root -ppass
```

Note that by default, Dolt runs on the same port as MySQL (3306). If
you have MySQL installed on the same host, choose a different port for
the server with `-P`.
