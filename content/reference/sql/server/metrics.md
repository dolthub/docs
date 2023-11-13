---
title: Metrics
---

Dolt's SQL server can optionally expose metrics through a [Prometheus](https://prometheus.io/) HTTP endpoint. You can enable the Prometheus HTTP endpoint by defining a `metrics` section in your [YAML configuration](https://docs.dolthub.com/sql-reference/server/configuration). The following YAML configuration file shows a complete configuration file that enables Prometheus metrics on port 11228:
```
log_level: info

user:
  name: root
  password: ""

listener:
  host: localhost
  port: 11227
  max_connections: 100
  read_timeout_millis: 28800000
  write_timeout_millis: 28800000

metrics:
  labels: {}
  host: localhost
  port: 11228
```

Once you start a Dolt SQL server with the configuration above, you'll be able to view all the exposed metrics and their descriptions at http://localhost:11228/metrics. The metrics prefixed with `dss_` are Dolt SQL server metrics, and metrics prefixed with `go_` are Golang runtime metrics.

#### Important Dolt SQL Server Metrics
- `dss_concurrent_connections` – Number of clients concurrently connected to this instance of dolt sql server.
- `dss_concurrent_queries` – Number of queries concurrently being run on this instance of dolt sql server.
- `dss_query_duration_bucket` – Histogram buckets of dolt sql server query runtimes

#### Important Go Runtime Metrics
- `go_gc_duration_seconds` – Histogram buckets containing counts for different pause durations of garbage collection cycles.
- `go_gc_duration_seconds_count` – The total number of seconds Dolt has spent performing garbage collection.
- `go_memstats_alloc_bytes` – Number of bytes allocated and still in use.

### Scraping with Prometheus
After you've inspected the metrics by manually looking the `/metrics` page, you can configure a Prometheus server to scrape that data so you can use the Prometheus web UI to explore your metrics. Here's an example Prometheus server configuration file showing how to configure metrics scraping for a Dolt SQL server with metrics exposed on port 11228:
```
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "dolt-sql-server"
    static_configs:
    - targets: ["localhost:11228"]
```
