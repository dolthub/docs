---
title: "Working with JSON"
---

Document databases like [MongoDB](https://www.mongodb.com/) rose to prominence because of their ability to store data in a hierarchical format like [Javascript Object Notation, aka JSON](https://www.json.org/json-en.html). Some applications just make more sense when you persist the JSON your application is using in the database. JSON is a lot more flexible. You can change the schema without making a schema change to your database.

Relational SQL databases like MySQL responded to customer demand for storing document style data with the [JSON column type](https://dev.mysql.com/doc/refman/8.0/en/json.html) and a bunch of [associated functions for working with JSON](https://dev.mysql.com/doc/refman/5.7/en/json-function-reference.html). In theory this provided all the benefits of a relational database while adding the flexibility of document style data in columns where you wanted it.

Here at Dolt, we aspire to be 100% MySQL compatible. We also support the JSON column type and [a subset of the associated JSON functions](../reference/sql/sql-support/expressions-functions-operators.md). If you need a function we don't support yet, please [submit a GitHub issue](https://github.com/dolthub/dolt/issues). So, you can use Dolt to store and version JSON objects. This is a guide on the different ways to do that.

# Do you really want JSON?

The first thing you have to decide is whether you actually want JSON in your database. The other option is to model the data stored in your JSON relationally (ie. in multiple related tables). In your application, you disassemble the data into tables on write and reassemble the data in JSON on read. There are a bunch of applications that help with this like [GraphQL](https://graphql.org/).

This sounds like a lot of work and it is. Relationally structured data has a lot of built in type and shape constraints that often enhance data quality. This is sort of akin to the choice between strongly typed languages like Go or Java versus weakly typed languages like Python or Javascript. In weakly typed languages, you can get started very quickly because you don't have to worry about types. As the code gets big or more people are working on it, there are no types so it's easier to make mistakes. A similar trade off is made when choosing document style databases over relational databases. You get started easily but you have no schema so the document can contain anything.

Moreover, 