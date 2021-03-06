---
title: Turbine + Dolt
---

## Turbine
Turbine is a startup using computer simulations as a tool for drug discovery, as well as pinpoint which kinds of cells would be most sensitive to these discoveries. They want to bring more drugs to market faster, and get more use out of those drugs.

Turbine’s technology revolves around the Simulated Cell, a continuously evolving computer simulation of human cancer cells. Tens of billions of such simulations are run at each screening in fleets of cloud GPUs, trying to find new drug targets in the newest release of the cell model.

## The Problem

A Simulated Cell is assembled from lot of different types of data, including, but not limited to:
- protein-protein interactions
- drug sensitivity
- genomics

As these data are updated, those changes need to be incorporated into the Simulated Cell. Naturally changes need to be tested first. On top of evolving underlying cell model, there is enrichment extracted from evolving literature. This data is provided by contract biologists, who need to input and test their changes to the Simulated Cell model. Again, this enrichment needs to be tested before it is incorporated into the model.

Finally, a drug discovery project can last for many months during which time the Simulated Cell will have evolved. This however makes experiments hard, as changes to the drug need to be compared "apples to apples", and so historical versions of the Simulated Cell need to be available to researchers.

## Discovering Dolt
The Turbine team had initially implemented something in Mongo DB. Mongo DB has the advantage of accommodating arbitrary JSON, and it's not too hard to version those objects. However, as the model grew and the structure become clearer the Mongo based solution become intractable. Some core issues were lack of robust typing and performance on foreign keys based queries.

At the same time the workflow around updating the Simulated Cell, soliciting enrichment from researchers, and testing experiment against "versions" of the core model was eerily reminiscent of a Git-like workflow. A quick Google search led to the the following Slack conversation:

![The Moment Dolt was shared](../../.gitbook/assets/dolt-turbine-finds-dolt.png)

This happened 31st of March, 2020. The team immediately took Dolt for a spin, but unfortunately they hit a snag:
```
kris@lightspeed test]$ dolt commit
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x28 pc=0x12c11e7]
goroutine 1 [running]:
github.com/liquidata-inc/dolt/go/libraries/doltcore/diff.(*DocDiffs).Len(...)
       /Users/oscarbatori/Documents/dolt/go/libraries/doltcore/diff/diffs.go:204
github.com/liquidata-inc/dolt/go/cmd/dolt/commands.printStagedDiffs(0x1a0fe40, 0xc000413920, 0x0, 0x0, 0x1, 0x1a101e0)
       /Users/oscarbatori/Documents/dolt/go/cmd/dolt/commands/status.go:156 +0x37
github.com/liquidata-inc/dolt/go/cmd/dolt/commands.buildInitalCommitMsg(0x1a3ba20, 0xc0000ae000, 0xc00028f340, 0xf8e5d6, 0xc0000c20c0)
       /Users/oscarbatori/Documents/dolt/go/cmd/dolt/commands/commit.go:212 +0x1a5
```

At the time DoltHub had not "Contact Us" form, though you can now [Contact Us](https://www.dolthub.com/contact). Thankfully Kristof did some digging and found an email address. It turned out to be a relatively superficial bug, and after several meetings DoltHub and Turbine agreed to a partnership to leverage Dolt as the underlying database for Turbine's simulated drug discovery platform.

## Support Model
Turbine were DoltHub's first customer. They took the plunge that is the lifeblood of new startups and technology. Naturally that meant there were some rough edges with Dolt, particularly performance. In order to ensure that Turbine were not blocked in their development we created a shared Discord channel where the Turbine team could get more or less real time support as they migrated their data to Dolt.

## Conclusion
We are delighted to support Turbine's use-case, and call them a customer. Not only are they doing important work with an enormous potential positive impact, but they chose to partner with us when many companies would have shied away.
