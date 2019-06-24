const BaseRouter = require('../base/base_router');
const RootController = require('../controllers/root_ctrl');

class RootRouter extends BaseRouter{
    constructor() {
        super();
    }
    config() {
        const rootCtrl = new RootController();
        this.addRouter('GET', '/', rootCtrl.index.bind(rootCtrl));
    }
}

module.exports = RootRouter;