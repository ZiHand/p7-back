const jwt       = require('jsonwebtoken');
const UserModel = require('../models/user_model');

// ===================================================
// checkUser
// ===================================================
// Used on all GET request
// ===================================================
module.exports.checkUser = (req, res, next) =>
{
    const token = req.cookies.jwt;

    if (token)
    {
        jwt.verify(token, process.env.TOKEN_SECRET, async (error, decodedToken) =>
        {
            if (error)
            {
                console.log("checkUser FAILED");
                res.locals.user = null;
                next();
            }
            else
            {
                try
                {
                    let user        = await UserModel.findByPk(decodedToken.id, {attributes : {exclude : ["createdAt", "updatedAt", "password"]}});
                    res.locals.user = user;
                    next();
                } 
                catch (error) 
                {
                    console.log("checkUser FAILED");
                    res.locals.user = null;
                    next();
                }
                
            }
        })
    }
    else
    {
        res.locals.user = null;
        next();
    }
};

// ===================================================
// requireAuth
// ===================================================
// 
// ===================================================
module.exports.requireAuth = (req, res, next) =>
{
    const token = req.cookies.jwt;

    if (token)
    {
        jwt.verify(token, process.env.TOKEN_SECRET, async (error, decodedToken) =>
        {
            if (error)
            {
                console.log(error);
                res.send(200).json('no token');
            }
            else
            {
                console.log("User logged : " + decodedToken.id);
                next();
            }
        });
    }
    else
    {
        console.log("No Valid Token.");
    }
}