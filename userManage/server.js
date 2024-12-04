const mongoose = require("mongoose")
const express = require("express")
const app = express()
const morgan = require('morgan');
const dotenv = require("dotenv").config()
const bodyParser = require("body-parser")
const path = require("path")
const admin_router = require("./routes/admin");
const user_router = require("./routes/user");
const port = process.env.PORT || 3000;
const session = require('express-session');
const nocache = require('nocache');
const flash = require("connect-flash");

app.use(nocache());


app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev')); 

app.use(session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
    }));

 app.use(flash());

 app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});
 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log("Database connected"))
.catch(err => console.log("Mongodb connection error",err));


app.use("/", user_router);
app.use("/admin", admin_router);



app.listen(port, () => console.log(`Server started on port http://localhost:${port}`));