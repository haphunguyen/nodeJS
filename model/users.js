let mongoose = require('mongoose');
let schema = mongoose.Schema;
let objectID = schema.Types.ObjectId;

let usersSchema = new schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    pwd: {
        type: String,
        require: true,
        trim: true,
        unique: false
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    //User minh yeu cau ket ban
    usersRequest: [
        {
            type: objectID,
            ref: 'user'
        }
    ],
    //User yeu cau ket ban voi minh
    guestRequest: [
        {
            type: objectID,
            ref: 'user'
        }
    ],
    //list ban be
    friends: [
        {
            type: objectID,
            ref: 'user'
        }
    ],
    //cac bai bao da luu
    articles: [
        {
            type: objectID,
            ref: 'articles'
        }
    ]
})

let usersModel = mongoose.model('user', usersSchema);
exports.USERS_MODEL = usersModel;