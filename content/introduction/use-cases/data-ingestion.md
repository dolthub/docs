---
title: Data Ingestion
---

# Data Ingestion

Are customers or vendors sharing data with you? When new data is shared, do downstream systems break? In my career, receiving shared data from outside my organization has often caused problems.

Dolt allows you to assert greater control over the shared data you are ingesting into your team. If you ingest bad data, roll back to the previous version. Look at the problematic diff and often the problem and solution will be obvious. Were you only expecting new data from the past day but the vendor updated last month's data as well? You can even automate these tests with tools [like Great Expectations](https://greatexpectations.io/) which [integrates well with Dolt](https://www.dolthub.com/blog/2021-06-15-great-expectations-plus-dolt/).

Dolt is the database for data ingestion.