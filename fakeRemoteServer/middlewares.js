  
const fs = require('fs')
const jwt = require('jsonwebtoken')

const expiresIn = '1h'
const SECRET_KEY = '123456789'
// Create a token from a payload 
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token){
    return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
  }

const userdb = JSON.parse(fs.readFileSync('./fakeRemoteServer/db.json', 'UTF-8'))

function isAuthenticated({username, password}){
    return userdb.authentification.findIndex(user => user.username === username && user.password === password) !== -1
  }

module.exports = (req, res, next) => {

/*
  

     */
    

     next();
  }

