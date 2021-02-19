---
title: MySQL Dialect Support
---

Dolt's goal is to be compliant with the MySQL dialect, with every query and statement that works in MySQL behaving identically in Dolt. For most syntax and technical questions, you should feel free to refer to the [MySQL user manual](https://dev.mysql.com/doc/refman/8.0/en/select.html). Any deviation from the MySQL manual should be documented on this page, or else indicates a bug. Please [file issues](https://github.com/dolthub/dolt/issues) with any incompatibilities you discover.

The content is organized as follows:
- [Data Description](data-description): SQL features for describing and organizing data
- [Expressions, Functions, Operators](expressions-functions-operators): SQL expressions, functions and operators used in queries
- [Supported Statements](supported-statements): statements Dolt supports
- [Miscellaneous](miscellaneous): miscellaneous SQL features
