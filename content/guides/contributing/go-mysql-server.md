---
title: "Contributing to Go MySQL Server"
---

[Dolt](https://doltdb.com) is an open-source SQL database that has Git-like
functionality, including branch, merge, clone, push and pull. As we attract
more and more users with various use cases and ways of integrating Dolt into
their existing workflows and systems, it's not rare for Dolt and its SQL engine
to need a little bit of work to support a new client library or upstream
dependency. This blog post is a short tutorial about how to make and test
changes in Dolt and its SQL engine, and how to submit those changes for
inclusion in Dolt itself.

## Prerequisites

Before we get started, you should know that:

1. Dolt is largely written in [golang](https://golang.org/) and
   you should [install the golang sdk](https://golang.org/dl/) to work with it.

2. Dolt's SCM is [git](https://www.git-scm.com) and you will need to [download
   and install it](https://git-scm.com/downloads) to fetch the source code and
   create pull requests.

3. Dolt's source code is hosted on [github](https://www.github.com) and you
   will want to [create an account](https://github.com/signup) and [follow the
   instructions for authenticating to GitHub with
   SSH](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh)
   if you don't already have one.

# An Example Code Change

For the purposes of this blog post, we're going to work through fixing and
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

Let's start by checking out the relevant projects, building dolt, and seeing if
we can reproduce the error based on the error message and the bug report.

# Getting the Source Code

Dolt's primary repository is at [dolthub/dolt](https://github.com/dolthub/dolt)
on GitHub. The majority of the logic for SQL expression handling lives in a
separate project,
[dolthub/go-mysql-server](https://github.com/dolthub/go-mysql-server). We're
going to need to work on both of these projects. Our first step is to fork the
projects so that we have our own fork to push to and submit PRs from. On both
repository pages on GitHub, while signed in, click "Fork" in the upper right
corner of the repository page. You will get your own copy of the repository:

![forked dolthub](../images/forked-dolthub.png)

Then we clone those forks to a workspace on our computer:

```shell
~ $ mkdir dolt_workspace
~/dolt_workspace $ cd dolt_workspace
~/dolt_workspace $ git clone git@github.com:reltuk/dolt.git
~/dolt_workspace $ git clone git@github.com:reltuk/go-mysql-server.git
```

By default, the dolt repository builds and links against a pinned version of
go-mysql-server, so to develop the two together we need to point our checkout
to our local go-mysql-server. The go module root for dolt lives in `//go`,
while the go module root for go-mysql-server lives in `//`. We will also take
the chance to create a local git branch for our changes:

```shell
~/dolt_workspace $ cd go-mysql-server
~/dolt_workspace/go-mysql-server $ git checkout -b aaron/fix-2088-time-convert-bug
~/dolt_workspace/go-mysql-server $ cd ../dolt/go
~/dolt_workspace/dolt/go $ git checkout -b aaron/fix-2088-time-convert-bug
~/dolt_workspace/dolt/go $ go mod edit -replace github.com/dolthub/go-mysql-server=../../go-mysql-server
```

It's reasonable at this point to check that everything is setup and working as
expected by running dolt's unit tests (some of these packages unfortunately
take a bit of time for the tests to run, and this can take a few minutes):

```shell
~/dolt_workspace/dolt/go $ go test ./...
?   	github.com/dolthub/dolt/go/cmd/dolt	[no test files]
ok  	github.com/dolthub/dolt/go/cmd/dolt/cli	0.843s
ok  	github.com/dolthub/dolt/go/cmd/dolt/commands	2.547s
?   	github.com/dolthub/dolt/go/cmd/dolt/commands/cnfcmds	[no test files]
?   	github.com/dolthub/dolt/go/cmd/dolt/commands/credcmds	[no test files]
?   	github.com/dolthub/dolt/go/cmd/dolt/commands/cvcmds	[no test files]
?   	github.com/dolthub/dolt/go/cmd/dolt/commands/indexcmds	[no test files]
?   	github.com/dolthub/dolt/go/cmd/dolt/commands/schcmds	[no test files]
ok  	github.com/dolthub/dolt/go/cmd/dolt/commands/sqlserver	1.198s
?   	github.com/dolthub/dolt/go/cmd/dolt/commands/tblcmds	[no test files]
ok  	github.com/dolthub/dolt/go/cmd/dolt/errhand	0.300s
?   	github.com/dolthub/dolt/go/cmd/git-dolt	[no test files]
?   	github.com/dolthub/dolt/go/cmd/git-dolt/commands	[no test files]
ok  	github.com/dolthub/dolt/go/cmd/git-dolt/config	0.206s
?   	github.com/dolthub/dolt/go/cmd/git-dolt/doltops	[no test files]
?   	github.com/dolthub/dolt/go/cmd/git-dolt/env	[no test files]
ok  	github.com/dolthub/dolt/go/cmd/git-dolt/utils	0.311s
?   	github.com/dolthub/dolt/go/cmd/git-dolt-smudge	[no test files]
.
.
.
?   	github.com/dolthub/dolt/go/store/util/outputpager	[no test files]
?   	github.com/dolthub/dolt/go/store/util/profile	[no test files]
?   	github.com/dolthub/dolt/go/store/util/progressreader	[no test files]
ok  	github.com/dolthub/dolt/go/store/util/random	0.294s
ok  	github.com/dolthub/dolt/go/store/util/sizecache	0.244s
?   	github.com/dolthub/dolt/go/store/util/status	[no test files]
?   	github.com/dolthub/dolt/go/store/util/tempfiles	[no test files]
?   	github.com/dolthub/dolt/go/store/util/test	[no test files]
ok  	github.com/dolthub/dolt/go/store/util/verbose	0.312s
ok  	github.com/dolthub/dolt/go/store/util/writers	0.292s
ok  	github.com/dolthub/dolt/go/store/valuefile	0.471s
?   	github.com/dolthub/dolt/go/utils/3pdeps	[no test files]
?   	github.com/dolthub/dolt/go/utils/copyrightshdrs	[no test files]
?   	github.com/dolthub/dolt/go/utils/remotesrv	[no test files]
```

Finally, let's install dolt from source and see if we can make progress on
reproducing the bug. Here, we just attempt to insert the same string that
appears in the error message into a `timestamp` column:

```shell
~/dolt_workspace/dolt/go $ go install ./cmd/dolt
~/dolt_workspace/dolt/go $ cd ../../
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
At this point, the bug is fixed in Dolt's SQL engine. We need to submit a pull
request to the upstream project (`dolt/go-mysql-server`) so that the fix can
land in Dolt's pinned version of the dependency. Let's go ahead and do that.
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
I can open the provided link in my browser
(https://github.com/reltuk/go-mysql-server/pull/new/aaron/fix-2088-time-convert-bug)
and open the PR by clicking the `Create pull request` button:
![open pull request](../images/open-go-mysql-server-pull-request.png)
Submitting the PR will get some automated tests run against the branch and will
notify the project maintainers that someone has some changes they would like to
land in `go-mysql-server`. If there are failures in the automated tests, the
maintainers will let you know what steps you need to take to fix things up.
Otherwise, the maintainers will provide feedback, or, if everything looks good,
they will merge the PR.
# Getting the Changes into Dolt
Once a change lands in `go-mysql-server`, it will make its way Dolt's main
branch through automation. A PR will be opened against `dolthub/dolt` to bump
the dependency, and automated tests will be run against the `dolt` repository.
Someone from the `dolt` team will merge the PR (or a subsequent one with
equivalent effect). However, if you want to add automated tests to dolt itself
that assert the behavior you have fixed in `go-mysql-server`, please feel free
to submit a separate PR for that. For this particular bug fix, we did [add bats
tests at the dolt
layer](https://github.com/dolthub/dolt/commit/7995467efb2c49b8e5bebbc1e02d500576e405c3#diff-d4e784a806de827e327ccdf0d2c8992bc8c0cba0a915277cf56417a304f39799)
to assert the behavior we want. It's also worth noting that the `enginetest`
integration tests from `go-mysql-server` also get run against Dolt as the
storage engine by dolt's unit test setup as well.
# Conclusion
Contributing to a new open source project can have a high barrier to entry,
including discovering toolchains and developer tools dependencies, code
organization, build and test processes, etc. The go ecosystem is quite
homogenous in this regard and that makes it easier to jump into Dolt and
go-mysql-server than equivalently sized projects in other language ecosystems
might be. But there are still specific dependencies that need to be in place,
subtleties of code organization to take into account and specific workflows
that need to be known about and worked within. Hopefully this short overview
has given a good concrete example of how to make progress on improving and
testing Dolt's SQL engine. Some major takeaways:
1. Dolt depends on go-mysql-server and fixing SQL engine bugs in particular
   will often involve changing go-mysql-server, which lives in a separate Git
   repository. You can make good iterative progress by checking out and
   branching both repositories and adding a local dependency override to
   `dolt/go/go.mod` with the `go mod edit ...` invocation used above.
2. `go-mysql-server` has two major types of tests: unit tests that live next to
   the implementation of the expression, function, analysis phase, plan nodes,
   etc., and engine tests, which live in `//enginetest`. Engine tests function
   more like high level integration and functional tests. Many changes to
   go-mysql-server will merit adding some of both types of tests.
3. Once a `go-mysql-server` PR is accepted and merged, it will make its way to
   `dolt`'s master branch automatically. For many types of improvements to the
   SQL support in Dolt, it may not be necessary to make any changes to the Dolt
   repository itself. If you do need to or want to make changes to the Dolt
   repository itself, the procedure looks largely the same, just with opening a
   PR against the Dolt repository.
We hope this blog post can help anyone looking to navigate and contribute to
the Dolt code base more effectively in the future.
If you're looking to jump into the Dolt or go-mysql-server code bases, we use
the tag `good first issue` on our github issues to tag things that are probably
near at hand, unambiguous, and easy to test and review. Feel free to check out
the current list of issues [in
go-mysql-server](https://github.com/dolthub/go-mysql-server/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
or [in
dolt](https://github.com/dolthub/dolt/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).
