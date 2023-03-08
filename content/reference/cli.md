---
title: CLI
---

# CLI

## `dolt add`

Add table contents to the list of staged tables

**Synopsis**

```bash
dolt add [<table>...]
```

**Description**


This command updates the list of tables using the current content found in the working root, to prepare the content staged for the next commit. It adds the current content of existing tables as a whole or remove tables that do not exist in the working root anymore.

This command can be performed multiple times before a commit. It only adds the content of the specified table(s) at the time the add command is run; if you want subsequent changes included in the next commit, then you must run dolt add again to add the new content to the index.

The dolt status command can be used to obtain a summary of which tables have changes that are staged for the next commit.

**Arguments and options**

`<table>`: Working table(s) to add to the list tables staged to be committed. The abbreviation '.' can be used to add all tables.

`-A`, `--all`:
Stages any and all changes (adds, deletes, and modifications).



## `dolt backup`

Manage server backups

**Synopsis**

```bash
dolt backup [-v | --verbose]
dolt backup add [--aws-region <region>] [--aws-creds-type <creds-type>] [--aws-creds-file <file>] [--aws-creds-profile <profile>] <name> <url>
dolt backup remove <name>
dolt backup restore <url> <name>
dolt backup sync <name>
dolt backup sync-url [--aws-region <region>] [--aws-creds-type <creds-type>] [--aws-creds-file <file>] [--aws-creds-profile <profile>] <url>
```

**Description**

With no arguments, shows a list of existing backups. Several subcommands are available to perform operations on backups, point in time snapshots of a database's contents.

`add`
Adds a backup named `<name>` for the database at `<url>`.
The `<url>` parameter supports url schemes of http, https, aws, gs, and file. The url prefix defaults to https. If the `<url>` parameter is in the format `<organization>/<repository>` then dolt will use the `backups.default_host` from your configuration file (Which will be dolthub.com unless changed).
The URL address must be unique to existing remotes and backups.

AWS cloud backup urls should be of the form `aws://[dynamo-table:s3-bucket]/database`. You may configure your aws cloud backup using the optional parameters `aws-region`, `aws-creds-type`, `aws-creds-file`.

aws-creds-type specifies the means by which credentials should be retrieved in order to access the specified cloud resources (specifically the dynamo table, and the s3 bucket). Valid values are 'role', 'env', or 'file'.

	role: Use the credentials installed for the current user
	env: Looks for environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
	file: Uses the credentials file specified by the parameter aws-creds-file
	
GCP backup urls should be of the form gs://gcs-bucket/database and will use the credentials setup using the gcloud command line available from Google.

The local filesystem can be used as a backup by providing a repository url in the format file://absolute path. See https://en.wikipedia.org/wiki/File_URI_scheme

`remove`, `rm`
Remove the backup named `<name>`. All configuration settings for the backup are removed. The contents of the backup are not affected.

`restore`
Restore a Dolt database from a given `<url>` into a specified directory `<url>`.

`sync`
Snapshot the database and upload to the backup `<name>`. This includes branches, tags, working sets, and remote tracking refs.
	
`sync-url`
Snapshot the database and upload the backup to `<url>`. Like sync, this includes branches, tags, working sets, and remote tracking refs, but it does not require you to create a named backup

**Arguments and options**

`<region>`: cloud provider region associated with this backup.

`<creds-type>`: credential type.  Valid options are role, env, and file.  See the help section for additional details.

`<profile>`: AWS profile to use.

`-v`, `--verbose`:
When printing the list of backups adds additional details.

`--aws-region`

`--aws-creds-type`

`--aws-creds-file`:
AWS credentials file

`--aws-creds-profile`:
AWS profile to use



## `dolt blame`

Show what revision and author last modified each row of a table

**Synopsis**

```bash
dolt blame [<rev>] <tablename>
```

**Description**

Annotates each row in the given table with information from the revision which last modified the row. Optionally, start annotating from the given revision.

**Arguments and options**

No options for this command.

## `dolt branch`

List, create, or delete branches

**Synopsis**

```bash
dolt branch [--list] [-v] [-a] [-r]
dolt branch [-f] <branchname> [<start-point>]
dolt branch -m [-f] [<oldbranch>] <newbranch>
dolt branch -c [-f] [<oldbranch>] <newbranch>
dolt branch -d [-f] [-r] <branchname>...
```

**Description**

If `--list` is given, or if there are no non-option arguments, existing branches are listed. The current branch will be highlighted with an asterisk. With no options, only local branches are listed. With `-r`, only remote branches are listed. With `-a` both local and remote branches are listed. `-v` causes the hash of the commit that the branches are at to be printed as well.

The command's second form creates a new branch head named `<branchname>` which points to the current `HEAD`, or `<start-point>` if given.

Note that this will create the new branch, but it will not switch the working tree to it; use `dolt checkout <newbranch>` to switch to the new branch.

With a `-m`, `<oldbranch>` will be renamed to `<newbranch>`. If `<newbranch>` exists, -f must be used to force the rename to happen.

The `-c` options have the exact same semantics as `-m`, except instead of the branch being renamed it will be copied to a new name.

With a `-d`, `<branchname>` will be deleted. You may specify more than one branch for deletion.

**Arguments and options**

`<start-point>`: A commit that a new branch should point at.

`-f`, `--force`:
Reset `<branchname>` to `<startpoint>`, even if `<branchname>` exists already. Without `-f`, `dolt branch` refuses to change an existing branch. In combination with `-d` (or `--delete`), allow deleting the branch irrespective of its merged status. In combination with -m (or `--move`), allow renaming the branch even if the new branch name already exists, the same applies for `-c` (or `--copy`).

`-c`, `--copy`:
Create a copy of a branch.

`-m`, `--move`:
Move/rename a branch

`-d`, `--delete`:
Delete a branch. The branch must be fully merged in its upstream branch.

`--D`:
Shortcut for `--delete --force`.

`-t`, `--track`:
When creating a new branch, set up 'upstream' configuration.

`--list`:
List branches

`-v`, `--verbose`:
When in list mode, show the hash and commit subject line for each head

`-a`, `--all`:
When in list mode, shows remote tracked branches

`--datasets`:
List all datasets in the database

`-r`, `--remote`:
When in list mode, show only remote tracked branches. When with -d, delete a remote tracking branch.

`--show-current`:
Print the name of the current branch



## `dolt checkout`

Switch branches or restore working tree tables

**Synopsis**

```bash
dolt checkout <branch>
dolt checkout <table>...
dolt checkout -b <new-branch> [<start-point>]
dolt checkout --track <remote>/<branch>
```

**Description**


Updates tables in the working set to match the staged versions. If no paths are given, dolt checkout will also update HEAD to set the specified branch as the current branch.

dolt checkout `<branch>`
   To prepare for working on `<branch>`, switch to it by updating the index and the tables in the working tree, and by pointing HEAD at the branch. Local modifications to the tables in the working
   tree are kept, so that they can be committed to the `<branch>`.

dolt checkout -b `<new_branch>` [`<start_point>`]
   Specifying -b causes a new branch to be created as if dolt branch were called and then checked out.

dolt checkout `<table>`...
  To update table(s) with their values in HEAD 

**Arguments and options**

`--b`:
Create a new branch named `<new_branch>` and start it at `<start_point>`.

`-f`, `--force`:
If there is any changes in working set, the force flag will wipe out the current changes and checkout the new branch.

`-t`, `--track`:
When creating a new branch, set up 'upstream' configuration.



## `dolt cherry-pick`

Apply the changes introduced by an existing commit.

**Synopsis**

```bash
dolt cherry-pick <commit>
```

**Description**


Applies the changes from an existing commit and creates a new commit from the current HEAD. This requires your working tree to be clean (no modifications from the HEAD commit).

Cherry-picking merge commits or commits with schema changes or rename or drop tables is not currently supported. Row data changes are allowed as long as the two table schemas are exactly identical.

If applying the row data changes from the cherry-picked commit results in a data conflict, the cherry-pick operation is aborted and no changes are made to the working tree or committed.


**Arguments and options**

No options for this command.

## `dolt clean`

Deletes untracked working tables

