const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleID: {
        type: String
    },
    picture: {
        type: String
    },
    username: {
        type: String
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User;