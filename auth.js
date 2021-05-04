const jwt = require('jsonwebtoken');
//let nope = process.env.AUTH_SECRET;
let nope='durgabooks123';

class Authentication{
    createToken(payload){
        let jwtOptions = { expiresIn: 60*60*12, algorithm: "HS256" };
        let token = jwt.sign( payload, nope, jwtOptions );
        return token;
    };
    
    verifyToken(req, res, next){
        try{
            console.log(req.headers.token)
            let verify = jwt.verify(JSON.parse(req.headers.token), nope);
            if(verify){
                let decoded = jwt.decode(JSON.parse(req.headers.token));
                req.headers.userId=decoded.id
                next()
            }
        }catch(err){
            console.log(`error verifying token: ${req.headers.token}, ${err}`);
            return res.status(401).json({message:"please send proper token"});
        }
    };
}

module.exports = Authentication;