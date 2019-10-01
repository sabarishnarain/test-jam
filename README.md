[![Build Status](https://dev.azure.com/snarain-open-source/test-jam/_apis/build/status/sabarishnarain.test-jam?branchName=master)](https://dev.azure.com/snarain-open-source/test-jam/_build/latest?definitionId=3&branchName=master)

## TEST-JAM
 A simple dashboard service to manage test cases. This service also exposes REST end points to update test status. For example, if you have automated tests running from a cloud server, you can have them update the status into this dashboard. 

 ### Features

 1. Create and edit test cases
 2. Pie chart dashboard to visualize status per projects. 
 2. Group tests by projects. 
 3. Simple username/password authentication
 4. Test history.

### Models
The various models used in this project are - 
1. **Test** - Representation of a test case. Contains name, description and unique identifier per project. There can be multiple tests associated to a single project. Each test is stored with auto-generated id. There is also a unique identifier that can be added to a test. This unique identifier is used to update the test's status using API calls. 
2. **Project** - Represents a container for tests. 
3. **Test History** - Each test stores its history of runs. 
4. **Users** - An user has access to all projects and all tests. First user who registers is admin by default. An admin user has the privilege to add other admin users. An admin user can access the users page using the url - /users.


### Build Targets
`npm run dev`
`npm run prod` # be sure to add JDAM_ENV_PROD=true
`npm run test`
`npm run lint`

### Docker
Use Dockerfile to build the image. It is strongly recommended to use this for production. 
Mount a volume so the data can be exported for backup as well as reuse in future. 
Ex: `docker run -d -p 3000:3000 -v /home/snarain/temp:/app/db/prod testjam:latest`
Note that JDAM_ENV_PROD environment variable is set to true inside the container. Port 80 is exposed by default.
The app will create the list of json files in the mounted directory of host machine. You can then start registering the users. The first user is admin. Default master key is `nobodyownsnothing`.

## User Registration

Users will need a secret key to register into the app. This is to prevent uninvited visitors from using the app. See end points below to generate a client secret. Default master key is `nobodyownsnothing`.

## API

#### Update a test by id 

``` POST /tests/:id/update ```

Form parameters
``` status = PASS | FAIL | NORUN ```

The values PASS, FAIL, NORUN is case insensitive.

Returns 
200 - If status updated successfully
500 - Test not found
500 - If status supplied is not one among PASS, FAIL or NORUN
400 - if form parameters are not supplied


#### Update test with identifier.
` POST /projects/:id/tests/:identifier/update`

Form parameters 
```  status = PASS | FAIL | NO RUN ```

Returns 
*Same as above*

#### Generate client secret
`POST /auth/generate`

Form parameters
``` master = <master key> ```

Returns 
200 - with client secret
400 - if master key is not supplied
500 - If invalid master key is used

#### List all client secrets
``` POST /auth/keys```

Form parameters
*Same as above.*
