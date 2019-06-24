class RootController {
    constructor() {
        
    }

    async index(req, res) {
        try {
            res.render('pages/index');
        } catch (e) {
            console.log(e);
        }
    }

}
module.exports = RootController;