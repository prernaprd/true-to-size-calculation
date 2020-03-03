# True-to-Size Calculation

A true-to-size calculation is a [Node.js](https://nodejs.org/en/) app using [Express 4](http://expressjs.com/) framework to calculate true-to-size data based on crowd sourcing. 

## Running using Docker <Environment: production>

App requires [Docker](https://www.docker.com/products/docker-desktop), [Git](https://git-scm.com/downloads) and [Postman](https://www.postman.com/downloads/) installed.

```
1. Clone or download from https://github.com/prernaprd/true-to-size-calculation
2. Navigate to the path where file is downloaded in Terminal: cd <path>
3. Make sure previous containers are shut down: docker-compose down --remove-orphans
4. Remove previous images: docker rmi <image>
5. To start the container and keep running in background: docker-compose up -d
6. Run the API through Postman as per `routes/products.yml`. 
    Eg: URL: http://localhost:9090/v1.0/api/products/1/true-to-size
        Header: x-api-key : <apiKey> (As per `config/production.js`); Content-Type: application/json
        Method: POST
        Body: {"trueToSize" : 1}
7. To verify the logs: docker-compose logs
8. After using shut down the container: docker-compose down --remove-orphans
```

## Running using Docker <Environment: test>

App requires [Docker](https://www.docker.com/products/docker-desktop) and [Git](https://git-scm.com/downloads) installed.

```
1. Clone or download from https://github.com/prernaprd/true-to-size-calculation
2. Navigate to the path where file is downloaded in Terminal: cd <path>
3. Make sure previous containers are shut down: docker-compose down --remove-orphans
4. Remove previous images: docker rmi <image>
5. To start the container and run the mocha tests: docker-compose -f docker-compose-test.yml up
6. After using shut down the container: docker-compose down --remove-orphans 
```

# Code Overview

## Dependencies

- [express](https://github.com/expressjs/express) - The server for handling and routing HTTP requests.
- [express-validator](https://github.com/express-validator) - An express.js middleware for validator.js. Provides functionality to perform schema validation with built in function for various defined and custom data types. Provides detailed error messages.
- [config](https://github.com/lorenwest/node-config) - Node-config organizes hierarchical configurations for app deployments. The node or process environment variable needs to be set based on the app deployment.
- [body-parser](https://github.com/expressjs/body-parser) - Node.js body parsing middleware. 
- [pg](https://github.com/brianc/node-postgres) - Non-blocking PostgreSQL client for Node.js.
- [mocha](https://github.com/mochajs/mocha) - Simple, flexible JavaScript test framework for Node.js.
- [chai](https://github.com/chaijs/chai) - Chai is an assertion library for node that can be paired with any JavaScript testing framework.
- [chai-http](https://github.com/chaijs/chai) - Allows HTTP integration testing with Chai assertions.

## Application Structure

- `app.js` - The entry point to the application. This file defines the express server, binds the security and authentication of the application. It has list of routing with their schema validation to be used in the application.
- `auth.js` - The authentication methodology applied for each HTTP request coming to the server.
- `docker-compose.yml` - The Docker yaml file containing the configuration for services such as database and API to be used when environment is production.
- `docker-compose-test.yml` - The Docker yaml file containing the configuration for services such as database and API to be used when environment is test.
- `Dockerfile` - The Docker file containing the configuration for creating the images and starting the application when environment is production.
- `Dockerfile.test` - The Docker file containing the configuration for creating the images and running the mocha test cases when environment is test.
- `init.sql` - The SQL file to be loaded to create the database table schema and loading the master data when environment is production. This get used in docker-compose.yml configuration steps.
- `init-test.sql` - The SQL file to be loaded to create the database table schema and loading the master data when environment is test. This get used in docker-compose-test.yml configuration steps.
- `erDiagram.png` - The entity relationship diagram of the data model created in PostgreSQL database for the application.
- `config/` - This folder contains configuration for PostgreSQL database and application to be used in the application based on the configuration/environment variables.
- `routes/` - This folder contains the route definitions for the API along with the API documentation in their respective YAML files and the schema to be used by express-validator module.
- `utils/` - This folder contains the utility to connect to PostgreSQL database and perform query execution. Also contains the list of all the error messages sent from the application to the client.
- `test/` - This folder contains the unit and integration testing for the API which runs using the Mocha framework.

## Error Handling

Node module express-validator is used for performing all the schema validations and formats the response which can be easily understood by client. `routes/products.yml` provides the error message format, response attributes and the status codes which will be returned to the client. The database validations is handled in `utils/pgsql.js` and returns the error message in same format as returned in the schema validation to keep the consistency.

## Authentication

Requests are authenticated using the `API Key` in the header. `auth.js` is used to authenticate requests and also set the allowed CORS (Cross Origin Resource Sharing) in the headers. If the request is not authenticated a status of 403 is returned.

## API Documentation

`routes/products.yml` contains the API documentation. It can be opened in [Swagger](https://editor.swagger.io/) by client users to read the API definitions in a better format. It contains the URL, path, header and body definition specifying about the request attributes, their syntax, response and error responses to be rendered by the API.

<br />