# London API
London API and TF Deployment

### Scaling
* Work with the service provider to check if they could add a new enpoint to allow the radius filtering at there end to significantly reduce the size of the requests.
* Consider Lambda first as it would fit nicely with our very simple service but a more realistic service may not fit as well.
* Use CDN, the caching would be a low hanging fruit option for improved throughput.
* Use Load Balancer and Auto Scaling Group to automatically allow more servers to spin up to handle increased load.
* Containerise and utilise Elastic Container Registry and Elastic Container Service or Elastic Kubernetes Service.

### Protect
* Ensure security scanning software eg. Checkmarx has been ran against the service.
* Ensure Content Security Policies has been set correctly and use a library like helmet to help with that.
* Potentially pentest or run a bug bounty.
* Implement authentication for the service using possibly JWT.
* Use CDN, Akamai or Cloudflare provide Distributed Denial of Service protection.
* Use a Web Application Firewall to insulate the service from direct communication and limit attack surface area.
* Use an API Gateway to further insulate the service, a good Defence in Depth practise but possibly wasteful for only 1 service.

### Improve Availability
* Use CDN, the caching would also reduce load on potentially overwhelmed servers.
* Use Load Balancer and Auto Scaling Group to maintain at least 2 servers from different availability zones.
* Containerise and utilise Elastic Container Registry and Elastic Container Service or Elastic Kubernetes Service and ensure multiple container hosts in different availability zones.