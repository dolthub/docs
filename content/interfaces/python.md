---
title: Python
---

# Python

## Doltpy Overview

Doltpy is a Python API that exposes cli Dolt features, as well as tools for common use cases of Dolt. It also facilitates interactions with DoltHub out of the box. Doltpy is open source, and distributed via `pip` on PyPi. You can install it by running `pip install doltpy`. See more detailed installation instructions [here](../getting-started/installation.md).

## `cli`

### Overview and Example

This `doltpy.cli` module contains tools for creating, cloning, and publishing Dolt datasets. We will illustrate using a CSV to create a simple database, pushing it to DoltHub, and then cloning it, making a change, and pushing the change back to the remote. Here is the data we are going to work with:

```text
$ cat ~/temp/great_players.csv
name,id
rafa,1
roger,2
novak,3
```

First, let's initialize a new database create a table with our sample data:

```python
from doltpy.cli import Dolt
from doltpy.cli.write import bulk_import

dolt = Dolt.init('~/temp/tennis-players')
write_file(dolt,
           'great_players',
           open('path/to/great_players.csv'),
           import_mode='create',
           primary_keys=['id'],
           commit=True)
dolt.remote(add=True, name='origin', url='dolthub/great-players-example')
dolt.push('origin', 'master')
```

I already created this database, you can check it out on [DoltHub](https://www.dolthub.com/repositories/dolthub/great-players-example). To clone and make changes is also straight forward, let's start with an update to our data:

```text
$ cat ~/temp/great_players.csv
name,id
rafa,1
roger,2
novak,3
andy,4
```

Now let's clone the database and import the updated data:

```python
from doltpy.cli import Dolt
from doltpy.cli.write import write_file

dolt = Dolt.clone('dolthub/great-players-example')
write_file(dolt,
           'great_players',
           open('path/to/great_players.csv'),
           import_mode'update')
dolt.push('origin', 'master')
```

If the database has already been cloned your end via the CLI you can instead do 

```python
from doltpy.cli import Dolt
from doltpy.cli.write import write_file

dolt = Dolt('dolthub/great-players-example')
write_file(dolt,
           'great_players',
           open('path/to/great_players.csv'),
           import_mode'update')
dolt.push('origin', 'master')
```

And we are done. This exact sequence of updates was executed on the example database, and you can see the [commit log](https://www.dolthub.com/repositories/dolthub/great-players-example), and [diff](https://www.dolthub.com/repositories/dolthub/great-players-example/compare/ht24tetekl12hmek03e6ldl0hbqm8l93).

### Full API

See doc strings on [GitHub](https://github.com/dolthub/doltpy/blob/master/doltpy/cli/dolt.py).

## `sql`

### Overview and Example

Doltpy comes with a SQL module for interacting with Dolt SQL Server. The centerpiece of that module is abstract class `DoltSQLContext`. It has two concrete subclasses, `DoltSQLServerContext`, and `DoltSQLEngineContext`. `DoltSQLServerContext` handles standing up the Dolt SQL Server subprocess, and shutting it down. It uses a `ServerConfig` to pass server parameters like username and password. `DoltSQLEngineContext` assumes the server is running on some host that can be specified in the past `Dolt`.

We will use the same data from the previous example, but this time in Pandas DataFrame object:

```python
import pandas as pd
data = pd.DataFrame([
  {'name': 'rafa', 'id': 1},
  {'name': 'roger', 'id': 2},
  {'name': 'novak', 'id': 3}
])
```

First, let's initialize a new database create a table with our sample data. Note that the following code will take care of inferring a schema for the table:

```python
from doltpy.cli import Dolt
from doltpy.sql import DoltSQLServerContext, ServerConfig
from doltpy.cli.write import write_pandas

dolt = Dolt.init('~/temp/tennis-players')
server_config = ServerConfig(user='root')

with DoltSQLServerContext(dolt, server_config) as dssc:
  dssc.write_pandas('great_players',
                    data,
                    create_if_not_exists=True,
                    primary_keys=['id'],
                    commit=True)

dolt.remote(add=True, name='origin', url='dolthub/great-players-example')
dolt.push('origin', 'master')
```

The context manager takes care of spinning up the SQL server, managing a connection, which is then used to write and commit data. We can then push the data to the remote database we on DoltHub.

Now let's clone the database and add a row:

```python
from doltpy.cli import Dolt
from doltpy.sql import DoltSQLServerContext, ServerConfig
from doltpy.cli.write import write_file

dolt = Dolt.clone('dolthub/great-players-example')
server_config = ServerConfig(user='root')

with DoltSQLServerContext(dolt, server_config) as dssc:
  dssc.write_pandas('great_players',
                    pd.DataFrame([{'name': 'andy', 'id': 4}]),
                    commit=True)

dolt.push('origin', 'master')
```

And we are done. We showed how to use `doltpy.sql` to create a Dolt database from a Pandas DataFrame, push it to DoltHub, clone it elsewhere and make modifications via SQL, and the commit and push the result back.

### Full API

See doc strings on [GitHub](https://github.com/dolthub/doltpy/blob/master/doltpy/sql/sql.py).

## `etl`

### Overview and Example

The `doltpy.etl` module contains tooling for ETL workflows that write or transform data in Dolt. We will show a simple example of pulling from a free API for FX rates, and then transforming the data into moving averages. This code is taken almost verbatim from an ETL job that actually writes to [this database](https://www.dolthub.com/repositories/oscarbatori/fx-test-data).

First we setup some get that gets the data, returning a `pandas.DataFrame` with the JSON flattened into a table structure:

```python
import pandas as pd
import requests

def get_data() -> pd.DataFrame:
    r = requests.get(URL)
    if r.status_code == 200:
        data = r.json()
        exchange_rates = data['rates']
        return pd.DataFrame([{'currency': currency, 'rate': rate, 'timestamp': data['timestamp']}
                             for currency, rate in exchange_rates.items()])
    else:
        raise ValueError('Bad request, return code {}'.format(r.status_code))
```

Next we define code to write this to a table. `doltpy.etl` provides code to do this:

```python
from doltpy.etl import get_df_table_writer

raw_data_writer = get_df_table_writer('eur_fx_rates', get_data, ['currency', 'timestamp'])
```

Note that we pass our `get_data` function to `get_df_table_writer` which itself returns a function. The motivation for this is creating ETL workflows one often wants to import code before it's executed, thus we build a function that will perform the load, but delay executing it. If we wanted to execute it immediately we could just do:

```python
from dolt.cli import Dolt

dolt = Dolt('path/to/my/db')
raw_data_writer(dolt)
```

Often we want to define a loader for a number of tables in a database. The loader abstraction takes a collection of `DoltTableWriter` functions and executes them sequentially. Define one as follows:

```python
from doltpy.etl import get_dolt_loader
from datetime import datetime

loader = get_dolt_loader([raw_data_writer],
                         commit=True,
                         message='Updated raw FX rates for date {}'.format(datetime.now()),
                         branch='master')
```

Notice that we passed a collection containing the table writer we just defined. We also define database level considerations \(which branch to write to, whether to commit, and commit message\). All table writers executed by this loader will have their results attached to the commit this code generates. You can execute collections of loaders in the event you want to generate more than a single commit. For example, suppose we want to compute moving averages on our complete FX dataset, including the most recent load. In that case we need to read the whole table after the load:

```python
from doltpy.etl import get_table_transfomer
from doltpy.cli.read import read_pandas

def get_raw_fx_rates(dolt: Dolt):
    return read_pandas(dolt, 'eur_fx_rates')

def get_average_rates(df: pd.DataFrame) -> pd.DataFrame:
    logger.info('Computing moving averages of currency rates')
    return df.groupby('currency').mean().reset_index()[['currency', 'rate']].rename(columns={'rate': 'average_rate'})

transformed_table_writer = get_table_transfomer(get_raw_fx_rates, 'eur_fx_rate_averages', ['currency'], get_average_rates)]
```

Here we defined our `get_data` function to read from the table `raw_data_writer` is configured to write to. To ensure that `raw_data_writer` executes first, we can define our loaders as follows:

```python
from doltpy.etl import get_dolt_loader
from datetime import datetime

loaders = [get_dolt_loader([raw_data_writer],
                           commit=True,
                           message='Updated raw FX rates for date {}'.format(datetime.now()),
                           branch='master'),
           get_dolt_loader([transformed_table_writer],
                           commit=True,
                           message='Updated FX averages for date {}'.format(datetime.now()),
                           branch='master')]
```

This will generate two commits, each showing the precise update.

### Full API

See doc strings on [GitHub](https://github.com/dolthub/doltpy/blob/master/doltpy/etl/loaders.py).

## SQL Sync

We provide a library for syncing between Dolt and existing relational database implementations. Usage is covered in an extensive example in the [guides section](../guides/sql-sync.md).
