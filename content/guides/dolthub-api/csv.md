# CSV

DoltHub provides a CSV API for fetching table data as CSVs. You can request a CSV for an individual table or a zip of all table CSVs at a specified commit or branch.

#### Example

We will use an example DoltHub database, [dolthub/us-jails](https://www.dolthub.com/repositories/dolthub/us-jails/) and the Python `requests` library to explore it in the Python console.

**One Table**

Download the table `incidents` from `main` branch:

```python
import requests
local_file = 'incidents_main.csv'
res = requests.get('https://www.dolthub.com/csv/dolthub/us-jails/main/incidents')
with open(local_file, 'wb') as file:
  file.write(res.content)
```

Download the table `incidents` at a commit hash:

```python
import requests
local_file = 'incidents_commit.csv'
res = requests.get('https://www.dolthub.com/csv/dolthub/us-jails/u8s83gapv7ghnbmrtpm8q5es0dbl7lpd/incidents')
with open(local_file, 'wb') as file:
  file.write(res.content)
```

**All Tables**

Download a ZIP file of all database tables from the `main` branch:

```python
import requests
local_file = 'us-jails_main.zip'
res = requests.get('https://www.dolthub.com/csv/dolthub/us-jails/main')
with open(local_file, 'wb') as file:
  file.write(res.content)
```

Download a ZIP file of all database tables at a commit hash:

```python
import requests
local_file = 'us-jails_commit.zip'
res = requests.get('https://www.dolthub.com/csv/dolthub/us-jails/u8s83gapv7ghnbmrtpm8q5es0dbl7lpd')
with open(local_file, 'wb') as file:
  file.write(res.content)
```

#### Authentication

API tokens can be used to authenticate calls to the CSV API over Basic [Authentication](authentication.md). This is useful for downloading data from private databases.

You can use the token in the header when downloading CSVs from a private database.

```python
import requests
local_file = 'private_db_main.zip'
res = requests.get(
  'https://www.dolthub.com/csv/owner/private-db/main',
  headers={ "authorization": "token [TOKEN YOU COPIED]" },
)
with open(local_file, 'wb') as file:
    file.write(res.content)
```
