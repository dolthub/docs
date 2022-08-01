---
title: Benchmarks
---

Dolt publishes benchmarks for its correctness and performance relative
to other relational databases. Additional benchmarks will be added
over time.

To learn more, click on a subsection heading.

* [SQL correctness](./correctness.md) tests Dolt's query engine against
  the `sqllogictest` suite for correctness issues.
* [Server latency](./latency.md) uses `sysbench` to compare Dolt's read
  and write latencies against MySQL.
* [Import latency](./import.md) uses a custom benchmark to compare Dolt's bulk import performance
  against MySQL's `LOAD DATA` command's performance.
