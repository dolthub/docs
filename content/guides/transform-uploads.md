---
title: "Transforming File Uploads"
---

DoltHub and DoltLab `v0.8.1` allow users to optionally transform files before they're imported into a database. To do this, users
can provide a Transform Url at the time they're uploading a file.

If a Transform Url is provided, DoltHub/DoltLab will send an http `POST` request containing the uploaded file contents. In the http response
to this request, the service receiving the request can return new file contents that will be imported into the database in place of the original file contents.

Transform Urls can be supplied at the time of the original file upload, along with any request headers that should be sent along with the `POST`. The `content-type` header is required.

Additionally, in the Database Settings page, users can provide a default Transform Url along with default request headers, which, if defined, will automatically be populated in the appropriate fields for all file uploads across a database.

Pull requests are automatically created against a database after a successful file upload and import.

# Transform File Server

The transform file servers can expect a http `POST` request containing the contents of an uploaded file along with the following http headers:

* `content-type`: the type of file contents.
* `content-length`: the size of the file.
* `x-dolthub-owner`: the database owner name.
* `x-dolthub-database`: the database name.
* `x-dolthub-from-branch`: the branch created to import the data.
* `x-dolthub-to-branch`: the target branch of the pull request.
* `x-import-filename`: the name of the uploaded file.
* `x-import-md5`: the md5 of the uploaded file.

In the http response to this `POST`, transform file servers should provide the transformed file contents in the response body. Additionally, depending on the type of import desired, the response should include some combination of the following http headers:

* `content-type`: Required. The type of file contents to be imported into the database. Supported values are:
    * `text/csv`
    * `application/sql`
    * `application/json`
    * `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`

* `content-length`: Required. The size of the file.
* `x-import-filename`: Required. The name of the file.
* `x-import-md5`: Required. The md5 of the file.
* `x-import-table`: Required if `content-type != application/sql`.
* `x-import-operation`: Required if `content-type != application/sql`.


