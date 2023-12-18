# The Chatter
The Chatter is a microblogging website where users may create an account to create, edit, like, and delete posts. Inspired by the X (Twitter) platform.

## How it was built
This website uses the express framework and MySQL db for the server. Pug templates were used to replace HTML to make 
generating dynamic content that is simple and efficient. 

### How to install and run:
0: Ensure ```node``` is installed locally. For more information visit: https://nodejs.org/en/learn/getting-started/how-to-install-nodejs <br/>
1: ```git clone https://github.com/romeo-sweeney/The-Chatter```<br/>
2: ```cd The-Chatter```<br/>
3: ```npm init```<br/>
4: ```npm install express pug bcrypt express-session mysql-await tunnel-ssh prompt```<br/>
5: ```node tunnel.js```<br/>
6: Authenticate as a umn.edu user to create a tunnel into the CSE labs firewall.<br/>
7: Open a new terminal and navigate to the project.<br/>
8: ```node server.js```<br/>
9: Navigate to the browser of choice and type: ```localhost:4131/```
