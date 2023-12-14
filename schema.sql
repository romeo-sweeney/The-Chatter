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

CREATE TABLE posts (
  id INT NOT NULL AUTO_INCREMENT,
  post VARCHAR(200),
  userID INT NOT NULL,
  FOREIGN KEY (userID) REFERENCES user(id),
  PRIMARY KEY (id)
);

-- inserting a admin user (me)
INSERT INTO user (firstName, lastName, username, userPassword, email)
VALUES ('Romeo', 'Sweeney', 'admin', 'password', 'sween461@umn.edu');


-- create table sale (
--   id int not null auto_increment,
--   saleText text,
--   startTime timestamp not null,
--   endTime timestamp,
--   primary key(id)
-- );

-- -- Adding sale without end date
-- INSERT INTO sale (saleText, startTime) VALUES ('40% on top of everything', CURRENT_TIMESTAMP);
-- INSERT INTO sale (saleText, startTime) VALUES ('11% off every two weeks for some reason', CURRENT_TIMESTAMP);
-- INSERT INTO sale (saleText, startTime) VALUES ('GIVEAWAY SALE UP TO 80%', CURRENT_TIMESTAMP);
-- INSERT INTO sale (saleText, startTime) VALUES ('GIVEAWAY SALE UP TO 100%', CURRENT_TIMESTAMP);

-- -- Updating all active sale to be inactive, meaning that they have been completed and endTime is not null anymore.
-- UPDATE sale
-- SET endTime = CURRENT_TIMESTAMP
-- WHERE endTime IS NULL;

-- -- SQL query to get most recent sales
-- -- This will order by the most recent sales (AKA the greatest timestamp, so DESC order)
-- SELECT * FROM sale ORDER BY startTime DESC LIMIT 3;





-- -- Create contacts table.
-- create table contacts (
--   id int not null auto_increment,
--   contactName text not null,
--   contactEmail text not null,
--   dateScheduled date,
--   apptType text,
--   serviceType text,
--   paymentType text,
--   primary key(id)
-- );

-- INSERT INTO contacts (contactName, contactEmail, dateScheduled, apptType, serviceType, paymentType)
-- VALUES ('Person 1', 'test1@email.com', '2025-01-12', 'in person', 'In Store Purchase', 'No');

-- INSERT INTO contacts (contactName, contactEmail, dateScheduled, apptType, serviceType, paymentType)
-- VALUES ('Person 2', 'test2@email.com', '2024-01-01', 'virtual', 'One Lesson ($20)', 'No');

-- insert into contacts (contactName, contactEmail, dateScheduled, apptType, serviceType, paymentType)
-- values ('Person 3', 'test3@email.com', '2026-03-09', 'in person', 'Unlimited Plan ($50/month)', 'Yes');
