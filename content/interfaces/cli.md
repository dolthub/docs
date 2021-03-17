---
title: CLI
---

# CLI

## dolt init

### Command

`dolt init` - Create an empty Dolt data repository

### Synopsis

### Description

This command creates an empty Dolt data repository in the current directory.

Running dolt init in an already initialized directory will fail.

### Options

`--name`: The name used in commits to this repo. If not provided will be taken from `user.name` in the global config.

`--email`: The email address used. If not provided will be taken from `user.email` in the global config.

`--date`: Specify the date used in the initial commit. If not specified the current system time is used.

## dolt status

### Command

`dolt status` - Show the working status

### Synopsis

```text
            dolt status
```

### Description

Displays working tables that differ from the current HEAD commit, tables that differ from the staged tables, and tables that are in the working tree that are not tracked by dolt. The first are what you would commit by running `dolt commit>`; the second and third are what you could commit by running `dolt add .>` before running `dolt commit>`.

### Options

No options for this command.

## dolt add

### Command

`dolt add` - Add table contents to the list of staged tables

### Synopsis

```text
            dolt add [<table>...]
```

### Description

This command updates the list of tables using the current content found in the working root, to prepare the content staged for the next commit. It adds the current content of existing tables as a whole or remove tables that do not exist in the working root anymore.

This command can be performed multiple times before a commit. It only adds the content of the specified table\(s\) at the time the add command is run; if you want subsequent changes included in the next commit, then you must run dolt add again to add the new content to the index.

The dolt status command can be used to obtain a summary of which tables have changes that are staged for the next commit.

### Options

`<table>`:

Working table\(s\) to add to the list tables staged to be committed. The abbreviation '.' can be used to add all tables.

`-A`, `--all`: Stages any and all changes \(adds, deletes, and modifications\).

## dolt reset

### Command

`dolt reset` - Resets staged tables to their HEAD state

### Synopsis

```text
            dolt reset <tables>...

            dolt reset [--hard | --soft]
```

### Description

Sets the state of a table in the staging area to be that table's value at HEAD

`dolt reset <tables>...`" This form resets the values for all staged `<tables>` to their values at `HEAD`. \(It does not affect the working tree or the current branch.\)

```text
This means that `dolt reset <tables>` is the opposite of `dolt add <tables>`.

After running `dolt reset <tables>` to update the staged tables, you can use `dolt checkout` to check the
contents out of the staged tables to the working tables.
```

dolt reset . This form resets `all` staged tables to their values at HEAD. It is the opposite of `dolt add .`

### Options

`--hard`: Resets the working tables and staged tables. Any changes to tracked tables in the working tree since `<commit>` are discarded.

`--soft`: Does not touch the working tables, but removes all tables staged to be committed.

## dolt commit

### Command

`dolt commit` - Record changes to the repository

### Synopsis

```text
            dolt commit [options]
```

### Description

```text
Stores the current contents of the staged tables in a new commit along with a log message from the user describing the changes.

The content to be added can be specified by using dolt add to incrementally \"add\" changes to the staged tables before using the commit command (Note: even modified files must be \"added\").

The log message can be added with the parameter `-m <msg>`.  If the `<-m>` parameter is not provided an editor will be opened where you can review the commit and provide a log message.

The commit timestamp can be modified using the --date parameter.  Dates can be specified in the formats `<YYYY-MM-DD>`, `<YYYY-MM-DDTHH:MM:SS>`, or `<YYYY-MM-DDTHH:MM:SSZ07:00>` (where `<07:00>` is the time zone offset)."
```

### Options

`-m`, `--message`: Use the given `<msg>` as the commit message.

`-a`: Adds all edited files in working to staged.

`--allow-empty`: Allow recording a commit that has the exact same data as its sole parent. This is usually a mistake, so it is disabled by default. This option bypasses that safety.

`--date`: Specify the date used in the commit. If not specified the current system time is used.

