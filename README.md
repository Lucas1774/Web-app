This page represents the front end of a bigger web application.
Its purpose is to emulate the deployment phase. 
This instance of the application didn't work for the longest time, but now it does!  
The real challenge was to have it done for free, but I learned a lot on the way and the project is huge right now.  
I only regret not finding the "My SQL in-app" built-in server before I had the Microsoft SQL Server up and running.

The server and database are hosted on Azure (and not on my personal computer anymore).
It is quite slow and seems to go idle after a little (as if sitting in the US wasn't enough), but it works.
It works from Android too (as a Cordova-wrapped Android app), but I'm not sure if I want to commit to the $25 fee to deploy at the app store.

The calculator app can store text (on invalid expression), so read the last message and send a new one!

I've added a stupid serverless Secret Santa raffler to play with my co-workers now that Christmas is coming.  
The cool part is that it guarantees a single cycle (reminded me of that one Futurama episode), so it's more fun this way.

I've also added a very fancy Sudoku generator and solver, which requires server computing but that's not an issue anymore!  
The generated sudokus have at least 17 clues, so they are supposed to have exactly one solution.  
The program can import others with a similar format to [this](https://projecteuler.net/project/resources/p096_sudoku.txt), and will attempt to store them in a database.  
The solution is generated serverside, so no cheating allowed!

I've now added a <s>small</s> Rubik's cube (and other types of puzzles alike) timer to use on the train on my way to work because  
I was annoyed at ads, repeated scrambles and other issues with the Android app store apps.  
As the Secret Santa app, it is completely serverless (for now) and very convenient to use as a timer + scramble generator + stats tracker app.  
Stats and times are clickable for detailed info and deletion respectively.

This message is a react component that parses the readme of this branch of the repository into HTML.

Refer to [this page](https://github.com/Lucas1774/Web-app) for more information.
