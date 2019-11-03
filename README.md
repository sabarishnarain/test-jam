[![Build Status](https://dev.azure.com/snarain-open-source/test-jam/_apis/build/status/sabarishnarain.test-jam?branchName=master)](https://dev.azure.com/snarain-open-source/test-jam/_build/latest?definitionId=3&branchName=master)

## TEST-JAM
 A simple dashboard service to manage tests by adding, editing and executing them across sprints. This service also exposes REST end points to update test status. For example, if you have automated tests running from a cloud server, you can have them update its status into this dashboard. 

 ### Features

 1. Create and edit test cases
 2. Create projects and add tests into it.
 3. Create Sprints and execute tests in each sprint. 
 4. Pie chart dashboard to visualize pass percentage per sprint.
 5. Bar graph to visualize completion status per sprint. 
 6. Store test history
 4. user management (admin only feature).

### Models
The various models used in this project are - 
1. **Test** - Representation of a test case. Contains name, description and unique identifier per project. There can be multiple tests associated to a single project. Each test is stored with auto-generated id. The unique identifier is used to update the test's status using API calls. 
2. **Project** - Represents a container for tests. 
3. **Sprint** - Represents a cycle. A test can be executed in each sprint.
3. **Test History** - History of runs. 
4. **Users** - An user has access to all projects and all tests. First user who registers is admin by default. An admin user has the privilege to add other admin users. Users page can be accessed via the route `/users`.

### Build Targets
`npm run dev` -
`npm run prod`
`npm run test`
`npm run lint`

Each target comprises of its own environment variable setting. Removing db/XX where XX is dev,demo,test data sets and rerunning the target will regenerate all datasets.

### Docker
It is strongly recommended to use this for production. 
Mount a volume so the data can be exported for backup as well as reuse in future. 
Ex: `docker run -d -p 3000:3000 -v /home/snarain/temp:/app/db/prod testjam:latest`
Note that JDAM_ENV_PROD environment variable is set within the container. Port 80 exposed by default.
The app will create the list of json files in the mounted directory of host machine. You can then start registering the users. The first user is admin. Default master key is `nobodyownsnothing`.

## User Registration

To prevent uninvited visitors from accessing the app, users will need to request admins for a secret key to register.
See end points below to generate a client secret. Default master key is `nobodyownsnothing`.

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


#### Delete Sprint
`DELETE /sprint/:id`

Form parameters
``` master = <master key> ```

Returns 
200 - sprint deleted.
400 - if master key is not supplied.
500 - If sprint has tests associated with it or if master key is invalid.