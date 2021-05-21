---
title: Stability
---

Dolt is pre-1.0. We expect to release 1.0 version by mid 2021. The 1.0 release signals a commitment to no backwards incompatible changes to the format. That means that versions of Dolt subsequent to the 1.0 release will always be able to read Dolt data written as of 1.0 or later. We are obviously less stable than database solutions like MySQL and Postgres currently. Those solutions have been in market for over twenty five years. We think we can get to that degree of stability by the end of 2021.

In practice Dolt's SQL implementation is relatively full featured, and we are constantly improving on it. All breaking changes, even prior to 1.0, come with robust migration mechanisms, so no data will ever be lost in practice.
