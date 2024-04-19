# Authentication

API tokens can be used to authenticate calls to the SQL API over Basic Authentication. This is useful for executing SQL queries against private databases or executing write queries.

First, create an API token in your [settings](https://www.dolthub.com/settings/tokens) on DoltHub. Copy the token right away, as you won't be able to see it again.

Now you can use this token in the header when executing a query against a private database.

```python
owner, repo, branch = "dolthub", "private-db", "main"
query = """SELECT * FROM testtable"""
res = requests.get(
    "https://www.dolthub.com/api/v1alpha1/{}/{}/{}".format(owner, repo, branch),
    params={"q": query},
    headers={ "authorization": "token [TOKEN YOU COPIED]" },
)
res.json()
```

Please note: You must include a ref name (branch, tag, commit hash, etc) when making authenticated calls to the SQL API using a token. Unauthenticated API requests do not require this. They use the default branch (`main` or `master`).