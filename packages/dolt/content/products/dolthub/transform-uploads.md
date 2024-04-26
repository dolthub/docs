---
title: "Transforming File Uploads"
---

DoltHub and DoltLab >= `v0.8.1` allow users to optionally transform files before they&apos;re imported into a database. To do this, users can provide a Transform Url at the time they&apos;re uploading a file.

If a Transform Url is provided, DoltHub/DoltLab will send an http `POST` request containing the uploaded file contents. In the http response
to this request, the service receiving the request can return new file contents that will be imported into the database in place of the original file contents.

Additionally, on the Database Settings page of DoltHub/DoltLab, users can provide Transform Url along with request headers, which, will automatically be used to transform all file uploads across a database.

Pull requests are automatically created against a database after successful file uploads and imports.

<h1 id="#receive-post-request">Receiving the POST request</h1>

The transform file server can expect a http `POST` request containing the contents of an uploaded file along with the following minimum http headers:

* `content-type`: The type of file contents.
* `content-length`: The size of the file.
* `x-dolthub-owner`: The database owner name.
* `x-dolthub-database`: The database name.
* `x-dolthub-from-branch`: The branch created to import the data.
* `x-dolthub-to-branch`: The target branch of the pull request.
* `x-import-filename`: The name of the uploaded file.
* `x-import-md5`: The md5 of the uploaded file.

If the uploaded file has a `content-type` of `text/csv`, `text/psv`, `application/json` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, the following headers may also be included on the request:

* `x-import-table`: The name of the table the import affects.
* `x-import-primary-keys`: The primary keys of the table.
* `x-import-operation`: The type of import operation to perform. Possible values are:
    * `overwrite`: Used to create or overwrite a table with contents of file.
    * `update`: Used to update a table with contents of file using table&apos;s existing schema.
    * `replace`: Used to replace a table with contents of file using table&apos;s existing schema.
* `x-import-force`: If `x-import-operation=overwrite` and data already exists in the destination table, a value of `true` here allows the target table to be overwritten.

<h1 id="#send-post-response">Sending the POST response</h1>

In the http response to this `POST`, transform file servers should provide the transformed file contents in the response body. Additionally, depending on the type of import desired, the response should include some combination of the following http headers:

