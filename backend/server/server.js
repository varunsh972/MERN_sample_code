/** require dependencies */
const express = require("express")
const path = require('path');
const routes = require('./routes/')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const jwt = require('jsonwebtoken');
const config = require('./config')

const app = express();
const router = express.Router();
const port = process.env.PORT || 5000;
const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
const User = require('./models/User')
app.set('superSecret', config.secret);

/** connect to MongoDB datastore */
try {
    mongoose.connect(url, {
        user: 'user',
        pass: 'password'
    })
} catch (error) {
    //console.log(error);
}

/** set up routes {API Endpoints} */
routes(router)

/** set up middlewares */
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(helmet())

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    if (!req.headers['content-type']) {
        return res.status(406).send({
            success: false,
            message: 'content type not matched!'
        });
    } else {
        if (req.path == '/api/v1/login') {
            next();
        } else {
            // check for verify reset token route because its don't need access token.
            if (req.path.indexOf('verify') > -1) {
                next();
            } else {
                var token = req.query.token || req.headers['x-access-token'];
                if (token) {
                    // verifies secret and checks exp
                    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
                        if (err) {
                            return res.json({ error: true, success: false, message: 'Failed to authenticate token.' });
                        } else {
                            // if everything is good, save to request for use in other routes
                            req.decoded = decoded;
                            next();
                        }
                    });
                } else {
                    // if there is no token
                    // return an error
                    return res.status(403).send({
                        success: false,
                        error: true,
                        message: 'No token provided.'
                    });
                }
            }
        }
    }
});


/** default user */
// function defaultUser(req, res, next) {
var data = {
    "email" : "admin@gmail.com",
    "password" : "$2b$10$E2oSbFuocpJoK/YzDccW9.ohNNsCipSQaHbnRb1ciMmRqSrszG5U6",
    "role" : "admin",
    "first_name":"admin",
    "last_name":"user"
}
new User(data).save((err, response)=>{
   if(err){
       if(err.errmsg.indexOf('duplicate') > -1) {
        console.log("email: admin@gmail.com, password: 123@admin")
       }
   }else if(response){
    console.log("email: admin@gmail.com, password: 123@admin")
   }
})


app.use('/api/v1', router)

/** start server */
app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});