`--author`: Specify an explicit author using the standard "A U Thor [author@example.com](mailto:author@example.com)" format.

## dolt sql

### Command

`dolt sql` - Runs a SQL query

### Synopsis

```text
            dolt sql [--multi-db-dir <directory>] [-r <result format>]

            dolt sql -q <query;query> [-r <result format>] -s <name> -m <message> [-b]

            dolt sql -q <query;query> --multi-db-dir <directory> [-r <result format>] [-b]

            dolt sql -x <name>

            dolt sql --list-saved
```

### Description

Runs a SQL query you specify. With no arguments, begins an interactive shell to run queries and view the results. With the `-q` option, runs the given query and prints any results, then exits.

By default, `-q` executes a single statement. To execute multiple SQL statements separated by semicolons, use `-b` to enable batch mode. Queries can be saved with `-s`. Alternatively `-x` can be used to execute a saved query by name. Pipe SQL statements to dolt sql \(no `-q`\) to execute a SQL import or update script.

By default this command uses the dolt data repository in the current working directory as the one and only database. Running with `--multi-db-dir <directory>` uses each of the subdirectories of the supplied directory \(each subdirectory must be a valid dolt data repository\) as databases. Subdirectories starting with '.' are ignored. Known limitations: - No support for creating indexes - No support for foreign keys - No support for column constraints besides NOT NULL - No support for default values - Joins can only use indexes for two table joins. Three or more tables in a join query will use a non-indexed join, which is very slow.

### Options

`-q`, `--query`: Runs a single query and exits

`-r`, `--result-format`: How to format result output. Valid values are tabular, csv, json. Defaults to tabular.

`-s`, `--save`: Used with --query, save the query to the query catalog with the name provided. Saved queries can be examined in the dolt\_query\_catalog system table.

`-x`, `--execute`: Executes a saved query with the given name

`-l`, `--list-saved`: Lists all saved queries

`-m`, `--message`: Used with --query and --save, saves the query with the descriptive message given. See also --name

`-b`, `--batch`: batch mode, to run more than one query with --query, separated by ';'. Piping input to sql with no arguments also uses batch mode

`--multi-db-dir`: Defines a directory whose subdirectories should all be dolt data repositories accessible as independent databases within

## dolt sql-server

### Command

`dolt sql-server` - Start a MySQL-compatible server.

### Synopsis

```text
            dolt sql-server --config <file>

            dolt sql-server [-H <host>] [-P <port>] [-u <user>] [-p <password>] [-t <timeout>] [-l <loglevel>] [--multi-db-dir <directory>] [-r]
```

### Description

By default, starts a MySQL-compatible server which allows only one user connection at a time to the dolt repository in the current directory. Any edits made through this server will be automatically reflected in the working set. This behavior can be modified using a yaml configuration file passed to the server via `--config <file>`, or by using the supported switches and flags to configure the server directly on the command line \(If `--config <file>` is provided all other command line arguments are ignored\). This is an example yaml configuration file showing all supported items and their default values:

```text
log_level: info

behavior:
    read_only: false
    autocommit: true

user:
    name: root
    password: ""

listener:
    host: localhost
    port: 3306
    max_connections: 1
    read_timeout_millis: 30000
    write_timeout_millis: 30000

databases: []
```

SUPPORTED CONFIG FILE FIELDS:

