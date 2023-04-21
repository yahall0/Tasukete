if(process.env.NODE_ENV !== 'production')
{
    require("dotenv").config()
}


const express = require("express")
const ejsmate = require("ejs-mate")
const path = require("path")
const mongoose = require("mongoose")
const mongoStore = require("connect-mongo")
const sessions = require("express-session")
const MongoStore = require("connect-mongo")
const passport = require("passport")
const User = require("./models/user")
const flash = require("connect-flash")
require("./utils/passportGoogle")


app = express()
app.set("view engine", 'ejs')
app.use(express.urlencoded({ extended: true }))
app.set("views", path.join(__dirname, 'views'))
app.engine('ejs', ejsmate)
app.use(express.static(path.join(__dirname, 'public')))

//connect to mongodb
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to mongodb")
    })
    .catch(() => {
        console.log("Connection to mongodb could not be established")
    })

//Sessions and sessions store stuff

const sessionsStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'sadasd12ee21e32asda1d'
    }
})

const sessionConfig = {
    store: sessionsStore,
    secret: 'kjbuinjbsiuni313!@121',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,// expires after 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false
    }
}
app.use(sessions(sessionConfig))
app.use(flash())

//passport Stuff

app.use(passport.initialize())
app.use(passport.session())

//setting up currentUser variable for ejs

app.use(async (req, res, next) => {
    res.locals.currentUser = null
    if(req.user)
    {
        console.log(req.user)
        const user = await User.findOne({googleID: req.user.id})
        res.locals.currentUser = user// Session info of the user from passport
    }
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

app.get("/google/login", passport.authenticate('google', {scope: ['profile', 'email']}), (req, res, next) => {
    req.session.save()
})

app.get("/oauth2/redirect/google", passport.authenticate('google', {keepSessionInfo: true}), 
    (req, res) => {
        req.flash("success", "Welcome!")
        res.redirect('/')
    }    
)

app.get("/google/logout", (req, res, next) => {
    console.log(req)
    req.logout(err => {
        if (err) {
            return next(err)
        }
        req.flash("success", "Logged out successfully")
        res.redirect("/")
    })
})

//homepage    
const mapboxToken = process.env.MAPBOX_TOKEN
app.get("/", (req, res) => {
    res.render("home.ejs", {mapboxToken})
})

//New Help request
app.get("/new", )

//If page not found
/*app.all("*", (req, res, next) => {
    next(new ExpressErrors("NOT FOUND", 404))
})*/

app.listen(6942, () => {
    console.log("Listening on port 6942")
})