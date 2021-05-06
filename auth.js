const jwt = require('jsonwebtoken');
//let nope = process.env.AUTH_SECRET;
let nope='durgachitss123';

class Authentication{
    createToken(payload){
        let jwtOptions = { expiresIn: 60*60, algorithm: "HS256" };
        //console.log("payload in ctoken is",payload)
        
        let token = jwt.sign( payload, nope, jwtOptions );
        
        
        return token;
    };
    
    verifyToken(req, res, next){
        try{
            //console.log('req is=',req)
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
            //console.log("token is",token)
            let verify = jwt.verify(token, nope);
            //console.log("verify=",verify)
            if(verify){
                let decoded = jwt.decode(token);
                //console.log("decoded is=",decoded)
                req.headers.role=decoded.role
                
                next()
            }
        }catch(err){
            console.log(`error verifying token: ${err}`);
            return res.status(401).json({message:"please send proper token"});
        }
    };
}
module.exports = Authentication;