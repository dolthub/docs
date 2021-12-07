---
title: Git for Data
---

# Git for Data

Dolt is Git for Data. You can use Dolt's command line interface to
version control data like you version control files with Git. Git
versions files, Dolt versions tables.

All the commands you know for `git` work the same with `dolt`, but
with tables instead of file names. Follow along with the tutorial
below to learn the basics.

## Configure Dolt

After installing Dolt, the first thing you must do to use it like Git
for Data is set the `user.name` and `user.email` config
variables. This information will be used to attribute each Dolt commit
to you.

```
dolt config --global --add user.name <your name>
dolt config --global --add user.email <your email>
```

## Create a repository

`dolt init` creates a repository, just like `git init`.

```bash
% dolt init
Successfully initialized dolt data repository.
```

## Import some data

Dolt can import most data file types. This example uses CSV.

We'll create a simple data file with state populations.

```bash
% cat > states.csv <<EOF
state,population
Delaware,59096
Maryland,319728
Tennessee,35691
Virginia,691937
Connecticut,237946
Massachusetts,378787
South Carolina,249073
New Hampshire,141885
Vermont,85425
Georgia,82548
Pennsylvania,434373
Kentucky,73677
New York,340120
New Jersey,184139
North Carolina,393751
Maine,96540
Rhode Island,68825
EOF
```

Then import it as a dolt table:

```
% dolt table import -c -pk=state state_populations states.csv
Rows Processed: 17, Additions: 17, Modifications: 0, Had No Effect: 0
Import completed successfully.
```

## View the status

`dolt status` does the same thing as `git status`.

```bash
% dolt status
On branch main
Untracked files:
  (use "dolt add <table|doc>" to include in what will be committed)
        new table:      state_populations
```

## Create a commit

Add tables with `dolt add`, commit them with `dolt commit`. Both these
commands work just like their `git` equivalents.

```bash
% dolt add .
% dolt commit -m "State population data"
commit b1aa1bbkvlblnasohleec9ga9pieo9ts
Author: Zach Musgrave <zach@dolthub.com>
Date:   Mon Dec 06 17:58:06 -0800 2021

        State population data
```

## View the log

`dolt log` does the same thing as `git log`, and shows us the history
of the database.

```bash
% dolt log
commit b1aa1bbkvlblnasohleec9ga9pieo9ts
Author: Zach Musgrave <zach@dolthub.com>
Date:   Mon Dec 06 17:58:06 -0800 2021

        State population data

commit 62dsa7mrbkre939n56m94dfl3cl75k20
Author: Zach Musgrave <zach@dolthub.com>
Date:   Mon Dec 06 17:23:35 -0800 2021

        Initialize data repository
```

## Create a branch

Just like in `git`, it's a good idea to make your changes on a branch,
then merge them back to main. The commands work the same as in
git. Use either `dolt branch` or more commonly, `dolt checkout -b` to
create a new branch.

```bash
% dolt checkout -b feature
Switched to branch 'feature'
```

## Change the data using SQL

To change the data, use SQL `INSERT`, `UPDATE` and `DELETE`
statements. Dolt has a built-in SQL shell, or [start a
server](database.md) and connect to it with any tool that can connect
to MySQL.

```bash
% dolt sql
# Welcome to the DoltSQL shell.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
state_pops> update state_populations set population = 0 where state like 'New%';
Query OK, 3 rows affected
Rows matched: 3  Changed: 3  Warnings: 0
state_pops> exit
Bye
```

You can also run individual queries from the command line with `dolt
sql -q`.

## View the diff

```bash
% dolt diff
diff --dolt a/state_populations b/state_populations
--- a/state_populations @ msmov4aocgno3klji3d2kk2qsg405urr
+++ b/state_populations @ 4op7rpaqg0a62lkomf2b1b8e6tt3gug4
+-----+---------------+------------+
|     | state         | population |
+-----+---------------+------------+
|  <  | New Hampshire | 141885     |
|  >  | New Hampshire | 0          |
|  <  | New Jersey    | 184139     |
|  >  | New Jersey    | 0          |
|  <  | New York      | 340120     |
|  >  | New York      | 0          |
+-----+---------------+------------+
```

## Commit and merge

```bash
% dolt add .
% dolt commit -m "Only original states now"
```

After commiting on the `feature` branch, checkout `main` and merge
your changes back. `dolt merge` works just like `git merge`.

```bash
% dolt checkout main
Switched to branch 'main'
% dolt merge feature
Updating b1aa1bbkvlblnasohleec9ga9pieo9ts..9a1mbpq7kva50ibhmru4viiqutmiqmmm
Fast-forward
```

## Next steps

Keep reading the getting started guide to learn more, or skip to the
full [CLI docs](../../reference/cli.md).
