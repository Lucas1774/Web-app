This page represents the front end of a bigger web application.
Its purpose is to emulate the deployment phase. 
This instance of the application doesn't work because whenever you make a server request it is made to some Google DNS solver,  
instead of to my IP address (or any other address where my server would sit).

I made an actual deployment onto my local network through port forwarding, and the application became fully functional worldwide.

I've added a stupid serverless Secret Santa raffler to play with my co-workers now that Christmas is coming.  
The cool part is that it guarantees a single cycle (reminded me of that one Futurama episode), so it's more fun this way.

I've also added a very fancy Sudoku generator and solver, too bad it does require server computing (see [main branch](https://github.com/Lucas1774/Web-app/tree/master/server)).  
I've injected a demo video into the page. The generated sudokus are not necessarily valid (more than one solution)  
which makes the check functionality fail potentially. The importer is not implemented yet.

This message is a react component that parses the readme of this branch of the repository into HTML, which is the weirdest thing I'll ever write.

I really like this project because I get to do a lot of stuff:
- The server is https, and I can set it up with my phone anywhere across the world.
- Git flows are very interesting.
- I have scripts to build and deploy the front end of the application into gh-pages, as well as to launch it locally or across the world.

Refer to [this page](https://github.com/Lucas1774/Web-app) for more information.
