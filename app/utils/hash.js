const bcrypt = require('bcrypt');
class Hash {
    static encrypt(plaintext) {
        return new Promise( (resolve, reject) => {
            bcrypt.hash(plaintext, 10, (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });
        });
    }

    static compare(plaintext, hash) {
        return new Promise( (resolve, reject) => {
            bcrypt.compare(plaintext, hash, function(err, res) {
                if (err) reject(err);
                resolve(res);
            });
        })
    }
}
module.exports = Hash;