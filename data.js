// mysql -u C4131F23U205 C4131F23U205 -p -h cse-mysql-classes-01.cse.umn.edu

// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await
const bcrypt = require('bcrypt');

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
    const storedHashWithUsername = await connPool.awaitQuery("SELECT userPassword FROM user WHERE username=?", [usernameOrEmail]);
    const storedHashWithPassword = await connPool.awaitQuery("SELECT userPassword FROM user WHERE email=?", [usernameOrEmail]);

    if (storedHashWithUsername.length === 1 && await bcrypt.compare(userPassword, storedHashWithUsername[0].userPassword)) {
        return await connPool.awaitQuery("SELECT userID, username FROM user WHERE username=?", [usernameOrEmail]);
    } else if (storedHashWithPassword.length === 1 && await bcrypt.compare(userPassword, storedHashWithPassword[0].userPassword)) {
        return await connPool.awaitQuery("SELECT userID, username FROM user WHERE email=?", [usernameOrEmail]);
    } else {
      return false;
    }
  } catch (error) {
    console.error(error.message);
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

async function createPost(post, userID) {
  try {
    const result = await connPool.awaitQuery("INSERT INTO post (postText, userID, timeEditedOrCreated, likes) VALUES (?, ?, CURRENT_TIMESTAMP, 0);", [post, userID]);
    return result.affectedRows == 1;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

async function editPost(postID, postToEdit) {
  try {
    const result = await connPool.awaitQuery("UPDATE post SET postText=?, timeEditedOrCreated=CURRENT_TIMESTAMP WHERE postID=?", [postToEdit, postID]);
    return result.affectedRows == 1;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

async function updateLikes(postID) {
  try {
    const result = await connPool.awaitQuery("UPDATE post SET likes=likes+1 WHERE postID=?;", [postID]);
    return result.affectedRows == 1;
  } catch (error) {
    console.log(error.message);
    return false;
  } 
}

async function getAllPosts(sortingMethod) {
  try {
    let result = null;
    if (sortingMethod === 'newest') {
      result = await connPool.awaitQuery("SELECT * FROM post JOIN user ON post.userID = user.userID ORDER BY timeEditedOrCreated DESC;");
    } else if (sortingMethod === 'likeCount') {
      result = await connPool.awaitQuery("SELECT * FROM post JOIN user ON post.userID = user.userID ORDER BY likes DESC;");
    } else {
      return false;
    }

    // Empty
    if (result.length == 0) {
      return [];
    }

    if (result.length >= 1) {
      return result;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

async function deletePost(postID) {
  try {
    let result = await connPool.awaitQuery("DELETE FROM post WHERE postID=?;", [postID]);
    return result.affectedRows === 1;
  } catch(error) {
    console.log(error.message)
    return false;
  }
}

async function checkPostOwner(userID, postID) {
  try {
    let result = await connPool.awaitQuery("SELECT userID FROM post WHERE userID=? AND postID=?;", [userID, postID]);
    return result.length === 1;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

// checkPostOwner(10,102).then(console.log)

module.exports = {checkUserExists, addUser, loginUser, createPost, getAllPosts, updateLikes, deletePost, editPost, checkPostOwner}