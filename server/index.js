const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router.js')
const mongoose = require('mongoose');
const cors = require('cors');

// DB Setup
mongoose.connect('mongodb://localhost/auth', { useMongoClient: true, promiseLibrary: require('bluebird') });


// App Setup
app.use(morgan('combined'));
app.use(cors());
//app.use(bodyParser.json({ type: '*/*' }));
var jsonParser       = bodyParser.json({limit:1024*1024*200, type:'application/json'});
 var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*200,type:'application/x-www-form-urlencoding' })

 app.use(jsonParser);
 app.use(urlencodedParser);
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server is running on:', port);
