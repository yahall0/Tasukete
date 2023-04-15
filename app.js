if(process.env.NODE_ENV !== 'production')
{
    require("dotenv").config()
}


const express = require("express")
const ejsmate = require("ejs-mate")
const path = require("path")
const mongoose = require("mongoose")

app = express()
app.set("view engine", 'ejs')
app.use(express.urlencoded({ extended: true }))
app.set("views", path.join(__dirname, 'views'))
app.engine('ejs', ejsmate)
app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect("mongodb://localhost:27017/Tasukete")
    .then(() => {
        console.log("Connected to mongoose")
    })
    .catch(() => {
        console.log("Connection to mongoose could not be established")
    })

const mapboxToken = process.env.MAPBOX_TOKEN
test = "hey"
app.get("/", (req, res) => {
    res.render("home.ejs", {mapboxToken})
})

//If page not found
app.all("*", (req, res, next) => {
    next(new ExpressErrors("NOT FOUND", 404))
})

app.listen(6942, () => {
    console.log("Listening on port 6942")
})