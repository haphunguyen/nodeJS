let express = require('express');
let { USERS_MODEL } = require('../model/users')
let { ARTICLES_MODEL } = require('../model/articles')
let route = express.Router();

route.route('/accept-request/:userID')
    .get(async (req, res) => {
        let { userID: _id } = req.params;

        let resultUser = await USERS_MODEL.findByIdAndUpdate(req.session.info._id, {
            $addToSet: {
                friends: _id
            },
            $pull: {
                guestRequest: _id
            }
        })

        let resultGuest = await USERS_MODEL.findByIdAndUpdate(_id, {
            $addToSet: {
                friends: req.session.info._id
            },
            $pull: {
                usersRequest: req.session.info._id
            }
        })

        if (!resultUser || !resultGuest) {
            res.json({ error: true, message: khong_the_chap_nhan_ket_ban })
        }
        else {
            let newInfo = await USERS_MODEL.findById(req.session.info._id)
                .populate({ path: 'usersRequest' })
                .populate({ path: 'guestRequest' })
                .populate({ path: 'friends' });;
            req.session.info = newInfo;
            res.redirect('/menu')
        }
    })
route.route('/remove-request/:userID')
    .get(async (req, res) => {
        let { userID: _id } = req.params;

        let resultUser = await USERS_MODEL.findByIdAndUpdate(req.session.info._id, {
            $pull: {
                guestRequest: _id
            }
        })

        let resultGuest = await USERS_MODEL.findByIdAndUpdate(_id, {
            $pull: {
                usersRequest: req.session.info._id
            }
        })

        if (!resultUser || !resultGuest) {
            res.json({ error: true, message: khong_the_gui_ket_ban })
        }
        else {
            let newInfo = await USERS_MODEL.findById(req.session.info._id)
                .populate({ path: 'usersRequest' })
                .populate({ path: 'guestRequest' })
                .populate({ path: 'friends' });;
            req.session.info = newInfo;
            res.redirect('/menu')
        }
    })
route.route('/add-friend/:userID')
    .get(async (req, res) => {
        let { userID: _id } = req.params;

        let resultUser = await USERS_MODEL.findByIdAndUpdate(req.session.info._id, {
            $addToSet: {
                usersRequest: _id
            }
        })

        let resultGuest = await USERS_MODEL.findByIdAndUpdate(_id, {
            $addToSet: {
                guestRequest: req.session.info._id
            }
        })

        if (!resultUser || !resultGuest) {
            res.json({ error: true, message: khong_the_gui_ket_ban })
        }
        else {
            let newInfo = await USERS_MODEL.findById(req.session.info._id)
                .populate({ path: 'usersRequest' })
                .populate({ path: 'guestRequest' })
                .populate({ path: 'friends' });;
            req.session.info = newInfo;
            res.redirect('/menu')
        }
    })
route.route('/remove-add-friend/:userID')
    .get(async (req, res) => {
        let { userID: _id } = req.params;

        let resultUser = await USERS_MODEL.findByIdAndUpdate(req.session.info._id, {
            $pull: {
                usersRequest: _id
            }
        })

        let resultGuest = await USERS_MODEL.findByIdAndUpdate(_id, {
            $pull: {
                guestRequest: req.session.info._id
            }
        })

        if (!resultUser || !resultGuest) {
            res.json({ error: true, message: khong_the_xoa_loi_ket_ban })
        }
        else {
            let newInfo = await USERS_MODEL.findById(req.session.info._id)
                .populate({ path: 'usersRequest' })
                .populate({ path: 'guestRequest' })
                .populate({ path: 'friends' });;
            req.session.info = newInfo;
            res.redirect('/menu')
        }
    })
route.route('/delete-friend/:userID')
    .get(async (req, res) => {
        let { userID: _id } = req.params;

        let resultUser = await USERS_MODEL.findByIdAndUpdate(req.session.info._id, {
            $pull: {
                friends: _id
            }
        })

        let resultGuest = await USERS_MODEL.findByIdAndUpdate(_id, {
            $pull: {
                friends: req.session.info._id
            }
        })

        if (!resultUser || !resultGuest) {
            res.json({ error: true, message: khong_the_xoa_ket_ban })
        }
        else {
            let newInfo = await USERS_MODEL.findById(req.session.info._id)
                .populate({ path: 'usersRequest' })
                .populate({ path: 'guestRequest' })
                .populate({ path: 'friends' });;
            req.session.info = newInfo;
            res.redirect('/menu')
        }
    })
route.route('/log-out')
    .get(async (req, res) => {
        req.session.destroy();
        res.redirect('/login')
    })
route.route('/article')
    .post(async (req, res) => {
        let { title, content } = req.body;

        let newArticle = new ARTICLES_MODEL({ authors: req.session.info._id, titles: title, contents: content });
        let resultCreateArticle = await newArticle.save();


        if (!resultCreateArticle)
            res.json({ error: true, message: 'khong_the_dang_bai_viet' })
        else {
            let addArticles = await USERS_MODEL.findByIdAndUpdate(req.session.info._id, {
                $push: {
                    articles: resultCreateArticle._id
                }
            })
            if (!addArticles)
                res.json({ error: true, message: 'khong_the_them_bai_viet_cho_user' })
            else {
                let newInfo = await USERS_MODEL.findById(req.session.info._id)
                    .populate({ path: 'usersRequest' })
                    .populate({ path: 'guestRequest' })
                    .populate({ path: 'friends' })
                    // .populate({ path: 'articles' })

                req.session.info = newInfo;
                res.redirect('/menu')
            }
        }
    })
exports.route = route;

