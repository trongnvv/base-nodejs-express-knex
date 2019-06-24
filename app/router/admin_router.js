const BaseRouter = require('../base/base_router');
const { AuthCtrl } = require('../controllers');
class AdminRouter extends BaseRouter {
    constructor() {
        super();
    }
    config() {
        const authCtrl = new AuthCtrl();

        this.addRouter('POST', '/login', authCtrl.adminLogin.bind(authCtrl));
    }
}

module.exports = AdminRouter;