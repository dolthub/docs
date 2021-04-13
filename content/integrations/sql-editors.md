---
title: MySQL Editors
---

Dolt comes with a built in MySQL compatible server that you can connect SQL Editors too. Here are a list of notable MySQL Editors and our compatibilty status. 
| Editor | Supported | Notes and limitations |
| :--- | :--- | :--- |
| [Tableplus](https://tableplus.com/) | ✓ |  |
| [Navicat For Mysql](https://www.navicat.com/en/products/navicat-for-mysql) | ✓ |  |
| [Dbeaver](https://dbeaver.io/) | ✓ |  |
| [Datagrip](https://www.jetbrains.com/datagrip/) | X | Need to implement a couple functions |
| [MySQL Workbench](https://www.mysql.com/products/workbench/) | X | Missing some information schema materials |

### Config Customization
Some editors require custom configuration of dolt's sql-server. For example, DBeaver use multiple connections to run queries whereas `dolt sql-server` supports 1 connection out of the box. Here's a sample config file that should get you started with `dolt sql-server`

<div class="gatsby-highlight" data-language="text">
	<pre class="By default, starts a MySQL-compatible server whilanguage-text">
		<code class="language-text">

log_level: trace

behavior:
  read_only: false
  autocommit: true

user:
  name: root
  password: ""

listener:
  host: localhost
  port: 3306
  max_connections: 10
  read_timeout_millis: 28800000
  write_timeout_millis: 28800000
  		</code>
	</pre>
</div>

NOTE: Dolt does not support SSL yet, so be sure to turn it off on your editor before connecting.

You can see this [section](https://docs.dolthub.com/interfaces/cli#dolt-sql-server) to learn more about each part of our config file. 

If there are other editors that you want us to be compatible with please do not hesitate to reach out!

