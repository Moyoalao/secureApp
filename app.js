const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const saltRounds=10;
const sanitizeHtml =require('sanitize-html');
const app = express();
const port = 8001;



let username = "admin";
let password = "0000"

// Setup database 
let db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to SQlite database.');
});

// Create users table 
db.run('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
db.run('CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY, content TEXT ,FOREIGN KEY(userID) REFERENCES users(id))');

app.use(bodyParser.urlencoded({ extended: true }));

process.on('exit', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});


//home
app.get('/', (req, res) => {
  res.send(`
  <h1 style="text-align:center; color: #333;">Blog</h1>
  
  <nav style="background-color: #f8f9fa; padding: 10px; box-shadow: 0 2px 4px rgba(0,0,0,.1);">
      <ul style="list-style-type: none; margin: 0; padding: 0; overflow: hidden;">
          <li style="float: left;"><a href="/register" style="display: block; color: black; text-align: center; padding: 14px 16px; text-decoration: none;">Register</a></li>
          <li style="float: left;"><a href="/Login" style="display: block; color: black; text-align: center; padding: 14px 16px; text-decoration: none;">Login</a></li>
          <li style="float: left;"><a href="/new-post" style="display: block; color: black; text-align: center; padding: 14px 16px; text-decoration: none;">New Post</a></li>
          <li style="float: left;"><a href="/posts" style="display: block; color: black; text-align: center; padding: 14px 16px; text-decoration: none;">View Post</a></li>
      </ul>
  </nav>

  `);
});

//register
app.get('/register', (req, res) => {
    res.send(`
      <h2>Register</h2>

      <form method="POST" action="/register">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>

      <a href="/">Back</a>
    `);
  });
  
  app.post('/register', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Secure: Storing hashed passwords
        const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
        db.run(query, [username, hash], function(err) {
            if (err) {
                return console.error(err.message);
            }
            res.send("Registered successfully!");
        });
    });
});

  //Login
  app.get('/login', (req, res) => {
    res.send(`
      <h2>Login</h2>

      <form method="POST" action="/login">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      <a href="/">Back</a>
    `);
  });
  
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT password FROM users WHERE username = ?`;
    db.get(query, [username], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (row) {
            // secure: Password
            bcrypt.compare(password, row.password, function(err, result) {
                if (result) {
                    res.send("Logged in successfully!");
                } else {
                    res.send("Login failed.");
                }
            });
        } else {
            res.send("Login failed.");
        }
    });
});

  //post
app.get('/new-post', (req, res) => {
    res.send(`
      <h2>Create a New Post</h2>

      <form method="POST" action="/new-post">
        <textarea name="content" placeholder="Write something..." required></textarea>
        <button type="submit">Post</button>
      </form>

      <a href="/">Back</a>
    `);
});

app.post('/new-post', (req, res) => {
    const { content } = req.body;
    //secure: stopped xss
    const sanitizeContent = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2']),
        allowedAttributes: false,

    });
    const query = `INSERT INTO posts (content) VALUES (?)`;
    db.run(query, [sanitizeContent], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.redirect('/posts');
    });
});

app.get('/posts', (req, res) => {
  const query = `SELECT * FROM posts`;
  db.all(query, [], (err, rows) => {
      if (err) {
          return console.error(err.message);
      }
      let postsHTML = rows.map(row => 
          `<div style="margin: 20px; padding: 10px; border: 1px solid #ddd;">${row.content}</div>`
      ).join('');
      res.send(`
        <h2 style="color: navy;">All Posts</h2>
        ${postsHTML}
        <a href="/new-post" style="color: green;">Create a New Post</a>

        <a href="/">Back</a>
      `);
  });
});

//admin user
const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
db.run(query, [username, password], function(err) {
    if (err) {
        return console.error(err.message);
    }
    console.log("Admin user added successfully");
});



