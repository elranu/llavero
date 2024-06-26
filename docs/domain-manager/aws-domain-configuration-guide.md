# AWS Domain Configuration Guide

## Overview

This guide provides comprehensive steps and parameters required to configure the main domain using AWS Route 53 and CloudFront. It also outlines the necessary parameters for subdomain configuration to ensure effective setup and management of domains and subdomains.

## Table of Contents

1. [Configuring the Main Domain in Route 53](#configuring-the-main-domain-in-route-53)
2. [Configuring CloudFront Distributions](#configuring-cloudfront-distributions)
3. [Parameters for Route 53 and CloudFront](#parameters-for-route-53-and-cloudfront)
4. [Parameters to be Passed to Service B](#parameters-to-be-passed-to-service-b)
5. [Configuration Requirements for Service A](#configuration-requirements-for-service-a)
6. [Steps for Service B to Configure Subdomains](#steps-for-service-b-to-configure-subdomains)
7. [Best Practices and Considerations](#best-practices-and-considerations)
8. [Sequence Diagram](#sequence-diagram)

## Configuring the Main Domain in Route 53

1. **Registering a Domain:**

   - Confirm domain availability.
   - Register the domain using Route 53.
   - Route 53 automatically creates a hosted zone and assigns name servers.

2. **Creating DNS Records:**
   - Create records in the hosted zone to specify how traffic should be routed for the domain or subdomains.
   - Use alias records to route traffic to AWS resources like S3 and CloudFront.

## Configuring CloudFront Distributions

1. **Creating a CloudFront Distribution:**

   - Sign in to the AWS Management Console and open the CloudFront console.
   - Choose "Create Distribution."
   - Select "Web" as the delivery method.

2. **Your Content Origin:**

   - Specify up to 25 origins for a single distribution (e.g., S3 bucket, MediaPackage channel, MediaStore container, load balancer, HTTP server).

3. **Access:**

   - Control whether the files are available to everyone or restricted to some users.

4. **Security:**

   - Enable AWS WAF protection.
   - Require users to use HTTPS to access your content.

5. **Cache Key:**

   - Specify which values to include in the cache key, uniquely identifying each file in the cache for a given distribution.

6. **Origin Request Settings:**

   - Decide whether CloudFront includes HTTP headers, cookies, or query strings in requests sent to your origin.

7. **Geographic Restrictions:**

   - Configure CloudFront to prevent users in selected countries from accessing your content.

8. **Logs:**

   - Create standard logs or real-time logs showing viewer activity.

9. **Associating with Route 53:**
   - In the CloudFront console, under "Distribution Settings," specify the domain name (e.g., www.example.com).
   - In Route 53, create an alias record that points to the CloudFront distribution.

## Parameters for Route 53 and CloudFront

- **Nameserver Details:**
  - List of name servers assigned by Route 53.
- **IP Addresses:**
  - IP addresses associated with the domain.
- **TTL (Time To Live) Settings:**
  - TTL values for DNS records.
- **DNS and Distribution Settings:**
  - Any other relevant settings for DNS and CloudFront distributions.

## Parameters to be Passed to Service B

- **Nameserver Details for Subdomain:**
  - List of name servers for the subdomain.
- **IP Address or Addresses:**
  - IP addresses for the subdomain.
- **TTL (Time To Live) Settings:**
  - TTL values for subdomain DNS records.
- **CloudFront Distribution Settings:**
  - Relevant settings for CloudFront distributions related to the subdomain.
- **Route 53 Records:**
  - Configuration details for Route 53 records pertinent to the subdomain.

## Configuration Requirements for Service A

- **DNS Record Settings in Route 53:**
  - Create an A or CNAME record for the subdomain pointing to the appropriate IP addresses or CloudFront distributions managed by Service B.
  - Example:
    - Record Type: A
    - Name: subdomain.example.com
    - Value: IP address or CloudFront distribution domain name
    - TTL: 300 (or as required)
- **CloudFront Configurations:**
  - Create a CloudFront distribution for the subdomain.
  - Specify the origin as the endpoint managed by Service B.
  - Configure cache behaviors and settings to route traffic correctly from the subdomains to Service B's endpoints.
  - Example:
    - Origin Domain Name: serviceb.example.com
    - Viewer Protocol Policy: Redirect HTTP to HTTPS
    - Allowed HTTP Methods: GET, HEAD, OPTIONS
    - Cache Based on Selected Request Headers: None
    - Forward Cookies: All
    - Forward Query Strings: Yes

## Steps for Service B to Configure Subdomains

1. **Using Provided Parameters:**
   - Follow the steps to set up the subdomain in Route 53 and CloudFront using the parameters provided by Service A.
   - **Creating a Hosted Zone for the Subdomain:**
     - Sign in to the AWS Management Console and open the Route 53 console.
     - Choose "Create Hosted Zone."
     - Enter the name of the subdomain (e.g., subdomain.example.com).
     - Choose "Public Hosted Zone" and click "Create."
   - **Adding Records for the Subdomain:**
     - In the Route 53 console, select the hosted zone you just created.
     - Choose "Create Record Set."
     - Enter the record type (e.g., A or CNAME), name, and value (IP address or CloudFront distribution domain name).
     - Set the TTL value (e.g., 300 seconds).
     - Click "Create."
   - **Updating the DNS Service for the Parent Domain:**
     - Obtain the name servers for the Route 53 hosted zone.
     - Update the DNS service for the parent domain by adding NS records for the subdomain.
     - Use the method provided by the DNS service of the parent domain to add the NS records.
     - Specify the four Route 53 name servers associated with the hosted zone.
   - **Configuring CloudFront Distributions for the Subdomain:**
     - Sign in to the AWS Management Console and open the CloudFront console.
     - Choose "Create Distribution."
     - Select "Web" as the delivery method.
     - Specify the origin settings (e.g., S3 bucket, MediaPackage channel, MediaStore container, load balancer, HTTP server).
     - Configure access control settings to restrict or allow access to your content.
     - Enable AWS WAF protection and require HTTPS for accessing your content.
     - Specify cache key settings to uniquely identify each file in the cache.
     - Configure origin request settings to include HTTP headers, cookies, or query strings in requests sent to your origin.
     - Set geographic restrictions to prevent users in selected countries from accessing your content.
     - Create standard or real-time logs to monitor viewer activity.
     - Save your changes and wait for the distribution to be deployed.
     - In the CloudFront console, under "Distribution Settings," specify the domain name (e.g., subdomain.example.com).
     - In Route 53, create an alias record that points to the CloudFront distribution.

## Best Practices and Considerations

- **Best Practices:**

  - **Use Alias Records:** Use alias records in Route 53 to route traffic to AWS resources like CloudFront distributions, S3 buckets, and ELB load balancers. Alias records are more efficient and cost-effective than CNAME records.
  - **Enable HTTPS:** Always enable HTTPS for your CloudFront distributions to ensure secure communication between clients and your origin servers.
  - **Use AWS WAF:** Implement AWS WAF (Web Application Firewall) to protect your applications from common web exploits and vulnerabilities.
  - **Optimize Cache Settings:** Configure cache settings in CloudFront to optimize performance. Use cache behaviors to specify how different types of content are cached and served.
  - **Monitor and Log Activity:** Enable logging in CloudFront to monitor viewer activity and identify potential issues. Use standard or real-time logs to gain insights into traffic patterns and performance.
  - **Set TTL Values Appropriately:** Set appropriate TTL values for your DNS records to balance between DNS resolution speed and the need for updates.
  - **Use Health Checks:** Configure health checks in Route 53 to monitor the health of your endpoints and ensure high availability.

- **Potential Pitfalls:**

  - **DNS Propagation Delays:** Be aware of DNS propagation delays when updating DNS records. Changes may take time to propagate across the internet.
  - **Misconfigured Cache Settings:** Incorrect cache settings in CloudFront can lead to stale content being served. Ensure cache behaviors are configured correctly.
  - **Security Misconfigurations:** Failing to enable HTTPS or implement AWS WAF can expose your applications to security risks. Always follow security best practices.
  - **Geographic Restrictions:** Be cautious when setting geographic restrictions in CloudFront. Ensure that restrictions do not unintentionally block legitimate users.

- **Recommendations:**
  - **Regularly Review Configurations:** Periodically review your Route 53 and CloudFront configurations to ensure they align with best practices and current requirements.
  - **Stay Updated:** Keep up with AWS updates and new features for Route 53 and CloudFront to take advantage of improvements and enhancements.
  - **Document Changes:** Maintain thorough documentation of your domain and subdomain configurations, including DNS records, CloudFront settings, and security measures.

## Sequence Diagram

- **Interaction Between Service A and Service B:**
  - Detailed sequence diagram illustrating the flow of information and parameters between the two services.

## Deliverables

- Detailed report/documentation of the research findings for both Service A and Service B.
- Step-by-step guides for configuring the main domain and subdomains.
- List of necessary parameters and their explanations for both services.
- Sequence diagram illustrating the interaction between Service A and Service B.
- Best practices and recommendations.
