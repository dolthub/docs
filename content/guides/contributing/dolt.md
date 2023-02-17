# dolt

Here, we will go through a fix for this [bug where Dolt wasn't respecting a config flag](https://github.com/dolthub/dolt/issues/2442) to demonstrate how to make a change to [Dolt](https://github.com/dolthub/dolt).

## Setup

Follow these [setup instructions](./).

## Identifying the Bug

Dolt has the ability to host a SQL server and take in user queries to create, modify, and drop tables. The server allows users to provide a config file through the `--config` option. A customer claimed that the `read_only` flag in their config file was not being respected when using the dolt server; this means that the server was allowing users to run queries that modified data on the server.

First off, let's try to reproduce the issue. Create a dolt database:

```bash
$ cd ~/dolt_workspace
$ mkdir test_db
$ cd test_db
$ dolt init
```

Create a config file named `config.yml` and put this in it:

```
log_level: debug
user:
  name: dolt
listener:
  host: "0.0.0.0"
  port: $PORT
behavior:
  read_only: true
```

We have a file called `pytest.py` located in `~/dolt_workspace/dolt/integration-tests/bats/helper`, which contains many useful helper methods for testing dolt sql-server. I wrote a quick Python script using methods from `pytest.py` to send queries and look at the results manually.

```python
from pytest import *
# Create a new connection
dc = DoltConnection(port=3000, database="test_db", user="dolt", auto_commit=1)
dc.connect()
try:
    actual_rows, num_rows = dc.query("create table t(a int)", False)
    print("no problems")
except BaseException as e:
    print('caught exception:', str(e))
```

In one terminal, start the dolt sql-server:

```bash
$ dolt sql-server --host 0.0.0.0 --port=3000 --user dolt --config ./config.yml
```

In another, run the python script.

```bash
$ python sqltest.py
no problems
```

In this case "no problems" is actually bad, since we expected the server to return an error.

## Fixing the Bug

I highly recommend using an IDE like [Goland](https://www.jetbrains.com/go/) especially when debugging larger projects.

After poking around in the code, we see that the config file containing user permissions is used to create a new `sqlengine`.

```go
serverConf.Address = hostPort
serverConf.Auth = userAuth
serverConf.ConnReadTimeout = readTimeout
serverConf.ConnWriteTimeout = writeTimeout
serverConf.MaxConnections = serverConfig.MaxConnections()
serverConf.TLSConfig = tlsConfig
serverConf.RequireSecureTransport = serverConfig.RequireSecureTransport()
sqlEngine, err := engine.NewSqlEngine(ctx, mrEnv, engine.FormatTabular, "", serverConfig.AutoCommit())
```

For some reason, the `NewSqlEngine` constructor creates a new authenticator using `auth.None`, which always gives users full permissions. Instead, we should be passing in the authenticator already created that is based on permissions specified in the config file.

```
// NewSqlEngine returns a SqlEngine
func NewSqlEngine(
	ctx context.Context,
	mrEnv *env.MultiRepoEnv,
	format PrintResultFormat,
	initialDb string,
+	au auth.Auth,
	autocommit bool) (*SqlEngine, error) {
-	au := new(auth.None)
```

The method call to `NewSqlEngine` now looks like this:

```go
sqlEngine, err := engine.NewSqlEngine(ctx, mrEnv, engine.FormatTabular, "", serverConf.Auth, serverConfig.AutoCommit())
```

## Testing

After [reinstalling](./#install-dolt) dolt and running the python script, we get an exception as expected.

```bash
$ python sqltest.py
caught exception: 1105 (HY000): not authorized: user does not have permission: write
```

A better way to test this is to use a [bats](https://github.com/sstephenson/bats) tests, which are located in [`~/dolt_workspace/dolt/integration-tests/bats`](https://github.com/dolthub/dolt/tree/main/integration-tests/bats). You can install bats through npm

```bash
$ npm install -g bats
```

This test basically creates a config file (with the read-only flag set to true), starts a dolt sql-server using the config file, sends a query to create a table, and checks to see if that table was created. So, it's an automated way to do everything we did earlier.

```
@test "sql-server: read-only flag prevents modification" {
    skiponwindows "Has dependencies that are missing on the Jenkins Windows installation."
    cd repo1
    DEFAULT_DB="$1"
    let PORT="$$ % (65536-1024) + 1024"
    cat >config.yml <<EOF
log_level: debug
user:
  name: dolt
listener:
  host: "0.0.0.0"
  port: $PORT
behavior:
  read_only: true
EOF
    dolt sql-server --host 0.0.0.0 --port=$PORT --user dolt --config ./config.yml &
    SERVER_PID=$!
    wait_for_connection $PORT 5000
    # No tables at the start
    run dolt ls
    [ "$status" -eq 0 ]
    [[ "$output" =~ "No tables in working set" ]] || false
    # attempt to create table (autocommit on), expect either some exception
    server_query repo1 1 "CREATE TABLE i_should_not_exist (
            c0 INT
        )" "" "not authorized: user does not have permission: write"
    # Expect that there are still no tables
    run dolt ls
    [ "$status" -eq 0 ]
    [[ "$output" =~ "No tables in working set" ]] || false
}
```

Then, I ran the test using this shell script placed in the `~/dolt_workspace/dolt` directory:

```bash
#!/bin/bash
cd go/cmd/dolt && go install . && cd -
cd go/cmd/git-dolt && go install . && cd -
cd go/cmd/git-dolt-smudge && go install . && cd -
cd go/store/cmd/noms && go install . && cd -
cd integration-tests/bats && bats sql-server.bats && cd -
```

As expected, this test passes.

```bash
$ test.sh
...
 ✓ sql-server: read-only flag prevents modification
...
```

## Submit Changes

Use git to commit and push our changes.

If you are unfamiliar with how to create a Pull Request, follow the instructions [here](./#submit-pull-request).
