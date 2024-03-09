This page represents the front end of a bigger web application.
Its purpose is to emulate the deployment phase. 
This instance of the application doesn't work because whenever you make a server request it is made to some Google DNS solver,  
instead of to my IP address (or any other address where my server would sit).

I made an actual deployment onto my local network through port forwarding, and the application became fully functional worldwide.

I've added a stupid serverless Secret Santa raffler to play with my co-workers now that Christmas is coming.  
The cool part is that it guarantees a single cycle (reminded me of that one Futurama episode), so it's more fun this way.

I've also added a very fancy Sudoku generator and solver, too bad it does require server computing (see [main branch](https://github.com/Lucas1774/Web-app/tree/master/server)).  
I've injected a demo video into the page. The generated sudokus are not necessarily valid (more than one solution)  
which makes the check functionality fail potentially. [The imported ones](https://projecteuler.net/project/resources/p096_sudoku.txt) (sitting on a database) are.  
The solution is generated serverside, so no cheating allowed!

This message is a react component that parses the readme of this branch of the repository into HTML, which is the weirdest thing I'll ever write.

Refer to [this page](https://github.com/Lucas1774/Web-app) for more information.
