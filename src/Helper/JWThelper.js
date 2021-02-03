const jwt = require("jsonwebtoken")
require("dotenv").config();

const createJWT = (payload) => {
    const token = jwt.sign({payload}, process.env.JWT_TOKEN, {expiresIn : "15m"});

    return Promise.resolve(token)
}

const refreshJWT = (payload) => {
    const token = jwt.sign({payload}, process.env.JWT_TOKEN_REFRESH, {expiresIn: "30d"});

    return Promise.resolve(token)
}

module.exports = {
    createJWT,
    refreshJWT,
}