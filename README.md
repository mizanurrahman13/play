# Microservices(PLAY) API with .NET 8, Repository, Docker, Polly, Asynchronous inter-service communication(RabbitMQ), Publishing messages(MassTransit) and MongoDb.

The Project covers database storage with MongoDB, implementing repository patterns, using Docker for containerization, and configuring dependency injection. It also addresses microservice preparation, synchronous and asynchronous inter-service communication, leveraging tools like Postman, IHttpClientFactory, Polly, MassTransit, and RabbitMQ, with a focus on code reuse and Docker Compose.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker](https://www.docker.com/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/mizanurrahman13/play.git
   ```
2. Navigate to the project directory
   ```sh
   cd play
   ```
3. Restore dependencies:
   ```sh
   dotnet restore
   ```

## Architecture Overview

A microservice architecture utilizing RabbitMQ and MassTransit allows for efficient and reliable communication between services through asynchronous messaging, enhancing scalability. Each microservice can publish and subscribe to messages on RabbitMQ, with MassTransit simplifying the integration of messaging patterns like publish-subscribe, request-response, and sagas. Additionally, the Repository Pattern is employed for dynamic entities, and Docker Compose is used to manage MongoDB and RabbitMQ message broker.

## Features

- **Built with .NET 8**: Utilizes the latest features for efficient development.
- **RabbitMQ**: RabbitMQ facilitates reliable, scalable, and efficient communication between distributed systems through message queuing, ensuring robust asynchronous processing and integration.
- **MassTransit**: MassTransit simplifies the development and management of messaging patterns in .NET applications, enhancing scalability, reliability, and maintainability through seamless integration with message brokers like RabbitMQ.
- **Repository** : Provides abstraction and simplifies data access logic.
- **MongoDb**: MongoDB offers high scalability, flexibility, and performance for handling large volumes of data, making it ideal for modern, dynamic applications.
- **Polly**: Polly enhances the resilience and reliability of applications by providing sophisticated error-handling and resilience policies such as retries, circuit breakers, and timeouts.
- **Docker**: Docker provides a lightweight and consistent environment for application development and deployment, enabling portability, scalability, and efficient resource utilization across different platforms.

## Technologies Used

- **.NET 8**
- **Repository Pattern**
- **RabbitMQ**
- **MassTransit**
- **Polly**
- **Docker**
- **MongoDb**

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
