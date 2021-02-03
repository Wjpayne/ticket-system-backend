const { UserSchema } = require("./UserSchema");

const insertUser = (user) => {
  return new Promise((resolve, reject) => {
    UserSchema(user)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    if (!email) return false;

    try {
      UserSchema.findOne({ email }, (error, data) => {
        if (error) {
          resolve(error);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  insertUser,
  getUserByEmail,
};
