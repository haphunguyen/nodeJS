let express = require('express');
let mongoose = require('mongoose');
let route = express.Router();
let { USERS_MODEL } = require('../model/users')
let { ARTICLES_MODEL } = require('../model/articles')

route.route('/menu')
    .get(async (req, res) => {
        console.log(req.session.info);
        
        if (req.session.info) {

            let info = req.session.info;
            let arrExcep = [...info.friends, ...info.guestRequest, info._id];
            let newFriend = await USERS_MODEL.find({
                _id: {
                    $nin: arrExcep
                }
            });

            let arrArticleID = [...info.articles];
            info.friends.reduce((backVal, thisVal) => {
                return  arrArticleID.push(...thisVal.articles)
            },0)
            let arrArticle = await ARTICLES_MODEL.find({
                _id: { $in: arrArticleID }
            }).populate({path: 'authors'}).sort({createAt: -1})

            res.render('menu', { info, newFriend, arrArticle})
        } else
            res.redirect('/login')
    })


exports.route = route;

