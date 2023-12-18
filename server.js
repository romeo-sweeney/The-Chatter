// Objects
const data = require('./data');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

// Variables
const app = express();
const port = 4131;
const saltRounds = 10;

// Middleware
app.use(session({
  secret: 'fjdv8982++_&554vmd??ji',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/resources', express.static('resources'));

// Setting pug templates
app.set("views", "templates");
app.set("view engine", "pug");

// Routes
app.get('/', (req, res) => {
  res.render("landingPage");
});

app.get('/main', (req, res) => {
  res.render("landingPage");
});

app.get('/login', (req, res) => {
  res.render("login");
});

app.get('/signup', (req, res) => {
  res.render("signup");
});

app.post('/loggedIn', (req, res) => {
  try {
    if (!req.body || !req.body.usernameOrEmail || !req.body.userPassword) {
      res.status(400).send('Bad Request: usernameOrEmail or userPassword is missing');
      return;
    }

    data.loginUser(req.body.usernameOrEmail, req.body.userPassword)
      .then((result) => {
        if (result) {
          // Login success, set session to userID and redirect to main page
          req.session.user = { userID: result[0].userID, username: result[0].username, sortingMethod: 'newest' };
          res.redirect("/dashboard");
        } else {
          // Login failed, render login page with error message
          res.render("login", { errorMessage: "Incorrect username or password, please try again" });
        }
      })
      .catch((error) => {
        console.error(error.message);
        res.render("login");
      });
  } catch (error) {
    console.log('Error in /loggedIn: ', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/signupPost', async (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.userPassword || !req.body.email) {
      res.status(400).send('Bad Request: One or more sign up fields missing');
      return;
    }
    
    const userExists = await data.checkUserExists(req.body.username, req.body.email);

    if (userExists) {
      console.log("User already exists in the database. Redirecting to login.");
      res.redirect("/login");
    }

    // password hasing where saltRounds = 10
    const password = req.body.userPassword;
    const salt = await bcrypt.genSalt(saltRounds);
    
    const hashedPassword = await bcrypt.hash(password, salt);
    const addUserResult = await data.addUser(req.body.firstName, req.body.lastName, req.body.username, hashedPassword, req.body.email);

    if (addUserResult) {
      console.log("Success adding user to the database. Redirecting to login.");
      res.redirect("/login");
    } else {
      console.log("Failed adding user to the database. Redirecting to signup.");
      res.render("signup");
    }
  } catch (error) {
    console.log('Error in /signupPost: ', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/dashboard', (req, res) => {
  try {
    if (!req.session.user || !req.session.user.username || !req.session.user.username) {
      console.log("Error getting the user's sesion, redirecting to log in");
      res.redirect('/login');
      return;
    }

    // Checks if the user is authenticated using session
    let page = parseInt(req.query.page ?? 1)
    if (!page) {
        page = 1;
    }
    let offset = (page-1)*5
    const display = {username: req.session.user.username} 
    const sortingMethod = req.session.user.sortingMethod;
    data.getAllPosts(sortingMethod)
    .then((posts)=> {
      if (posts) {
        let pagedPosts = posts.slice(offset, offset+5);
        res.render("dashboard", { pagedPosts, display, page, sortingMethod})
      } else {
        console.log("error, could not get the posts");
        res.status(500).send('Internal server error');
      }
    })
    .catch(error=>{
      console.log('Error rendering dashboard: ', error.message);
      res.status(500).send('Internal Server Error');
    })
  } catch (error) {
    console.log('Error in /dashboard: ', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/publishPost', (req, res) => {
  try {
    if (!req.body || !req.body.createPostTextArea || !req.session.user || !req.session.user.userID) {
      console.log('Error, missing publishPost fields: ', error.message);
      res.redirect('/dashboard');
    }
    const post = req.body.createPostTextArea;
    data.createPost(post, req.session.user.userID)
    .then((result) => {
      if (result) {
        res.redirect('/dashboard');
      } else {
        console.error(error.message);
        res.redirect('/dashboard');
      }
    })
    .catch((error) => {
      console.error(error.message);
      res.redirect('/dashboard');
    });
  } catch (error) {
    console.log('Error in /publishPost: ', error.message);
    res.status(500).send('Internal Server Error');
  }
})

app.post('/edit/:postID', (req, res) => {
  try {
    if (!req.params.postID || !req.body.editPostTextArea) {
      console.log('Error, missing edit post fields: ', error.message);
      res.redirect('/dashboard');
    }

    const postID = req.params.postID;
    const postToEdit =req.body.editPostTextArea;
    data.editPost(postID, postToEdit)
    .then((result) => {
      if (result) {
        res.redirect('/dashboard');
      } else {
        console.log('Error in editPost(): ', error.message);
        res.status(500).send('Internal Server Error');
      }
    })
    .catch((error) => {
      console.log('Error in /edit/:postID: ', error.message);
      res.status(500).send('Internal Server Error');
    });
  } catch(error) {
    console.log('Error in /edit/:postID: ', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/api/like', (req, res) => {
  
  if (!req.body || !req.body.postID) {
    res.status(400).send('Bad Request: postID is missing in the request body');
    return;
  }

  const postID = req.body.postID;
  data.updateLikes(postID)
  .then(result=>{
    if (result) {
      res.status(200).send('Like incremented for postID: '+ postID);
    } else {
      console.log("error in PUT /api/like");
      res.status(500).send('Internal Server Error');
    }
  })
  .catch(error=> {
    console.log('Error in /api/like: ', error.message);
    res.status(500).send('Internal Server Error');
  });
})

app.put('/api/sortingMethod', (req, res) => {
  try {
    if (!req.body || !req.body.sortingMethod) {
      res.status(400).send('Bad Request: Sorting method is missing in the request body');
      return;
    }

    req.session.user.sortingMethod = req.body.sortingMethod;
    res.status(200).send('Success');
  } catch (error) {
    console.error('Error in /api/sortingMethod:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


app.delete('/api/deletePost', (req, res) => {
  try {
    if (!req.body || !req.body.postID) {
      res.status(400).send('Bad Request: DeletePost is missing fields');
      return;
    }

    data.checkPostOwner(req.session.user.userID, req.body.postID)
    .then((result) => {
      if (!result) {
        res.status(400).send("Can not delete other user's post");
        return;
      }

      const postID = req.body.postID;
      data.deletePost(postID)
      .then((result) => {
        if (result) {
          res.status(200).send('Post deleted for postID: '+ postID);
        } else {
          res.status(404).send('Could not delete postID: '+ postID);
        }
      })
      .catch((error)=> {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
      })
    })
    .catch((error)=> {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    })
  } catch (error) {
    console.error('Error in /api/deletePost:', error.message);
    res.status(500).send('Internal Server Error');
  }
})

app.put('/api/checkEditingRights', (req, res) => {
  try {
    if (!req.session.user.userID || !req.body.postID) {
      res.status(400).send("Could not get user's credentials.");
    }
    data.checkPostOwner(req.session.user.userID, req.body.postID)
      .then((result) => {
        if (!result) {
          res.status(400).send("Can not edit other user's post");
          return;
        }
        res.status(200).send("Editing rights granted");
      })
      .catch((error)=> {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
      });
  } catch(error) {
    console.error('Error in /api/checkEditingRights:', error.message);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/logout', (req, res) => {
  // Destroy the session on logout
  req.session.destroy((err) => {
    if (err) {
      console.error(err.message);
    }
    res.redirect('/login');
  });
});

// Catch-all route
app.use((req, res, next) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log("Server is running on: http://localhost:4131/");
});
