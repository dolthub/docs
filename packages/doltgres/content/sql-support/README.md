---
title: SQL Language Support
---

Doltgres's goal is to be compliant with the PostgreSQL dialect, 
with every query and statement that works in PostgreSQL behaving identically in Doltgres.

For most syntax and technical questions, you should feel free to refer to 
the [PostgreSQL 15 user manual](https://www.postgresql.org/docs/15/index.html).

Any deviation from the PostgreSQL 15 manual should be documented on this page, 
or else indicates a bug. Please [file issues](https://github.com/dolthub/dolt/issues) 
with any incompatibilities you discover.

This series of documents shows:

* ✅ Which SQL language features we support the same as PostgreSQL
* 🟠 Where we support the feature but deviate from PostgreSQL in some way
* ❌ Where we lack support for the SQL language feature.
