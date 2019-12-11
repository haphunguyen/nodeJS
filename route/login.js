let express = require('express');
let mongoose = require('mongoose');
let Schema = mongoose.Types.ObjectId;
let route = express.Router();
let { check, validationResult } = require('express-validator')

let configUserIsExis = [
    check('username', 'pwd').isString().withMessage('username_pwd_khong_phai_string'),
    check('username', 'pwd').isLength({ min: 3, max: 10 }).withMessage('username_pwd_khong_du_length'),
    // check('username', 'pwd').matches(/^\d+$/).withMessage('username_pwd_chua_ki_tu_dac_biet')
]


let { CHECK_AND_CREATE_SESSION } = require('../middleware/checkInvalid')
route.route('/login')
    .get((req, res) => {
        if (req.session.info)
            res.redirect('/menu')
        else
            res.render('login')
    })

    .post(configUserIsExis, CHECK_AND_CREATE_SESSION, (req, res) => {
        res.redirect('/menu')
    })

    // route.get('*', (req, res) => {
    //     res.redirect('/login')
    // })


exports.route = route;

