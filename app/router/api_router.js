const BaseRouter = require('../base/base_router');
const AdminRouter = require('./admin_router');
const UserRouter = require('./user_router');
const ApiCtrl = require('../controllers/api_ctrl');

class ApiRouter extends BaseRouter {
    constructor() {
        super();
    }

    config() {
        this.router.use('/users', new UserRouter().getRouter());
        this.router.use('/admins', new AdminRouter().getRouter());
    }
}

module.exports = ApiRouter;