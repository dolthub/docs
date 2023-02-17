# Log

## What is a log?

The Dolt log is a way to visualize the Dolt commit graph in an intuitive way. When viewing the log, you are seeing a topologically sorted commit order that led to the commit you have checked out. The log is an audit trail of commits.

In Dolt, you can visualize the log of a database, a table, a row, or even a cell.

Log is usually filtered by branch. Any commits not reachable in the graph from the current commit will be omitted from the log.

## How to use logs

Logs are useful in reverting the database to a previous state. You determine the state of the database you want via log and then use other Dolt commands to change the database to a different state.

Logs are useful when trying to track down why the database is in a particular state. You use log to find the commits in question and usually follow up with diffs (i.e. differences) between two commits you found in the log.

Logs are useful in audit. If you would like to ensure a particular value in the database has not changed since the last time you read it, log is useful in verifying this.

## Difference between Git log and Dolt log

Conceptually and practically log on the command line is very similar between Git and Dolt. A table is akin to a file in Git.

Dolt has additional log functionality beyond Git. You can produce a log of any cell (i.e. row, column pair) in the database using a SQL query against the `dolt_history_<tablename>` system table.

## Example

### Commit Log

```bash
% dolt log
commit cffu3k56rtv6cf28370buivf33bb2mvr
Author: Tim Sehn <tim@dolthub.com>
Date:   Fri Dec 03 09:49:29 -0800 2021

        This is a commit

commit t5d5inj4bpc1fltrdm9uoscjdsgebaih
Author: Tim Sehn <tim@dolthub.com>
Date:   Fri Dec 03 09:49:10 -0800 2021

        Initialize data repository

docs $ dolt sql -q "select * from dolt_log"
+----------------------------------+-----------+------------------+-----------------------------------+----------------------------+
| commit_hash                      | committer | email            | date                              | message                    |
+----------------------------------+-----------+------------------+-----------------------------------+----------------------------+
| u73s2mb1ho4mj1ldkof939vampo93bld | Tim Sehn  | tim@dolthub.com  | 2021-12-06 10:45:11.148 -0800 PST | This is a commit           |
| bo318l76dq3bdvu1ie84d4nmv4hpi4km | Tim Sehn  | tim@dolthub.com | 2021-12-02 16:55:00.101 -0800 PST | This is a commit           |
| jcj6q9c9nsveh72eadsms9i9k9ii1e55 | Tim Sehn  | tim@dolthub.com | 2021-12-02 16:54:35.87 -0800 PST  | Initialize data repository |
+----------------------------------+-----------+------------------+-----------------------------------+----------------------------+
```

### Cell History

```
$ dolt sql -q "select * from dolt_history_employees where id=0 order by commit_date";
+------+-----------+------------+------------+----------------------------------+-----------+-------------------------+
| id   | last_name | first_name | start_date | commit_hash                      | committer | commit_date             |
+------+-----------+------------+------------+----------------------------------+-----------+-------------------------+
|    0 | Sehn      | Tim        | NULL       | 13qfqa5rojq18j84d1n2htjkm6fletg4 | Tim Sehn  | 2022-06-07 16:39:32.066 |
|    0 | Sehn      | Timothy    | NULL       | uhkv57j4bp2v16vcnmev9lshgkqq8ppb | Tim Sehn  | 2022-06-07 16:41:49.847 |
|    0 | Sehn      | Tim        | 2018-09-08 | pg3nfi0j1dpc5pf1rfgckpmlteaufdrt | Tim Sehn  | 2022-06-07 16:44:37.513 |
|    0 | Sehn      | Timothy    | 2018-09-08 | vn9b0qcematsj2f6ka0hfoflhr5s6p0b | Tim Sehn  | 2022-06-07 17:10:02.07  |
+------+-----------+------------+------------+----------------------------------+-----------+-------------------------+
```
