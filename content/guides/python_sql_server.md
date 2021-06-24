# SQL-Server with Python Clients

Any programming language or language package with a MySQL
client can also connect to Dolt. Here we will discuss Python specific
MySQL clients.

Dolt is 99% MySQL compatible. Dolt also parses additional commands
specific to version controlling. ([this blog gives a good
introduction](https://www.dolthub.com/blog/2021-03-12-dolt-sql-server-concurrency/).

The full superset of MySQL commands that Dolt supports can be found
[here](https://docs.dolthub.com/interfaces/sql/sql-support).


## Starting a Dolt Server

Install Dolt:

```bash
$ sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | sudo bash'
```

Create or clone a database:

```bash
$ mkdir new-databasse
$ cd new-database
$ dolt init
```

Start a server:

```bash
$ dolt sql-server -l trace --max-connections 10
```

Test connection in a different window:

```bash
$ mysql --user=root --host=0.0.0.0 -p new_database
Enter password:
mysql >
```

## Clients

### PyMySQL

### SQLAlchemy

### Pandas
