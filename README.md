# Very basic Redshift Serverless deployment

This project will deploy the most basic implementation of Redshift serverless.

It consists of two stacks:
* Redshift Serverless Namespaces - Construct for storage
* Redshift Serverless Workgroup - Construct for compute

## Useful commands

* `npm run deploy:all`   deploys both the Namespace and Workgroups stacks
* `npm run destroy:all`   destroys both the Namespace and Workgroups stacks

# How to deploy

* Get the secret access id and secret access key from AWS IAM for a user with the rights to use cloudformation and deploy Redshift, VPCs and Security 
  Groups
  * Add the keys to `~/.aws/credentials`
* Set the values in `config.ts'
  * Your AWS account ID 
  * Allowed IP Addresses
* run `npm ci` - to install all of the necessary packages
* run `npm run deploy:all` - to deploy the stacks to your AWS account

## How to Redshift Serverless

You can connect to Redshift:
* Using the `Query Editor V2` in the AWS Console in Redshift section.
* Using an appropriate tool with an ODBC or JDBC driver. The connection string you can find in AWS Console, in the Redshift section under the 
  appropriate workspace
  * Note, you will have to change the admin password to something you know.

## Notes

* Two stacks are used because the Namespace and Workgroups constructs cannot be deployed in the same stack. The Workgroups depend on pre-existing 
  Namespaces. When deployed in the same stack the Namespace does not yet exist to which the Workgroup refers. It is likely that AWS will fix this 
  soon.
