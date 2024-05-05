This page represents the front end of a bigger web application.
Its purpose is to emulate the deployment phase. 
This instance of the application doesn't work because whenever you make a server request it is made to some Google DNS solver,  
instead of to my IP address (or any other address where my server would sit).

I made an actual deployment onto my local network through port forwarding, and the application became fully functional worldwide.

I've added a stupid serverless Secret Santa raffler to play with my co-workers now that Christmas is coming.  
The cool part is that it guarantees a single cycle (reminded me of that one Futurama episode), so it's more fun this way.

I've also added a very fancy Sudoku generator and solver, too bad it does require server computing (see [main branch](https://github.com/Lucas1774/Web-app/tree/master/server)).  
I've injected a demo video into the page. The generated sudokus have at least 17 clues, so they are supposed to have exactly one solution.  
The program can import others from [here](https://projecteuler.net/project/resources/p096_sudoku.txt), and will attempt to store them in a database.  
I didn't bother implementing custom error message rendering, so if something can't be done it just won't be done.  
The solution is generated serverside, so no cheating allowed!

I've now added a small Rubik's cube (and other types of puzzles alike) timer to use on the train on my way to work because  
I was annoyed at ads, repeated scrambles and other issues with the Android app store apps.  
As the Secret Santa app, it is completely serverless (for now) and very convenient to use as a very raw timer + scramble generator app.

This message is a react component that parses the readme of this branch of the repository into HTML.

Refer to [this page](https://github.com/Lucas1774/Web-app) for more information.
