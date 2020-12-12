"use strict";
var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const Design = require("../model/Design");

const jwtSecret = "secretDesign";

/* GET /designs : list all the designs from designs.json */
router.get("/", function (req, res, next) {
  return res.json(Design.list);
});

// Read an identified design : GET /api/designs/:id
router.get("/:id", function (req, res) {
  const designFound = Design.get(req.params.id);
  if (!designFound) return res.status(404).end();

  return res.json(designFound);
});

/* POST /designs : create a design to be added to designs.json
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
    
    let newDesign = new Design(req.body);
    newDesign.save();
    return res.json(newDesign);
  });
});

// Update a design : PUT /api/designs/:id
router.put("/:id", function (req, res) {
  const designUpdated = Design.update(req.params.id, req.body);
  if (!designUpdated) return res.status(404).end();
  return res.json(designUpdated);
});

// Delete a design : DELETE /api/designs/:id
router.delete("/:id", function (req, res) {
  const designDeleted = Design.delete(req.params.id);
  if (!designDeleted) return res.status(404).end();
  return res.json(designDeleted);
});

module.exports = router;