**Synopsis**

```bash
dolt clean [--dry-run]
dolt clean [--dry-run] <tables>...
```

**Description**

`dolt clean [--dry-run]`

The default (parameterless) form clears the values for all untracked working `<tables>` .This command permanently deletes unstaged or uncommitted tables.

The `--dry-run` flag can be used to test whether the clean can succeed without deleting any tables from the current working set.

`dolt clean [--dry-run] `<tables>`...`

If `<tables>` is specified, only those table names are considered for deleting.



**Arguments and options**

`--dry-run`:
Tests removing untracked tables without modifying the working set.



## `dolt clone`

Clone a data repository into a new directory

**Synopsis**

```bash
dolt clone [-remote <remote>] [-branch <branch>]  [--aws-region <region>] [--aws-creds-type <creds-type>] [--aws-creds-file <file>] [--aws-creds-profile <profile>] <remote-url> <new-dir>
```

**Description**

Clones a repository into a newly created directory, creates remote-tracking branches for each branch in the cloned repository (visible using `<dolt branch -a>`), and creates and checks out an initial branch that is forked from the cloned repository's currently active branch.

After the clone, a plain `dolt fetch` without arguments will update all the remote-tracking branches, and a `dolt pull` without arguments will in addition merge the remote branch into the current branch.

This default configuration is achieved by creating references to the remote branch heads under `<refs/remotes/origin>`  and by creating a remote named 'origin'.


**Arguments and options**

`--remote`:
Name of the remote to be added to the cloned database. The default is 'origin'.

`-b`, `--branch`:
The branch to be cloned. If not specified all branches will be cloned.

`--aws-region`

`--aws-creds-type`

`--aws-creds-file`:
AWS credentials file.

`--aws-creds-profile`:
AWS profile to use.

`--oss-creds-file`:
OSS credentials file.

`--oss-creds-profile`:
OSS profile to use.



## `dolt commit`

Record changes to the database

**Synopsis**

```bash
dolt commit [options]
```

**Description**


Stores the current contents of the staged tables in a new commit along with a log message from the user describing the changes.

The content to be added can be specified by using dolt add to incrementally \"add\" changes to the staged tables before using the commit command (Note: even modified files must be \"added\").

The log message can be added with the parameter `-m <msg>`.  If the `<-m>` parameter is not provided an editor will be opened where you can review the commit and provide a log message.

The commit timestamp can be modified using the --date parameter.  Dates can be specified in the formats `<YYYY-MM-DD>`, `<YYYY-MM-DDTHH:MM:SS>`, or `<YYYY-MM-DDTHH:MM:SSZ07:00>` (where `<07:00>` is the time zone offset)."

**Arguments and options**

`-m`, `--message`:
Use the given `<msg>` as the commit message.

`--allow-empty`:
Allow recording a commit that has the exact same data as its sole parent. This is usually a mistake, so it is disabled by default. This option bypasses that safety.

`--date`:
Specify the date used in the commit. If not specified the current system time is used.

`-f`, `--force`:
Ignores any foreign key warnings and proceeds with the commit.

`--author`:
Specify an explicit author using the standard A U Thor `<author@example.com>` format.

`-a`, `--all`:
Adds all existing, changed tables (but not new tables) in the working set to the staged set.

`-A`, `--ALL`:
Adds all tables (including new tables) in the working set to the staged set.

`--amend`:
Amend previous commit



## `dolt config`

Get and set repository or global options

**Synopsis**

```bash
dolt config [--global|--local] --list
dolt config [--global|--local] --add <name> <value>
dolt config [--global|--local] --set <name> <value>
dolt config [--global|--local] --get <name>
dolt config [--global|--local] --unset <name>...
```

**Description**

You can query/set/replace/unset options with this command.
		
When reading, the values are read from the global and repository local configuration files, and options `<--global>`, and `<--local>` can be used to tell the command to read from only that location.

When writing, the new value is written to the repository local configuration file by default, and options `<--global>`, can be used to tell the command to write to that location (you can say `<--local>` but that is the default).

Valid configuration variables:

	- core.editor - lets you edit 'commit' or 'tag' messages by launching the set editor.

	- creds.add_url - sets the endpoint used to authenticate a client for 'dolt login'.

	- doltlab.insecure - boolean flag used to authenticate a client against DoltLab.

	- init.defaultbranch - allows overriding the default branch name e.g. when initializing a new repository.

	- metrics.disabled - boolean flag disables sending metrics when true.

	- user.creds - sets user keypairs for authenticating with doltremoteapi.

	- user.email - sets name used in the author and committer field of commit objects.

	- user.name - sets email used in the author and committer field of commit objects.

	- remotes.default_host - sets default host for authenticating with doltremoteapi.

	- remotes.default_port - sets default port for authenticating with doltremoteapi.

	- push.autoSetupRemote - if set to "true" assume --set-upstream on default push when no upstream tracking exists for the current branch.


**Arguments and options**

`--global`:
Use global config.

`--local`:
Use repository local config.

`--add`:
Set the value of one or more config parameters

`--set`:
Set the value of one or more config parameters

`--list`:
List the values of all config parameters.

`--get`:
Get the value of one or more config parameters.

`--unset`:
Unset the value of one or more config parameters.



## `dolt conflicts cat`

print conflicts

**Synopsis**

```bash
dolt conflicts cat [<commit>] <table>...
```

**Description**

The dolt conflicts cat command reads table conflicts and writes them to the standard output.

**Arguments and options**

`<table>`: List of tables to be printed. '.' can be used to print conflicts for all tables.



## `dolt conflicts resolve`

Automatically resolves all conflicts taking either ours or theirs for the given tables

**Synopsis**

```bash
dolt conflicts resolve --ours|--theirs <table>...
```

**Description**


	When a merge finds conflicting changes, it documents them in the dolt_conflicts table. A conflict is between two versions: ours (the rows at the destination branch head) and theirs (the rows at the source branch head).

	dolt conflicts resolve will automatically resolve the conflicts by taking either the ours or theirs versions for each row.


**Arguments and options**

`<table>`: List of tables to be resolved. '.' can be used to resolve all tables.

`--ours`:
For all conflicts, take the version from our branch and resolve the conflict

`--theirs`:
For all conflicts, take the version from their branch and resolve the conflict



## `dolt constraints verify`

Verifies that working set changes satisfy table constraints

**Synopsis**

```bash
dolt constraints verify [--all] [--output-only] [<table>...]
```

**Description**

Verifies that inserted or modified rows in the working set satisfy the defined table constraints.
               If any constraints are violated, they are documented in the dolt_constraint_violations system table.
               By default, this command does not consider row changes that have been previously committed.

**Arguments and options**

`<table>`: The table(s) to check constraints on. If omitted, checks all tables.

`-a`, `--all`:
Verifies that all rows in the database do not violate constraints instead of just rows modified or inserted in the working set.

`-o`, `--output-only`:
Disables writing violated constraints to the constraint violations table.



## `dolt creds check`

Check authenticating with a credential keypair against a doltremoteapi.

**Synopsis**

```bash
dolt creds check [--endpoint doltremoteapi.dolthub.com:443] [--creds <eak95022q3vskvumn2fcrpibdnheq1dtr8t...>]
```

**Description**

Tests calling a doltremoteapi with dolt credentials and reports the authentication result.

**Arguments and options**

`--endpoint`:
API endpoint, otherwise taken from config.

`--creds`:
Public Key ID or Public Key for credentials, otherwise taken from config.



## `dolt creds import`

Import a dolt credential from an existing .jwk file.

**Synopsis**

```bash
dolt creds import [--no-profile] [<jwk_filename>]
```

**Description**

Imports a dolt credential from an existing .jwk file.

Dolt credentials are stored in the creds subdirectory of the global dolt config
directory as files with one key per file in JWK format. This command can import
a JWK from a file or stdin and places the imported key in the correct place for
dolt to find it as a valid credential.

This command will set the newly imported credential as the used credential if
there are currently not credentials. If this command does use the new
credential, it will call doltremoteapi to update user.name and user.email with
information from the remote user profile if those fields are not already
available in the local dolt config.