```text
    `vlog_level` - Level of logging provided. Options are: `trace`, `debug`, `info`, `warning`, `error`, and `fatal`.

    `behavior.read_only` - If true database modification is disabled

    `behavior.autocommit` - If true write queries will automatically alter the working set. When working with autocommit enabled it is highly recommended that listener.max_connections be set to 1 as concurrency issues will arise otherwise

    `user.name` - The username that connections should use for authentication

    `user.password` - The password that connections should use for authentication.

    `listener.host` - The host address that the server will run on.  This may be `localhost` or an IPv4 or IPv6 address

    `listener.port` - The port that the server should listen on

    `listener.max_connections` - The number of simultaneous connections that the server will accept

    `listener.read_timeout_millis` - The number of milliseconds that the server will wait for a read operation

    `listener.write_timeout_millis` - The number of milliseconds that the server will wait for a write operation

    `databases` - a list of dolt data repositories to make available as SQL databases. If databases is missing or empty then the working directory must be a valid dolt data repository which will be made available as a SQL database

    `databases[i].path` - A path to a dolt data repository

    `databases[i].name` - The name that the database corresponding to the given path should be referenced via SQL
```

If a config file is not provided many of these settings may be configured on the command line.

### Options

`--config`: When provided configuration is taken from the yaml config file and all command line parameters are ignored.

`-H`, `--host`: Defines the host address that the server will run on \(default `localhost`\)

`-P`, `--port`: Defines the port that the server will run on \(default `3306`\)

`-u`, `--user`: Defines the server user \(default `root`\)

