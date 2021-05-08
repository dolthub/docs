---
title: Application Database
---

Dolt SQL interface is closely modeled against MySQL. In particular Dolt implements the MySQL dialect, and is compatible with its wire protocols. There are two obvious motivations for migrating to Dolt:
- to implement version control features in the application that would be cumbersome to build using traditional SQL
- to store the lineage of the underlying application data


## Version Control Features
Building version control features into an application is complicated. It requires implementing brand new schemas that work alongside application code. These schemas are often not a natural fit for SQL. By making robust version control native to the SQL layer, Dolt enables application developers to focus on the application layer where business value lives.

## Case Studies
[Nautobot](https://github.com/nautobot/nautobot) is an open source "Network Source of Truth and Network Automation Platform." The project is sponsored by [Network to Code](https://www.networktocode.com/), a provider of network automation solutions. You can read more about Network to Code's motivations for integrating Nautobot and Dolt [here](nautobot.md).

## Versioning Application Data
This is the simpler case. Some applications used to managed configuration data might benefit from robust versioning, and the ability to instantly rollback to historical versions. Or application owners may simply want a history for audit purpose. In this case the application simply sits on top of Dolt and periodically snaps a commit into the Dolt commit graph:
