const express = require("express");
const router = express.Router();

router.all("/", (req, res, next) => {
//   res.json({ message: "return user" })
  next();
});

router.post("/", (req, res) => {
    console.log(req.body)
    res.json(req.body)
   
});

module.exports = router;
