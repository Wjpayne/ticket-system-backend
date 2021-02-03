const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {type: String, required: true},    
    email: {type: String, required: true},
    company: {type: String, required: true},
    password: {type: String, required: true, minLength: 8},
    refreshJWT: {
        token: {
          type: String,
          maxlength: 500,
          default: "",
        },
        addedAt: {
          type: Date,
          required: true,
          default: Date.now(),
        },
      },
    
})

module.exports = {
    UserSchema: mongoose.model("user", UserSchema)
}