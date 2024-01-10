# The Chatter
The Chatter is a microblogging website where users may create an account to create, edit, like, and delete posts. Inspired by the X (Twitter) platform.

## How it was built
This website uses the express framework for the server and MySQL database to handle CRUD operations. Pug templates were used to replace HTML to make 
generating dynamic content simple and efficient. 

### How to install and run:
0: Ensure ```node``` is installed locally. For more information visit: https://nodejs.org/en/learn/getting-started/how-to-install-nodejs <br/>
1: ```git clone https://github.com/romeo-sweeney/The-Chatter```<br/>
2: ```cd The-Chatter```<br/>
3. ```npm install``` This will install all the dependencies listed in ```package.json```<br/>
4: Run ```node tunnel.js```<br/>
5: Authenticate as a umn.edu user to create a tunnel into the CSE labs firewall to use their database.<br/>
6: Open a new terminal and navigate to the project.<br/>
7: Run ```npm run dev```<br/>
8: Navigate to the browser of choice and type: ```localhost:4131/```
