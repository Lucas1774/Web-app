This page represents the front end of a bigger web application.
Its purpose is to emulate the deployment phase.  
Its content, as of now, is a very basic React app to make the application test-ready.  
This instance of the application doesn't work for a couple of reasons:  
    When you click equals or ans or press enter, a request to a place-holding IP address is made, and Google doesn't happen to be listening.  
    <s>Even if I replaced that address with mine and had the server running, your browser would block mixed communication between HTTPS and HTTP addresses.</s>  

I made an actual deployment onto my local network through port forwarding, and the application became fully functional worldwide.  
The ans and equals buttons were working as an oddly secure one-number-only-broadcast chat tool. Goes to show the potential of the structure.  
This NAT configuration is not running anymore for obvious reasons, even if my IP address is completely hidden in this Github branch and others.

I've added a stupid Secret Santa raffler to play with my co-workers now that Christmas is coming.  
The cool part is that it guarantees a single cycle (reminded me of that one Futurama episode), so it's more fun this way.

This message is a react component that parses the readme of this branch of the repository into HTML, which is the weirdest thing I'll ever write.

Refer to [this page](https://github.com/Lucas1774/Web-app) for more information.
