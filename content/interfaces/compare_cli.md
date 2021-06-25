
# Compare SQL and CLI

The first version of Dolt mutated data at rest in file systems.
Users `dolt clone` databases, and run Git commands like `dolt
checkout`, `dolt branch`, `dolt merge`, ...etc.

Dolt is increasingly used as
a server to accommodate UX and scaling challenges. When getting started
with Dolt, however, the cli is easiest way to experiment with editing
databases.

To compare, here is a file-system getting started:

```bash
$ sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | sudo bash'
$ mkdir my-database
$ cd my-database
$ dolt init
$ dolt sql -q "create table t1 (a int primary key, b int)"
$ dolt ls
```

The server requires every step above, including a server instantiation:

```bash
$ dolt sql-server -l trace --max-connections 10
```

and a separately downloaded client to interact with our server:

```bash
$ mysql --user=root --host=0.0.0.0 -p my_database
Enter password:
mysql> show tables;
+-------+
| Table |
+-------+
| t1    |
+-------+
1 row in set (0.00 sec)
```

Any tool that works with MySQL works equivalently with a Dolt server.
The downside is you need two tools: dolt for the server, something else
for the client.
