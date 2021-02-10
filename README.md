---
title: Dolt & DoltHub Documentation
---

# Introduction
This repository contains Dolt and DoltHub documentation.

# GitBook Hosting
We use [GitBook](https://www.gitbook.com/) to publish our documentation, and delegate the subdomain `docs.dolthub.com` to `dolt.gitbook.com`. GitBook operates by syncing the contents of this repository. The GitBook/GitHub integration is documented [here](https://docs.gitbook.com/integrations/github).

# Contribution Workflow
GitBook is configured to sync off of two branches, `dev` and `publish`. The landing page is configured to point at the `publish` variant. Contributors should fork the repository, and create a pull request against `dev`.

# Outstanding Items
There are few things that need doing to sync our documentation with our release automation process:
- Dolt to generate CLI docs
- Doltpy to generate API docs
