const BaseModel = require('../base/base_model');
const Hash = require('../utils/hash');
const TABLE = 'admin';
class UserModel extends BaseModel {

    constructor() {
        super(TABLE);
    }

    async auth(email, password) {
        return new Promise(async (resolve, reject) => {
            if (!email || !password) return reject('email or password null');
            const users = await this.getBy({ 'email': email });
            if (users && users.length > 0) {
                const rs = await Hash.compare(password, users[0]['pass']);
                if (rs) resolve(users);
                else reject('username or password is not correct');
            } else {
                reject('username not found');
            }
        })
    }
}

module.exports = UserModel;