---
title: Why DoltHub?
---

# Why DoltHub?

DoltHub is a web-based interface to share, discover, and collaborate on [Dolt](./dolt.md) databases. Similar to GitHub, DoltHub let's multiple users easily collaborate on the same database at the same time. It lowers the barrier to entry for users who may want version control for their data without knowing SQL or Git or being comfortable using the command line.

Emailing around CSVs is a way of the past. Have you ever tried to have more than one person collaborate on a CSV at the same time and ended up with multiple versions of the same file without knowing which one has the most up-to-date information? DoltHub solves this problem.

On DoltHub, there is one source of truth. You can clone a database with one command, make some changes, and submit a [pull request](./dolthub/prs.md) to incorporate the change into the main branch. Sharing is made easy and you no longer need to worry about which version is the right version.

Collaboration on DoltHub is seamless. Following the GitHub model of collaboration, anyone can have a copy of a database, whether using a [fork](./dolthub/forks.md) or [branch](./dolt/git/branch.md), and propose changes using their copy through pull requests. Database maintainers can view the [diff](./dolt/git/diff.md) of changes and there is a built in forum for feedback.

Want to make a change to a database and are new to SQL? No problem. DoltHub has table buttons that let you sort columns, filter by a value, delete and hide columns and rows, and update cell values. Not only do you not need to know SQL to use this functionality, but these buttons generate the corresponding SQL query so you can learn SQL as you're clicking around. DoltHub also has file upload and spreadsheet editor features that let you get data onto DoltHub easily without using the command line tool.

DoltHub adds an extra layer of transparency to data. Every change in every cell has a commit and author attached to it. With the click of a button you can see how a cell has changed over time. Find a bug in your data? Trace it back to a person and time and easily revert the commit. No more guessing where data came from.

DoltHub is unbreakable. Easily create a branch or fork of a database and do all the experimenting you want. Any change can be undone, making it safer to let less-savvy friends or coworkers have access to your database.

DoltHub wants to change the way data is shared and collaborated on, similar to how GitHub changed how people and companies managed source code. Check out our [discover page](https://www.dolthub.com/discover) to choose an interesting database and see for yourself!

# Why DoltLab?

DoltLab is the self-hosted version of DoltHub that allows you to run your own DoltHub on-prem. If you're interested in using Dolt in production at your company, but can't push data to DoltHub, DoltLab is the product you're looking for. DoltLab provides the same web-based UI as DoltHub, backed entirely by local disk, so your data never leaves your control!

Released as a simple zip file, DoltLab is a suite of publically available container images that run using Docker Compose on a single Linux host. This host can be a local desktop, or a cloud server, but by no means are any cloud resources required to start running DoltLab today.
