---
Title: Why Enterprise?
---

The free version of DoltLab is designed to work for a small team of people. It runs on a single host. Teams and organizations ~~are~~ will eventually be disabled. There is no built-in user management. Users sign up with email only and manage their own accounts. 

DoltLab Enterprise is for companies. If your company is large enough to need Enterprise security, scalability, or support, the three S's, DoltHub Enterprise is for you.

## Security

A larger scale deployment at a company will eventually need DoltLab Enterprise for security. DoltLab is likely being deployed on-premises in the first place because your company is worried about sensitive data leaving its network. DoltLab Enterprise enhances your security posture further. 

Your security team will likely ask for Single Sign On and custom look and feel features when they review your DoltLab deployment.

Single Sign On is often a security requirement in large organizations. Single Sign is integration with the company's identity provider. Single Sign On maintains security when users join and leave an organization. Identity is managed in one place. You don't have to remember to delete the user from DoltLab when the user leaves the company. Moreover, users don't get used to entering their passwords in multiple tools, decreasing the likelihood of a phishing attack succeeding.

Custom look and feel via a custom logo and custom email templates visually signals to users they are on the company's DoltLab deployment, not a spoofed copy, another useful security feature. This again decreases the likelihood of a phishing or spoofing attack succeeding.

## Scalability

The free version of DoltLab runs on a single host. DoltLab is a fairly complicated piece of software. Seven individual services are deployed in a single DoltLab install. DoltHub runs the same services and we run them all on separate infrastructure for scalability. DoltLab Enterprise allows you to do the same with your company's DoltLab. Need more throughput through the API? No problem. Put it on it's own host. Need even more throughput? Put it behind a load balancer and have multiple hosts serving it.

Of particular interest is storage. DoltLab stores a copy of every database that is pushed to it. It is not uncommon for a Dolt database to be hundreds of Gigabytes. In the free version of DoltLab, the hard drive of the DoltLab host needs to be big enough to store all the databases. With DoltLab Enterprise, you can use cloud storage like S3 or GCS to back your deployment.

## Support

Lastly, DoltLab Enterprise comes with DoltHub's Enterprise Support built into the cost. Customers get a private Discord channel where  Dolt engineers provide direct 24/7 customer support. Customers also get input into the DoltLab and Dolt roadmap. Feature requests will be prioritized. 

An Enterprise Support customer raves:

> Dolt engineers are the most responsive we've encountered. Most bugs we find are fixed in 24 hours or less. We aspire to provide the same level of support here at our company.