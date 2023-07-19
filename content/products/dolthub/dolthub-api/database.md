# Database

DoltHub provides a database API for fetching and creating data on your database. You can create a database, create a pull request, create a pull request comment, and merge a pull request through these APIs.

{% hint style="info" %}
Please make sure to send your requests to `https://www.dolthub.com` instead of `https://dolthub.com`.
{% endhint %}

## Create database

Here's an example of how to create a new database called `museum-collections` under the organization `dolthub` using an [authorization token](authentication.md).

Creating a database requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': '[api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/createDatabase.json" path="/api/v1alpha1/database" method="post" %}
[createDatabase.json](../../../.gitbook/assets/createDatabase.json)
{% endswagger %}



## Create pull request

Here is an example of opening a pull request on the `museum-collections` database with data from the Los Angeles County Museum of Art. This data was added to the `lacma` branch on a fork database, whose `owner` is `liuliu`, we would like to eventually merge `lacma` branch into the `main` branch using an [authorization token](authentication.md).

Include this `header` in your request.

```python
headers = {
    'authorization': '[api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/pullrequest.json" path="/{owner}/{database}/pulls" method="post" %}
[pullrequest.json](../../../.gitbook/assets/pullrequest.json)
{% endswagger %}



## Create a pull request comment&#x20;

Here is an example of adding a pull request comment using an [authorization token](authentication.md).

Include this `header` in your request.

```python
headers = {
    'authorization': '[api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/pullcomment.json" path="/{owner}/{database}/pulls/{pull_id}/comments" method="post" %}
[pullcomment.json](../../../.gitbook/assets/pullcomment.json)
{% endswagger %}



## Merge pull request

Here is an example of merging a pull request `#66` on a database `museum-collections` using an [authorization token](authentication.md). Note that the merge operation is asynchronous and creates an operation that can be polled to get the result.

To poll the operation and check its status, you can use the `operationName` in the returned response of the merge request to query the API. Once the operation is complete, the response will contain a `job_id` field indicating the job that's running the merge, as well as other information such as the `database_owner`, `database_name`, and `pull_id`.

Keep in mind that the time it takes for the merge operation to complete can vary depending on the size of the pull request and the complexity of the changes being merged.&#x20;

Include this `header` in your request with the API token you created.

```python
headers = {
    'authorization': '[api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/mergePull.json" path="/{owner}/{database}/pulls/{pull_id}/merge" method="post" %}
[mergePull.json](../../../.gitbook/assets/mergePull.json)
{% endswagger %}

Then use `GET` to poll the operation to check if the merge operation is done.

{% swagger src="../../../.gitbook/assets/pollMergeJob.json" path="/{owner}/{database}/pulls/{pull_id}/merge" method="get" %}
[pollMergeJob.json](../../../.gitbook/assets/pollMergeJob.json)
{% endswagger %}


## Upload a file

Here is an example of uploading a file `lacma.csv` to create a table `lacma` on a database `museum-collections` using an [authorization token](authentication.md). Note that the file import operation is asynchronous and creates an operation that can be polled to get the result. 

To poll the operation and check its status, you can use the `operationName` in the returned response of the file upload post to query the API. Once the operation is complete, the response will contain a `job_id` field indicating the job that's running the file import as well as the id of the pull request that's created when the import job is completed.

Keep in mind that the time it takes for the import operation to complete can vary depending on the size of the file and the complexity of the changes being applied to the database. The file size limit is 100 MB.

Include this `header` in your request with the API token you created.

```python
headers = {
    'authorization': '[api token you created]'
}
```

To upload the file, include two fields in the request body, `file` and `params`, the `file` should be type of `Blob`, and `params` should be a JSON object.

{% swagger src="../../../.gitbook/assets/fileUpload.json" path="/{owner}/{database}/upload" method="post" %}
[fileUpload.json](../../../.gitbook/assets/fileUpload.json)
{% endswagger %}

Then use `GET` to poll the operation to check if the import operation is done.

{% swagger src="../../../.gitbook/assets/pollImportJob.json" path="/{owner}/{database}/upload" method="get" %}
[pollImportJob.json](../../../.gitbook/assets/pollImportJob.json)
{% endswagger %}

Here is an example of uploading a CSV file to create a table through this api endpoint in Javascript, you can reference the [`dolt table import`](https://docs.dolthub.com/cli-reference/cli#dolt-table-import) documentation for additional information.:

{% hint style="info" %}
Please make sure to send your requests to `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/upload` instead of `https://www.dolthub.com/api/v1alpha1/{owner}/{database}/upload/`, do not need the last `/`.
{% endhint %}

```js
const fs = require("fs");
 
const url =
  "https://www.dolthub.com/api/v1alpha1/dolthub/museum-collections/upload";
 
  
const headers = {
  "Content-Type": "application/json",
  authorization: [api token you created],
};

const filePath = "lacma.csv";

fetchFileAndSend(filePath);

async function fetchFileAndSend(filePath) {
  const params = {
    tableName: "lacma",
    fileName: "lacma.csv",
    branchName:"main",
    fileType: "Csv",
    importOp: "Create",
    primaryKeys: ["id"],
  };

  const formData = new FormData();
  const fileData = fs.readFileSync(filePath);
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  await formData.append("file", blob, "lacma.csv");
  formData.append("params", JSON.stringify(params));

  fetch(url, {
    method: "POST",
    headers,
    body: formData,
  })
   .then((response) => {
        // process response
    })
    .catch((error) => {
      // process error
    });
}

```

And an example of polling the job status in Javascript:

```js
function pollOperation(op_name,branch_name) {
  const url = `https: //www.dolthub.com/api/v1alpha1/dolthub/museum-collections/upload?branchName=${branch_name}&operationName=${op_name}`;
  const headers = {
    "Content-Type": "application/json",
    authorization: [api token you created],
  };

  while (true) {
    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    const data = await res.json();
    if (data.job_created) {
      return data;
    } else {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

}
```

## Create a branch

Here's an example of how to create a new branch in database `museum-collections` under the organization `dolthub` using an [authorization token](authentication.md).

Creating a branch requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': '[api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/createBranch.json" path="/{owner}/{database}/branch" method="post" %}
[createBranch.json](../../../.gitbook/assets/createBranch.json)
{% endswagger %}


## Create a tag

Here's an example of how to create a new tag in database `museum-collections` under the organization `dolthub` using an [authorization token](authentication.md).

Creating a tag requires authentication, so you must include this authorization header in your request. See the [Authentication](authentication.md) section for more details.

```python
headers = {
    'authorization': '[api token you created]'
}
```

{% swagger src="../../../.gitbook/assets/createTag.json" path="/{owner}/{database}/tag" method="post" %}
[createTag.json](../../../.gitbook/assets/createTag.json)
{% endswagger %}