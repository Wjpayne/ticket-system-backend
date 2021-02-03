const { UserSchema } = require("./UserSchema");

const insertUser = (user) => {
    return new Promise((resolve, reject) => {
        UserSchema(user)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));

    })
};


module.exports = {
    insertUser,
}