`-p`, `--password`: Defines the server password \(default \`\`\)

`-t`, `--timeout`: Defines the timeout, in seconds, used for connections A value of `0` represents an infinite timeout \(default `30000`\)

`-r`, `--readonly`: Disables modification of the database

`-l`, `--loglevel`: Defines the level of logging provided Options are: `trace',`debug`,`info`,`warning`,`error`,`fatal`(default`info\`\)

`--multi-db-dir`: Defines a directory whose subdirectories should all be dolt data repositories accessible as independent databases.

`--no-auto-commit`: When provided sessions will not automatically commit their changes to the working set. Anything not manually committed will be lost.

## dolt log

### Command

`dolt log` - Show commit logs

### Synopsis

```text
            dolt log [-n <num_commits>] [<commit>]
```

### Description

Shows the commit logs

The command takes options to control what is shown and how.

### Options

`-n`, `--number`: Limit the number of commits to output

## dolt diff

### Command

`dolt diff` - Show changes between commits, commit and working tree, etc

### Synopsis

```text
            dolt diff [options] [<commit>] [<tables>...]

            dolt diff [options] <commit> <commit> [<tables>...]
```

### Description

Show changes between the working and staged tables, changes between the working tables and the tables within a commit, or changes between tables at two commits.

`dolt diff [--options] [<tables>...]` This form is to view the changes you made relative to the staging area for the next commit. In other words, the differences are what you could tell Dolt to further add but you still haven't. You can stage these changes by using dolt add.

`dolt diff [--options] <commit> [<tables>...]` This form is to view the changes you have in your working tables relative to the named `<commit>`. You can use HEAD to compare it with the latest commit, or a branch name to compare with the tip of a different branch.

`dolt diff [--options] <commit> <commit> [<tables>...]` This is to view the changes between two arbitrary `commit`.

The diffs displayed can be limited to show the first N by providing the parameter `--limit N` where `N` is the number of diffs to display.

In order to filter which diffs are displayed `--where key=value` can be used. The key in this case would be either `to_COLUMN_NAME` or `from_COLUMN_NAME`. where `from_COLUMN_NAME=value` would filter based on the original value and `to_COLUMN_NAME` would select based on its updated value.

### Options

`-d`, `--data`: Show only the data changes, do not show the schema changes \(Both shown by default\).

`-s`, `--schema`: Show only the schema changes, do not show the data changes \(Both shown by default\).

`--summary`: Show summary of data changes

`-q`, `--sql`: Output diff as a SQL patch file of `INSERT` / `UPDATE` / `DELETE` statements

`--where`: filters columns based on values in the diff. See `dolt diff --help` for details.

`--limit`: limits to the first N diffs.

## dolt blame

### Command

`dolt blame` - Show what revision and author last modified each row of a table

### Synopsis

```text
            dolt blame [<rev>] <tablename>
```

### Description

Annotates each row in the given table with information from the revision which last modified the row. Optionally, start annotating from the given revision.

### Options

No options for this command.

## dolt merge

### Command

`dolt merge` - Join two or more development histories together

### Synopsis

```text
            dolt merge <branch>

            dolt merge --abort
```

### Description

Incorporates changes from the named commits \(since the time their histories diverged from the current branch\) into the current branch.

The second syntax \(`<dolt merge --abort>`\) can only be run after the merge has resulted in conflicts. git merge `--abort` will abort the merge process and try to reconstruct the pre-merge state. However, if there were uncommitted changes when the merge started \(and especially if those changes were further modified after the merge was started\), dolt merge `--abort` will in some cases be unable to reconstruct the original \(pre-merge\) changes. Therefore:

`<Warning>`: Running dolt merge with non-trivial uncommitted changes is discouraged: while possible, it may leave you in a state that is hard to back out of in the case of a conflict.

### Options

`--abort`: Abort the current conflict resolution process, and try to reconstruct the pre-merge state.

If there were uncommitted working set changes present when the merge started, `dolt merge --abort` will be unable to reconstruct these changes. It is therefore recommended to always commit or stash your changes before running git merge.

## dolt branch

### Command

`dolt branch` - List, create, or delete branches

### Synopsis

```text
            dolt branch [--list] [-v] [-a]

            dolt branch [-f] <branchname> [<start-point>]

            dolt branch -m [-f] [<oldbranch>] <newbranch>

            dolt branch -c [-f] [<oldbranch>] <newbranch>

            dolt branch -d [-f] <branchname>...
```

### Description

If `--list` is given, or if there are no non-option arguments, existing branches are listed; the current branch will be highlighted with an asterisk.

The command's second form creates a new branch head named `<branchname>` which points to the current `HEAD`, or `<start-point>` if given.

Note that this will create the new branch, but it will not switch the working tree to it; use `dolt checkout <newbranch>` to switch to the new branch.

With a `-m`, `<oldbranch>` will be renamed to `<newbranch>`. If `<newbranch>` exists, -f must be used to force the rename to happen.

The `-c` options have the exact same semantics as `-m`, except instead of the branch being renamed it will be copied to a new name.

With a `-d`, `<branchname>` will be deleted. You may specify more than one branch for deletion.

### Options

`<start-point>`:

A commit that a new branch should point at.

`--list`: List branches

`-f`, `--force`: Reset `<branchname>` to `<startpoint>`, even if `<branchname>` exists already. Without `-f`, `dolt branch` refuses to change an existing branch. In combination with `-d` \(or `--delete`\), allow deleting the branch irrespective of its merged status. In combination with -m \(or `--move`\), allow renaming the branch even if the new branch name already exists, the same applies for `-c` \(or `--copy`\).

`-c`, `--copy`: Create a copy of a branch.

`-m`, `--move`: Move/rename a branch

`-d`, `--delete`: Delete a branch. The branch must be fully merged in its upstream branch.

`--D`: Shortcut for `--delete --force`.

`-v`, `--verbose`: When in list mode, show the hash and commit subject line for each head

`-a`, `--all`: When in list mode, shows remote tracked branches

## dolt checkout

### Command

`dolt checkout` - Switch branches or restore working tree tables

### Synopsis

```text
            dolt checkout <branch>

            dolt checkout <table>...

            dolt checkout -b <new-branch> [<start-point>]
```

### Description

Updates tables in the working set to match the staged versions. If no paths are given, dolt checkout will also update HEAD to set the specified branch as the current branch.

dolt checkout `<}branch>` To prepare for working on `<}branch>`, switch to it by updating the index and the tables in the working tree, and by pointing HEAD at the branch. Local modifications to the tables in the working tree are kept, so that they can be committed to the `<}branch>`.

dolt checkout -b `<}new_branch>` \[`<}start_point>`\] Specifying -b causes a new branch to be created as if dolt branch were called and then checked out.

dolt checkout `<}table>`... To update table\(s\) with their values in HEAD

### Options

`--b`: Create a new branch named `<new_branch>` and start it at `<start_point>`.

## dolt remote

### Command

`dolt remote` - Manage set of tracked repositories

### Synopsis

```text
            dolt remote [-v | --verbose]

            dolt remote add [--aws-region <region>] [--aws-creds-type <creds-type>] [--aws-creds-file <file>] [--aws-creds-profile <profile>] <name> <url>

            dolt remote remove <name>
```

### Description

With no arguments, shows a list of existing remotes. Several subcommands are available to perform operations on the remotes.

`add` Adds a remote named `<name>` for the repository at `<url>`. The command dolt fetch `<name>` can then be used to create and update remote-tracking branches `<name>/<branch>`.

The `<url>` parameter supports url schemes of http, https, aws, gs, and file. If a url scheme does not prefix the url then https is assumed. If the `<url>` paramenter is in the format `<organization>/<repository>` then dolt will use the `remotes.default_host` from your configuration file \(Which will be dolthub.com unless changed\).

AWS cloud remote urls should be of the form `aws://[dynamo-table:s3-bucket]/database`. You may configure your aws cloud remote using the optional parameters `aws-region`, `aws-creds-type`, `aws-creds-file`.

aws-creds-type specifies the means by which credentials should be retrieved in order to access the specified cloud resources \(specifically the dynamo table, and the s3 bucket\). Valid values are 'role', 'env', or 'file'.

```text
\trole: Use the credentials installed for the current user
\tenv: Looks for environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
\tfile: Uses the credentials file specified by the parameter aws-creds-file
```

GCP remote urls should be of the form gs://gcs-bucket/database and will use the credentials setup using the gcloud command line available from Google +

The local filesystem can be used as a remote by providing a repository url in the format file://absolute path. See [here](https://en.wikipedia.org/wiki/File_URI_scheme) for details. `remove`, `rm`, Remove the remote named `<name>`. All remote-tracking branches and configuration settings for the remote are removed.

### Options

`<region>`:

cloud provider region associated with this remote.

`<creds-type>`:

credential type. Valid options are role, env, and file. See the help section for additional details.

`<profile>`:

AWS profile to use.

`-v`, `--verbose`: When printing the list of remotes adds additional details.

`--aws-region`

`--aws-creds-type`

`--aws-creds-file`: AWS credentials file

`--aws-creds-profile`: AWS profile to use

## dolt push

### Command

`dolt push` - Update remote refs along with associated objects

### Synopsis

```text
            dolt push [-u | --set-upstream] [<remote>] [<refspec>]
```

### Description

Updates remote refs using local refs, while sending objects necessary to complete the given refs.

When the command line does not specify where to push with the `<remote>` argument, an attempt is made to infer the remote. If only one remote exists it will be used, if multiple remotes exists, a remote named 'origin' will be attempted. If there is more than one remote, and none of them are named 'origin' then the command will fail and you will need to specify the correct remote explicitly.

When the command line does not specify what to push with `<refspec>`... then the current branch will be used.

When neither the command-line does not specify what to push, the default behavior is used, which corresponds to the current branch being pushed to the corresponding upstream branch, but as a safety measure, the push is aborted if the upstream branch does not have the same name as the local one.

### Options

`-u`, `--set-upstream`: For every branch that is up to date or successfully pushed, add upstream \(tracking\) reference, used by argument-less `dolt pull` and other commands.

`-f`, `--force`: Update the remote with local history, overwriting any conflicting history in the remote.

## dolt pull

### Command

`dolt pull` - Fetch from and integrate with another repository or a local branch

### Synopsis

```text
            dolt pull <remote>
```

### Description

Incorporates changes from a remote repository into the current branch. In its default mode, `dolt pull` is shorthand for `dolt fetch` followed by `dolt merge <remote>/<branch>`.

More precisely, dolt pull runs `dolt fetch` with the given parameters and calls `dolt merge` to merge the retrieved branch `HEAD` into the current branch.

### Options

No options for this command.

## dolt fetch

### Command

`dolt fetch` - Download objects and refs from another repository

### Synopsis

```text
            dolt fetch [<remote>] [<refspec> ...]
```

### Description

Fetch refs, along with the objects necessary to complete their histories and update remote-tracking branches.

By default dolt will attempt to fetch from a remote named `origin`. The `<remote>` parameter allows you to specify the name of a different remote you wish to pull from by the remote's name.

When no refspec\(s\) are specified on the command line, the fetch\_specs for the default remote are used.

### Options

`-f`, `--force`: Update refs to remote branches with the current state of the remote, overwriting any conflicting history.

## dolt clone

### Command

`dolt clone` - Clone a data repository into a new directory

### Synopsis

```text
            dolt clone [-remote <remote>] [-branch <branch>]  [--aws-region <region>] [--aws-creds-type <creds-type>] [--aws-creds-file <file>] [--aws-creds-profile <profile>] <remote-url> <new-dir>
```

### Description

Clones a repository into a newly created directory, creates remote-tracking branches for each branch in the cloned repository \(visible using `<dolt branch -a>`\), and creates and checks out an initial branch that is forked from the cloned repository's currently active branch.

After the clone, a plain `dolt fetch` without arguments will update all the remote-tracking branches, and a `dolt pull` without arguments will in addition merge the remote branch into the current branch.

This default configuration is achieved by creating references to the remote branch heads under `<refs/remotes/origin>` and by creating a remote named 'origin'.

### Options

`--remote`: Name of the remote to be added. Default will be 'origin'.

`-b`, `--branch`: The branch to be cloned. If not specified all branches will be cloned.

`--aws-region`

`--aws-creds-type`

`--aws-creds-file`: AWS credentials file.

`--aws-creds-profile`: AWS profile to use.

## dolt login

### Command

`dolt login` - Login to DoltHub

### Synopsis

```text
            dolt login [<creds>]
```

### Description

Login into DoltHub using the email in your config so you can pull from private repos and push to those you have permission to.

### Options

`<creds>`:

A specific credential to use for login.

## dolt config

### Command

`dolt config` - Get and set repository or global options

### Synopsis

```text
            dolt config [--global|--local] --list

            dolt config [--global|--local] --add <name> <value>

            dolt config [--global|--local] --get <name>

            dolt config [--global|--local] --unset <name>...
```

### Description

You can query/set/replace/unset options with this command.

```text
When reading, the values are read from the global and repository local configuration files, and options `<--global>`, and `<--local>` can be used to tell the command to read from only that location.

When writing, the new value is written to the repository local configuration file by default, and options `<--global>`, can be used to tell the command to write to that location (you can say `<--local>` but that is the default).
```

### Options

`--global`: Use global config.

`--local`: Use repository local config.

`--add`: Set the value of one or more config parameters

`--list`: List the values of all config parameters.

`--get`: Get the value of one or more config parameters.

`--unset`: Unset the value of one or more config paramaters.

## dolt ls

### Command

`dolt ls` - List tables

### Synopsis

```text
            dolt ls [--options] [<commit>]
```

### Description

With no arguments lists the tables in the current working set but if a commit is specified it will list the tables in that commit. If the `--verbose` flag is provided a row count and a hash of the table will also be displayed.

If the `--system` flag is supplied this will show the dolt system tables which are queryable with SQL. Some system tables can be queried even if they are not in the working set by specifying appropriate parameters in the SQL queries. To see these tables too you may pass the `--verbose` flag.

If the `--all` flag is supplied both user and system tables will be printed.

### Options

`-v`, `--verbose`: show the hash of the table

`-s`, `--system`: show system tables

`-a`, `--all`: show system tables
