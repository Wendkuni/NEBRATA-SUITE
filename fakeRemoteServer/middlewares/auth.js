const fs = require('fs')
const jwt = require('jsonwebtoken')
const path = require('path')
const child_process = require("child_process");
const expiresIn = '1h'
const SECRET_KEY = '123456789'
const TOKEN_TYPE = "Bearer"
const TOKEN_KEY = "AuthToken";
// Create a token from a payload
function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

// Verify the token
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}


const userdb = JSON.parse(fs.readFileSync(path.join(__dirname, '../users.json'), 'UTF-8'))

function isAuthenticated({ username, password }) {
    return userdb.findIndex(user => user.username === username && user.password === password);
}

function logout(req, res, next) {
    res.clearCookie(TOKEN_KEY);
    const status = 200
    const message = 'logout OK'
    res.status(status).json({ status, message })
    return
}

function getMyProfil(req, res, next) {


    /*
    const statussss = 404
    const message = 'User not found'
    res.status(statussss).json({ statussss, message })
    return
    */

    let token = req.cookies[TOKEN_KEY] || '';
    /*child_process.execSync("sleep 1");*/
    if (!token) {
        token = (req.headers.authorization) ? req.headers.authorization.replace(TOKEN_TYPE + " ", "") : null;
    }

    let decoded = verifyToken(token);

    if (decoded instanceof Error) {
        const status = 401
        const message = 'Access token not provided'
        res.status(status).json({ status, message })
        return
    }


    let i = userdb.findIndex(user => user.username === decoded.username);
    if (i < 0) {

        const status = 404
        const message = 'User not found'
        res.status(status).json({ status, message })
        return

    }

    let user = Object.assign({}, userdb[i]);
    delete user.password;
    const status = 200;
    res.status(status).json(user)
    return

}

function authorization(req, res, next) {




    // console.log(' authorization check')
    let token = req.cookies[TOKEN_KEY] || '';

    if (!token) {
        token = (req.headers.authorization) ? req.headers.authorization.replace(TOKEN_TYPE + " ", "") : null;
    }


    if (!token) {
        const status = 401
        const message = 'Access token not provided'
        res.status(status).json({ status, message })
        return
    }

    let verifyTokenResult;
    verifyTokenResult = verifyToken(token);

    if (verifyTokenResult instanceof Error) {
        const status = 401
        const message = 'Access token not provided'
        res.status(status).json({ status, message })
        return
    }
    next()

}

function authentification(req, res, next) {

    //console.log(req.body)
    //// console.log(req.body.username)
    // child_process.execSync("sleep 1");
    if (req.method === "POST" && req.body && req.body.username && req.body.password) {
        const { username, password } = req.body;

        const index = isAuthenticated({ username, password });
        if (index >= 0) {
            const status = 200;
            const user = userdb[index];

            const access_token = createToken({ username })
                // console.log("Access Token:" + access_token);
            res.cookie(TOKEN_KEY, access_token, { maxAge: 900000, secure: false, httpOnly: true })
            res.status(status).json({ access_token })
            return
        } else {
            // console.log(req.body.username, req.body.password, index, userdb)

            const status = 401
            const message = 'Incorrect username or password'
            res.status(status).json({ status, message })
            return
        }

    } else {

        const status = 400
        const message = 'Bad request '
        res.status(status).json({ status, message })
        return
    }


}




module.exports = {
    authorization: authorization,
    authentification: authentification,
    me: getMyProfil,
    logout: logout
}