// Imports
const data = require('./data');
const express = require('express');
const session = require('express-session');

// Objects
const app = express();
const port = 4131;

// Middleware
app.use(session({
  secret: 'fjdv8982++_&554vmd??ji',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/resources', express.static('resources'));

// Pug templates
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
        req.session.user = { userID: result[0].userID };
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

app.post('/signupPost', (req, res) => {
  data.checkUserExists(req.body.username, req.body.email)
    .then((result) => {
      if (result) {
        console.log("user already exists in db, redirecting to login");
        res.render("login");
      } else {
        data.addUser(req.body.firstName, req.body.lastName, req.body.username, req.body.userPassword, req.body.email)
          .then((result) => {
            if (result) {
              console.log("Success adding user to db, redirecting to login");
              res.render("login");
            } else {
              console.log("Failed adding user to db, redirecting to signup");
              res.render("signup");
            }
          })
          .catch((error) => {
            console.error(error.message);
            res.render("signup");
          });
      }
    })
    .catch((error) => {
      console.error(error.message);
      res.render("login");
    });
});

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
    data.getAllPosts()
    .then((posts)=> {
      if (posts) {
        let pagedPosts = posts.slice(offset, offset+5);
        res.render("dashboard", { pagedPosts, display, page })
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
