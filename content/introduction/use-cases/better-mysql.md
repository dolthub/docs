---
title: Better MySQL
---

# Better MySQL

Do you have a database problem in production? Do you feel comfortable logging in with privileges to the production host? What if you need to make a change, like add an index? How can you be sure you're not going to break anything?

The above problem is not the least bit harrowing using Dolt. Share your production database with your laptop. Clone a copy of the production database and debug outside of production. Run pull to get the latest production data. Need to add an index as a fix or even change a problematic value? Make the change on your laptop, get it reviewed in a PR, and merge it up into production. No downtime. No risk of connecting to a production system and making writes.

Dolt allows you to have all the benefits of the software development workflows you've used for the past 10 years in your database.

The trend towards continuous deployment in software unlocked orders of magnitude productivity improvements in many software development environments. Commit your code and have it tested and deployed all the way to production, failing if it causes issues. This set up moves software failure closer to the time the code was written, making debugging much quicker. Continuous deployment was so revolutionary that most modern software development teams adopt it from inception now.

Dolt allows you to bring continuous deployment to your database development. Commit your schema and data and have it tested and deployed all the way to production, failing if it causes issues. Achieve the same order of magnitude productivity improvements in database development you achieved with software. Share the database on your laptop with production.

Dolt is a better MySQL or Postgres. You can use modern software development practices for your database.