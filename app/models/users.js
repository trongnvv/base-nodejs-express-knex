const BaseModel = require('../base/base_model');
const TABLE = 'users';
const Hash = require('../utils/hash');
class UserModel extends BaseModel {

    constructor() {
        super(TABLE);
    }

    async auth(email, password) {
        return new Promise(async (resolve, reject) => {
            const users = await this.getBy({ 'email': email });
            if (users && users.length > 0) {
                const rs = await Hash.compare(password, users[0]['pass']);
                if (rs && users[0]['active'] == 1) resolve(users);
                else reject('username or password is not correct or user was locked');
            } else {
                reject('username not found');
            }
        })
    }
}

module.exports = UserModel;