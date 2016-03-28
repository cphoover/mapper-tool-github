# mappings-github

Utillity for creating indices and corresponding mappings for github project explorer within elasticsearch in AWS.

## Settings
* mapper - object - config namespace
	* **aws_elasticsearch** - object - aws related configurations
		* **host** - string - url of es host
		* **region** - string - region of aws es
		* **access_key** - string - access key for iam user *(see note below)*
		* **secret_key** - string - secret key for iam user *(see note below)*
		* **index** - string - (*default: github*) - name of the index to be created and mapped
		* **type** - string - (*default: repo*) - name of the document type in elasticsearch to add mapping to
	* **mapping_file** - string - (*default: ../mapping.json*) location of file that contains mappings (relative to lib).

## Note about access_key, secret_key
Amazon IAM user access_key and secret_key are needed so requests to Amazon's Elasticsearch service can be signed and authorized. NOTE It is **NOT ADVISEABLE**  to store secrets inside of config file in git (**THIS IS BAD**).

This application can be configured using environment variables with the __ nested namespace seperator. (see nconf repo for more info.)

## Command Flags
In order to utilize this tool you must use one of the following flags (`--create`, `--delete`, or `--get`):

```
# creates the index and it's respective mapping
> node main.js --create

# deletes the index and it's respective mapping
> node main.js --delete

# shows the mapping for the index and type
> node main.js --get
```
