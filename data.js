require('dotenv').config()
const mysql = require(`mysql-await`);
const bcrypt = require('bcrypt');

var connPool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: process.env.DB_USER,
  database: process.env.DB,
  password: process.env.DB_PASSWORD,
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

module.exports = {checkUserExists, addUser, loginUser, createPost, getAllPosts, updateLikes, deletePost, editPost, checkPostOwner}