-- I want a user table
-- I want a table for all the posts
-- I want to be able to tie the users to the posts

CREATE TABLE user (
  id INT NOT NULL AUTO_INCREMENT,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  username VARCHAR(20) NOT NULL,
  userPassword VARCHAR(200) NOT NULL,
  email VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (username),
  UNIQUE KEY (email)
);

CREATE TABLE post (
  id INT NOT NULL AUTO_INCREMENT,
  postText VARCHAR(200),
  userID INT NOT NULL,
  FOREIGN KEY (userID) REFERENCES user(id),
  PRIMARY KEY (id)
);

-- inserting a admin user (me)
INSERT INTO user (firstName, lastName, username, userPassword, email)
VALUES ('Romeo', 'Sweeney', 'admin', 'password', 'sween461@umn.edu');

-- inserting a post as admin user
INSERT INTO post (postText, userID)
VALUES ('First Post', '1');

-- I want to find the name of the author (username) given 'postT'
SELECT username 
FROM user 
INNER JOIN post
ON user.userID = post.userID
WHERE post = 'First Post';