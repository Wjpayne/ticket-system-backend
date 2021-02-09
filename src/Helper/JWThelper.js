const jwt = require("jsonwebtoken");
require("dotenv").config();
const { setJWT, getJWT } = require("./RedisHelper");
const { storeUserRefreshJWT } = require("../Model/User/UserModel")

const createJWT = async (email, _id) => {
  try {
    const token = jwt.sign({ email }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });

    await setJWT(token, _id);
    return Promise.resolve(token);
  } catch (error) {
    return Promise.reject(error);
  }
};

const refreshJWT = async (email, _id) => {
  try {
    const token = jwt.sign({ email }, process.env.JWT_TOKEN_REFRESH, {
      expiresIn: "30d",
    });

    await storeUserRefreshJWT(_id, token);

    return Promise.resolve(token);
  } catch (error) {
    return Promise.reject(error);
  }
};

const verifyAccessJWT = (userJWT) => {
    try {
      return Promise.resolve(jwt.verify(userJWT, process.env.JWT_TOKEN));
    } catch (error) {
      return Promise.resolve(error);
    }
  };

  const verifyRefreshJWT = (userJWT) => {
    try {
      return Promise.resolve(jwt.verify(userJWT, process.env.JWT_TOKEN_REFRESH));
    } catch (error) {
      return Promise.resolve(error);
    }
  };

module.exports = {
  createJWT,
  refreshJWT,
  verifyAccessJWT,
  verifyRefreshJWT 
};
