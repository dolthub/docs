---
title: "Working with JSON"
---

Document databases like [MongoDB](https://www.mongodb.com/) rose to prominence because of their ability to store data in a hierarchical format like [Javascript Object Notation, aka JSON](https://www.json.org/json-en.html). Some applications just make more sense when you persist the JSON your application is using in the database. JSON is a lot more flexible. You can change the schema without making a schema change to your database.

Relational SQL databases like MySQL responded to customer demand for storing document style data with the [JSON column type](https://dev.mysql.com/doc/refman/8.0/en/json.html) and a bunch of [associated functions for working with JSON](https://dev.mysql.com/doc/refman/5.7/en/json-function-reference.html). In theory this provided all the benefits of a relational database while adding the flexibility of document style data in columns where you wanted it.

Here at Dolt, we aspire to be 100% MySQL compatible. We also support the JSON column type and [a subset of the associated JSON functions](../reference/sql/sql-support/expressions-functions-operators.md). If you need a function we don't support yet, please [submit a GitHub issue](https://github.com/dolthub/dolt/issues). So, you can use Dolt to store and version JSON objects. This is a guide on the different ways to do that.

# Do you really want JSON?

The first thing you have to decide is whether you actually want JSON in your database. The other option is to model the data stored in your JSON relationally (ie. in multiple related tables). In your application, you disassemble the data into tables on write and reassemble the data in JSON on read. There are a bunch of applications that help with this like [GraphQL](https://graphql.org/).

This sounds like a lot of work and it is. Relationally structured data has a lot of built in type and shape constraints that often enhance data quality. This is sort of akin to the choice between strongly typed languages like Go or Java versus weakly typed languages like Python or Javascript. In weakly typed languages, you can get started very quickly because you don't have to worry about types. As the code gets big or more people are working on it, there are no types so it's easier to make mistakes. A similar trade off is made when choosing document style databases over relational databases. You get started easily but you have no schema so the document can contain anything.

Moreover, in Dolt, the versioning primitive is tables. Currently, if you have a 1,000 value JSON object and you change one value, the diff in Dolt will be the entire 1,000 value object not the single value. In storage, we do a little better than this. We chunk the JSON object up so each version on disk may share some chunks. Obviously, if there is demand for better JSON diff capabilities, we can build them but currently Dolt handles relational data better.

# I really want JSON!

OK. We'll stop trying to talk you out of it. 

The way to add JSON to your Dolt database is to make a table containing a column with type `JSON`. Once the table is created you add JSON data using `INSERT` queries, modify JSON data using `UPDATE` queries, and delete JSON data using `DELETE` queries. 

If you want to do anything more complicated with your JSON objects, you [use a built in function](https://dev.mysql.com/doc/refman/5.7/en/json-function-reference.html). For instance you can query a specific field using `JSON_EXTRACT`.

Note, in this model, you can mix relational data with JSON data. You can kind of have the best of both worlds, descriptive data in columns and complicated hierarchical data in a JSON column. 

# Just show me.

I'm going to use the command line for the example but all the SQL statements work in the [SQL server context](../introduction/getting-started/database.md) as well. 

1. Create a dolt database and a table with a JSON type column

```
dolt $ mkdir json-example
dolt $ cd json-example/
json-example $ dolt init
Successfully initialized dolt data repository.
json-example $ dolt sql -q "create table json_example (id int, myjson json, primary key(id))"
```

2. Examine the table schema to make sure you did it right 
```
json-example $ dolt sql -q "show tables"
+------------------------+
| Tables_in_json_example |
+------------------------+
| json_example           |
+------------------------+
json-example $ dolt sql -q "describe json_example"
+--------+------+------+-----+---------+-------+
| Field  | Type | Null | Key | Default | Extra |
+--------+------+------+-----+---------+-------+
| id     | int  | NO   | PRI | NULL    |       |
| myjson | json | YES  |     | NULL    |       |
+--------+------+------+-----+---------+-------+
```

3. Create a dolt commit so you can always go back to a blank table

```
json-example $ dolt commit -am "Created json example table"
commit q04jbofalc3f4tkf5dnejrt4fe17f9f4 (HEAD -> main) 
Author: Tim Sehn <tim@dolthub.com>
Date:  Wed Jun 29 09:26:03 -0700 2022

        Created json example table

```

4. Insert and read back some json

```
json-example $ dolt sql -q "insert into json_example values (0, '{\"this\": \"is\", \"json\": \"things\"}')";
Query OK, 1 row affected
json-example $ dolt sql -q "select * from json_example"
+----+----------------------------------+
| id | myjson                           |
+----+----------------------------------+
| 0  | {"json": "things", "this": "is"} |
+----+----------------------------------+
```

NOTE: I needed to escape the double quotes to make it work in bash 

5. use JSON_EXTRACT to read individual values

```
json-example $ dolt sql -q "select JSON_EXTRACT(myjson, '$.this') from json_example"
+--------------------------------+
| JSON_EXTRACT(myjson, '$.this') |
+--------------------------------+
| "is"                           |
+--------------------------------+
```

6. Make another commit so you can return here

```
json-example $ dolt commit -am "Inserted some json"
commit v6qoj114shnh4fbrlh1id14s69m4ihmr (HEAD -> main) 
Author: Tim Sehn <tim@dolthub.com>
Date:  Wed Jun 29 09:35:46 -0700 2022

        Inserted some json

```

7. Update the value

```
json-example $ dolt sql -q "update  json_example set myjson='{\"this\": \"is\", \"json\": \"things\", \"different\":\"see\"}' where id=0";
Query OK, 1 row affected
Rows matched: 1  Changed: 1  Warnings: 0
```

8. See the diff

```
json-example $ dolt diff
diff --dolt a/json_example b/json_example
--- a/json_example @ shon7m83dohveufikt366p7krpmpn7tg
+++ b/json_example @ 6d8tpimciahmfhhv7t9iokg6169fvh2v
+-----+----+------------------------------------------------------+
|     | id | myjson                                               |
+-----+----+------------------------------------------------------+
|  <  | 0  | {"json": "things", "this": "is"}                     |
|  >  | 0  | {"different": "see", "json": "things", "this": "is"} |
+-----+----+------------------------------------------------------+
```