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
  data.loginUser(req.body.usernameOrEmail, req.body.userPassword)
    .then((result) => {
      if (result) {
        // Login success, set session to userID and redirect to main page
        req.session.user = { userID: result[0].userID, sortingMethod: 'newest' };
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
});

app.post('/signupPost', async (req, res) => {
  try {
    const userExists = await data.checkUserExists(req.body.username, req.body.email);

    if (userExists) {
      console.log("User already exists in the database. Redirecting to login.");
      return res.render("login");
    }

    const password = req.body.userPassword;
    const salt = await bcrypt.genSalt(saltRounds);
    
    const hashedPassword = await bcrypt.hash(password, salt);
    const addUserResult = await data.addUser(req.body.firstName, req.body.lastName, req.body.username, hashedPassword, req.body.email);

    if (addUserResult) {
      console.log("Success adding user to the database. Redirecting to login.");
      res.render("login");
    } else {
      console.log("Failed adding user to the database. Redirecting to signup.");
      res.render("signup");
    }
  } catch (error) {
    console.error(error.message);
    res.render("signup");
  }
});


app.get('/bypass', (req,res) => {
  req.session.user = { userID: '1', sortingMethod: 'newest' };
  res.redirect('/dashboard');
})

app.get('/dashboard', (req, res) => {
  // Checks if the user is authenticated using session
    if (req.session.user) {
    // displays the logout button
    let page = parseInt(req.query.page ?? 1)
    if (!page) {
        page = 1;
    }
    let offset = (page-1)*5
    const display = true;
    const sortingMethod = req.session.user.sortingMethod;
    data.getAllPosts(sortingMethod)
    .then((posts)=> {
      console.log(posts)
      if (posts) {
        console.log('in hereee');
        let pagedPosts = posts.slice(offset, offset+5);
        res.render("dashboard", { pagedPosts, display, page, sortingMethod})
      } else {
        console.log("error, could not get the posts");
        res.redirect("/404");
      }
    })
    .catch(error=>{
      console.log(error.message);
      res.redirect('/404');
    })
  } else {
    res.redirect('/login'); // Redirect to the login page if the user is not authenticated
  }
});

app.post('/publishPost', (req, res) => {
  const post = req.body.createPostTextArea;
  data.createPost(post, req.session.user.userID)
  .then((result) => {
    if (result) {
      // print success message on frontend
      res.redirect('/dashboard');
    } else {
      res.redirect('/404');
    }
  })
  .catch((error) => {
    console.error(error.message);
    res.redirect('/dashboard');
  });
})

app.post('/edit/:postID', (req, res) => {
  const postID = req.params.postID;
  const postToEdit =req.body.editPostTextArea;
  data.editPost(postID, postToEdit)
  .then((result) => {
    if (result) {
      res.redirect('/dashboard');
    } else {
      res.redirect('/404');
    }
  })
  .catch((error) => {
    console.error(error.message);
    res.redirect('/dashboard');
  });
});

app.put('/api/like', (req, res) => {
  const postID = req.body.postID;
  data.updateLikes(postID)
  .then(result=>{
    if (result) {
      res.status(200).send('Like incremented for postID: '+ postID);
    } else {
      console.log("error in PUT /api/like");
    }
  })
  .catch(error=> {
    console.log(error.message);
  });
})

app.put('/api/sortingMethod', (req, res) => {
  req.session.user.sortingMethod = req.body.sortingMethod;
  res.status(200).send('success');
})

app.delete('/api/deletePost', (req, res) => {
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
  })
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
