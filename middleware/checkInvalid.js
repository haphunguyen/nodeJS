let mongoose = require('mongoose');
let session = require('express-session');
let { USERS_MODEL } = require('../model/users');
let { compare: COMPARE, enCrypt: ENCRYPT } = require('../helper/bcrypt')
const {validationResult } = require('express-validator')



let userIsExis = async (req, res, next) => {
    let { username, pwd, email } = req.body;
    let isExis = await USERS_MODEL.findOne({ $or: [{ username }, { email }] });

    if (isExis) {
        res.json({ error: true, message: 'tai_khoan_da_ton_tai' })
    }

    pwd = ENCRYPT(String(pwd))

    let Users = new USERS_MODEL({ username, pwd, email });
    let result = await Users.save();

    if (!result) {
        res.json({ error: true, message: 'tai_khoan_chua_duoc_khoi_tao' })
    }
    next();
}

let userIsExisAndCreateSession = async (req, res, next) => {
    const errorLG = validationResult(req);
    if (!errorLG.isEmpty()) {
        res.json(errorLG)
    }

    let { username, pwd } = req.body;
    let isExis = await USERS_MODEL.findOne({ username })
        .populate({ path: 'usersRequest', select: ['username'] })
        .populate({ path: 'guestRequest', select: ['username'] })
        .populate({ path: 'friends', select: ['articles', 'username'] })
    // .populate({ path: 'articles', select: ['titles', 'contents', 'createAt'] })

    if (!isExis || !COMPARE(pwd, isExis.pwd))
        res.json({ error: true, message: 'sai_tai_khoan_hoac_mat_khau' })

    req.session.info = isExis;

    next();

}

exports.CHECK_USERS_ISEXIS = userIsExis;
exports.CHECK_AND_CREATE_SESSION = userIsExisAndCreateSession;