/*
 * Idea from the following sources:
 * https://www.passportjs.org/
 * https://blog.risingstack.com/node-hero-node-js-authentication-passport-js/
 * https://juejin.cn/post/6844903434265559054
 * https://www.youtube.com/watch?v=6FOq4cUdH8k
 * https://www.bilibili.com/video/BV1mQ4y1C7Cn/?spm_id_from=333.337.search-card.all.click&vd_source=bfa6992d87ca52dd825f32026f176e7a
 *
 * And the following repositories:
 * https://github.com/bradtraversy/node_passport_login
 */

// Load environment variables in development mode
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Import required libraries
const express = require("express");
const app = express();
const bcrypt = require("bcrypt"); // For password hashing
const passport = require("passport"); // For authentication
const flash = require("express-flash"); // For displaying messages
const session = require("express-session"); // For handling sessions
const methodOverride = require("method-override"); // For HTTP method overriding
const bodyParser = require("body-parser"); // For parsing request body

const mysql = require("mysql2"); // MySQL client

// Define the MySQL connection
const connection = mysql.createConnection({
  host: "db-mysql-cse135-monster-do-user-13928624-0.b.db.ondigitalocean.com",
  port: "25060",
  user: "doadmin",
  password: "AVNS_bqxqJL1DWue3xadCli8",
  database: "Reporting",
});

// Connect to the MySQL server
connection.connect(function (err) {
  if (err) throw err;
});

let users = []; // Users array to store user data

// Import and initialize passport configuration
const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) =>
    users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() ||
        user.name.toLowerCase() === email.toLowerCase()
    ),
  (id) => users.find((user) => user.id === id)
);

// Retrieve all users from database (Not a good practice for production)
connection.query("SELECT * FROM user;", (err, rows, fields) => {
  rows.forEach((row) => {
    users.push({
      id: row["id"],
      isAdmin: row["isAdmin"],
      name: row["name"],
      email: row["email"],
      password: row["password"],
    });
  });
});

app.set("view-engine", "ejs"); // Set view engine to ejs

// Middleware configurations
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: "super_secret!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Create application/json parser
var jsonParser = bodyParser.json();
app.use(jsonParser); // Add parser for JSON

