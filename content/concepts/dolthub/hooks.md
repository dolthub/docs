# Hooks

## What is a hook?

Hooks allow you to build or set up integrations that subscribe to certain events on DoltHub, such as pushing data. You give DoltHub the URL of an HTTP endpoint you've set up to accept POST requests, and then when certain events happen your endpoint will receive a payload.

## How to use hooks

Some common workflows involving hooks include:

* Triggering [continuous integration](https://en.wikipedia.org/wiki/Continuous\_integration) builds
* Updating an external issue tracker
* Creating automatic releases

## Difference between GitHub hooks and DoltHub hooks

DoltHub hooks currently only support push events on a database, while GitHub supports a much [longer list of events](https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads) on both [organizations](https://docs.github.com/en/rest/orgs/webhooks) and [repositories](https://docs.github.com/en/rest/repos#webhooks).

We are planning on implementing more event types in the near future, including `on_pull_request`, `on_branch_change`, and `on_change`. If you have an event you'd like us to support, [file an issue](https://github.com/dolthub/dolthub-issues/issues/new?assignees=tbantle22\&labels=enhancement\&template=feature\_request.md\&title=) or reach out to us on [Discord](https://discord.com/invite/RFwfYpu).

## Example

[This blog](https://www.dolthub.com/blog/2020-04-08-data-ci-with-dolthub-webhooks/) covers an in depth example for how to set up a webhook for a push event on DoltHub. You can add and manage webhooks in the settings tab of any of your DoltHub databases.

![Webhooks page](../../.gitbook/assets/dolthub-webhooks.png)
