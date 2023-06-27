---
title: Dolt Documentation
---

## Introduction

This repository contains Dolt and DoltHub documentation. Check out our [website](https://www.dolthub.com), [team](https://www.dolthub.com/team), and [documentation](https://docs.dolthub.com/introduction/what-is-dolt) to learn more about Dolt.

## GitBook Hosting

We use [GitBook](https://www.gitbook.com/) to publish our documentation, and delegate the subdomain `docs.dolthub.com` to `dolt.gitbook.io`. GitBook operates by syncing the contents of this repository. The GitBook/GitHub integration is documented [here](https://docs.gitbook.com).

Using GitBook requires us to adopt their model of content structuring in order to properly render our markdown. The restrictions are as follows:

- the root directory is set in `.gitbook.yaml`
- assets, i.e. images, need to live in `content/.gitbook/assets`
- the content structure is configured in `content/SUMMARY.md`

## Contribution Workflow

We have two GitBook "spaces", one for development and review, and one for production:

- "Dolt", which [docs.dolthub.com](https://docs.dolthub.com/) links to, and syncs off of `gitbook-publish`
- "Dolt Dev", which is [dolt.gitbook.io/dolt-dev](https://dolt.gitbook.io/dolt-dev/), and syncs off of `gitbook-dev`

To make a contribution create a feature branch, either in a fork or in this repository, and then make a PR against `gitbook-dev`. This can be reviewed and merged, which will result in it being deployed to "Dolt Dev" space. Once it has been reviewed in GitBook we can merge `gitbook-dev` to `gitbook-publish`, and it will land in production.

To add a new page to the docs, make sure you update [SUMMARY.md](https://github.com/dolthub/docs/blob/gitbook-publish/content/SUMMARY.md)

To update Dolt CLI reference docs, make updates to the Dolt command code in the `dolt` repo, then run `dolt dump-docs` to regenerate the CLI markdown file and copy it to `content/reference/cli.md`.

To recap:

- make changes on `your-feature-branch`
- if adding a new page, update [SUMMARY.md](https://github.com/dolthub/docs/blob/gitbook-publish/content/SUMMARY.md)
- review and merge to `gitbook-dev`, `gitbook-dev` syncs to [Dolt Dev](https://dolt.gitbook.io/dolt-dev/)
- once you are satisfied with your changes, merge `gitbook-dev` to `gitbook-publish`, at which point your changes will sync'd to production

The following diagram illustrates the workflow:
![GitHub/GitBook Workflow](gitbook_workflow.png)

## Check Dead Links

This [tool](https://www.deadlinkchecker.com/) is free and works quite well if you just pass the dev URL, `https://dolt.gitbook.io/dolt-dev/`, into it.

## Styling Tips
You can create a styled info box for a note callout by including the following:
```
{% hint style="info" %}
### Note
My styled note! 
{% endhint %}
```

## Embed DoltHub SQL Console
You can embed DoltHub SQL console by including the following:
```
{% embed url="https://www.dolthub.com/repositories/[owner]/[database]/embed/[refName]?q={query}" %}
```

Some system tables are not supported on DoltHub, for example, `dolt_conflicts`, running `select * from dolt_conflicts` will return query error: `dhdolt: ReadOnlyChunkStore: Unimplemented.`
Make sure the query works on DoltHub before adding the console.

To avoid timeout, use a small-size database. sometimes queries with `ORDER BY` will time out. After removing `ORDER BY`, it will return much faster.
