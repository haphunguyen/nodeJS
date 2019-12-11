let mongoose = require('mongoose');
let schema = mongoose.Schema;

let articlesSchema = new schema({
    authors: {
        type: schema.Types.ObjectId,
        ref: 'user'
    },
    titles: {
        type: String,
        trim: true,
        unique: true,
        require: true
    },
    contents: {
        type: String,
        trim: true,
        unique: false,
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

let articlesModel = mongoose.model('articles', articlesSchema);
exports.ARTICLES_MODEL = articlesModel;