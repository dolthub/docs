---
title: Get A Ubuntu Host on GCP
---

We need a properly configured Ubuntu host to run DoltLab on. This will take a few steps. Start by going to [Google Cloud Platform console](https://console.cloud.google.com/).

## Create a GCP Project

Let's create a new project for our DoltLab. Click Create Project and you'll be greeted by this screen.

![Create Project](../../.gitbook/assets/doltlab-gcp-create-project.png)

This takes a couple seconds and then you need to switch to the project.

![New Project](../../.gitbook/assets/doltlab-gcp-new-project.png)

Google really wants me to use Gemini. I can't get rid of that pop up.

## Procure a New Compute Engine Instance

Now, we need a compute engine instance. Click Compute Engine and the click Enable. Compute Engine does not seem to be on by default for new projects. This takes a couple minutes but once enabled you'll be greeted with this screen.

![Compute Engine](../../.gitbook/assets/doltlab-gcp-compute-engine.png)

Click Create Instance.

![Create Instance](../../.gitbook/assets/doltlab-gcp-create-instance.png)

Call it something cool. I called mine `doltlab-getting-started`.

Now, you need to hit the DoltLab minimum hardware requirements; 4CPUs, 16GB of RAM, and 300GB of disk. For this, I select the E2 family of instance (because it's the default) and then in the "Machine Type" drop down I switch to "Standard" and select the "4CPU, 16GB RAM" option.

![Machine Configuration](../../.gitbook/assets/doltlab-gcp-machine-configuration.png)

Now, it's time to change the Operating System and the disk size under the Boot Disk section. 

![Default Boot Disk](../../.gitbook/assets/doltlab-gcp-default-boot-disk.png)

It looks like GCP defaults to Debian with 10GB of disk. We need Ubuntu with 300GB of disk.

![Proper Boot Disk](../../.gitbook/assets/doltlab-gcp-proper-boot-disk.png)

Much better. Either Debian 22.04 or 24.04 will work with DoltLab.

Finally, on this page, we'll enable HTTP traffic under the Firewall section. We'll need a few more ports open but we do that after the instance is created.

![Proper Boot Disk](../../.gitbook/assets/doltlab-gcp-enable-http.png)

Let's fire this baby up by clicking "CREATE". After a couple minutes I have a running instance.

![Running Instance](../../.gitbook/assets/doltlab-gcp-running-instance.png)

Make note of your public IP. You'll need this to install DoltLab on the host. Ours is 34.171.211.99.

## Open the Required Ports

We need to open a few more ports for DoltLab to operate correctly. Click "Set Up Firewall Rules" and the "Create new Firewall Rule".

![New Firewall Rule](../../.gitbook/assets/doltlab-gcp-firewall-rule.png)

In "Actions on Match", select "All instances in Network" and enter a Source IPv4 range as `0.0.0.0/0` or the entire range. We want the whole internet to see this wonderful DoltLab we're creating.

![Actions on Match](../../.gitbook/assets/doltlab-gcp-actions-on-match.png)

Scroll down to Protocols and Ports, enable TCP on port 100.

![Protocols and Ports](../../.gitbook/assets/doltlab-gcp-protocols-and-ports.png)

Click "CREATE".

Rinse and repeat for ports 4321 and 50051. After your done, you're firewall rules should look like this.

![Proper Firewall Rules](../../.gitbook/assets/doltlab-gcp-proper-firewall-rules.png)

## SSH to the host

GCP has a cool SSH in browser that I'll use.

![SSH Button](../../.gitbook/assets/doltlab-gcp-ssh-button.png)

This opens a new browser window for you to SSH with. Click authorize and you should be greeted with an in browser terminal window connected to your new instance.

![SSH Window](../../.gitbook/assets/doltlab-gcp-ssh-window.png)

Pretty slick Google. Pretty slick.

Now that you have a DoltLab ready host, [continue the Getting Started guide](./getting-started.md#download-doltlab-and-its-dependencies)