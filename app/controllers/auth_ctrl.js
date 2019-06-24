const { RESPONSE_STATUS, Response, Controller } = require('../base');
const Token = require('../utils/token');
const Hash = require('../utils/hash');
const UserModel = require('../models/users');
const AdminModel = require('../models/admins');

class AuthController extends Controller {

    constructor() {
        super();
        this.user_model = new UserModel();
        this.admin_model = new AdminModel();
    }

    async resetPassword(req, res) {
        try {
            const hash = await Hash.encrypt(req.body['password']);
            console.log('reset_password: ', req.user);
            const rs = await this.user_model.update({
                'id': req.user.id,
                'pass': hash
            })
            const signData = {
                'id': user[0].id,
                'firstname': user[0].firstname,
                'lastname': user[0].lastname,
                'email': user[0].email,
                'company': user[0].company,
            }
            const accesskey = Token.sign(signData);

            if (rs)
                res.json(new Response(RESPONSE_STATUS.SUCCESS, { ...signData, 'accesskey': accesskey }));
            else
                res.json(new Response(RESPONSE_STATUS.FAIL, req.body, { code: '500', message: 'Reset Fail' }));
        } catch (e) {
            res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '400', message: 'Have some error, contact for resolve.' }));
        }
    }

    async register(req, res) {
        try {
            if (!req.body.password)
                return res.json(new Response(RESPONSE_STATUS.FAIL, req.body, { code: '500', message: 'Password null!' }));
            if (!req.body.firstname)
                return res.json(new Response(RESPONSE_STATUS.FAIL, req.body, { code: '500', message: 'Firstname null!' }));
            if (!req.body.lastname)
                return res.json(new Response(RESPONSE_STATUS.FAIL, req.body, { code: '500', message: 'Lastname null!' }));
            if (!req.body.company)
                return res.json(new Response(RESPONSE_STATUS.FAIL, req.body, { code: '500', message: 'Company null!' }));
            if (req.body['email'].indexOf('@') < 0)
                return res.json(new Response(RESPONSE_STATUS.FAIL, req.body, { code: '400', message: 'Email invalid.' }));
            const hash = await Hash.encrypt(req.body['password']);

            let data = {
                'firstname': req.body['firstname'],
                'lastname': req.body['lastname'],
                'email': req.body['email'],
                'pass': hash
            }
            console.log('register : ', req.body);
            const rs = await this.user_model.add(data);
            console.log('create new user with id: ', rs);
            delete data['pass'];
            data['rule'] = 'user';
            const accesskey = Token.sign({ 'id': rs, ...data });
            const refresh_token = Token.sign({ 'id': rs, ...data }, 60 * 60 * 24 * 7);
            delete data['rule'];
            if (rs)
                res.json(new Response(RESPONSE_STATUS.SUCCESS, { id: rs, ...data, accesskey, refresh_token }));
            else
                res.json(new Response(RESPONSE_STATUS.FAIL, req.body, { code: '500', message: 'Regist Fail' }));
        } catch (e) {
            res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '400', message: 'Have some error, contact for resolve.' }));
        }
    }

    async refreshToken(req, res) {
        try {
            console.log('refresh_token', req.user);
            const accesskey = Token.sign(req.user);
            const refresh_token = Token.sign(req.user, 60 * 60 * 24 * 7);
            res.json(new Response(RESPONSE_STATUS.SUCCESS, { accesskey, refresh_token }));
        } catch (error) {
            console.log(error);
            res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '400', message: 'Have some error, contact for resolve.' }));
        }
    }

    async login(req, res) {
        try {
            let user = await this.user_model.auth(req.body.email, req.body.password);
            if (!!user && user.length > 0) {
                console.log('admin login:', req.body.email, req.body.password);
                const accesskey = Token.sign({
                    'id': user[0]['id'],
                    'firstname': user[0]['firstname'],
                    'lastname': user[0]['lastname'],
                    'email': user[0]['email'],
                    'company': user[0]['company'],
                    'rule': 'user'
                });
                const refresh_token = Token.sign({
                    'id': user[0]['id'],
                    'firstname': user[0]['firstname'],
                    'lastname': user[0]['lastname'],
                    'email': user[0]['email'],
                    'company': user[0]['company'],
                    'rule': 'user'
                }, 60 * 60 * 24 * 7);
                delete user[0]['pass'];
                res.json(new Response(RESPONSE_STATUS.SUCCESS, { ...user[0], accesskey, refresh_token }));
            } else {
                res.json(new Response(RESPONSE_STATUS.FAIL, req.body, { code: '500', message: 'Login fail.' }));
            }
        } catch (e) {
            console.log(e)
            res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '400', message: 'Have some error, contact for resolve.' }));
        }
    }

    async adminLogin(req, res) {
        try {
            let user = await this.admin_model.auth(req.body.email, req.body.password);
            if (!!user && user.length > 0) {
                console.log('admin login:', req.body.email, req.body.password, user[0]);
                const accesskey = Token.sign({
                    'id': user[0]['id'],
                    'fullname': user[0]['fullname'],
                    'email': user[0]['email'],
                    'company': user[0]['company'],
                    'rule': 'admin'
                });
                delete user[0]['pass'];
                res.json(new Response(RESPONSE_STATUS.SUCCESS, { ...user[0], accesskey }));
            } else {
                res.json(new Response(RESPONSE_STATUS.FAIL, req.body, { code: '500', message: 'Login fail.' }));
            }
        } catch (e) {
            console.log(e)
            res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '400', message: 'Have some error, contact for resolve.' }));
        }
    }
}
module.exports = AuthController;
