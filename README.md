# Web App

The purpose of this project is to provide an example of a simple web application with a backend server and a front-end client. The application provides a calculator that allows users to perform basic arithmetic operations.  
You should know that everything in this file except this line was generated by ChatGPT3.5 prompted the directory tree.

## Technologies Used

The following technologies were used to build this application:

- Git - Version control system used for managing source code.
- Java - Programming language used for developing the server-side application.
- Maven - Build automation tool used for managing dependencies and building the server-side application.
- Spring Boot - Framework used for building the server-side application and RESTful web services.
- JavaScript - Programming language used for developing the client-side application
- npm - Package manager used for managing dependencies for the client-side application.
- React - JavaScript library used for building the client-side application.
- Node.js - JavaScript runtime environment used for running the client-side application.
- MySQL - Relational database management system used for storing data.
- HTML - Markup language used for structuring the client-side application.
- CSS - Style sheet language used for styling the client-side application.
- Bootstrap - Front-end framework used for designing and styling web pages and user interfaces in the client-side application.

## Project Structure

The project is structured as follows:

- `client`: This directory contains the React.js client application code. The frontend application is built using the `create-react-app` tool and communicates with the backend server through RESTful API endpoints.
- `server`: This directory contains the Java Spring Boot server code. The backend application provides RESTful API endpoints that the client uses to perform operations on the calculator.
- `database`: This directory contains an example MySQL database file that can be used to store and retrieve data for this application.

## Installation and Usage

To run this application locally, follow these steps:

1. Clone the repository to your local machine
2. Install Node.js and MySQL if not already installed
3. Start the MySQL server and create a new database
4. Update the database connection details in the `application.properties` or `application.yml` file located in the `src/main/resources` directory of the backend server code
5. Navigate to the server directory and run `./mvnw spring-boot:run` to start the backend server
6. Open a web browser and navigate to `http://localhost:3000` to access the application

## Contributing

If you wish to contribute to this project, please fork the repository and submit a pull request with your changes. Please ensure that your code adheres to the existing code style and includes appropriate test coverage.

## License

This project is licensed under the MIT License.
# TODO:

Fill this file.