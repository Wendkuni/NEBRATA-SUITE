const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path')
    //const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()
const cookieParser = require('cookie-parser');
var cors = require('cors')

//var router = jsonServer.router('./db.js');
var router = jsonServer.router(require('./db.js')());
//server.use(router);
/*

server.use("*", function(req, res, next) {
   // console.log("hack query")
    req.headers.origin = req.headers.origin || "autre-host";
    // req.headers.origin = req.headers.origin || req.headers.host;
    next();
})

*/


var whitelist = ['autre-host', 'http://localhost:3000', 'http://localhost:4200'];

var corsOptions = {
    origin: function(origin, callback) {
        // console.log(origin)
        callback(null, true)
            /* if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
            */
    }
}

const authorization = require("./middlewares/auth").authorization;
const authentification = require("./middlewares/auth").authentification;
const me = require("./middlewares/auth").me;
const logout = require("./middlewares/auth").logout;



server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use(cookieParser());



server.use('/api/authentification', cors(corsOptions), authentification);
server.use("/api/logout", cors(corsOptions), logout);
server.use("/api/*", cors(corsOptions), authorization);
server.use("/api/me", cors(corsOptions), me);





server.use(jsonServer.rewriter({
    "/api/*": "/$1",
    "/processus(\\?.+)?": "/processus-page",
    "/processus/:numero": "/processus-ext/:numero",
    "/transition/:numero/:code": "/transitions/:code"
}))
server.use(router)



/*
server.use(jsonServer.rewriter({
  '/db': '/api/db'
}))
server.use('/api', router)
*/



server.listen(4000, () => {
    // console.log('JSON Server is running 4000')
});