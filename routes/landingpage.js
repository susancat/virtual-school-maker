const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("First steps on Fetching Player Data!")
    // res.render("./players/show");
  })

  module.exports = router;