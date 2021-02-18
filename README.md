---
title: Dolt & DoltHub Documentation
---

## Introduction
This repository contains Dolt and DoltHub documentation.

## GitBook Hosting
We use [GitBook](https://www.gitbook.com/) to publish our documentation, and delegate the subdomain `docs.dolthub.com` to `dolt.gitbook.com`. GitBook operates by syncing the contents of this repository. The GitBook/GitHub integration is documented [here](https://docs.gitbook.com/integrations/github).

Using GitBook requires us to adopt their model of content structuring in order to properly render our markdown. The restrictions are as follows:
- the root directory is set in `.gitbook.yaml`
- assets, i.e. images, need to live in `content/.gitbook/assets`
- the content structure is configured in `content/SUMMARY.md`

## Contribution Workflow
GitBook is configured to sync off of two branches, `gitbook-dev` and `gitbook-publish`. The landing page is configured to point at the `gitbook-publish` variant. Due to the way the GitBook sync works both of those branches have push restrictions on them, you cannot push to them. There is also a branch called `dev`. You should make `your-feature-branch` pull requests against `dev`, review them, and then merge them `gitbook-dev`. They will then sync to GitBook, and can be reviewed. Finally you should merge them to `gitbook-publish`.

To recap:
- make changes on `your-feature-branch`
- review and merge to `gitbook-dev`, `gitbook-dev` syncs to [Dolt Dev](https://dolt.gitbook.io/dolt-dev/)
- once you are satisfied with your changes, merge `gitbook-dev` to `gitbook-publish`, at which point your changes will sync'd to production

The following diagram illustrates the workflow:
![GitHub/GitBook Workflow](gitbook_workflow.png)

## Outstanding Items
There are few things that need doing to sync our documentation with our release automation process:
- fix some dead links from the migration
- Dolt to generate CLI docs
- Doltpy to generate API docs