**Arguments and options**

`<jwk_filename>`: The JWK file. If omitted, import operates on stdin.

`--no-profile`:
If provided, no attempt will be made to contact doltremoteapi and update user.name and user.email.



## `dolt creds ls`

List keypairs available for authenticating with doltremoteapi.

**Synopsis**

```bash
dolt creds ls [-v | --verbose]
```

**Description**

Lists known public keys from keypairs for authenticating with doltremoteapi.

The currently selected keypair appears with a `*` next to it.

**Arguments and options**

`-v`, `--verbose`:
Verbose output, including key id.



## `dolt creds new`

Create a new public/private keypair for authenticating with doltremoteapi.

**Synopsis**



**Description**

Creates a new keypair for authenticating with doltremoteapi.

Prints the public portion of the keypair, which can entered into the credentials settings page of dolthub.

**Arguments and options**

No options for this command.

## `dolt creds rm`

Remove a stored public/private keypair.

**Synopsis**

```bash
dolt creds rm <public_key_as_appears_in_ls>
```

**Description**

Removes an existing keypair from dolt's credential storage.

**Arguments and options**

No options for this command.

## `dolt creds use`

Select an existing dolt credential for authenticating with doltremoteapi.

**Synopsis**

```bash
dolt creds use <public_key_as_appears_in_ls | public_key_id_as_appears_in_ls>
```

**Description**

Selects an existing dolt credential for authenticating with doltremoteapi.

Can be given a credential's public key or key id and will update global dolt
config to use the credential when interacting with doltremoteapi.

You can see your available credentials with 'dolt creds ls'.

**Arguments and options**

No options for this command.

## `dolt diff`

Show changes between commits, commit and working tree, etc

**Synopsis**

```bash
dolt diff [options] [<commit>] [<tables>...]
dolt diff [options] <commit> <commit> [<tables>...]
```

**Description**


Show changes between the working and staged tables, changes between the working tables and the tables within a commit, or changes between tables at two commits.

`dolt diff [--options] [<tables>...]`
   This form is to view the changes you made relative to the staging area for the next commit. In other words, the differences are what you could tell Dolt to further add but you still haven't. You can stage these changes by using dolt add.

`dolt diff [--options] [--merge-base] <commit> [<tables>...]`
   This form is to view the changes you have in your working tables relative to the named `<commit>`. You can use HEAD to compare it with the latest commit, or a branch name to compare with the tip of a different branch. If `--merge-base` is given, instead of using `<commit>`, use the merge base of `<commit>` and HEAD. `dolt diff --merge-base A` is equivalent to `dolt diff $(dolt merge-base A HEAD)` and `dolt diff A...HEAD`.

`dolt diff [--options] [--merge-base] <commit> <commit> [<tables>...]`
   This is to view the changes between two arbitrary `commit`. If `--merge-base` is given, use the merge base of the two commits for the "before" side. `dolt diff --merge-base A B` is equivalent to `dolt diff $(dolt merge-base A B) B` and `dolt diff A...B`.

`dolt diff [--options] <commit>..<commit> [<tables>...]`
   This is synonymous to the above form (without the ..) to view the changes between two arbitrary `commit`.

`dolt diff [--options] <commit>...<commit> [<tables>...]`
   This is to view the changes on the branch containing and up to the second `<commit>`, starting at a common ancestor of both `<commit>`. `dolt diff A...B` is equivalent to `dolt diff $(dolt merge-base A B) B` and `dolt diff --merge-base A B`. You can omit any one of `<commit>`, which has the same effect as using HEAD instead.

The diffs displayed can be limited to show the first N by providing the parameter `--limit N` where `N` is the number of diffs to display.

To filter which data rows are displayed, use `--where <SQL expression>`. Table column names in the filter expression must be prefixed with `from_` or `to_`, e.g. `to_COLUMN_NAME > 100` or `from_COLUMN_NAME + to_COLUMN_NAME = 0`.

The `--diff-mode` argument controls how modified rows are presented when the format output is set to `tabular`. When set to `row`, modified rows are presented as old and new rows. When set to `line`, modified rows are presented as a single row, and changes are presented using "+" and "-" within the column. When set to `in-place`, modified rows are presented as a single row, and changes are presented side-by-side with a color distinction (requires a color-enabled terminal). When set to `context`, rows that contain at least one column that spans multiple lines uses `line`, while all other rows use `row`. The default value is `context`.


**Arguments and options**

`-d`, `--data`:
Show only the data changes, do not show the schema changes (Both shown by default).

`-s`, `--schema`:
Show only the schema changes, do not show the data changes (Both shown by default).

`--stat`:
Show stats of data changes

`--summary`:
Show summary of data and schema changes

`-r`, `--result-format`:
How to format diff output. Valid values are tabular, sql, json. Defaults to tabular.

`--where`:
filters columns based on values in the diff.  See `dolt diff --help` for details.

`--limit`:
limits to the first N diffs.

`-c`, `--cached`:
Show only the staged data changes.

`-sk`, `--skinny`:
Shows only primary key columns and any columns with data changes.

`--merge-base`:
Uses merge base of the first commit and second commit (or HEAD if not supplied) as the first commit

`--diff-mode`:
Determines how to display modified rows with tabular output. Valid values are row, line, in-place, context. Defaults to context.



## `dolt docs diff`

Diffs Dolt Docs

**Synopsis**

```bash
dolt docs diff <doc>
```

**Description**

Diffs Dolt Docs

**Arguments and options**

`<doc>`: Dolt doc to be diffed.



## `dolt docs print`

Prints Dolt Docs to stdout

**Synopsis**

```bash
dolt docs print <doc>
```

**Description**

Prints Dolt Docs to stdout

**Arguments and options**

`<doc>`: Dolt doc to be read.



## `dolt docs upload`

Uploads Dolt Docs from the file system into the database

**Synopsis**

```bash
dolt docs upload <doc> <file>
```

**Description**

Uploads Dolt Docs from the file system into the database

**Arguments and options**

`<doc>`: Dolt doc name to be updated in the database.

`<file>`: file to read Dolt doc from.



## `dolt dump`

Export all tables.

**Synopsis**

```bash
dolt dump [-f] [-r <result-format>] [-fn <file_name>]  [-d <directory>] [--batch] [--no-batch] [--no-autocommit] [--no-create-db] 
```

**Description**

`dolt dump` dumps all tables in the working set. 
If a dump file already exists then the operation will fail, unless the `--force | -f` flag 
is provided. The force flag forces the existing dump file to be overwritten. The `-r` flag 
is used to support different file formats of the dump. In the case of non .sql files each table is written to a separate
csv,json or parquet file. 


**Arguments and options**

`-r`, `--result-format`:
Define the type of the output file. Defaults to sql. Valid values are sql, csv, json and parquet.

`-fn`, `--file-name`:
Define file name for dump file. Defaults to `doltdump.sql`.

`-d`, `--directory`:
Define directory name to dump the files in. Defaults to `doltdump/`.

`-f`, `--force`:
If data already exists in the destination, the force flag will allow the target to be overwritten.

`--batch`:
Return batch insert statements wherever possible, enabled by default.

`--no-batch`:
Emit one row per statement, instead of batching multiple rows into each statement.

`-na`, `--no-autocommit`:
Turn off autocommit for each dumped table. Useful for speeding up loading of output SQL file.

`--schema-only`:
Dump a table's schema, without including any data, to the output SQL file.

`--no-create-db`:
Do not write `CREATE DATABASE` statements in SQL files.



## `dolt fetch`

Download objects and refs from another repository

**Synopsis**

```bash
dolt fetch [<remote>] [<refspec> ...]
```

**Description**

Fetch refs, along with the objects necessary to complete their histories and update remote-tracking branches.

By default dolt will attempt to fetch from a remote named `origin`.  The `<remote>` parameter allows you to specify the name of a different remote you wish to pull from by the remote's name.

When no refspec(s) are specified on the command line, the fetch_specs for the default remote are used.


**Arguments and options**

No options for this command.

## `dolt filter-branch`

Edits the commit history using the provided query

**Synopsis**

```bash
dolt filter-branch [--all] <query> [<commit>]
```

