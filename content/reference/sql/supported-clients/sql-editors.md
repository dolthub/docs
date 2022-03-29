---
title: SQL Editors
---

# SQL Editors

Dolt comes with a built-in MySQL compatible server, making it easy to connect to your Dolt databases with existing SQL tooling. Here are a list of notable MySQL Editors and our compatibility status.
| Editor | Supported | Notes and limitations |
| :--- | :--- | :--- |
| [Tableplus](https://tableplus.com/) | ✅ | Recommended (see below) |
| [Datagrip](https://www.jetbrains.com/datagrip/) | ✅ | |
| [MySQL Workbench](https://www.mysql.com/products/workbench/) | ❌ | Missing some information schema materials |

## Setting up Dolt with Tableplus

[Tableplus](https://tableplus.com/) is the recommended SQL editor to use with Dolt. Let's clone a Dolt database and connect it to Tableplus. We have a [video](https://www.youtube.com/watch?v=0FkYraVqNjM) that walks through this experience as well. 

### Step 1: Cloning a database.

Open your terminal and clone the following [database](https://www.dolthub.com/repositories/dolthub/ip-to-country/data/master).

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

Dolt's sql server can be started with one command.

``` bash
> dolt sql-server
Starting server with Config HP="0.0.0.0:3306"|U="root"|P=""|T="28800000"|R="false"|L="info"
```

The default configuration for our server uses a username of `root` and an empty password. You can configure access settings, logging, and timeouts by following additional documentation [here](https://docs.dolthub.com/reference/cli#dolt-sql-server).

### Step 3: Connecting our server with Tableplus

If you haven't already go ahead and install Tableplus from [here](https://tableplus.com/download):

Click on create a new connection:

![](../.gitbook/assets/tableplus-create-new-connection.png)

Hit MySQL in the selection box and fill in the following information. All the parameters are the same as for any MySQL database.

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

That's it! You've successfully connected Dolt to Tableplus and ran your first query.

If you have any additional issues please file them [here](https://github.com/dolthub/dolt/issues).
