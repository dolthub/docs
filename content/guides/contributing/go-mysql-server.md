---
title: "Contributing to Go MySQL Server"
---

This is a short tutorial about how to make and test
changes in Dolt and its Go MySQL engine. 
We're going to work through fixing and
testing [a recent bug that was filed against
Dolt](https://github.com/dolthub/dolt/issues/2088). In the bug report, a user
is using
[RMariaDB](https://cran.r-project.org/web/packages/RMariaDB/index.html), a
database connector library for [R](https://www.r-project.org/), and is seeing
some values of certain timestamps fail to insert. The server is returning an error:

```r
time = data.frame(time = as.POSIXct("2014-01-01 19:00:00"))
try(dbWriteTable(dolt_conn, "time", time, overwrite = TRUE))
#> Error : value "2014-1-2" can't be converted to time.Time [1105]
```

# Setup
Follow these [setup instructions](../contributing.md).


# Reproduce the Bug
Let's see if we can make progress on reproducing the bug.
Here, we just attempt to insert the same string that
appears in the error message into a `timestamp` column:
```shell
~/dolt_workspace $ mkdir test_db
~/dolt_workspace $ cd test_db
~/dolt_workspace/test_db $ dolt init
Successfully initialized dolt data repository.
~/dolt_workspace/test_db $ dolt sql
# Welcome to the DoltSQL shell.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
test_db> create table has_timestamp (t timestamp);
test_db> insert into has_timestamp values ('2014-1-2');
value "2014-1-2" can't be converted to time.Time
```

Brilliant, we've managed to reproduce the bug. Let's track down where that
error is coming from.

## Tracking Down the Error
Hopefully this isn't too hard:
```shell
$ ~/dolt_workspace $ grep -R "can't be converted to time.Time"
aaronson@Aarons-MacBook-Pro dolt_workspace % grep -R "can\'t be converted to time.Time" .
./go-mysql-server/benchmark/metadata.go:				// TODO: value "1996-01-02" can't be converted to time.Time
./go-mysql-server/benchmark/metadata.go:				// TODO: value "1996-03-13" can't be converted to time.Time
./go-mysql-server/benchmark/metadata.go:				// TODO: value "1996-03-13" can't be converted to time.Time
./go-mysql-server/benchmark/metadata.go:				// TODO: value "1996-03-13" can't be converted to time.Time
./go-mysql-server/sql/datetimetype.go:	ErrConvertingToTime = errors.NewKind("value %q can't be converted to time.Time")
```
so we can open `go-mysql-server/sql/datetimetype.go` in an editor and look for
uses of `ErrConvertingToTime`. We quickly find the only place it is returned:
```go
func (t datetimeType) ConvertWithoutRangeCheck(v interface{}) (time.Time, error) {
        var res time.Time
        switch value := v.(type) {
        case string:
                if value == zeroDateStr || value == zeroTimestampDatetimeStr {
                        return zeroTime, nil
                }
                parsed := false
                for _, fmt := range TimestampDatetimeLayouts {
                        if t, err := time.Parse(fmt, value); err == nil {
                                res = t.UTC()
                                parsed = true
                                break
                        }
                }
                if !parsed {
                        return zeroTime, ErrConvertingToTime.New(v)
                }
```
and going to the definition of `TimestampDatetimeLayouts`, we find:
```go
        // TimestampDatetimeLayouts hold extra timestamps allowed for parsing. It does
        // not have all the layouts supported by mysql. Missing are two digit year
        // versions of common cases and dates that use non common separators.
        //
        // https://github.com/MariaDB/server/blob/mysql-5.5.36/sql-common/my_time.c#L124
        TimestampDatetimeLayouts = []string{
                "2006-01-02 15:04:05.999999",
                "2006-01-02",
                "2006-1-2 15:4:5.999999",
                time.RFC3339,
                time.RFC3339Nano,
                "2006-01-02T15:04:05",
                "20060102150405",
                "20060102",
                "2006/01/02",
                "2006-01-02 15:04:05.999999999 -0700 MST", // represents standard Time.time.UTC()
        }
```
Notably present is a `"2006-1-2 15:4:5.999999"`, which looks like it might
handle single-digit months and days in a date that comes with a timestamp. But
there is no corresponding `"2006-1-2"` in that list, which would possibly
handle the case we're trying to fix. Let's start by looking for a unit test we
could write that would demonstrate the bug in this `ConvertWithoutRangeCheck`
function.
We open up `datetimetype_test.go`, and look through the top level functions:
```go
func TestDatetimeCompare(t *testing.T) {
func TestDatetimeCreate(t *testing.T) {
func TestDatetimeCreateInvalidBaseTypes(t *testing.T) {
func TestDatetimeConvert(t *testing.T) {
func TestDatetimeString(t *testing.T) {
```
for our purposes, `TestDatetimeConvert` looks the most promising, and digging
into the implementation, it's a [table driven
test](https://github.com/golang/go/wiki/TableDrivenTests) with a pretty
straight forward structure of giving an input to `Convert` and asserting a
matching output and error value. We can just add tests for each of the three
handled time types:
```diff
diff --git a/sql/datetimetype_test.go b/sql/datetimetype_test.go
index d9551262..a3d385a9 100644
--- a/sql/datetimetype_test.go
+++ b/sql/datetimetype_test.go
@@ -150,6 +150,9 @@ func TestDatetimeConvert(t *testing.T) {
                {Date, time.Date(2012, 12, 12, 12, 12, 12, 12, time.UTC),
                        time.Date(2012, 12, 12, 0, 0, 0, 0, time.UTC), false},
                {Date, "2010-06-03", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
+               {Date, "2010-6-3", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
+               {Date, "2010-6-03", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
+               {Date, "2010-06-3", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
                {Date, "2010-06-03 12:12:12", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
                {Date, "2010-06-03 12:12:12.000012", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
                {Date, "2010-06-03T12:12:12Z", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
@@ -161,6 +164,9 @@ func TestDatetimeConvert(t *testing.T) {
                {Datetime, time.Date(2012, 12, 12, 12, 12, 12, 12, time.UTC),
                        time.Date(2012, 12, 12, 12, 12, 12, 12, time.UTC), false},
                {Datetime, "2010-06-03", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
+               {Datetime, "2010-6-3", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
+               {Datetime, "2010-06-3", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
+               {Datetime, "2010-6-03", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
                {Datetime, "2010-06-03 12:12:12", time.Date(2010, 6, 3, 12, 12, 12, 0, time.UTC), false},
                {Datetime, "2010-06-03 12:12:12.000012", time.Date(2010, 6, 3, 12, 12, 12, 12000, time.UTC), false},
                {Datetime, "2010-06-03T12:12:12Z", time.Date(2010, 6, 3, 12, 12, 12, 0, time.UTC), false},
@@ -177,6 +183,9 @@ func TestDatetimeConvert(t *testing.T) {
                {Timestamp, time.Date(2012, 12, 12, 12, 12, 12, 12, time.UTC),
                        time.Date(2012, 12, 12, 12, 12, 12, 12, time.UTC), false},
                {Timestamp, "2010-06-03", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
+               {Timestamp, "2010-6-3", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
+               {Timestamp, "2010-6-03", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
+               {Timestamp, "2010-06-3", time.Date(2010, 6, 3, 0, 0, 0, 0, time.UTC), false},
                {Timestamp, "2010-06-03 12:12:12", time.Date(2010, 6, 3, 12, 12, 12, 0, time.UTC), false},
                {Timestamp, "2010-06-03 12:12:12.000012", time.Date(2010, 6, 3, 12, 12, 12, 12000, time.UTC), false},
                {Timestamp, "2010-06-03T12:12:12Z", time.Date(2010, 6, 3, 12, 12, 12, 0, time.UTC), false},
```
and then try running the tests:
```shell
dolt_workspace/go-mysql-server/sql $ go test .
aaronson@Aarons-MacBook-Pro sql % go test . -count 1
--- FAIL: TestDatetimeConvert (0.00s)
    --- FAIL: TestDatetimeConvert/DATE_2010-6-3_2010-06-03_00:00:00_+0000_UTC (0.00s)
        datetimetype_test.go:255:
            	Error Trace:	datetimetype_test.go:255
            	Error:      	Received unexpected error:
            	            	value "2010-6-3" can't be converted to time.Time
...
    --- FAIL: TestDatetimeConvert/DATE_2010-6-03_2010-06-03_00:00:00_+0000_UTC (0.00s)
        datetimetype_test.go:255:
            	Error Trace:	datetimetype_test.go:255
            	Error:      	Received unexpected error:
            	            	value "2010-6-03" can't be converted to time.Time
...
...
FAIL
FAIL	github.com/dolthub/go-mysql-server/sql	0.181s
FAIL
```
Perfect. Let's go ahead and see if we can fix it by adding the new pattern in
`TimestampDatetimeLayouts`.
```diff
diff --git a/sql/datetimetype.go b/sql/datetimetype.go
index 2f00e324..f50b82af 100644
--- a/sql/datetimetype.go
+++ b/sql/datetimetype.go
@@ -62,6 +62,7 @@ var (
        TimestampDatetimeLayouts = []string{
                "2006-01-02 15:04:05.999999",
                "2006-01-02",
+               "2006-1-2",
                "2006-1-2 15:4:5.999999",
                time.RFC3339,
                time.RFC3339Nano,
```
and test again:
```shell
dolt_workspace/go-mysql-server/sql $ go test .
ok  	github.com/dolthub/go-mysql-server/sql	0.327s
```
Seems to work. So now we have a unit test demonstrating the problem and we've
made that test pass. There's one other type of test we can add if we want to.
The original bug was reported in the context of an insert, and it would be
great to codify the fact that `INSERT INTO table_with_datetime (timestamp) VALUES ("2006-6-3")` should always work. For that kind of test,
`go-mysql-server` has a directory of integration tests that lives at
`//enginetest`. If we look around a little, we will find a file called
`insert_queries.go` and we can look through that file for places where we're
doing integration tests of inserts into datetime columns. Eventually, we might
come with something like:
```diff
diff --git a/enginetest/insert_queries.go b/enginetest/insert_queries.go
index 5b88fad5..a4daf1f3 100644
--- a/enginetest/insert_queries.go
+++ b/enginetest/insert_queries.go
@@ -190,6 +190,12 @@ var InsertQueries = []WriteQueryTest{
                SelectQuery:         "SELECT * FROM typestable WHERE id = 999;",
                ExpectedSelect:      []sql.Row{{int64(999), nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil, nil}},
        },
+       {
+               WriteQuery:          `INSERT INTO typestable (id, ti, da) VALUES (999, '2021-09-1', '2021-9-01');`,
+               ExpectedWriteResult: []sql.Row{{sql.NewOkResult(1)}},
+               SelectQuery:         "SELECT id, ti, da FROM typestable WHERE id = 999;",
+               ExpectedSelect:      []sql.Row{{int64(999), sql.MustConvert(sql.Timestamp.Convert("2021-09-01")), sql.MustConvert(sql.Date.Convert("2021-09-01"))}},
+       },
        {
                WriteQuery: `INSERT INTO typestable SET id=999, i8=null, i16=null, i32=null, i64=null, u8=null, u16=null, u32=null, u64=null,
                        f32=null, f64=null, ti=null, da=null, te=null, bo=null, js=null, bl=null;`,
```
which hopefully captures the spirit of the behavior we want to verify. We can
also verify that this fixes the behavior all the way at the dolt layer:
```shell
~/dolt_workspace/dolt/go $ go install ./cmd/dolt
~/dolt_workspace/dolt/go $ cd ../../test_db
~/dolt_workspace/test_db $ dolt sql
# Welcome to the DoltSQL shell.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
test_db> insert into has_timestamp values ('2014-1-2');
Query OK, 1 row affected
```

# Committing and Opening a Pull Request
At this point, the bug is fixed in Dolt's SQL engine. 
Commit and push your changes through git.
```shell
~/dolt_workspace/go-mysql-server $ git commit -am 'Fix string to datetime convert of YYYY-M-D.'
[aaron/fix-2088-time-convert-bug 81dce573] Fix string to datetime convert of YYYY-M-D.
 3 files changed, 16 insertions(+)
~/dolt_workspace/go-mysql-server $ git push origin aaron/fix-2088-time-convert-bug:aaron/fix-2088-time-convert-bug
Enumerating objects: 13, done.
Counting objects: 100% (13/13), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (7/7), 803 bytes | 803.00 KiB/s, done.
Total 7 (delta 6), reused 4 (delta 4)
remote: Resolving deltas: 100% (6/6), completed with 6 local objects.
remote:
remote: Create a pull request for 'aaron/fix-2088-time-convert-bug' on GitHub by visiting:
remote:      https://github.com/reltuk/go-mysql-server/pull/new/aaron/fix-2088-time-convert-bug
remote:
To github.com:reltuk/go-mysql-server.git
 * [new branch]        aaron/fix-2088-time-convert-bug -> aaron/fix-2088-time-convert-bug
```
Finally, we just need to [submit a pull request](../contributing.md#submit-pull-request).
