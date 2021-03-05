---
title: Notebooks
---

# Notebooks

Python is the language of data science. Python Notebooks in [Jupyter format](https://jupyter.org/) have become a popular tool for creating and publishing complex data analysis. Dolt can be used with Jupyter Notebooks fairly easily by accessing the Dolt command line or by using Doltpy, Dolt's python interface.

## Deepnote

[Deepnote](https://www.deepnote.com) is an online, collaborative Jupyter Notebook environment. It is best described as the [Google Docs](https://docs.google.com) or [Google Sheets](https://docs.google.com/spreadsheets) of Jupyter Notebooks.

### Setup

To use Dolt with Deepnote requires Dolt and Doltpy be installed. To get Dolt installed, you click the environemnt button on the left in Deepnote, click the Dockerfile link, and add the following text to the editable Dockerfile that appears.

```text
RUN sudo curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | sudo bash
```

Click the Build button in the top right corner. After it completes, click "Restart Machine" and Dolt will be installed on the Deepnote image you are using.

To install Doltpy, Deepnote recommends you add a [requirements.txt](https://deepnote.com/project/cacec925-c951-4d1e-bbf5-eaeaa9b1e8fc#%2Frequirements.txt) to your project root. Ours contains a single `doltpy` line, but you can add other Python packages if you need them.

That's it, you're now ready to access Dolt via you Python notebook.

### Reading data from Dolt

You now have access to the full Dolt command line and Doltpy. This should be enough to do all manner of data analysis on your own datasets or public datasets on DoltHub.

#### Cloning

Usually the first step to use Dolt is to clone a copy of your data locally. This makes queries faster and it allows you to make edits without worrying about messing up other people's copies. These edits can be merged back into the `master` branch later, just like in Git.

With Dolt and Doltpy installed, you have two options, you can clone a database using the Dolt command line or do the cloning from within Doltpy. For [this example](https://deepnote.com/project/cacec925-c951-4d1e-bbf5-eaeaa9b1e8fc#%2Fdolt-demo.ipynb), we clone using the command line and then read a table into a Pandas Dataframe using Doltpy.

![Deepnote Clone Read](https://www.dolthub.com/blog/static/c4e15893c8f797cc49920bcd6c8068cc/ccf0c/deepnote-clone-read.png)

#### SQL

With Dolt, you have a full SQL database at your fingertips. So, if you don't want to do data manipulation in Python, you can do it in SQL. [This example](https://deepnote.com/project/cacec925-c951-4d1e-bbf5-eaeaa9b1e8fc#%2Fdolt-demo.ipynb) starts a Dolt MySQL compatible server and reads the results of a query into a Pandas Dataframe.

![Deepnote Read SQL](https://www.dolthub.com/blog/static/bcf15787f952931d9bd795657509b678/ccf0c/deepnote-read-sql.png)

#### API

If you don't want to clone the data locally, [DoltHub has a versioned SQL to JSON API](https://www.dolthub.com/blog/2020-08-21-dolthub-repository-apis/) for every database. The API supports branches and releases so you can pin your notebook to a specific data version. [This example](https://deepnote.com/project/cacec925-c951-4d1e-bbf5-eaeaa9b1e8fc#%2Fdolt-demo.ipynb) reads from the tip of master but appending a `/<branch>` to the end of the API reads from the tip of that branch. [Dolt supports tags and releases](https://www.dolthub.com/blog/2020-09-14-data-releases/) so you should use those to pin to a specific commit.

![Deepnote API](https://www.dolthub.com/blog/static/aa483fc7bd85ebbed37ac30e95bd3470/ccf0c/deepnote-api.png)

### Writing data to Dolt

Dolt has the unique capability of providing safe and distributed writes. Modify the schema and the data to make your analysis easier. Writing in a Notebook is not very common because the model assumes idempotency of cells. With Dolt, you can just `dolt reset --hard` at the end of your cell to put the database back in the state you found it.

In this example, we add a column to a table and populate it for a couple rows. We then show off Dolt's diff functionality. The code and output is a little long for a screenshot so head to Deepnote and [see for yourself](https://deepnote.com/project/cacec925-c951-4d1e-bbf5-eaeaa9b1e8fc#).

