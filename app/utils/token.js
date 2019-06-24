const fs   = require('fs');
const jwt = require('jsonwebtoken');

let options = {
    expiresIn:  "12h",
    algorithm:  "RS256"
};

class Token {
    
    static sign(payload, expiresIn) {
        if (expiresIn) options.expiresIn = expiresIn;
        const privateKey  = fs.readFileSync(__dirname + '/../../assets/key/private.key', 'utf8');
        return jwt.sign(payload, privateKey, options);
    }
    static verify(token, expiresIn) {
        try {
            if (expiresIn) options.expiresIn = expiresIn;
            const publicKey  = fs.readFileSync(__dirname + '/../../assets/key/public.key', 'utf8');
            return jwt.verify(token, publicKey, options);    
        } catch (error) {
            if (error['TokenExpiredError:']) return {'error': 'Token has expired'}
            else return {'error': error};
        }
        
    }

    static decode(token) {
        return jwt.decode(token, {complete: true});
    }
}
module.exports = Token;