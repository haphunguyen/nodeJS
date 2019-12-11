let bcrypt = require('bcryptjs');
let KEY = 3

let enCrypt = (strData) => {
    var salt =  bcrypt.genSaltSync(KEY);
    var hash =  bcrypt.hashSync(strData, salt);
    return hash;
}
let compare =  (plainText, hashString) => {
    let isMatching = bcrypt.compareSync(plainText, hashString);
    return isMatching;
}

exports.enCrypt = enCrypt;
exports.compare = compare;