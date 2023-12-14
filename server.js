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
        // Login success, set session and redirect to main page
        req.session.user = { username: req.body.usernameOrEmail };
        // res.send("success"); // Send success and redirect
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
  const posts = 
  [
    'Sed quisquam distinctio provident unde.',
    'Quis velit vel est et in.',
    'Voluptatem dolorum est consequatur in voluptas.',
    'Autem aperiam sequi dolore aliquam qui.',
    'Aspernatur beatae architecto quas omnis. I like pAspernatur beatae architecto quas omnis. I like pfkjd la jvklajvl dsjlf djsklaf jdlksa fjlkdsa jflkdsja lf jkls flk jfljas lfdjsajjkvska v. vjavjakvajjkv avjakljvakjvkaj va vjkavj vajkvjakv.  vjakjv vjajvkv vajkkjvfkjd la jvklajvl dsjlf djsklaf jdlksa fjlkdsa jflkdsja lf jkls flk'
  ]
  
  if (req.session.user) {
    // displays the logout button
    const display = true;
    res.render("dashboard", { posts, display })
  } else {
    res.redirect('/login'); // Redirect to the login page if the user is not authenticated
  }
});

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
