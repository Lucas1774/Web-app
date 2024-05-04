# Full-stack web application
The purpose of this project is to provide an example of a simple web application with a back-end server and a front-end client. The application provides a calculator that allows users to perform basic arithmetic operations.  
You should know that everything in this file except this line was generated by ChatGPT3.5 prompted the directory tree, and then molded by me to correct or highlight some aspects. I left some parts untouched because it is funny.

## Technologies Used
The following technologies were used to build this application:

- Git - Version control system used for managing source code.
- Java - Programming language used for developing the server-side application.
- Spring Boot - Framework used for building the server-side application and RESTful web services.
- Maven - Build automation tool used for managing dependencies and building the server-side application.
- JavaScript - Programming language used for developing the client-side application
- React - JavaScript library used for building the client-side application.
- npm - Package manager used for managing dependencies for the client-side application.
- Node.js - JavaScript runtime environment used for running the client-side application.
- MySQL - Relational database management system used for storing data.
- HTML - Markup language used for structuring the client-side application.
- CSS - Style sheet language used for styling the client-side application.
- Bootstrap - Front-end framework used for designing and styling web pages in the client-side application.

## Project Structure
The project is structured as follows:

- `client`: This directory contains the React.js client application code. The frontend application is built using the `create-react-app` tool (that was a wild guess by the AI, but spot on) and communicates with the backend server through RESTful API endpoints.
- `server`: This directory contains the Java Spring Boot server code. The backend application provides RESTful API endpoints that the client uses to perform operations on the calculator. The program receives user input, performs the requested calculation using a Solver class, and saves the results to a MySQL database for later retrieval. When the `ans` function of the calculator is called, the program retrieves the result from the database and sends it back to the front end.
- `database`: This directory contains a MySQL database that stores the result of the mathematical operation under two layers of authentication security and CORS policies (chatGPT did not infer this. Imagine).

## Programs
### Sudoku Application
If you click `Generate`, you will then be able to select `Generate` to generate a randomly generated, one-solution Sudoku, where the number of clues will be 17 at difficulty 9 and 6 per difficulty level less. You will also be able to click `Fetch` to pull a randomly selected, previously imported Sudoku from the database. you can also press `enter` or `ctrl+enter` respectively.  
Once a sudoku is showing you will be able to navigate it with the `arrow keys` or with the mouse. You cannot remove or override clues (marked with a grey background). Selecting `solve` will solve the SUdoku immediately and render it uneditable. Selecting `check` will have the Sudoku blink red if at least one number is wrong, and blink green otherwise. You can also press `ctrl+enter` or `enter` respectively.  
Placing the last number in the sudoku will make an auto-check.  
Pressing `escape` or clicking `reset` at any time will go back to "the main menu".  
It takes the program less than <s>2</s> 0.1 milliseconds on average to solve a Sudoku  
If you click `Choose file` you will be able to import sudokus from a `.txt` file, where each sudoku has a one-line header (which will be ignored) and then one nine-digit line per row:

    # Sudoku Puzzle 1
    530070000
    600195000
    098000060
    800060003
    400803001
    700020006
    060000280
    000419005
    000080079
    # Sudoku Puzzle 2
    003020600
    900305001
    001806400
    008102900
    700000008
    006708200
    002609500
    800203009
    005010300

### Calculator Application
Does what you would imagine it does, with the twist that typing something will store it in the database, and can be retrieved with the `ans` button.  
There's no session control, so the value stored behind the `ans` button is always the same.

### Secret Santa Application
Type the name of three or more players (cannot be left empty and has to be unique) so when clicking `Start raffle` the program creates a single cycle with participants, where each ought to gift the next one.  
The program will then prompt each participant (in input order) to click the `Press me to show!` button, after which it will show their giftee's name for 2 seconds.  
To clarify, the idea is to use this app ideally on a phone, passing it around so each participant can intimately check who they have to gift.

### Rubik timer
While the timer is very precise, the displayed time's refresh rate is declared as a constant and used to save computing power.  
Select a puzzle for which to generate a random scramble.  
Set the timer to zero by holding `spacebar` or touching your phone screen (buttons and form fields have priority over this functionality).  
Start the timer by releasing, or cancel the start-up by dragging your finger or pressing any other key. The scramble won't be lost unless the key is `escape`.  
As with the other apps, pressing `escape` is equivalent to clicking or pressing `reset`.


## Installation and Usage
To run this application, follow these steps:

1. Clone the repository to your local machine
2. Install Node.js and MySQL if not already installed
3. Start the MySQL server and create a new database running the migration script
4. Update the database connection details in the `application.yml` file located in the `src/main/resources` directory of the backend server code
5. Update the IP address details and the server credentials with the ones of your choice in the `application.yml` and the `.env.local` files. If you are not planning on deploying your application you can and should leave the public IP address blank
6. Start the application server and client running the run.bat script or through any other mean
7. If you want to use the application over the internet you will need to forward the required ports from your router's NAT configuration. You might also need to set up your firewall rules to allow traffic within your LAN environment so both endpoints can communicate with each other

## Conclusion
Overall, this project demonstrates how different technologies can be combined to create a web-based application that provides a simple yet useful service. The use of React.js and Spring Boot in particular shows how front-end and back-end technologies can be used together to create a smooth and seamless user experience. This last sentence is flattering because I didn't write it.

## Contributing
If you wish to contribute to this project, please fork the repository and submit a pull request with your changes. Please ensure that your code adheres to the existing code style and includes appropriate test coverage.

## License
This project is licensed under the MIT License.
