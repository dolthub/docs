---
title: Application Server
---

These instructions are for bootstrapping dolt as an application
database server. They assume you are starting from scratch on a Linux
machine without dolt installed or running.

Package manager support (`.deb` and `.rpm` distributions) is coming
soon, but for now this set of manual setup work is necessary.

We have the instructions below packaged in a script [here](../../.gitbook/assets/deploy-server.sh).

# Installation

Install dolt. Run the following command:

```bash
sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | sudo bash'
```

This script puts the `dolt` binary in `/usr/local/bin`, which is
probably on your `$PATH`. If it isn't add it there or use use the
absolute path of the `dolt` binary for next steps.

# Configuration

Create a system account for the dolt user to run the server.

```bash
sudo useradd -r -m -d /var/lib/doltdb dolt
```

Before running the server, you need to give this user a name and
email, which it will use to create its commits. Choose a dolt system
account for your product or company.

```bash
$ cd /var/lib/doltdb
$ sudo -u dolt dolt config --global --add user.email doltServer@company.com
$ sudo -u dolt dolt config --global --add user.name "Dolt Server Account"
```

You can override this user for future commits with the `--author`
flag, but this will be default author of every commit in the server.

# Database creation

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

# Start the server

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
ExecStart=/usr/local/bin/dolt sql-server -u root
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
sudo systemctl daemon-reload
sudo systemctl enable doltdb.service
sudo systemctl start doltdb
```

The dolt sql server will now be running as a daemon. Test connecting
to it with any SQL shell. Here we are using the mysql shell to connect.

```bash
mysql -h 127.0.0.1 -u root -p''
```

Note that by default, Dolt runs on the same port as MySQL (3306). If
you have MySQL installed on the same host, choose a different port for
the server with the `-P` argument.

# Users and passwords

With the above settings, dolt runs with a single user `root` and an
empty password. Dolt currently supports a single user and password. To
change the name and password of the SQL user, provide a config file as
described in the [`sql-server`](../../reference/cli/cli.md#dolt-sql-server)
docs.

Other configuration such as logging behavior, timeouts, etc. are
available via this method as well.

# Other Linux distributions

These instructions should work for Debian, Ubuntu, Amazon Linux, and many other common
distributions. If you find they don't work for yours and you would like your distribution
documented, come chat with us on [Discord](https://discord.gg/s8uVgc3) or [submit a
PR](https://github.com/dolthub/docs) to update the docs.
