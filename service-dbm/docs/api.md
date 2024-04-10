## About

This microservice functions as a database management service. It receives HTTP requests, translates to basic CRUD operations, and pass the instruction the corresponding database management service.

## Deployment

Here are steps to deploy and start the service:

1. Install all dependencies in the root directory 'service-dbm'.
2. If not done already, compile TypeScript scripts in the 'src' directory. This will generate another directory 'build' which mirrors the 'src' folder.

   ** Make sure to copy '.env' file to the 'build' directory. **

3. Modify parameters in the '.env' file to corresponding values specific to the running machine.

4. Run 'server.js' file as the entry point of the application.

To switch to other database management system, one can implement database connection script to the 'detachables' directory.

## API Endpoints

The API endpoints handle CRUD operations in a RESTful manner

- GET /records + query parameters : fetch records with matching values in the query parameters.
- DELETE /records + query parameters : delete records with matching values in the query parameters.
- POST /records + request body : create records according to data in the request's body.
- PUT /records + request body : update records with matching values by data in the request's body.

# GPT

# Database Management Service API

## About

The Database Management Service microservice handles HTTP requests, translating them into basic CRUD operations and forwarding instructions to the corresponding database management system.

## Deployment

To deploy and start the service, follow these steps:

1. Install all dependencies in the root directory 'service-dbm'.
2. If not already done, compile TypeScript scripts in the 'src' directory. This generates a 'build' directory mirroring 'src'.
3. Copy the '.env' file to the 'build' directory and update parameters specific to your environment.
4. Run the 'server.js' file as the entry point of the application.

To switch to a different database management system, implement the database connection script in the 'detachables' directory.

## API Endpoints

The API endpoints handle CRUD operations in a RESTful manner:

- **GET /records** + query parameters: Fetch records matching the specified query parameters.
- **DELETE /records** + query parameters: Delete records matching the specified query parameters.
- **POST /records** + request body: Create records based on the data in the request body.
- **PUT /records** + request body: Update records matching the specified criteria with data from the request body.
