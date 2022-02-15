---
title: SQL Editors
---

# SQL Editors

Dolt comes with a built in MySQL compatible server that you can connect SQL Editors too. Here are a list of notable MySQL Editors and our compatibility status.
| Editor | Supported | Notes and limitations |
| :--- | :--- | :--- |
| [Tableplus](https://tableplus.com/) | ✅ | Recommended (see below) |
| [Navicat For Mysql](https://www.navicat.com/en/products/navicat-for-mysql) | ✅ | |
| [Dbeaver](https://dbeaver.io/) | ✅ | |
| [Datagrip](https://www.jetbrains.com/datagrip/) | ✅ | |
| [MySQL Workbench](https://www.mysql.com/products/workbench/) | ❌ | Missing some information schema materials |

## Setting up Dolt with Tableplus

[Tableplus](https://tableplus.com/) is the recommended SQL editor to use with dolt. Let's clone a Dolt repo and connect it to Tableplus.

### Step 1: Cloning a repository.

Open your terminal and clone the following [repository](https://www.dolthub.com/repositories/dolthub/ip-to-country/data/master).

```bash
dolt clone dolthub/ip-to-country && cd ip-to-country
```

Now run: `dolt sql -q 'show tables'` and you should see the following output

```bash
> dolt sql -q 'show tables'
+---------------+
| Table         |
+---------------+
| IPv4ToCountry |
| IPv6ToCountry |
+---------------+
```

### Step 2: Setting up your server

Some editors require custom configuration of dolt's [sql-server](https://docs.dolthub.com/reference/cli#dolt-sql-server). For example, DBeaver use multiple connections to run queries whereas `dolt sql-server` supports 1 connection out of the box. Here's a sample config file that should get you started with `dolt sql-server`. Save this in the `ip-to-country` directory we created above as `config.yaml`

```yaml
log_level: debug

user:
	name: root
	password: ""

listener:
	host: 0.0.0.0
	port: 3306
	max_connections: 10
	read_timeout_millis: 28800000
	write_timeout_millis: 28800000
```

Your directory should now look like this:
```bash
> ls -a
.           ..          .dolt       config.yaml
```

Now let's spin up our server

``` bash
> dolt sql-server --config=config.yaml
Starting server with Config HP="0.0.0.0:3306"|U="root"|P=""|T="28800000"|R="false"|L="debug"
```

Let's take a second to reflect on the above configuration file. We defined a server that can be accessed on host 0.0.0.0.0 and port 3306. It has a username of "root" and no password. It can support up to 10 concurrent connections and supports queries that timeout after `28800000` millseconds. At the top we defined how often Dolt's server outputs [logs](https://docs.dolthub.com/reference/cli#dolt-sql-server).

### Step 3: Connecting our server with Tableplus

If you haven't already go ahead and install Tableplus from [here](https://tableplus.com/download):

Click on create a new connection:

![](../.gitbook/assets/tableplus-create-new-connection.png)

Hit MySQL in the selection box and fill in the following information. Note all the parameters set here are exactly in the configuration file you defined above.

![](../.gitbook/assets/tableplus-connect-info.png)

When you hit `Test` you should see all the boxes turn green like in the above image. Finally, hit connect
to access the Dolt server.

### Step 4: Writing queries with Tableplus

Let's start by selecting a database in the Dolt server and writing queries against it.

![](../.gitbook/assets/select-db-tableplus.png)

Select the `ip_to_country` database. You should see tables populate to the left like below.

![](../.gitbook/assets/tables-on-left-tableplus.png)

Now click on the table `IPv4ToCountry` and see the screen populate. We just read from our Dolt database!

![](../.gitbook/assets/open-table-tableplus.png)

Finally, let's write a quick query on the dataset. Click the `SQL` button in the top left and write the query in the box. Hit the `Run Current` button to execute it and the results should appear:

![](../.gitbook/assets/run-query-tableplus.png)

That's it you've successfully connected Dolt to Tableplus and ran your first query!