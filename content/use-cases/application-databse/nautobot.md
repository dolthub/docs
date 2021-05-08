---
title: Nautobot + Dolt
---

## Background
Network To Code (NTC) is a firm that provides products and services to help clients automate their network configuration management. Their most recent offering, Nautobot, is a network web application that provides tools for managing and documenting computer networks. NTC is partnering with DoltHub to allow Nautobot to be backed by Dolt.

## Motivation
The goal of using Dolt as a backend for Nautobot is to give Nautobot branch-merge features, a diff and pull request workflow for managing changes, and data history and provenance for the data stored in Nautobot. The data stored in Nautobot represents the intended state of real world computer networks. Nautobot then provides tools for automating translating that data into live network configurations. Introducing Dolt is motivated by the desire to bring the Git-like version control model Dolt implements to the data stored in Nautobot.

The application now has an underlying branch parameter which refers to a version of the configurations being managed:

![Branch list view](../.gitbook/assets/nautobot-dolt-list-branches-interface.png)


Individual branches can be viewed and diff’d:

![Branch view](../.gitbook/assets/nautobot-dolt-branch-view.png)

![Diff view](../.gitbook/assets/nautobot-dolt-diff-view.png)


## Dolt
In order to build such branching and merging functionality into an application with a database like Postgres or MySQL would require introducing data versioning to the schema of every table, and augmenting the application layer code with the ability to interact with that schema. Dolt provides first class versioning meaning that no schema changes are required. The setup looks something like this:

![Nautobot-Dolt application architecture](../.gitbook/assets/ntc-dolt-setup.png)

Of course to augment Nautobot with this functionality requires changes to the user interface that make certain calls into Dolt to trigger the creation of commits, and merges. But much of the data management complexity is pushed down into the database, accelerating the development time for getting powerful versioning features into the hands of Nautobot users.

## Conclusion
If you have an application that you think could benefit from powerful versioning functionality, please let contact us and we’d be happy to help you find a solution using Dolt.
