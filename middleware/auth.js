const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {

    // Ingore routes like login 
    if (req.url === '/login') {
        return next()
    }

    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization'] || req.headers['Authorization']
    const token = authHeader
    
    // if there isn't any token
    if (token == null)
        return res.status(401).send({
            error: "Auth token not Supplied"
        })

    jwt.verify(token, `TOKEN_SECRET`, function (err, decoded) {
        console.log(err)
        if (err)
            return res.status(403).send({
                error: "Auth token Invalid"
            })

        next()
    })
}


module.exports = authenticateToken;