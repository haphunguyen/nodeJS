let express = require('express');
let mongoose = require('mongoose');
let route = express.Router();
let { check, validationResult } = require('express-validator')

let { CHECK_USERS_ISEXIS } = require('../middleware/checkInvalid')

let configUserIsExis = [
    check('username', 'pwd').isString().withMessage('username_pwd_khong_phai_string'),
    check('username', 'pwd').isLength({ min: 3, max: 10 }).withMessage('username_pwd_khong_du_length'),
    check('username', 'pwd').matches('/[.*+?^${}()|[\]\\]/').withMessage('username_pwd_chua_ki_tu_dac_biet'),
    check('email').isEmail().withMessage('email_khong_hop_le'),

]

route.route('/register')
    .get((req, res) => {
        if (!req.session.info)
            res.render('register')
        else
            res.redirect('/menu')
    })
    .post(CHECK_USERS_ISEXIS, configUserIsExis, (req, res) => {
        const errorRG = validationResult(req);
        if(!errorRG.isEmpty()){
            res.json(errorRG.errors)
        }
        res.redirect('/login')
    })

exports.route = route;

