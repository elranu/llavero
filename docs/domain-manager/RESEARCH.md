# Research on Configuring Main Domain and Subdomain Parameters in AWS Services

## Overview

This document provides a comprehensive guide on configuring the main domain using AWS Route 53 and CloudFront, and determining the necessary parameters for subdomain configuration. The research is part of the Llavero Wallet application, focusing on the Domain Manager service (Service A) and the Domain Requestor service (Service B).

## Service A: Domain Manager

### Configuring the Main Domain

#### Steps to Set Up the Main Domain in Route 53

1. **Create a Hosted Zone**:

   - Navigate to the Route 53 console.
   - Click on "Create hosted zone".
   - Enter the domain name (e.g., `llavero.cloud`) and select the appropriate type (Public or Private).
   - Click "Create hosted zone".

2. **Create DNS Records**:
   - In the hosted zone, click on "Create record".
   - Select the record type (e.g., `A` for IPv4 address).
   - Enter the domain name and the corresponding IP address.
   - Set the TTL (Time To Live) value.
   - Click "Create records".

#### Configuring CloudFront Distributions

1. **Create a CloudFront Distribution**:
   - Navigate to the CloudFront console.
   - Click on "Create Distribution".
   - Select the appropriate delivery method (e.g., Web).
   - Configure the origin settings, including the domain name and origin path.
   - Set up the default cache behavior, including allowed methods and forwarded values.
   - Configure distribution settings, such as enabling the distribution and setting a comment.
   - Click "Create Distribution".

### Identification of Parameters for Service A

- **Nameserver Details**: The nameservers provided by Route 53 for the hosted zone.
- **IP Addresses**: The IP addresses associated with the domain.
- **TTL (Time To Live) Settings**: The TTL values for the DNS records.
- **DNS and Distribution Settings**: Any other relevant settings for DNS records and CloudFront distributions.

### Parameters to be Passed to Service B

- **Nameserver Details for the Subdomain**: The nameservers for the subdomain.
- **IP Address or Addresses**: The IP addresses for the subdomain.
- **TTL (Time To Live) Settings**: The TTL values for the subdomain DNS records.
- **CloudFront Distribution Settings**: Any settings related to the CloudFront distribution for the subdomain.
- **Route 53 Records Configuration**: Details for configuring Route 53 records for the subdomain.

### Configuration Requirements for Service A

- **DNS Record Settings in Route 53**: Ensure proper redirection to Service B by configuring DNS records to point subdomains to the appropriate IP addresses or CloudFront distributions managed by Service B.
- **CloudFront Configurations**: Set up CloudFront to route traffic correctly from the subdomains to Service B's endpoints.

## Service B: Domain Requestor

### Configuring a Subdomain

1. **Set Up Subdomain in Route 53**:

   - Use the parameters provided by Service A to create DNS records for the subdomain.
   - Ensure the subdomain is associated with the correct hosted zone and IP addresses.

2. **Set Up CloudFront Distribution for Subdomain**:
   - Configure a CloudFront distribution for the subdomain using the provided parameters.
   - Ensure the distribution settings align with the requirements for the subdomain.

### Best Practices and Considerations

- **Best Practices**:

  - Use descriptive names for DNS records and CloudFront distributions.
  - Regularly review and update DNS and distribution settings to ensure optimal performance and security.

- **Potential Pitfalls**:

  - Misconfigured DNS records can lead to downtime or incorrect routing.
  - Ensure TTL values are set appropriately to balance between performance and propagation time.

- **Recommendations**:
  - Follow AWS documentation and guidelines for setting up and managing domains and subdomains.
  - Use automation tools like AWS CloudFormation or Terraform for consistent and repeatable configurations.

## Sequence Diagram

![Sequence Diagram](sequence-diagram.png)

## Deliverables

- A detailed report/documentation of the research findings for both Service A and Service B.
- Step-by-step guides for configuring the main domain and subdomains.
- A list of necessary parameters and their explanations for both services.
- A sequence diagram illustrating the interaction between Service A and Service B.
- Best practices and recommendations.

## Notes

- Ensure that the documentation is clear and comprehensive, suitable for other engineers to follow and implement.
- Consider any additional AWS services or configurations that might be relevant to the domain setup process.
