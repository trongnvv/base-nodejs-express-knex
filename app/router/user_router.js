
const BaseRouter = require('../base/base_router');
const ApiVerify = require('../middleware/api_verify');
const { AuthCtrl } = require('../controllers');

class UserRouter extends BaseRouter {
    constructor() {
        super();
    }
    config() {
        const authCtrl = new AuthCtrl();

        this.addRouter('POST', '/register', authCtrl.register.bind(authCtrl));
        this.addRouter('POST', '/login', authCtrl.login.bind(authCtrl));
        this.addRouter('POST', '/refresh-token', authCtrl.refreshToken.bind(authCtrl), ApiVerify.verifyAccesskey);
        this.addRouter('PUT', '/reset-password', authCtrl.resetPassword.bind(authCtrl), ApiVerify.verifyAccesskey);
    }
}

module.exports = UserRouter;