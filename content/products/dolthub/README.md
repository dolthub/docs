---
title: DoltHub
---

![](../../.gitbook/assets/dolthub-logo.png)

[DoltHub](https://www.dolthub.com) is a place to share Dolt databases. We host public data for free! DoltHub adds a modern, secure, always on database management web GUI to the Dolt ecosystem. Edit your database on the web, have another person review it via a pull request, and have the production database pull it to deploy.

# What is DoltHub

DoltHub is Dolt's GitHub. DoltHub acts as a [Dolt remote](../../concepts/dolt/git/remotes.md) you can [clone, push, pull and fetch](../../reference/cli.md) from. DoltHub adds [permissions](../../concepts/dolthub/permissions.md), [pull requests](../../concepts/dolthub/prs.md), [issues](../../concepts/dolthub/issues.md), and [forks](../../concepts/dolthub/forks.md) to the Dolt ecosystem. Additionally, DoltHub has a modern SQL workbench built in so you can explore and change databases on the web.

# Use Cases

DoltHub can be used for [Data Sharing](./data-sharing.md) publicly or privately.

DoltHub also hosts [Data Bounties](./data-bounties.md) where we pay to have an open database constructed, usually from scraping and transforming public data.

# DoltHub API

DoltHub has [an API](./dolthub-api/README.md) you can script against. 

# Guides

- [Transform File Uploads](./transform-uploads.md)

We added a feature to [Transform File Uploads](./transform-uploads.md) to DoltHub. This allows you to set up an API to receive and transform files that are uploaded to your databases on DoltHub. The transformed files are sent back to DoltHub for import to a DoltHub database.