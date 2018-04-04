var express = require('express'),
    session = require('express-session'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    compression = require('compression'),
    http = require('http'),
    path = require('path'),
    winston = require('winston'),
    sqlinit = require('./server/sqlinit'),

    // App modules
    task = require('./server/task'),
    chart = require('./server/chart'),
    tasklist = require('./server/tasklist'),
    
    auth = require('./server/auth'),
    app = express();

app.set('port', process.env.PORT || 5000);

app.use(compression());
app.use(bodyParser.json({limit: '50mb'}));
app.use(session({cookie : {
        maxAge: 1000* 60 * 60 *24 * 365
    },secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser({
    uploadDir: __dirname + '/uploads',
    keepExtensions: true
}));
//,duration: 30 * 60 * 1000,activeDuration: 5 * 60 * 1000
app.use(methodOverride());

app.use(express.static(path.join(__dirname, './client')));

app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.send(500, err.message);
});

//app.post('/login', auth.login);
app.post('/sflogin', auth.sflogin);
app.post('/logout', auth.validateToken, auth.logout);
//app.post('/signup', auth.signup);
//app.post('/forgot',auth.forgotpassword);
//app.post('/verify',auth.verify);
//app.post('/updatepassword',auth.updatepassword);
//app.post('/updateVerificatonCodeStatus',auth.updateVerificatonCodeStatus);
app.post('/task',  task.createTask);
app.post('/manager', task.managerList);
app.post('/chart', chart.chartList);
app.post('/projectchart', chart.projectChartList);
app.post('/tasklist', tasklist.getTasklists);
app.post('/resourceview', tasklist.getResourceview);
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