**Description**

Traverses the commit history to the initial commit starting at the current HEAD commit. Replays all commits, rewriting the history using the provided SQL query.

If a `<commit-spec>` is provided, the traversal will stop when the commit is reached and rewriting will begin at that commit, or will error if the commit is not found.

If the `--branches` flag is supplied, filter-branch traverses and rewrites commits for all branches.

If the `--all` flag is supplied, filter-branch traverses and rewrites commits for all branches and tags.


**Arguments and options**

`-v`, `--verbose`:
logs more information

`-b`, `--branches`:
filter all branches

`-a`, `--all`:
filter all branches and tags



## `dolt gc`

Cleans up unreferenced data from the repository.

**Synopsis**

```bash
dolt gc [--shallow]
```

**Description**

Searches the repository for data that is no longer referenced and no longer needed.

If the `--shallow` flag is supplied, a faster but less thorough garbage collection will be performed.

**Arguments and options**

`-s`, `--shallow`:
perform a fast, but incomplete garbage collection pass



## `dolt init`

Create an empty Dolt data repository

**Synopsis**

```bash
dolt init 
```

**Description**

This command creates an empty Dolt data repository in the current directory.

Running dolt init in an already initialized directory will fail.


**Arguments and options**

`--name`:
The name used in commits to this repo. If not provided will be taken from `user.name` in the global config.

`--email`:
The email address used. If not provided will be taken from `user.email` in the global config.

`--date`:
Specify the date used in the initial commit. If not specified the current system time is used.

`-b`, `--initial-branch`:
The branch name used to initialize this database. If not provided will be taken from `init.defaultbranch` in the global config. If unset, the default initialized branch will be named 'main'.

`--new-format`:
Specify this flag to use the new storage format (__DOLT__).

`--old-format`:
Specify this flag to use the old storage format (__LD_1__).



## `dolt log`

Show commit logs

**Synopsis**

```bash
dolt log [-n <num_commits>] [<revision-range>] [[--] <table>]
```

**Description**

Shows the commit logs

The command takes options to control what is shown and how. 

`dolt log`
  Lists commit logs from current HEAD when no options provided.
	
`dolt log [<revisions>...]`
  Lists commit logs starting from revision. If multiple revisions provided, lists logs reachable by all revisions.
	
`dolt log [<revisions>...] <table>`
  Lists commit logs starting from revisions, only including commits with changes to table.
	
`dolt log <revisionB>..<revisionA>`
`dolt log <revisionA> --not <revisionB>`
`dolt log ^<revisionB> <revisionA>`
  Different ways to list two dot logs. These will list commit logs for revisionA, while excluding commits from revisionB. The table option is not supported for two dot log.
	
`dolt log <revisionB>...<revisionA>`
`dolt log <revisionA> <revisionB> --not $(dolt merge-base <revisionA> <revisionB>)`
  Different ways to list three dot logs. These will list commit logs reachable by revisionA OR revisionB, while excluding commits reachable by BOTH revisionA AND revisionB.

**Arguments and options**

`-n`, `--number`:
Limit the number of commits to output.

`--min-parents`:
The minimum number of parents a commit must have to be included in the log.

`--merges`:
Equivalent to min-parents == 2, this will limit the log to commits with 2 or more parents.

`--parents`:
Shows all parents of each commit in the log.

`--decorate`:
Shows refs next to commits. Valid options are short, full, no, and auto

`--oneline`:
Shows logs in a compact format.

`--not`:
Excludes commits from revision.



## `dolt login`

Login to DoltHub or DoltLab

**Synopsis**

```bash
dolt login [--auth-endpoint <endpoint>] [--login-url <url>] [-i | --insecure] [<creds>]
```

**Description**

Login into DoltHub or DoltLab using the email in your config so you can pull from private repos and push to those you have permission to.


**Arguments and options**

`<creds>`: A specific credential to use for login. If omitted, new credentials will be generated.

`-e`, `--auth-endpoint`:
Specify the endpoint used to authenticate this client. Must be used with --login-url OR set in the configuration file as `creds.add_url`

`-url`, `--login-url`:
Specify the login url where the browser will add credentials.

`-i`, `--insecure`:
If set, makes insecure connection to remote authentication server



## `dolt ls`

List tables

**Synopsis**

```bash
dolt ls [--options] [<commit>]
```

**Description**

With no arguments lists the tables in the current working set but if a commit is specified it will list the tables in that commit.  If the `--verbose` flag is provided a row count and a hash of the table will also be displayed.

If the `--system` flag is supplied this will show the dolt system tables which are queryable with SQL.  Some system tables can be queried even if they are not in the working set by specifying appropriate parameters in the SQL queries. To see these tables too you may pass the `--verbose` flag.

If the `--all` flag is supplied both user and system tables will be printed.


**Arguments and options**

`-v`, `--verbose`:
show the hash of the table

`-s`, `--system`:
show system tables

`-a`, `--all`:
show system tables



## `dolt merge`

Join two or more development histories together

**Synopsis**

```bash
dolt merge [--squash] <branch>
dolt merge --no-ff [-m message] <branch>
dolt merge --abort
```

**Description**

Incorporates changes from the named commits (since the time their histories diverged from the current branch) into the current branch.

The second syntax (`<dolt merge --abort>`) can only be run after the merge has resulted in conflicts. dolt merge `--abort` will abort the merge process and try to reconstruct the pre-merge state. However, if there were uncommitted changes when the merge started (and especially if those changes were further modified after the merge was started), dolt merge `--abort` will in some cases be unable to reconstruct the original (pre-merge) changes. Therefore: 

`<Warning>`: Running dolt merge with non-trivial uncommitted changes is discouraged: while possible, it may leave you in a state that is hard to back out of in the case of a conflict.


**Arguments and options**

`--no-ff`:
Create a merge commit even when the merge resolves as a fast-forward.

`--squash`:
Merge changes to the working set without updating the commit history

`-m`, `--message`:
Use the given `<msg>` as the commit message.

`--abort`:
Abort the current conflict resolution process, and try to reconstruct the pre-merge state.

If there were uncommitted working set changes present when the merge started, `dolt merge --abort` will be unable to reconstruct these changes. It is therefore recommended to always commit or stash your changes before running dolt merge.


`--commit`:
Perform the merge and commit the result. This is the default option, but can be overridden with the --no-commit flag. Note that this option does not affect fast-forward merges, which don't create a new merge commit, and if any merge conflicts or constraint violations are detected, no commit will be attempted.

`--no-commit`:
Perform the merge and stop just before creating a merge commit. Note this will not prevent a fast-forward merge; use the --no-ff arg together with the --no-commit arg to prevent both fast-forwards and merge commits.

`--no-edit`:
Use an auto-generated commit message when creating a merge commit. The default for interactive CLI sessions is to open an editor.

`--author`:
Specify an explicit author using the standard A U Thor `<author@example.com>` format.



## `dolt merge-base`

Find the common ancestor of two commits.

**Synopsis**

```bash
dolt merge-base <commit spec> <commit spec>
```

**Description**

Find the common ancestor of two commits, and return the ancestor's commit hash.'

**Arguments and options**

No options for this command.

## `dolt pull`

Fetch from and integrate with another repository or a local branch

**Synopsis**

```bash
dolt pull [<remote>, [<remoteBranch>]]
```

**Description**

Incorporates changes from a remote repository into the current branch. In its default mode, `dolt pull` is shorthand for `dolt fetch` followed by `dolt merge <remote>/<branch>`.

More precisely, dolt pull runs `dolt fetch` with the given parameters and calls `dolt merge` to merge the retrieved branch `HEAD` into the current branch.


**Arguments and options**

`<remote>`: The name of the remote to pull from.

`<remoteBranch>`: The name of a branch on the specified remote to be merged into the current working set.

`--squash`:
Merge changes to the working set without updating the commit history

`--no-ff`:
Create a merge commit even when the merge resolves as a fast-forward.

`-f`, `--force`:
Ignore any foreign key warnings and proceed with the commit.

