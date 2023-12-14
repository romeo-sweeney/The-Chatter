// mysql -u C4131F23U205 C4131F23U205 -p -h cse-mysql-classes-01.cse.umn.edu

// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "localhost",// this will work
  user: "C4131F23U205",
  database: "C4131F23U205",
  password: "42075",
});

async function loginUser(usernameOrEmail, userPassword) {
  try {
    const result = await connPool.awaitQuery("SELECT * FROM user WHERE username=? AND userPassword=?", [usernameOrEmail, userPassword])
    const resultWithEmail = await connPool.awaitQuery("SELECT * FROM user WHERE email=? AND userPassword=?", [usernameOrEmail, userPassword])
    return result.length == 1 || resultWithEmail.length == 1;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

async function checkUserExists(username, email) {
  try {
    const resultUser = await connPool.awaitQuery("SELECT * FROM user WHERE username=?;", [username]);
    const resultEmail = await connPool.awaitQuery("SELECT * FROM user WHERE email=?;", [email]);
    return !resultUser && !resultEmail;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

async function addUser(firstName, lastName, username, userPassword, email) {
  try {
    const result = await connPool.awaitQuery("INSERT INTO user (firstName, lastName, username, userPassword, email) VALUES (?, ?, ?, ?, ?);", [firstName, lastName, username, userPassword, email]);
    return result.affectedRows !== 0;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}



// CREATE TABLE user (
//   id INT NOT NULL AUTO_INCREMENT,
//   firstName VARCHAR(50) NOT NULL,
//   lastName VARCHAR(50) NOT NULL,
//   username VARCHAR(20) NOT NULL,
//   userPassword VARCHAR(200) NOT NULL,
//   email VARCHAR(100) NOT NULL,
//   PRIMARY KEY (id),
//   UNIQUE KEY (username),
//   UNIQUE KEY (email)
// );

// CREATE TABLE posts (
//   id INT NOT NULL AUTO_INCREMENT,
//   post VARCHAR(200),
//   userID INT NOT NULL,
//   FOREIGN KEY (userID) REFERENCES user(id),
//   PRIMARY KEY (id)
// );


async function createPost(post, userID) {
  try {
    const result = await connPool.awaitQuery("INSERT INTO posts (post, userID) VALUES (?, ?);", [post, userID]);
    return result.affectedRows == 1;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

async function getAllPosts() {
  try {
    const result = await connPool.awaitQuery("SELECT * FROM posts;");
    return result.length >= 1;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

module.exports = {checkUserExists, addUser, loginUser, createPost, getAllPosts}