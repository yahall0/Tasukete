const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    volunteers: [{
        type: mongoose.Types.ObjectId,
        ref: 'Volunteer'
    }],
    reports: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
}) 

requestSchema.virtual("properties.popUpMarker").get(function() {
    this.populate("author")
    return `${this.title}  ${this.date} ${this.author.username}`
})

const Request = mongoose.model("Request", requestSchema)



module.exports = Request