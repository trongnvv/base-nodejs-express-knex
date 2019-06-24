const { RESPONSE_STATUS, Response } = require('../base');
const Token = require('../utils/token');
class ApiVerify {

    static verifyAccesskey(req, res, next) {
        try {
            const auth = req.headers['authorization'].split(' ');

            if (auth[0] === 'Bearer') {
                if (Token.decode(auth[1])) {
                    const rs = Token.verify(auth[1]);
                    if (rs.error)
                        res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '510', message: rs.error }));
                    else {
                        req.user = rs;
                        next();
                    }
                }
                else {
                    res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '520', message: "Accesskey is not valid" }));
                }
            } else {
                res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '500', message: "Accesskey is not valid" }));
            }
        } catch (e) {
            res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '500', message: "Accesskey is not valid" }));
        }
    }

    static adminVerifyAccesskey(req, res, next) {
        try {
            const auth = req.headers['authorization'].split(' ');

            if (auth[0] === 'Bearer') {
                if (Token.decode(auth[1])) {
                    const rs = Token.verify(auth[1]);
                    if (rs.error)
                        res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '510', message: rs.error }));
                    else {
                        if (rs.rule == "admin") {
                            req.user = rs;
                            next();
                        } else {
                            res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '403', message: 'Permission not accept' }));
                        }
                    }
                }
                else {
                    res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '520', message: "Accesskey is not valid" }));
                }
            } else {
                res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '500', message: "Accesskey is not valid" }));
            }
        } catch (e) {
            res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '500', message: "Accesskey is not valid" }));
        }
    }

    static decodeAccesskey(req, res, next) {
        try {
            const auth = req.headers['authorization'].split(' ');
            if (auth[0] === 'Bearer') {
                if (Token.decode(auth[1])) {
                    const payload_token = Token.decode(auth[1]).payload;
                    if (!req.body.refresh_token)
                        res.json(new Response(RESPONSE_STATUS.FAIL, req.body, { code: '500', message: 'Refresh token null!' }));
                    else {
                        if (Token.decode(req.body.refresh_token)) {
                            const _rs = Token.verify(req.body.refresh_token);
                            if (_rs.error)
                                res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '510', message: _rs.error, msg: 'refresh token error' }));
                            else {
                                console.log('access_token', payload_token);
                                console.log('refresh_token', _rs);
                                if (payload_token.id == _rs.id) {
                                    const rs = Token.verify(auth[1]);
                                    if (rs.error) {
                                        delete _rs['iat'];
                                        delete _rs['exp'];
                                        req.user = _rs;
                                        next();
                                    } else {
                                        res.json(new Response(RESPONSE_STATUS.SUCCESS, { accesskey: auth[1], refresh_token: req.body.refresh_token, message: 'Accesskey unexpired' }));
                                    }
                                } else {
                                    res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '520', message: "refresh_token not yours" }));
                                }
                            }
                        } else {
                            res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '520', message: "refresh_token is not valid" }));
                        }
                    }
                } else {
                    res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '520', message: "Accesskey is not valid" }));
                }
            } else {
                res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '500', message: "Accesskey is not valid" }));
            }
        } catch (e) {
            res.json(new Response(RESPONSE_STATUS.ERROR, {}, { code: '500', message: "Accesskey is not valid" }));
        }
    }
}

module.exports = ApiVerify;