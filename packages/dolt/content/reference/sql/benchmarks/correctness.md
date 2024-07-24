---
title: Correctness
---

# SQL Correctness

## SQLLogicTests
To measure Dolt's SQL correctness, we test each release of Dolt
against a SQL testing suite called
[sqllogictest](https://github.com/dolthub/sqllogictest). This suite
consists of 5.9 million SQL queries and their results, using the
results returned by MySQL as a reference. Many of these are randomly
generated queries that exercise very complex logic a human would have
a hard time reasoning about. They give us greater confidence that the
query engine produces correct results for any query, as opposed to
just the ones we and our customers have thought to try so far. These
tests have exposed many bugs in query execution logic before customers
discovered them.

Here's an example of a query run by this test suite:

```sql
SELECT pk FROM tab1 WHERE ((((col3 > 0 AND ((col0 >= 7 AND col0 <= 2)
AND (col0 <= 4 OR col4 < 5.82 OR col3 > 7) AND col0 >= 4) AND col0 <
0) AND ((col1 > 7.76))))) OR ((col1 > 7.23 OR (col0 <= 3) OR (col4 >=
2.72 OR col1 >= 8.63) OR (col3 >= 3 AND col3 <= 4)) AND ((col0 < 2 AND
col3 < 0 AND (col1 < 6.30 AND col4 >= 7.2)) AND (((col3 < 5 AND col4
IN (SELECT col1 FROM tab1 WHERE ((col3 >= 7 AND col3 <= 6) OR col0 < 0
OR col1 >= 0.64 OR col3 <= 7 AND (col3 >= 8) AND ((col3 <= 6) AND
((col0 = 1 AND col3 IS NULL)) OR col0 > 7 OR col3 IN (8,1,7,4) OR col3
> 7 AND col3 >= 5 AND (col3 < 0) OR col0 > 3 AND col4 > 1.21 AND col0
< 4 OR ((col4 > 9.30)) AND ((col3 >= 5 AND col3 <= 7))) AND col0 <= 5
OR ((col0 >= 1 AND col4 IS NULL AND col0 > 5 AND (col0 < 3) OR col4 <=
8.86 AND (col3 > 0) AND col3 = 8)) OR col3 >= 1 OR (col3 < 4 OR (col3
= 7 OR (col1 >= 4.84 AND col1 <= 5.61)) OR col3 >= 5 AND ((col3 < 4)
AND ((col3 > 9)) OR (col0 < 3) AND (((col0 IS NULL))) AND (col0 < 4))
AND ((col4 IN (0.79)))) OR (col4 = 6.26 AND col1 >= 5.64) OR col1 IS
NULL AND col0 < 1)))) AND ((((col3 < 9) OR ((col0 IS NULL) OR (((col1
>= 8.40 AND col1 <= 0.30) AND col3 IS NULL OR (col0 <= 7 OR ((col3 >
4))) AND col0 = 6)) OR col3 < 6 AND (((((((col1 > 4.8)) OR col0 < 9 OR
(col3 = 1))) AND col4 >= 4.12))) OR (((col1 > 1.58 AND col0 < 7))) AND
(col1 < 8.60) AND ((col0 > 1 OR col0 > 1 AND ((col3 >= 2 AND col3 <=
0) AND col0 <= 0) OR ((col0 >= 8)) AND (((col3 >= 8 AND col3 <= 8) OR
col0 > 4 OR col3 = 8)) AND col1 > 5.10) AND ((col0 < 7 OR (col0 < 6 OR
(col3 < 0 OR col4 >= 9.51 AND (col3 IS NULL AND col1 < 9.41 AND col1 =
1.9 AND col0 > 1 AND col3 < 9 OR (col4 IS NULL) OR col1 = 0.5 AND
(col0 >= 3) OR col4 = 9.25 OR ((col1 > 0.26)) AND col4 < 8.25 AND
(col0 >= 2) AND col3 IS NULL AND (col1 > 3.52) OR (((col4 < 7.24)) AND
col1 IS NULL) OR col0 > 3) AND col3 >= 4 AND col4 >= 2.5 AND col0 >= 0
OR (col3 > 3 AND col3 >= 3) AND col0 = 1 OR col1 <= 8.9 AND col1 >
9.66 OR (col3 > 9) AND col0 > 0 AND col3 >= 0 AND ((col4 > 8.39))))
AND (col1 IS NULL)))))) AND col1 <= 2.0 OR col4 < 1.8 AND (col4 = 6.59
AND col3 IN (3,9,0))))) OR col4 <= 4.25 OR ((col3 = 5))) OR (((col0 >
0)) AND col0 > 6 AND (col4 >= 6.56)))
```

Here are Dolt's sqllogictest results for version `1.42.2`.  Tests that
did not run could not complete due to a timeout earlier in the run.
<!-- START___DOLT___CORRECTNESS_RESULTS_TABLE -->
|       Read Tests        | MySQL |  Dolt  | Multiple |
|-------------------------|-------|--------|----------|
| covering\_index\_scan   |  2.07 |   3.02 |      1.5 |
| groupby\_scan           | 13.22 |  17.32 |      1.3 |
| index\_join             |  1.37 |   5.37 |      3.9 |
| index\_join\_scan       |  1.27 |   2.57 |      2.0 |
| index\_scan             | 34.33 |  54.83 |      1.6 |
| oltp\_point\_select     |  0.18 |   0.46 |      2.6 |
| oltp\_read\_only        |  3.49 |    7.7 |      2.2 |
| select\_random\_points  |  0.34 |   0.75 |      2.2 |
| select\_random\_ranges  |  0.39 |    0.9 |      2.3 |
| table\_scan             | 34.33 |  56.84 |      1.7 |
| types\_table\_scan      | 74.46 | 144.97 |      1.9 |
| reads\_mean\_multiplier |       |        |      2.1 |

|       Write Tests        | MySQL | Dolt  | Multiple |
|--------------------------|-------|-------|----------|
| oltp\_delete\_insert     |  8.13 |  6.09 |      0.7 |
| oltp\_insert             |  3.82 |  3.02 |      0.8 |
| oltp\_read\_write        |  8.58 | 13.95 |      1.6 |
| oltp\_update\_index      |  3.89 |  3.07 |      0.8 |
| oltp\_update\_non\_index |  3.89 |  3.02 |      0.8 |
| oltp\_write\_only        |  5.37 |  6.32 |      1.2 |
| types\_delete\_insert    |   7.7 |  6.67 |      0.9 |
| writes\_mean\_multiplier |       |       |      1.0 |

| Overall Mean Multiple | 1.55 |
|-----------------------|------|
<!-- END___DOLT___CORRECTNESS_RESULTS_TABLE -->
<br/>

## Function Coverage
We also measure the coverage of the functions in the SQL engine. This
is a measure of how many of the supported MySQL functions are also
supported by Dolt. 

Here are Dolt's function coverage results for version `1.40.3`.
| Supported | Total | Percent Coverage |
|-----------|-------|------------------|
|       308 |   438 |               70 |

## Skipped Engine Tests
Here are the total number of tests skipped by the engine for 
version `1.40.3`. These are edge cases that we know are failing for 
one reason or another, but haven't been able to fix yet.

In general, these tests are more difficult to fix compared to 
SQLLogicTests. These are tests we discovered during development 
that emphasize blind spots in SQLLogicTests. 
Additionally, these tests are unique and do not overlap in coverage
(unlike SQLLogicTests).

| Passing | Total | Percent Passing |
|---------|-------|-----------------|
|   43360 | 43578 |           99.50 |