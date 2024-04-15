# Welcome to Project GroundZero

This repository contains a collection of application microservices aimed at building scalable and modular cloud-native applications. Each microservice implements a RESTful API following software best practices.

## Table of Contents

- [Concept](#concept)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Future](#future)

## Concept

The concept behind Project GroundZero is to provide a collection of application microservices that offer abstractions for various functionalities, independent of specific applications.

Each microservice is designed to be self-contained and deployable as its own service or server. This design promotes modularity and scalability while facilitating the construction of cloud-native applications.

While these microservices can operate independently, some may require communications between themselves and other microservices in normal operation.

A key principle of Project GroundZero is the clear separation between business domain logic and software infrastructure within each microservice. This separation enhances maintainability, scalability, and testability while promoting frameworks independence.

By adhering to software best practices, Project GroundZero aims to provide a robust foundation for developing modern, scalable applications.

## Technologies Used

- Node.js
- TypeScript
- Express.js
- Axios
- MySQL
- MongoDB

## Project Structure

The repository is structured as follows:

- `/service-***`: Root directory for each microservice.
  - `/src`: Source code of the microservice.
  - `/build`: Transpiled code for production.
  - `/docs`: Documentation for the microservice.

## Usage

Each microservice exposes RESTful endpoints. Refer to the individual API documentation (/docs/api.md) for details on available endpoints and their usage.

Because of the modular design and clear separation of concerns, the modules can be deployed together to create complex and scalable application server architectures.

## Future

More microservices will be developed and added to the project. Here are the projected components:

- `/services-dbm`: Database management service.
- `/services-auth`: Authentication and authorization service.
- `/services-wskt`: WebSocket service.
- `/services-web`: Web server service.
- etc.

Stay tuned for updates and new functionalities!
