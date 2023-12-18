# The Chatter
The Chatter is a microblogging website where users may create an account to create, edit, like, and delete posts. Inspired by the X (Twitter) platform.

## How it was built
This website uses the express framework and MySQL db for the server. Pug templates were used to replace HTML to make 
generating dynamic content that is simple and efficient. 

### How to install and run:
1: ```git clone https://github.com/romeo-sweeney/The-Chatter```<br/>
2: ```cd <The-Chatter Project>```<br/>
3: ```npm init```<br/>
4: ```npm install express pug bcrypt express-session mysql-await```<br/>
5: ```node tunnel.js```<br/>
6: Authenticate as a umn.edu user to create a tunnel into the CSE labs firewall.<br/>
7: ```node server.js```<br/>
8: Navigate to the browser of choice and type: ```localhost:4131/```
