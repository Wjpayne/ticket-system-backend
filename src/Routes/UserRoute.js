const express = require("express");
const router = express.Router();
const { insertUser, getUserByEmail } = require("../Model/User/UserModel");
const { hashPassword, comparePassword } = require("../Helper/BcryptHelper");
const { createJWT, refreshJWT } = require("../Helper/JWThelper");

router.all("/", (req, res, next) => {
  next();
});

//create user

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

//user login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // get user with same email and password

  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid credentials" });
  }

  // check for user in database
  const user = await getUserByEmail(email);
  const passwordFromDB = user && user._id ? user.password : null;

  if (!passwordFromDB)
    return res.json({ status: "error", message: "Invalid credientials" });

  //compare passwords
  const result = await comparePassword(password, passwordFromDB);

  if (!result) {
    return res.json({ status: "error", message: "Invalid credientials" });
  }

  //create JWT for authentification

  const createToken = await createJWT(user.email);

  const refreshToken = await refreshJWT(user.email);

  res.json({
    status: "succuess",
    message: "success",
    createToken,
    refreshToken,
  });
});

module.exports = router;
