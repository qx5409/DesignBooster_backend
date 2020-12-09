var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const listDesign = [
  {
    id: 1,
    name: "name",
    images: "base64",
    description: "Super design",
    feature: "Liste des features",
    imageIncluded: "true",
    videoIncluded: "false",
    firstName: "firstName",
    lastName: "lastName",
    facebook: "url facebook",
    email: "email@mail.com",
    instagram: "url insta",
    linkedin: "url linkedin"
  }
];

const jwtSecret = "secretDesign";
/* GET /designs : list all the designs from the listDesign */
router.get("/", function (req, res, next) {
  res.json(listDesign);
});

/* POST /designs : create a design to be added to the listDesign 
Return the new design
This ressource operation shall be authorized only to designadmin and protected via a JWT !*/
router.post("/", function (req, res, next) {
  /* To authorize the access: 
  Get token from authorization header */
  let token = req.get("authorization");

  if (!token) return res.status(401).send("You are not authenticated.");

  jwt.verify(token, jwtSecret, (err, token) => {
    if (err) return res.status(401).send(err.message);
    if (token.username !== "designAdmin")
      return res.status(403).send("You are not authorized.");
    const newDesign = {
      id: listDesign.length + 1,
      name: req.body.name,
      title: req.body.title,
      content: req.body.content,
      images: req.body.images,
      description: req.body.description,
      feature: req.body.feature,
      imageIncluded: req.body.imageIncluded,
      videoIncluded: req.body.videoIncluded,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      facebook: req.body.facebook,
      email: req.body.email,
      instagram: req.body.instagram,
      linkedin: req.body.linkedin
    };
    listDesign.push(newDesign);
    return res.json(newDesign);
  });
});

module.exports = router;
