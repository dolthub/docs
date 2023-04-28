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

{% swagger src="../../.gitbook/assets/createDatabase.json" path="/api/v1alpha1/database" method="post" %}
[createDatabase.json](../../.gitbook/assets/createDatabase.json)
{% endswagger %}



## Creates pull request

Here is an example of opening a pull request on the `museum-collections` database with data from the Los Angeles County Museum of Art. This data was added to the `lacma` branch on a fork database, whose `owner` is `liuliu`, we would like to eventually merge `lacma` branch into the `main` branch using an [authorization token](authentication.md).

Include this `header` in your request.

```python
headers = {
    'authorization': '[api token you created]'
}
```

{% swagger src="../../.gitbook/assets/pullrequest.json" path="/{owner}/{repo}/pulls" method="post" %}
[pullrequest.json](../../.gitbook/assets/pullrequest.json)
{% endswagger %}



## Create a pull request comment&#x20;

Here is an example of adding a pull request comment using an [authorization token](authentication.md).

Include this `header` in your request.

```python
headers = {
    'authorization': '[api token you created]'
}
```

{% swagger src="../../.gitbook/assets/pullcomment.json" path="/{owner}/{repo}/pulls/{pull_id}/comments" method="post" %}
[pullcomment.json](../../.gitbook/assets/pullcomment.json)
{% endswagger %}



## Merge pull request

Here is an example of merging a pull request `#66` on a database `museum-collections` using an [authorization token](authentication.md). Note that the merge operation is asynchronous and creates an operation that can be polled to get the result.

To poll the operation and check its status, you can use the `operationName` in the returned response of the merge request to query the API. Once the operation is complete, the response will contain a `job_id` field indicating the job that's running the merge, as well as other information such as the `repository_owner`, `repository_name`, and `pull_id`.

Keep in mind that the time it takes for the merge operation to complete can vary depending on the size of the pull request and the complexity of the changes being merged.&#x20;

Include this `header` in your request with the API token you created.

```python
headers = {
    'authorization': '[api token you created]'
}
```

{% swagger src="../../.gitbook/assets/mergePull.json" path="/{owner}/{repo}/pulls/{pull_id}/merge" method="post" %}
[mergePull.json](../../.gitbook/assets/mergePull.json)
{% endswagger %}

Then use `GET` to poll the operation to check if the merge operation is done.

{% swagger src="../../.gitbook/assets/pollMergeJob.json" path="/{owner}/{repo}/pulls/{pull_id}/merge" method="get" %}
[pollMergeJob.json](../../.gitbook/assets/pollMergeJob.json)
{% endswagger %}