* `content-type`: Required. The type of file contents to be imported into the database. Supported values are:
    * `text/csv`
    * `application/sql`
    * `application/json`
    * `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

* `content-length`: Required. The size of the file.
* `x-import-filename`: Required. The name of the file.
* `x-import-md5`: Required. The md5 of the file.
* `x-import-table`: Required if `content-type != application/sql`. The name of the table the import affects.
* `x-import-operation`: Required if `content-type != application/sql`. The type of import operation to perform. Possible values are:
    * `overwrite`: Used to create or overwrite a table with contents of file.
    * `update`: Used to update a table with contents of file using table&apos;s existing schema.
    * `replace`: Used to replace a table with contents of file using table&apos;s existing schema.
* `x-import-primary-keys`: Optional. The primary keys of the table.
* `x-import-force`: Optional. If `x-import-operation=overwrite` and data already exists in the destination table, a value of `true` here allows the target table to be overwritten.

<h1 id="#example-transform-server">Example Transform Server</h1>

We&apos;ve created a simple example golang [transform server](https://github.com/dolthub/transform-file-server) to demonstrate how you can run one yourself.

This example server receives the `POST` request and prints the request headers like so:
```bash
received request
request headers: X-Import-Filename: [states.csv]
request headers: User-Agent: [Go-http-client/1.1]
request headers: X-Dolthub-Database: [example-database]
request headers: X-Dolthub-From-Branch: [example-user/import-fashionable-wolf]
request headers: X-Dolthub-Owner: [example-user]
request headers: X-Dolthub-To-Branch: [main]
request headers: Content-Type: [text/csv]
request headers: X-Import-Md5: [UjtXMOXuBEBXKXh4tkmvhQ==]
request headers: Accept-Encoding: [gzip]
content-length: 42
status-code: 200
```

Running the example server its default mode will always respond to a transform request with static CSV content and attach the following headers to the http response:

* `content-type=text/csv`
* `x-import-md5=<static csv md5>`
* `x-import-filename=transformed.csv`
* `x-import-table=csv_table`
* `x-import-operation=overwrite`
* `x-import-primary-keys=pk,col1`

The pull request opened on DoltHub/DoltLab for this import will reflect this static CSV content, regardless of the contents of the file uploaded originally.

<h1 id="#multiple-imports-from-single-transform">Create Multiple Imports from a Single Transform Request</h1>

DoltHub and DoltLab&apos;s automated file import process will create pull requests between new branches created during the database import process and the target branch chosen during file upload.

As a result, you can create _N_ imports, and corresponding pull requests, from a single transform request by responding with SQL that creates a new branch for each import and pull request you want.

Let's look at how this works in the [example transform server](https://github.com/dolthub/transform-file-server). When this server is run with the `--sql` flag, it will always respond to transform requests with the following static sql content:

```sql
CALL DOLT_CHECKOUT('-b', 'import-branch-1');
CREATE TABLE t1 (
pk int primary key,
col1 varchar(55),
col2 varchar(55),
col3 varchar(55)
);
INSERT INTO t1 (pk, col1, col2, col3) VALUES (1, 'a', 'b', 'c');
INSERT INTO t1 (pk, col1, col2, col3) VALUES (2, 'd', 'e', 'f');
INSERT INTO t1 (pk, col1, col2, col3) VALUES (3, 'g', 'h', 'i');
CALL DOLT_COMMIT('-A', '-m', 'Create table t1');
CALL DOLT_CHECKOUT('main');
CALL DOLT_CHECKOUT('-b', 'import-branch-2');
CREATE TABLE t2 (
pk int primary key,
col1 varchar(55),
col2 varchar(55),
col3 varchar(55)    
);
INSERT INTO t2 (pk, col1, col2, col3) VALUES (1, 'j', 'k', 'l');
INSERT INTO t2 (pk, col1, col2, col3) VALUES (2, 'm', 'n', 'o');
INSERT INTO t2 (pk, col1, col2, col3) VALUES (3, 'p', 'q', 'r');
CALL DOLT_COMMIT('-A', '-m', 'Create table t2');
CALL DOLT_CHECKOUT('main');
CREATE TABLE t3 (
pk int primary key,
col1 varchar(55),
col2 varchar(55),
col3 varchar(55)    
);
INSERT INTO t3 (pk, col1, col2, col3) VALUES (1, 's', 't', 'u');
INSERT INTO t3 (pk, col1, col2, col3) VALUES (2, 'v', 'w', 'x');
INSERT INTO t3 (pk, col1, col2, col3) VALUES (3, 'y', 'z', 'aa');
```

This content will run against a checkout of the DoltHub/DoltLab database&apos;s `x-dolthub-to-branch`. For this example the `x-dolthub-to-branch=main`.

When this SQL file runs in the database, first, it will create and checkout a new branch `import-branch-1`, create table `t1`, and insert rows into that table. Then, it will add and commit those changes.

Next, it checks out the `x-dolthub-to-branch` branch again, before creating another new branch and adding a table and some rows to that branch. It also adds and commits these changes.

DoltHub and DoltLab&apos;s import process will detect these new branches and open pull request with these changes against the `x-dolthub-to-branch`.

Finally, the above content shows that the `x-dolthub-to-branch` is checked out once again and table `t3` is created directly on this branch, but these changes are not added or committed in this SQL content.

Instead, the automated import process will detect any outstanding changes made to the `x-dolthub-to-branch` during import and commit them to the `x-dolthub-from-branch`. It will also create a pull request from the `x-dolthub-from-branch` to the `x-dolthub-to-branch`.
