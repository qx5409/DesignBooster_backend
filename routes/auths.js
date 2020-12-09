var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = "secretDesign";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // in seconds // 24 * 60 * 60 * 1000 = 24h
const { users, authorize } = require("../utils/auths");


/* Register a user : POST /auths/register */
router.post("/register", function (req, res, next) {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
  };
  users.push(newUser);
  const authenticatedUser = {
    username: req.body.username,
    token: "Future signed token",
  };

  jwt.sign(
    { username: authenticatedUser.username }, // session data in the payload
    jwtSecret, // secret used for the signature
    { expiresIn: LIFETIME_JWT }, // lifetime of the JWT
    (err, token) => {
      // callback that is called after the signature process of the token, providing either the token or an error
      if (err) {
        console.error("POST auths/login/ :", err);
        return res.status(500).send(err.message);
      }
      authenticatedUser.token = token;
      return res.json(authenticatedUser);
    }
  );
});

/* login a user : POST /auths/login */
router.post("/login", function (req, res, next) {
  // check if username exists in users
  const userFound = users.find((user) => user.username === req.body.username);
  if (!userFound) return res.status(401).send("You are not authenticated.");
  if (userFound.password !== req.body.password)
    return res.status(401).send("You are not authenticated.");

  const authenticatedUser = {
    username: req.body.username,
    token: "Future signed token",
  };

  jwt.sign(
    { username: authenticatedUser.username }, // session data in the payload
    jwtSecret, // secret used for the signature
    { expiresIn: LIFETIME_JWT }, // lifetime of the JWT
    (err, token) => {
      // callback that is called after the signature process of the token, providing either the token or an error
      if (err) {
        console.error("POST auths/login/ :", err);
        return res.status(500).send(err.message);
      }
      authenticatedUser.token = token;
      return res.json(authenticatedUser);
    }
  );
});

/* GET /auths/users : list all the users that can be authenticated 
Only authenticated users (any) can access these ressources
=> call the authorize middleware
*/
router.get("/users", authorize, function (req, res, next) { 
  return res.json(users);
});

/* GET /auths/users/unsafe : list all the users that can be authenticated 
WARNING this is a security hole !!! You shall authorize access to these ressources
router.get("/users/unsafe", function (req, res, next) {
  return res.json(users);
});*/

module.exports = router;
