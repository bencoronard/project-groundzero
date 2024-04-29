# Database Management Service API

## About

The Database Management Service microservice handles HTTP requests, translating them into basic CRUD operations and forwarding instructions to the corresponding database management system.

## Deployment

To deploy and start the service, follow these steps:

1. Install all dependencies in the root directory 'service-dbm'.
2. If not already done, compile TypeScript scripts in the 'src' directory. This generates a 'build' directory mirroring 'src'.
3. Copy the '.env' file to the 'build' directory and update parameters specific to your environment.
4. Run the 'main.js' file in the 'build' directory as the entry point of the application.

To switch to a different database management system, implement the database connection script in the 'detachables' directory and add corresponding configurations to the '.env' file. Make sure to instantiate the corresponding object of the new database inside the 'setup()' method in the 'server.ts' file.

## API Endpoints

The API endpoints handle CRUD operations in a RESTful manner:

- **GET /records** + query parameters: Fetch records matching the specified query parameters.
- **DELETE /records** + query parameters: Delete records matching the specified query parameters.
- **POST /records** + request body: Create records based on the data in the request body.
- **PUT /records** + request body: Update records matching the specified criteria with data from the request body.

## Future

- Create access control after 'service-auth' microservice has been implemented
