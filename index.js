let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let expressSession = require('express-session');
const passport = require('passport');



let app = express();

let { route: route_register } = require('./route/register')
let { route: route_login } = require('./route/login')
let { route: route_menu } = require('./route/menu')
let { route: route_use } = require('./route/users')
let { route: route_google } = require('./route/login-google')


app.set('view engine', 'ejs' );

app.use(expressSession({
    secret: 'MERN2410',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 10 * 60 * 1000
    }
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(passport.initialize());
app.use(passport.session());

app.use(route_register, route_login, route_menu, route_use, route_google);

let uri ='mongodb://localhost:27017/network_social';

mongoose.connect(uri);
mongoose.connection.once('open',()=>{
    app.listen(3000);
    console.log('Every_thing_connect\n\n\n');
})