const express = require("express");
const router = express.Router();
const { insertUser } = require("../Model/User/UserModel");
const { hashPassword } = require("../Helper/BcryptHelper");

router.all("/", (req, res, next) => {
  //   res.json({ message: "return user" })
  next();
});

router.post("/add", async (req, res) => {
  const { name, email, password, company } = req.body;
  try {
    const hashed = await hashPassword(password);

    const newUser = {
      name,
      email,
      password: hashed,
      company,
    };
    const result = await insertUser(newUser);
    res.json({ message: "User Created", result });
  } catch (error) {
    res.json({ message: error, status: "error" });
  }
});

module.exports = router;
