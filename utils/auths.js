const jwt = require("jsonwebtoken");

const jwtSecret = "secretDesign";

// the intial list of potential authenticated users
const users = [
  { username: "designAdmin", password: "DesignAdmin" },
  { username: "guest", password: "Guest" },
];

/**
 * Authorize middleware to be used on the routes to be secured/
 * This middleware authorize only user that have a valid JWT
 * and which are still present in the list of potential authenticated users
 */

const authorize = (req, res, next) => {
  /* To authorize the access: 
  Get token from authorization header */
  let token = req.get("authorization");


  if (!token) return res.status(401).send("You are not authenticated.");

  jwt.verify(token, jwtSecret, (err, token) => {
    if (err) return res.status(401).send(err.message);
    // check if token.username exists in users
    const userFound = users.find((user) => user.username === token.username);
    if (!userFound) return res.status(403).send("You are not authorized.");
    next(); // call the next Middleware => see /routes/auths.js GET /auths/users
  });
};

module.exports = { authorize, users };
