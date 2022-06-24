---
title: Working Set
---

# Working Set

## What is a Working Set?

Dolt has three kinds of changes: committed, staged and working. The working set is the set of changes that has not been staged or committed. To stage a change in a table you `add` it to the staging set. The staging set is committed by issuing a `commit` command and supplying the appropriate metadata. 

If you start a Dolt SQL server and start making changes, you are making changes to the working set. If you never make a commit, your working set is a standard MySQL database. So, a way to think about your working set is Dolt without version control features, just a standard MySQL relational database.

## How to use Working Sets

Working sets are used to isolate changes to your database from committed schema or data. Each branch gets it's own working set so you can make changes in isolation. If you don't like the changes made to a working set, you can `reset` or `checkout` to the previous commit.

## Difference between Git Working Sets and Dolt Working Sets

Git working sets change files. Dolt working sets change tables. 

On the command line, working set changes do follow to the newly checked out branch, just like Git. However, in SQL server mode, working set changes are not transferred to the newly checked out branch when you do a `dolt checkout`. The working set changes stay on the branch they were originally made. This change was made to account for multiple users using the same branch in SQL server mode.

## Example

### Make changes in a working set
```
$ dolt sql -q "insert into docs values (3,0)";
Query OK, 1 row affected
$ dolt status
On branch main
Changes not staged for commit:
  (use "dolt add <table>" to update what will be committed)
  (use "dolt checkout <table>" to discard changes in working directory)
	modified:       docs
```

### See what's changed in your working set
```
docs $ dolt diff
diff --dolt a/docs b/docs
--- a/docs @ c341qjl0eholuiu1k4pvujre7mc75qtc
+++ b/docs @ f7isl5tqm92ovogh6v8seq26lsjmiknk
+-----+----+----+
|     | pk | c1 |
+-----+----+----+
|  +  | 3  | 0  |
+-----+----+----+
docs $ dolt sql -q "select * from dolt_diff_docs where to_commit='WORKING'"
+-------+-------+-----------+----------------+---------+---------+----------------------------------+-------------------------+-----------+
| to_c1 | to_pk | to_commit | to_commit_date | from_c1 | from_pk | from_commit                      | from_commit_date        | diff_type |
+-------+-------+-----------+----------------+---------+---------+----------------------------------+-------------------------+-----------+
| 0     | 3     | WORKING   | NULL           | NULL    | NULL    | uhumidn2e7ucan59jk9vuabm7r5osggs | 2021-12-07 01:14:46.684 | added     |
+-------+-------+-----------+----------------+---------+---------+----------------------------------+-------------------------+-----------+
```

### Reset a change to your working set
```
docs $ dolt status
On branch main
Changes not staged for commit:
  (use "dolt add <table>" to update what will be committed)
  (use "dolt checkout <table>" to discard changes in working directory)
	modified:       docs
docs $ dolt checkout docs
docs $ dolt status
On branch main
nothing to commit, working tree clean
docs $ dolt sql -q "select * from docs"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
+----+----+
```

### Checkout on the Command Line
```
docs $ dolt sql -q "select * from docs"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
+----+----+
docs $ dolt branch
  feature-branch                                	
* main                                          	
docs $ dolt sql -q "insert into docs values (3,0)";
Query OK, 1 row affected
docs $ dolt checkout -b follow-me
Switched to branch 'follow-me'
docs $ dolt sql -q "select * from docs"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
| 3  | 0  |
+----+----+
docs $ dolt status
On branch follow-me
Changes not staged for commit:
  (use "dolt add <table>" to update what will be committed)
  (use "dolt checkout <table>" to discard changes in working directory)
	modified:       docs
docs $ dolt diff
diff --dolt a/docs b/docs
--- a/docs @ c341qjl0eholuiu1k4pvujre7mc75qtc
+++ b/docs @ f7isl5tqm92ovogh6v8seq26lsjmiknk
+-----+----+----+
|     | pk | c1 |
+-----+----+----+
|  +  | 3  | 0  |
+-----+----+----+
```

### Checkout in SQL server
```
mysql> insert into docs values (4,4);
mysql> select * from docs ;
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
| 3  | 0  |
| 4  | 4  |
+----+----+
mysql> call dolt_checkout('follow-me');
+--------+
| status |
+--------+
| 0      |
+--------+
mysql> select * from docs ;
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
| 3  | 0  |
+----+----+
```
