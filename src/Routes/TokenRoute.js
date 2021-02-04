const express = require("express");
const router = express.Router();
const { verifyRefreshJWT, refreshJWT } = require("../Helper/JWThelper");
const { getUserByEmail } = require("../Model/User/UserModel");


//return refresh token

router.get("/", async (req, res, next) => {
  const { authorization } = req.headers;
  // make sure token is valid
  const decoded = await verifyRefreshJWT(authorization);
  if (decoded.email) {
    // check if jwt exists in database
    const userProf = await getUserByEmail(decoded.email);
    if (userProf._id) {
      let tokenExpire = userProf.refreshJWT.addedAt;
      const refreshToken = userProf.refreshJWT.token 

      tokenExpire = tokenExpire.setDate(
        tokenExpire.getDate() + +process.env.JWT_REFRESH_EXPIRE
      );

      const today = new Date();

      if ( refreshToken !== authorization && tokenExpire < today) {
       return  res.status(403).json({ message: "Forbidden" });
      }

      const accessJWT = await refreshJWT(
        decoded.email,
        userProf._id.toString()
      );

      //delete token in redis database   

      return res.json({ status: "success", accessJWT });
    }
  }

  res.json({ message: decoded });
});

//create a token

module.exports = router;