`--commit`:
Perform the merge and commit the result. This is the default option, but can be overridden with the --no-commit flag. Note that this option does not affect fast-forward merges, which don't create a new merge commit, and if any merge conflicts or constraint violations are detected, no commit will be attempted.

`--no-commit`:
Perform the merge and stop just before creating a merge commit. Note this will not prevent a fast-forward merge; use the --no-ff arg together with the --no-commit arg to prevent both fast-forwards and merge commits.

`--no-edit`:
Use an auto-generated commit message when creating a merge commit. The default for interactive CLI sessions is to open an editor.



## `dolt push`

Update remote refs along with associated objects

**Synopsis**

```bash
dolt push [-u | --set-upstream] [<remote>] [<refspec>]
```

**Description**

Updates remote refs using local refs, while sending objects necessary to complete the given refs.

When the command line does not specify where to push with the `<remote>` argument, an attempt is made to infer the remote.  If only one remote exists it will be used, if multiple remotes exists, a remote named 'origin' will be attempted.  If there is more than one remote, and none of them are named 'origin' then the command will fail and you will need to specify the correct remote explicitly.

When the command line does not specify what to push with `<refspec>`... then the current branch will be used.

When neither the command-line does not specify what to push, the default behavior is used, which corresponds to the current branch being pushed to the corresponding upstream branch, but as a safety measure, the push is aborted if the upstream branch does not have the same name as the local one.


**Arguments and options**

`-u`, `--set-upstream`:
For every branch that is up to date or successfully pushed, add upstream (tracking) reference, used by argument-less `dolt pull` and other commands.

`-f`, `--force`:
Update the remote with local history, overwriting any conflicting history in the remote.



## `dolt read-tables`

Fetch table(s) at a specific commit into a new dolt repo

**Synopsis**

```bash
dolt read-tables [--dir <directory>] <remote-url> <commit> [<table>...]
```

**Description**

A shallow clone operation will retrieve the state of table(s) from a remote repository at a given commit. Retrieved data is placed into the working state of a newly created local Dolt repository. Changes to the data cannot be submitted back to the remote repository, and the shallow clone cannot be converted into a regular clone of a repository.

**Arguments and options**

`<remote-repo>`: Remote repository to retrieve data from

`<commit>`: Branch or commit hash representing a point in time to retrieve tables from

`<table>`:  Optional tables to retrieve.  If omitted, all tables are retrieved.

`-d`, `--dir`:
directory to create and put retrieved table data.



## `dolt remote`

Manage set of tracked repositories

**Synopsis**

```bash
dolt remote [-v | --verbose]
dolt remote add [--aws-region <region>] [--aws-creds-type <creds-type>] [--aws-creds-file <file>] [--aws-creds-profile <profile>] <name> <url>
dolt remote remove <name>
```

**Description**

With no arguments, shows a list of existing remotes. Several subcommands are available to perform operations on the remotes.

`add`
Adds a remote named `<name>` for the repository at `<url>`. The command dolt fetch `<name>` can then be used to create and update remote-tracking branches `<name>/<branch>`.

The `<url>` parameter supports url schemes of http, https, aws, gs, and file. The url prefix defaults to https. If the `<url>` parameter is in the format `<organization>/<repository>` then dolt will use the `remotes.default_host` from your configuration file (Which will be dolthub.com unless changed).

AWS cloud remote urls should be of the form `aws://[dynamo-table:s3-bucket]/database`.  You may configure your aws cloud remote using the optional parameters `aws-region`, `aws-creds-type`, `aws-creds-file`.

aws-creds-type specifies the means by which credentials should be retrieved in order to access the specified cloud resources (specifically the dynamo table, and the s3 bucket). Valid values are 'role', 'env', or 'file'.

	role: Use the credentials installed for the current user
	env: Looks for environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
	file: Uses the credentials file specified by the parameter aws-creds-file
	
GCP remote urls should be of the form gs://gcs-bucket/database and will use the credentials setup using the gcloud command line available from Google.

The local filesystem can be used as a remote by providing a repository url in the format file://absolute path. See https://en.wikipedia.org/wiki/File_URI_scheme

`remove`, `rm`
Remove the remote named `<name>`. All remote-tracking branches and configuration settings for the remote are removed.

**Arguments and options**

`<region>`: cloud provider region associated with this remote.

`<creds-type>`: credential type.  Valid options are role, env, and file.  See the help section for additional details.

`<profile>`: AWS profile to use.

`--aws-region`

`--aws-creds-type`

`--aws-creds-file`:
AWS credentials file

`--aws-creds-profile`:
AWS profile to use

`-v`, `--verbose`:
When printing the list of remotes adds additional details.

`--oss-creds-file`:
OSS credentials file

`--oss-creds-profile`:
OSS profile to use



## `dolt reset`

Resets staged or working tables to HEAD or a specified commit

**Synopsis**

```bash
dolt reset <tables>...
dolt reset [--hard | --soft] <revision>
```

**Description**

`dolt reset <tables>...`

The default form resets the values for all staged `<tables>` to their values at `HEAD`. It does not affect the working tree or the current branch.

This means that `dolt reset <tables>` is the opposite of `dolt add <tables>`.

After running `dolt reset <tables>` to update the staged tables, you can use `dolt checkout` to check the contents out of the staged tables to the working tables.

`dolt reset [--hard | --soft] <revision>`

This form resets all tables to values in the specified revision (i.e. commit, tag, working set). The --soft option resets HEAD to a revision without changing the current working set.  The --hard option resets all three HEADs to a revision, deleting all uncommitted changes in the current working set.

`dolt reset .`

This form resets `all` staged tables to their values at HEAD. It is the opposite of `dolt add .`

**Arguments and options**

`--hard`:
Resets the working tables and staged tables. Any changes to tracked tables in the working tree since `<commit>` are discarded.

`--soft`:
Does not touch the working tables, but removes all tables staged to be committed.



## `dolt revert`

Undo the changes introduced in a commit

**Synopsis**

```bash
dolt revert <revision>...
```

**Description**

Removes the changes made in a commit (or series of commits) from the working set, and then automatically commits the result. This is done by way of a three-way merge. Given a specific commit (e.g. `HEAD\~1`), this is similar to applying the patch from `HEAD\~1..HEAD\~2`, giving us a patch of what to remove to effectively remove the influence of the specified commit. If multiple commits are specified, then this process is repeated for each commit in the order specified. This requires a clean working set.

Any conflicts or constraint violations caused by the merge cause the command to fail.

**Arguments and options**

`<revision>`: The commit revisions. If multiple revisions are given, they're applied in the order given.

`--author`:
Specify an explicit author using the standard A U Thor `<author@example.com>` format.



## `dolt schema export`

Exports table schemas as SQL DDL statements.

**Synopsis**

```bash
dolt schema export [<table>] [<file>]
```

**Description**

Exports table schemas as SQL DDL statements, which can then be executed to recreate tables.

If `table` is given, only that table's schema will be exported, otherwise all table schemas will be exported.

If `file` is given, the exported schemas will be written to that file, otherwise they will be written to standard out.

**Arguments and options**

`<table>`: table whose schema is being exported.

`<file>`: the file to which the schema will be exported.



## `dolt schema import`

Creates or updates a table by inferring a schema from a file containing sample data.

**Synopsis**

```bash
dolt schema import [--create|--replace] [--force] [--dry-run] [--lower|--upper] [--keep-types] [--file-type <type>] [--float-threshold] [--map <mapping-file>] [--delim <delimiter>]--pks <field>,... <table> <file>
```

**Description**

If `--create | -c` is given the operation will create `<table>` with a schema that it infers from the supplied file. One or more primary key columns must be specified using the `--pks` parameter.

If `--update | -u` is given the operation will update `<table>` any additional columns, or change the types of columns based on the file supplied.  If the `--keep-types` parameter is supplied then the types for existing columns will not be modified, even if they differ from what is in the supplied file.

If `--replace | -r` is given the operation will replace `<table>` with a new, empty table which has a schema inferred from the supplied file but columns tags will be maintained across schemas.  `--keep-types` can also be supplied here to guarantee that types are the same in the file and in the pre-existing table.

A mapping file can be used to map fields between the file being imported and the table's schema being inferred.  This can be used when creating a new table, or updating or replacing an existing table.

