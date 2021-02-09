const express = require("express");
const router = express.Router();
const { insertUser, getUserByEmail, getUserById } = require("../Model/User/UserModel");
const { hashPassword, comparePassword } = require("../Helper/BcryptHelper");
const { createJWT, refreshJWT } = require("../Helper/JWThelper");
const { auth } = require("../Middleware/auth")
const { deleteJWT } = require("../Helper/RedisHelper");


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

  const createToken = await createJWT(user.email, `${user._id}`);

  const refreshToken = await refreshJWT(user.email, `${user._id}`);

  res.json({
    status: "success",
    message: "success",
    createToken,
    refreshToken,
  });
});



//Get user profile

router.get("/get", auth, async (req, res) => {
  //this data coming form database
  const _id = req.userId;

  const userProf = await getUserById(_id);
  const { name, email } = userProf;
  res.json({
    user: {
      _id,
      name,
      email,
    },
  });
});

router.delete("/logout", auth, async (req, res) => {
  const { authorization } = req.headers;
  //this data coming form database
  const _id = req.userId;

  // 2. delete accessJWT from redis database
  deleteJWT(authorization);

  // 3. delete refreshJWT from mongodb
  const result = await storeUserRefreshJWT(_id, "");

  if (result._id) {
    return res.json({ status: "success", message: "Loged out successfully" });
  }

  res.json({
    status: "error",
    message: "Unable to log you out, please try again later",
  });
});



module.exports = router;
