const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router.js')
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.Promise = global.Promise;

// DB Setup
mongoose.connect('mongodb://127.0.0.1/auth', { useMongoClient: true, promiseLibrary: require('bluebird') });


// App Setup
app.use(morgan('combined'));
app.use(cors());
//app.use(bodyParser.json({ type: '*/*' }));
var jsonParser       = bodyParser.json({limit:'300mb', type:'application/json'});
 var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:'300mb',type:'application/x-www-form-urlencoding' })

 app.use(jsonParser);
 app.use(urlencodedParser);
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server is running on:', port);
