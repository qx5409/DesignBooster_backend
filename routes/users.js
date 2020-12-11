var express = require("express");
var router = express.Router();
var User = require("../model/User.js");
let { authorize, signAsynchronous } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "secretDesign";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // in seconds // 24 * 60 * 60 * 1000 = 24h


/* Register a user : POST /users/register */
router.post("/register", function (req, res, next) {
  console.log("POST users/", User.list);
  console.log("email:", req.body.email);
  if (User.isUser(req.body.email)) return res.status(409).end();
  let newUser = new User(req.body.username, req.body.email, req.body.password);
  newUser.save().then(() => {
    console.log("afterRegisterOp:", User.list);
    jwt.sign(
      { username: newUser.username },
      jwtSecret,
      { expiresIn: LIFETIME_JWT },
      signAsynchronous(newUser, (err, token) => {
        if (err) {
          console.error("POST users/ :", err);
          return res.status(500).send(err.message);
        }
        console.log("POST users/ token:", token);
        return res.json({ username: req.body.email, token });
      })
    );
  });
});

/* login a user : POST /auths/login */
router.post("/login", function (req, res, next) {
  let user = new User(req.body.username, req.body.email, req.body.password);
  console.log("POST users/login:", User.list);
  user.checkCredentials(req.body.email, req.body.password).then((match) => {
    if (match) {
      jwt.sign(
        { username: user.username },
        jwtSecret,
        { expiresIn: LIFETIME_JWT },
        (err, token) => {
          if (err) {
            console.error("POST users/ :", err);
            return res.status(500).send(err.message);
          }
          console.log("POST users/ token:", token);
          return res.json({ username: user.username, token });
        }
      );
    } else {
      console.log("POST users/login Error:", "Unauthentified");
      return res.status(401).send("bad email/password");
    }
  });
});

module.exports = router;
