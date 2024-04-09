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

- /service-\*\*\*: Directory pertaining to each microservice, such as
  - /service-dbm: database management service,
  - /service-auth: authentication service.
- /service-\*\*\*/src: Contains source code of the corresponding microservice.
- /service-\*\*\*/build: Contains transpiled code for production.

## Usage

Each microservice exposes RESTful endpoints for specific functionalities. Refer to the API documentation (/docs/api.md) for details on available endpoints and their usage.
