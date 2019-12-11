let express = require('express');
let app = express()
let route = express.Router();
let cookieSession = require('cookie-session')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
let bodyParser = require('body-parser');


let { modulGoogle } = require('../modulGoogle')
let { USERS_MODEL } = require('../model/users')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  maxAge: 10 * 60 * 1000,
  keys: 'helloKey'
}))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  done(null, id)
})

passport.use(new GoogleStrategy(
  {
    clientID: modulGoogle.googleClientID,
    clientSecret: modulGoogle.googleClientSecret,
    callbackURL: '/login-google'
  },
  async function (token, tokenSecret, profile, done) {
    console.log({token});
    data = await USERS_MODEL.findOne({ email: profile._json.email })
      .populate({ path: 'usersRequest', select: ['username'] })
      .populate({ path: 'guestRequest', select: ['username'] })
      .populate({ path: 'friends', select: ['articles', 'username'] })
      .then( async (result) => {
        if (result) {
          console.log('\nUser da tung dang nhap.');
          done(null, result)

        } else {
          console.log('\nUser moi');
          let newUser = new USERS_MODEL({ username: profile._json.family_name, pwd: 123, email: profile._json.email });
          await newUser.save();
          // console.log({newUser});
          done(null, newUser)
        }
      })

  }));

route.get('/login-with-google', passport.authenticate('google', { scope: ['profile', 'email'] }));

route.get('/login-google', passport.authenticate('google'), (req, res) => {
  req.session.info = req.user;
  res.redirect('/menu')
  // res.json(req.user)
});

exports.route = route;

