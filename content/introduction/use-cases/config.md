# Configuration Management

It is common practice to store this YAML configuration in Git. Unfortunately, a file based UI becomes unwieldy at scale because it's not queryable. For large scale configuration management, you often grow out of YAML. Your configuration becomes data and you need a database to store it, not files.

By adopting Dolt for configuration management, you can have Git-style version control and the ability to query large scale sets of configuration. [Nautobot](https://github.com/nautobot/nautobot), a network configuration management tool, [leverages Dolt](https://www.dolthub.com/blog/2021-09-24-announcing-nautobot-on-dolt/) to allow Network engineers to share network configuration data more easily. Nautobot was built to be backed by Postgres, but by moving it to Dolt, Nautobot was able to support Git-style versioning, including integrated code review via Pull Requests.

Dolt is the database for configuration management.
