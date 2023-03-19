const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

// JWT configuration
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "your_secret_key",
};

// Passport JWT strategy
passport.use(
  new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    const user = users.find((user) => user.id === jwtPayload.id);

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);

// Generate a JWT token
function generateJwtToken(user) {
  const payload = { id: user.id, name: user.name };
  return jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: "1h" });
}

// Authentication middleware
const isAuthenticated = passport.authenticate("jwt", { session: false });

// Define a login endpoint
app.post("/login", (req, res) => {
  const { name } = req.body;
  const user = users.find((user) => user.name === name);

  if (user) {
    const token = generateJwtToken(user);
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

const users = [
  { id: 1, name: "Amir" },
  { id: 2, name: "John" },
  { id: 3, name: "Stacy" },
];

// Define an API endpoint that retrieves data from an external API
app.get("/data", isAuthenticated, async (req, res, next) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error(error);
    next(new Error("Error retrieving data"));
  }
});

app.get("/hello", (req, res) => {
  res.send("Hello, world!");
});

app.get("/users", isAuthenticated, (req, res) => {
  res.send(users);
});

app.post("/users", isAuthenticated, (req, res) => {
  const newUser = { id: 4, name: "Jane" };
  users.push(newUser);
  res.send(users);
});

app.put("/users/:id", isAuthenticated, (req, res) => {
  const userId = req.params.id;
  const userName = req.body.name;
  const user = users.find((user) => user.id === parseInt(userId));
  if (user) {
    user.name = userName;
    res.send(users);
  } else {
    res.status(404).send("User not found");
  }
});

app.delete("/users/:id", isAuthenticated, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).send("User not found");
  }
  users.splice(userIndex, 1);
  res.send(users);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