A mapping file is json in the format:

	{
		"source_field_name":"dest_field_name"
		...
	}

where source_field_name is the name of a field in the file being imported and dest_field_name is the name of a field in the table being imported to.


In create, update, and replace scenarios the file's extension is used to infer the type of the file.  If a file does not have the expected extension then the `--file-type` parameter should be used to explicitly define the format of the file in one of the supported formats (Currently only csv is supported).  For files separated by a delimiter other than a ',', the --delim parameter can be used to specify a delimiter.

If the parameter `--dry-run` is supplied a sql statement will be generated showing what would be executed if this were run without the --dry-run flag

`--float-threshold` is the threshold at which a string representing a floating point number should be interpreted as a float versus an int.  If FloatThreshold is 0.0 then any number with a decimal point will be interpreted as a float (such as 0.0, 1.0, etc).  If FloatThreshold is 1.0 then any number with a decimal point will be converted to an int (0.5 will be the int 0, 1.99 will be the int 1, etc.  If the FloatThreshold is 0.001 then numbers with a fractional component greater than or equal to 0.001 will be treated as a float (1.0 would be an int, 1.0009 would be an int, 1.001 would be a float, 1.1 would be a float, etc)


**Arguments and options**

`<table>`: Name of the table to be created.

`<file>`: The file being used to infer the schema.

`-c`, `--create`:
Create a table with the schema inferred from the `<file>` provided.

`-u`, `--update`:
Update a table to match the inferred schema of the `<file>` provided. All previous data will be lost.

`-r`, `--replace`:
Replace a table with a new schema that has the inferred schema from the `<file>` provided. All previous data will be lost.

`--dry-run`:
Print the sql statement that would be run if executed without the flag.

`--keep-types`:
When a column already exists in the table, and it's also in the `<file>` provided, use the type from the table.

`--file-type`:
Explicitly define the type of the file if it can't be inferred from the file extension.

`--pks`:
List of columns used as the primary key cols.  Order of the columns will determine sort order.

`-m`, `--map`:
A file that can map a column name in `<file>` to a new value.

`--float-threshold`:
Minimum value at which the fractional component of a value must exceed in order to be considered a float.

`--delim`:
Specify a delimiter for a csv style file with a non-comma delimiter.



## `dolt schema show`

Shows the schema of one or more tables.

**Synopsis**

```bash
dolt schema show [<commit>] [<table>...]
```

**Description**

`dolt schema show` displays the schema of tables at a given commit.  If no commit is provided the working set will be used.

A list of tables can optionally be provided.  If it is omitted all table schemas will be shown.

**Arguments and options**

`<table>`: table(s) whose schema is being displayed.

`<commit>`: commit at which point the schema will be displayed.



## `dolt schema tags`

Shows the column tags of one or more tables.

**Synopsis**

```bash
dolt schema tags [-r <result format>] [<table>...]
```

**Description**

`dolt schema tags` displays the column tags of tables on the working set.

A list of tables can optionally be provided.  If it is omitted then all tables will be shown. If a given table does not exist, then it is ignored.

**Arguments and options**

`<table>`: table(s) whose tags will be displayed.

`-r`, `--result-format`:
How to format result output. Valid values are tabular, csv, json. Defaults to tabular.



## `dolt schema update-tag`

Update the tag of the specified column

**Synopsis**

```bash
dolt schema update-tag <table> <column> <tag>
```

**Description**

`dolt schema update-tag`

Update tag of the specified column. Useful to fix a merge that is throwing a
schema tag conflict.


**Arguments and options**

`<table>`: The name of the table

`<column>`: The name of the column

`<tag>`: The new tag value



## `dolt sql`

Runs a SQL query

**Synopsis**

```bash
dolt sql 
dolt sql < script.sql
dolt sql [--data-dir <directory>] [-r <result format>]
dolt sql -q <query> [-r <result format>] [-s <name> -m <message>] [-b]
dolt sql -q <query> --data-dir <directory> [-r <result format>] [-b]
dolt sql -x <name>
dolt sql --list-saved
```

**Description**

Runs a SQL query you specify. With no arguments, begins an interactive shell to run queries and view the results. With the `-q` option, runs the given query and prints any results, then exits.

Multiple SQL statements must be separated by semicolons. Use `-b` to enable batch mode to speed up large batches of INSERT / UPDATE statements. Pipe SQL files to dolt sql (no `-q`) to execute a SQL import or update script. 

Queries can be saved to the query catalog with `-s`. Alternatively `-x` can be used to execute a saved query by name.

By default this command uses the dolt database in the current working directory, as well as any dolt databases that are found in the current directory. Any databases created with CREATE DATABASE are placed in the current directory as well. Running with `--data-dir <directory>` uses each of the subdirectories of the supplied directory (each subdirectory must be a valid dolt data repository) as databases. Subdirectories starting with '.' are ignored.

**Arguments and options**

`-q`, `--query`:
Runs a single query and exits.

`-r`, `--result-format`:
How to format result output. Valid values are tabular, csv, json, vertical. Defaults to tabular.

`-s`, `--save`:
Used with --query, save the query to the query catalog with the name provided. Saved queries can be examined in the dolt_query_catalog system table.

`-x`, `--execute`:
Executes a saved query with the given name.

`-l`, `--list-saved`:
List all saved queries.

`-m`, `--message`:
Used with --query and --save, saves the query with the descriptive message given. See also `--name`.

`-b`, `--batch`:
Use to enable more efficient batch processing for large SQL import scripts consisting of only INSERT statements. Other statements types are not guaranteed to work in this mode.

`--data-dir`:
Defines a directory whose subdirectories should all be dolt data repositories accessible as independent databases within. Defaults to the current directory.

`--multi-db-dir`:
Defines a directory whose subdirectories should all be dolt data repositories accessible as independent databases within. Defaults to the current directory. This is deprecated, you should use `--data-dir` instead

`--doltcfg-dir`:
Defines a directory that contains configuration files for dolt. Defaults to `$data-dir/.doltcfg`. Will only be created if there is a change that affect configuration settings.

`-c`, `--continue`:
Continue running queries on an error. Used for batch mode only.

`-f`, `--file`:
Execute statements from the file given.

`--privilege-file`:
Path to a file to load and store users and grants. Defaults to `$doltcfg-dir/privileges.db`. Will only be created if there is a change to privileges.

`--branch-control-file`:
Path to a file to load and store branch control permissions. Defaults to `$doltcfg-dir/branch_control.db`. Will only be created if there is a change to branch control permissions.

`-u`, `--user`:
Defines the local superuser (defaults to `root`). If the specified user exists, will take on permissions of that user.



## `dolt sql-client`

Starts a built-in MySQL client.

**Synopsis**

```bash
dolt sql-client [-d] --config <file>
dolt sql-client [-d] [-H <host>] [-P <port>] [-u <user>] [-p <password>] [-t <timeout>] [-l <loglevel>] [--data-dir <directory>] [--query-parallelism <num-go-routines>] [-r]
dolt sql-client -q <string> [--use-db <db_name>] [--result-format <format>] [-H <host>] [-P <port>] [-u <user>] [-p <password>]
```

**Description**

Starts a MySQL client that is built into dolt. May connect to any database that supports MySQL connections, including dolt servers.

You may also start a dolt server and automatically connect to it using this client. Both the server and client will be a part of the same process. This is useful for testing behavior of the dolt server without the need for an external client, and is not recommended for general usage.

Similar to `dolt sql-server`, this command may use a YAML configuration file or command line arguments. For more information on the YAML file, refer to the documentation on `dolt sql-server`.

**Arguments and options**

`--config`:
When provided configuration is taken from the yaml config file and all command line parameters are ignored.

`-H`, `--host`:
Defines the host address that the server will run on. Defaults to `localhost`.

`-P`, `--port`:
Defines the port that the server will run on. Defaults to `3306`.

`-u`, `--user`:
Defines the server user. Defaults to ``. This should be explicit if desired.

`-p`, `--password`:
Defines the server password. Defaults to ``.

`-t`, `--timeout`:
Defines the timeout, in seconds, used for connections
A value of `0` represents an infinite timeout. Defaults to `28800000`.

`-r`, `--readonly`:
Disable modification of the database.

`-l`, `--loglevel`:
Defines the level of logging provided
Options are: `trace`, `debug`, `info`, `warning`, `error`, `fatal`. Defaults to `info`.

`--data-dir`:
Defines a directory whose subdirectories should all be dolt data repositories accessible as independent databases within. Defaults to the current directory.

`--multi-db-dir`:
Defines a directory whose subdirectories should all be dolt data repositories accessible as independent databases within. Defaults to the current directory. This is deprecated, you should use `--data-dir` instead.

`--doltcfg-dir`:
Defines a directory that contains configuration files for dolt. Defaults to `$data-dir/.doltcfg`. Will only be created if there is a change that affect configuration settings.

`--no-auto-commit`:
Set @@autocommit = off for the server.

`--query-parallelism`:
Set the number of go routines spawned to handle each query. Defaults to `2`.

`--max-connections`:
Set the number of connections handled by the server. Defaults to `100`.

`--persistence-behavior`:
Indicate whether to `load` or `ignore` persisted global variables. Defaults to `load`.

`--privilege-file`:
Path to a file to load and store users and grants. Defaults to `$doltcfg-dir/privileges.db`. Will only be created if there is a change to privileges.

`--branch-control-file`:
Path to a file to load and store branch control permissions. Defaults to `$doltcfg-dir/branch_control.db`. Will only be created if there is a change to branch control permissions.

`--allow-cleartext-passwords`:
Allows use of cleartext passwords. Defaults to false.

`--socket`:
Path for the unix socket file. Defaults to '/tmp/mysql.sock'.

`--remotesapi-port`:
Sets the port for a server which can expose the databases in this sql-server over remotesapi.

`--golden`:
Provides a connection string to a MySQL instance to be user to validate query results

`-d`, `--dual`:
Causes this command to spawn a dolt server that is automatically connected to.

`-q`, `--query`:
Sends the given query to the server and immediately exits.

`--use-db`:
Selects the given database before executing a query. By default, uses the current folder's name. Must be used with the --query flag.

`--result-format`:
Returns the results in the given format. Must be used with the --query flag.



## `dolt sql-server`

Start a MySQL-compatible server.

**Synopsis**

```bash
dolt sql-server --config <file>
dolt sql-server [-H <host>] [-P <port>] [-u <user>] [-p <password>] [-t <timeout>] [-l <loglevel>] [--data-dir <directory>] [--query-parallelism <num-go-routines>] [-r]
```

**Description**

By default, starts a MySQL-compatible server on the dolt database in the current directory. Databases are named after the directories they appear in, with all non-alphanumeric characters replaced by the _ character. Parameters can be specified using a yaml configuration file passed to the server via `--config <file>`, or by using the supported switches and flags to configure the server directly on the command line. If `--config <file>` is provided all other command line arguments are ignored.

This is an example yaml configuration file showing all supported items and their default values:

	log_level: info
	
	max_logged_query_len: null
	
	behavior:
	  read_only: false
	  autocommit: true
	  persistence_behavior: load
	  disable_client_multi_statements: false
	
	user:
	  name: ""
	  password: ""
	
	listener:
	  host: localhost
	  port: 3306
	  max_connections: 100
	  read_timeout_millis: 28800000
	  write_timeout_millis: 28800000
	  tls_key: null
	  tls_cert: null
	  require_secure_transport: null
	  allow_cleartext_passwords: null
	  socket: null
	
	databases: []
	
	performance:
	  query_parallelism: null
	
	data_dir: null
	
	cfg_dir: null
	
	metrics:
	  labels: {}
	  host: null
	  port: null
	
	remotesapi:
	  port: null
	
	cluster: null
	
	privilege_file: null
	
	branch_control_file: null
	
	user_session_vars: []
	
	jwks: []
	
	golden_mysql_conn: null



SUPPORTED CONFIG FILE FIELDS:

`vlog_level`: Level of logging provided. Options are: `trace`, `debug`, `info`, `warning`, `error`, and `fatal`.

`behavior.read_only`: If true database modification is disabled

`behavior.autocommit`: If true write queries will automatically alter the working set. When working with autocommit enabled it is highly recommended that listener.max_connections be set to 1 as concurrency issues will arise otherwise

`user.name`: The username that connections should use for authentication

`user.password`: The password that connections should use for authentication.

`listener.host`: The host address that the server will run on.  This may be `localhost` or an IPv4 or IPv6 address

`listener.port`: The port that the server should listen on

`listener.max_connections`: The number of simultaneous connections that the server will accept

`listener.read_timeout_millis`: The number of milliseconds that the server will wait for a read operation

`listener.write_timeout_millis`: The number of milliseconds that the server will wait for a write operation

`performance.query_parallelism`: Amount of go routines spawned to process each query

`databases`: a list of dolt data repositories to make available as SQL databases. If databases is missing or empty then the working directory must be a valid dolt data repository which will be made available as a SQL database

`databases[i].path`: A path to a dolt data repository

`databases[i].name`: The name that the database corresponding to the given path should be referenced via SQL

If a config file is not provided many of these settings may be configured on the command line.

**Arguments and options**

`--config`:
When provided configuration is taken from the yaml config file and all command line parameters are ignored.

`-H`, `--host`:
Defines the host address that the server will run on. Defaults to `localhost`.

`-P`, `--port`:
Defines the port that the server will run on. Defaults to `3306`.

`-u`, `--user`:
Defines the server user. Defaults to ``. This should be explicit if desired.

`-p`, `--password`:
Defines the server password. Defaults to ``.

`-t`, `--timeout`:
Defines the timeout, in seconds, used for connections
A value of `0` represents an infinite timeout. Defaults to `28800000`.

`-r`, `--readonly`:
Disable modification of the database.

`-l`, `--loglevel`:
Defines the level of logging provided
Options are: `trace`, `debug`, `info`, `warning`, `error`, `fatal`. Defaults to `info`.

`--data-dir`:
Defines a directory whose subdirectories should all be dolt data repositories accessible as independent databases within. Defaults to the current directory.

`--multi-db-dir`:
Defines a directory whose subdirectories should all be dolt data repositories accessible as independent databases within. Defaults to the current directory. This is deprecated, you should use `--data-dir` instead.

`--doltcfg-dir`:
Defines a directory that contains configuration files for dolt. Defaults to `$data-dir/.doltcfg`. Will only be created if there is a change that affect configuration settings.

`--no-auto-commit`:
Set @@autocommit = off for the server.

`--query-parallelism`:
Set the number of go routines spawned to handle each query. Defaults to `2`.

`--max-connections`:
Set the number of connections handled by the server. Defaults to `100`.

`--persistence-behavior`:
Indicate whether to `load` or `ignore` persisted global variables. Defaults to `load`.

`--privilege-file`:
Path to a file to load and store users and grants. Defaults to `$doltcfg-dir/privileges.db`. Will only be created if there is a change to privileges.

`--branch-control-file`:
Path to a file to load and store branch control permissions. Defaults to `$doltcfg-dir/branch_control.db`. Will only be created if there is a change to branch control permissions.

`--allow-cleartext-passwords`:
Allows use of cleartext passwords. Defaults to false.

`--socket`:
Path for the unix socket file. Defaults to '/tmp/mysql.sock'.

`--remotesapi-port`:
Sets the port for a server which can expose the databases in this sql-server over remotesapi.

`--golden`:
Provides a connection string to a MySQL instance to be user to validate query results



## `dolt stash`

Stash the changes in a dirty working directory away.

**Synopsis**

```bash
dolt stash 
dolt stash list
dolt stash pop <stash>
dolt stash clear
dolt stash drop <stash>
```

**Description**

Use dolt stash when you want to record the current state of the working directory and the index, but want to go back to a clean working directory. 

The command saves your local modifications away and reverts the working directory to match the HEAD commit.


**Arguments and options**

`-u`, `--include-untracked`:
All untracked files (added tables) are also stashed.



## `dolt stash clear`

Remove all the stash entries.

**Synopsis**



**Description**


Removes all the stash entries from the current stash list.

**Arguments and options**

No options for this command.

## `dolt stash drop`

Remove a single stash entry.

**Synopsis**

```bash
dolt stash drop <stash>
```

**Description**


Removes a single stash entry at given index from the list of stash entries.

**Arguments and options**

No options for this command.

## `dolt stash list`

List the stash entries that you currently have.

**Synopsis**



**Description**

Each stash entry is listed with its name (e.g. stash@{0} is the latest entry, stash@{1} is the one before, etc.), the name of the branch that was current when the entry was made, and a short description of the commit the entry was based on.


**Arguments and options**

No options for this command.

## `dolt stash pop`

Remove a single stash from the stash list and apply it on top of the current working set.

**Synopsis**

```bash
dolt stash pop <stash>
```

**Description**

Applying the state can fail with conflicts; in this case, it is not removed from the stash list. 

You need to resolve the conflicts by hand and call dolt stash drop manually afterwards.


**Arguments and options**

No options for this command.

## `dolt status`

Show the working status

**Synopsis**

```bash
dolt status 
```

**Description**

Displays working tables that differ from the current HEAD commit, tables that differ from the staged tables, and tables that are in the working tree that are not tracked by dolt. The first are what you would commit by running `dolt commit`; the second and third are what you could commit by running `dolt add .` before running `dolt commit`.

**Arguments and options**

No options for this command.

## `dolt table cp`

Makes a copy of a table

**Synopsis**

```bash
dolt table cp [-f] <oldtable> <newtable>
```

**Description**

The dolt table cp command makes a copy of a table at a given commit. If a commit is not specified the copy is made of the table from the current working set.

If a table exists at the target location this command will fail unless the `--force|-f` flag is provided.  In this case the table at the target location will be overwritten with the copied table.

All changes will be applied to the working tables and will need to be staged using `dolt add` and committed using `dolt commit`.


**Arguments and options**

`<oldtable>`: The table being copied.

`<newtable>`: The destination where the table is being copied to.

`-f`, `--force`:
If data already exists in the destination, the force flag will allow the target to be overwritten.



## `dolt table export`

Export the contents of a table to a file.

**Synopsis**

```bash
dolt table export [-f] [-pk <field>] [-schema <file>] [-map <file>] [-continue] [-file-type <type>] <table> <file>
```

**Description**

`dolt table export` will export the contents of `<table>` to `<|file>`

See the help for `dolt table import` as the options are the same.


**Arguments and options**

`<table>`: The table being exported.

`<file>`: The file being output to.

`-f`, `--force`:
If data already exists in the destination, the force flag will allow the target to be overwritten.

`--file-type`:
Explicitly define the type of the file if it can't be inferred from the file extension.



## `dolt table import`

Imports data into a dolt table

**Synopsis**

```bash
dolt table import -c [-f] [--pk <field>] [--schema <file>] [--map <file>] [--continue]  [--quiet] [--disable-fk-checks] [--file-type <type>] <table> <file>
dolt table import -u [--map <file>] [--continue] [--quiet] [--file-type <type>] <table> <file>
dolt table import -r [--map <file>] [--file-type <type>] <table> <file>
```

**Description**

If `--create-table | -c` is given the operation will create `<table>` and import the contents of file into it.  If a table already exists at this location then the operation will fail, unless the `--force | -f` flag is provided. The force flag forces the existing table to be overwritten.

The schema for the new table can be specified explicitly by providing a SQL schema definition file, or will be inferred from the imported file.  All schemas, inferred or explicitly defined must define a primary key.  If the file format being imported does not support defining a primary key, then the `--pk` parameter must supply the name of the field that should be used as the primary key.

If `--update-table | -u` is given the operation will update `<table>` with the contents of file. The table's existing schema will be used, and field names will be used to match file fields with table fields unless a mapping file is specified.

During import, if there is an error importing any row, the import will be aborted by default. Use the `--continue` flag to continue importing when an error is encountered. You can add the `--quiet` flag to prevent the import utility from printing all the skipped rows. 

If `--replace-table | -r` is given the operation will replace `<table>` with the contents of the file. The table's existing schema will be used, and field names will be used to match file fields with table fields unless a mapping file is specified.

If the schema for the existing table does not match the schema for the new file, the import will be aborted by default. To overwrite both the table and the schema, use `-c -f`.

A mapping file can be used to map fields between the file being imported and the table being written to. This can be used when creating a new table, or updating or replacing an existing table.

A mapping file is json in the format:

	{
		"source_field_name":"dest_field_name"
		...
	}

where source_field_name is the name of a field in the file being imported and dest_field_name is the name of a field in the table being imported to.

The expected JSON input file format is:

	{ "rows":
		[
			{
				"column_name":"value"
				...
			}, ...
		]
	}

where column_name is the name of a column of the table being imported and value is the data for that column in the table.

In create, update, and replace scenarios the file's extension is used to infer the type of the file.  If a file does not have the expected extension then the `--file-type` parameter should be used to explicitly define the format of the file in one of the supported formats (csv, psv, json, xlsx).  For files separated by a delimiter other than a ',' (type csv) or a '|' (type psv), the --delim parameter can be used to specify a delimiter

**Arguments and options**

`<table>`: The new or existing table being imported to.

`<file>`: The file being imported. Supported file types are csv, psv, and nbf.

`-c`, `--create-table`:
Create a new table, or overwrite an existing table (with the -f flag) from the imported data.

`-u`, `--update-table`:
Update an existing table with the imported data.

`-f`, `--force`:
If a create operation is being executed, data already exists in the destination, the force flag will allow the target to be overwritten.

`-r`, `--replace-table`:
Replace existing table with imported data while preserving the original schema.

`--continue`:
Continue importing when row import errors are encountered.

`--quiet`:
Suppress any warning messages about invalid rows when using the --continue flag.

`--disable-fk-checks`:
Disables foreign key checks.

`-s`, `--schema`:
The schema for the output data.

`-m`, `--map`:
A file that lays out how fields should be mapped from input data to output data.

`-pk`, `--pk`:
Explicitly define the name of the field in the schema which should be used as the primary key.

`--file-type`:
Explicitly define the type of the file if it can't be inferred from the file extension.

`--delim`:
Specify a delimiter for a csv style file with a non-comma delimiter.



## `dolt table mv`

Renames a table

**Synopsis**

```bash
dolt table mv [-f] <oldtable> <newtable>
```

**Description**


The dolt table mv command will rename a table. If a table exists with the target name this command will 
fail unless the `--force|-f` flag is provided.  In that case the table at the target location will be overwritten 
by the table being renamed.

The result is equivalent of running `dolt table cp <old> <new>` followed by `dolt table rm <old>`, resulting 
in a new table and a deleted table in the working set. These changes can be staged using `dolt add` and committed
using `dolt commit`.

**Arguments and options**

`<oldtable>`: The table being moved.

`<newtable>`: The new name of the table

`-f`, `--force`:
If data already exists in the destination, the force flag will allow the target to be overwritten.



## `dolt table rm`

Removes table(s) from the working set of tables.

**Synopsis**

```bash
dolt table rm <table>...
```

**Description**

`dolt table rm` removes table(s) from the working set.  These changes can be staged using `dolt add` and committed using `dolt commit`

**Arguments and options**

`<table>`: The table to remove



## `dolt tag`

Create, list, delete tags.

**Synopsis**

```bash
dolt tag [-v]
dolt tag [-m <message>] <tagname> [<ref>]
dolt tag -d <tagname>
```

**Description**

If there are no non-option arguments, existing tags are listed.

The command's second form creates a new tag named `<tagname>` which points to the current `HEAD`, or `<ref>` if given. Optionally, a tag message can be passed using the `-m` option. 

With a `-d`, `<tagname>` will be deleted.

**Arguments and options**

`<ref>`: A commit ref that the tag should point at.

`-m`, `--message`:
Use the given `<msg>` as the tag message.

`-v`, `--verbose`:
list tags along with their metadata.

`-d`, `--delete`:
Delete a tag.

`--author`:
Specify an explicit author using the standard A U Thor `<author@example.com>` format.



