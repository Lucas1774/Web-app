This page represents the front end of a bigger web application.  
Its purpose is to emulate the development process from outside the code.  
This instance of the application didn't work for the longest time, but now it does!  
The real challenge was to have it done for free, but I learned a lot along the way.  
The project is huge right now (horizontally, that is). The apps, although nice, are only an excuse.

It has environment-specific configurations, standardized git flows, HTTP filters and validation, decent error handling, build scripts  
and it is deployed in two different web servers (Linux and Windows) and two different databases (MySQL and SQLServer),  
as well as installed separately on my phone as Cordova-wrapped Android apps,  
although I'm not sure if I want to commit to the $25 fee to deploy at the app store yet.  
My free Azure services don't provide enough computing power to handle actual traffic anyway.

The servers and databases are hosted on Azure (and not on my personal computer anymore).  
They need a wake-up request before running if they were idle, and even then they are not the fastest (being hosted in the US doesn't help).

The calculator app can persist text (on invalid expression), so read the last message and send a new one!

I've added a stupid serverless Secret Santa raffler to play with my co-workers now that Christmas is coming.  
The cool part is that it guarantees a single cycle (reminded me of that one Futurama episode), so it's more fun this way.

I've also added a very fancy Sudoku generator and solver, which requires server computing!  
The generated sudokus have at least 17 clues, so they are supposed to have exactly one solution.  
The program can import others with a similar format to [this](https://projecteuler.net/project/resources/p096_sudoku.txt), and will attempt to store them in a database.  
The solution is generated serverside, so no cheating allowed!

I've now added a <s>small</s> Rubik's cube (and other types of puzzles alike) timer to use on the train on my way to work because  
I was annoyed at ads, repeated scrambles and other issues with the Android app store apps.  
As the Secret Santa app, it is completely serverless and very convenient to use as a timer + scramble generator + stats tracker app.  
Stats and times are clickable for detailed info and deletion respectively.

This message is a react component that parses the readme of this branch of the repository into HTML.

Refer to [this page](https://github.com/Lucas1774/Web-app) for more information.
