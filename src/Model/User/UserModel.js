const { UserSchema } = require("./UserSchema");


//add user

const insertUser = (user) => {
  return new Promise((resolve, reject) => {
    UserSchema(user)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

//get user by email

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

//get user by ID

const getUserById = (_id) => {
    return new Promise((resolve, reject) => {
      if (!_id) return false;
  
      try {
        UserSchema.findOne({ _id }, (error, data) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          resolve(data);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const storeUserRefreshJWT = (_id, token) => {
    return new Promise((resolve, reject) => {
      try {
        UserSchema.findOneAndUpdate(
          { _id },
          {
            $set: { "refreshJWT.token": token, "refreshJWT.addedAt": Date.now() },
          },
          { new: true }
        )
          .then((data) => resolve(data))
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

module.exports = {
  insertUser,
  getUserByEmail,
  storeUserRefreshJWT,
  getUserById,
};
