# Welcome to Project GroundZero

This repository contains a collection of application microservices. Each microservice implements a RESTful API for specific functionalities following software best practices.

## Table of Contents

- Concept
- Technologies Used
- Project Structure
- Usage
- Future

## Concept

The project aims to provide abstractions of various application microservices. The logic is designed to be the most general and not specific to any particular application.

Each microservice is designed to be self-contained and deployable as its own service/server; however, some microservices might rely on communications between themselves and other microservices. Owning to their modularity, the microservices can be put together to form cloud-native applications.

It is also worth noting that each microservice is implemented in a way that there is a clear separation between the business domain logic and the software infrastructure. This facilitates maintainability, scalablitiy and testability of the microservices and highlights frameworks independence.

## Technologies Used (so far)

- Node.js
- Express.js
- TypeScript
- MySQL
- MongoDB

## Project Structure

The repository is structured as follows:

- /service-\*\*\* : directory pertaining to each microservice,
  - /src : directory containing source code of the corresponding microservice,
  - /build : directory containing transpiled code in production,
  - /docs : directory containing documentations of the microservice.

## Usage

Each microservice exposes RESTful endpoints for specific functionalities. Refer to the API documentation (/docs/api.md) for details on available endpoints and their usage.

## Future

More microservices will be developed and added to the project.

Here are the projected components of the repository:

- /services-dbm : database management service
- /services-auth : authentication and authorization service
- /services-web : web server service

# GPT

# Welcome to Project GroundZero

This repository contains a collection of application microservices aimed at building scalable and modular cloud-native applications. Each microservice implements a RESTful API following software best practices.

## Table of Contents

- [Concept](#concept)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Future](#future)

## Concept

- Provides abstractions of application microservices for general functionalities.
- Designed with clear separation between business domain logic and software infrastructure.
- Facilitates maintainability, scalability, and testability, highlighting frameworks independence.

## Technologies Used (so far)

- Node.js: Backend environment.
- Express.js: Web framework for Node.js.
- TypeScript: Adds static typing and other features to JavaScript.
- MySQL: Relational database for structured data.
- MongoDB: NoSQL database for flexible data storage.

## Project Structure

The repository is structured as follows:

- `/service-***`: Directory for each microservice.
  - `/src`: Source code of the microservice.
  - `/build`: Transpiled code for production.
  - `/docs`: Documentation for the microservice.

## Usage

Each microservice exposes RESTful endpoints. Refer to the [API documentation](/docs/api.md) for details.

## Future

More microservices will be developed and added to the project. Here are the projected components:

- `/services-dbm`: Database management service.
- `/services-auth`: Authentication and authorization service.
- `/services-web`: Web server service.

Stay tuned for updates and new functionalities!
