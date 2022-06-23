---
title: SQL Language Support
---

Dolt's goal is to be compliant with the MySQL dialect, with every query and statement that works in MySQL behaving identically in Dolt. 

For most syntax and technical questions, you should feel free to refer to the [MySQL user manual](https://dev.mysql.com/doc/refman/8.0/en/select.html). 

Any deviation from the MySQL manual should be documented on this page, or else indicates a bug. Please [file issues](https://github.com/dolthub/dolt/issues) with any incompatibilities you discover.

This series of documents shows:

* ✅ Which SQL language features we support the same as MySQL 
* 🟠 Where we support the feature but deviate from MySQL in some way 
* ❌ Where we lack support for the SQL language feature. 

This section is divided into four main categories:

1. [Data Description](data-description.md): SQL features for describing and organizing data
2. [Expressions, Functions, Operators](expressions-functions-operators.md): SQL expressions, functions and operators used in queries
3. [Supported Statements](supported-statements.md): statements Dolt supports
4. [Miscellaneous](miscellaneous.md): miscellaneous SQL features