// Define routes
app.get("/", checkAuthenticated, (req, res) => {
  console.log("/");
  res.setHeader("Cache-Control", "no-cache");
  console.log(users);
  res.render("./authapp/index.ejs", {
    name: req.user.name,
    isAdmin: users.find(
      (u) => req.user.name.toLowerCase() === u.name.toLowerCase()
    ).isAdmin,
  });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.render("./authapp/login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {
    res.render("./authapp/index.ejs", {
      name: req.user.name,
      isAdmin: users.find(
        (u) => req.user.name.toLowerCase() === u.name.toLowerCase()
      ).isAdmin,
    });
  }
);

app.post("/users", checkAuthenticated, (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.render("./authapp/users.ejs");
});

app.post("/report", checkAuthenticated, (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.render("./authapp/report.ejs");
});

// CRUD routes
app.get("/usercrud", (req, res) => {
  connection.query("SELECT * from user;", (err, rows, fields) => {
    // rows[foo] = 'bar';
    res.json(rows);
    // res.json({foo:'bar'});
  });
});
app.post("/usercrud", async (req, res) => {
  if (
    req.body.name != "" &&
    req.body.email != "" &&
    req.body.password != "" &&
    req.body.isAdmin !== ""
  ) {
    if (req.body.isAdmin > 0) {
      packet_isAdmin = 1;
    } else {
      packet_isAdmin = 0;
    }

    packet_id = Date.now().toString();

    packet_name = req.body.name;
    packet_email = req.body.email;
    packet_hashedPass = await bcrypt.hash(req.body.password, 10);

    const jsonPacket = {
      name: packet_name,
      email: packet_email,
      password: packet_hashedPass,
      isAdmin: packet_isAdmin,
      id: packet_id,
    };

    users.push({
      id: packet_id,
      isAdmin: packet_isAdmin,
      name: packet_name,
      email: packet_email,
      password: packet_hashedPass,
    });

    connection.query(
      "INSERT INTO user (name, email, password, isAdmin) \
        VALUES (?, ?, ?, ?);",
      [packet_name, packet_email, packet_hashedPass, packet_isAdmin],
      (err, rows, fields) => {
        console.log("query success, user added");
      }
    );

    res.json(jsonPacket);
  } else {
    res.sendStatus(400);
  }
});
app.delete("/usercrud/:id", (req, res) => {
  // Delete from users
  users = users.filter((user) => user.id != req.params.id);

  connection.query(
    "DELETE FROM user WHERE id = ?;",
    [req.params.id],
    (err, rows, fields) => {}
  );

  res.sendStatus(200);
});
app.patch("/usercrud/:id", async (req, res) => {
  // Update users
  usersIndex = users.findIndex((user) => user.id == req.params.id);
  key = Object.keys(req.body)[0];

  if (key == "isAdmin" && req.body[key] === "") req.body[key] = 0;

  if (key === "password") {
    const hashedPassword = await bcrypt.hash(req.body[key], 10);
    users[usersIndex][key] = hashedPassword;
  } else {
    users[usersIndex][key] = req.body[key];
  }
  // users[usersIndex][key] = req.body[key];

  // Update SQL
  connection.query(
    "INSERT INTO user (name, email, password, isAdmin, id) \
     VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, email = ?, password = ?, isAdmin = ?, id = ?;",
    [
      users[usersIndex]["name"],
      users[usersIndex]["email"],
      users[usersIndex]["password"],
      users[usersIndex]["isAdmin"],
      users[usersIndex]["id"],
      users[usersIndex]["name"],
      users[usersIndex]["email"],
      users[usersIndex]["password"],
      users[usersIndex]["isAdmin"],
      users[usersIndex]["id"],
    ],
    (err, rows, fields) => {}
  );

  res.sendStatus(200);
});

// UPDATE row
app.put("/usercrud/:id", async (req, res) => {
  // Update users
  usersIndex = users.findIndex((user) => user.id == req.params.id);
  users[usersIndex].name = req.body.name;
  users[usersIndex].email = req.body.email;

  if (
    req.body.password !== undefined &&
    req.body.password !== users[usersIndex].password
  ) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users[usersIndex].password = hashedPassword;
  } else {
    users[usersIndex].password = req.body.password;
  }

  if (req.body.isAdmin === "") req.body.isAdmin = 0;

  users[usersIndex].isAdmin = req.body.isAdmin;
  users[usersIndex].id = req.body.id;

  // console.log(users);

  // Update SQL
  connection.query(
    "INSERT INTO user (name, email, password, isAdmin, id) \
     VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, email = ?, password = ?, isAdmin = ?, id = ?;",
    [
      users[usersIndex]["name"],
      users[usersIndex]["email"],
      users[usersIndex]["password"],
      users[usersIndex]["isAdmin"],
      users[usersIndex]["id"],
      users[usersIndex]["name"],
      users[usersIndex]["email"],
      users[usersIndex]["password"],
      users[usersIndex]["isAdmin"],
      users[usersIndex]["id"],
    ],
    (err, rows, fields) => {}
  );

  res.sendStatus(200);
});

// New route for logout page
app.get("/logout", (req, res) => {
    res.render("./authapp/logout.ejs");
  });


// Logout route
app.post("/logout", (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.render("./authapp/logout.ejs");
    // res.redirect("/login");
  });
});

app.get('/bounce', checkNotAuthenticated, (req, res) => {
  res.render('./authapp/bounce.ejs')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('./authapp/register.ejs')
})


app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    userID = Date.now().toString()
    users.push({
      id: userID,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    // Change users to work with our sql server
    // Storing into SQL server
    connection.query("INSERT INTO user (name, email, password, isAdmin, id) VALUES (?, ?, ?, ?, ?);",
      [req.body.name, req.body.email, hashedPassword, 0, userID],
      (err, rows, fields) => { }
    );
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

// Auth check middleware
function checkAuthenticated(req, res, next) {
  console.log("checkAuthenticated");
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}


// Start server
app.listen(3300, () => {
  console.log("Server started on port 3300");
});
