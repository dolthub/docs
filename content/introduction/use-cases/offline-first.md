---
title: Offline First
---

# Problem

* Are you expecting your application to make writes locally while offline?
* Do these writes need to be synced to a central server or other nodes?
* How are you going to detect conflicting writes?
* What are you going to do if you detect them?
* Would the Git model of clone, push, and pull on your data help?

# Dolt solves this by…

Dolt brings Git-style decentralization to the SQL database. Just like Git is ideal in no connectivity environments when dealing with files, Dolt is ideal in low connectivity environments when dealing with tables. Most large scale data is stored in tables.

With Dolt you write to the database disconnected. You can have a fully functioning offline application that uses the exact same software and models it would use if it were a standard centralized SQL database.

When it is safe to connect to the internet, Dolt computes the difference between what you have and what a peer database has and only sends these differences both ways. This synchronization process is very efficient, effectively allowing you to get the most information possible in and out in the shortest amount of time. Once the synchronization is complete, go back to disconnected. You and the peer now share a synchronized view with complete, auditable edit history.

Conflicting writes are surfaced quickly and an operator or software can take additional action to resolve.

You get all this with the familiar capabilities and performance of a SQL database.

# Companies Doing This

Be the first

# Case Studies

Let us know if you would like us to feature your use of Dolt for data sharing here.

# Other Related Articles

[So you want a Decentralized database?](https://www.dolthub.com/blog/2022-05-27-decentralized-database/)
[Dolt for Military Applications](https://www.dolthub.com/blog/2022-03-07-dolt-military/)