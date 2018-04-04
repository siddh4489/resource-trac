    var db = require('./pghelper'),
    config = require('./config'),
    nforce = require('nforce'),
    session = require('express-session');
    
     
function chartList(req, res, next) {
    console.log('---chartList--->'+req);
    console.log('---chartList 1--->'+req.body.spassword);
    console.log('---chartList 2--->'+req.body.suser);
    console.log('---chartList 3 --->'+JSON.stringify(req.body));
    

    var oauth;
     org = nforce.createConnection({
            clientId: config.api.clientId,
            clientSecret: config.api.clientSecret,
            redirectUri: config.api.redirectUri,
            apiVersion: config.api.apiVersion,  // optional, defaults to current salesforce API version
            environment: 'sandbox',  // optional, salesforce 'sandbox' or 'production', production default
            mode: 'single' // optional, 'single' or 'multi' user mode, multi default
        });

    //org.authenticate({ username: userName, password: password}, function(err, resp) {
    console.log('-- task--Email--'+req.session.email);
    console.log('--tasl--Password--'+req.session.password);
    //org.authenticate({ username: req.body.suser, password: req.body.spassword}, function(err, resp) {
    org.authenticate({ username: req.session.email, password: req.session.password}, function(err, resp) {    
        if(!err) {
        var q = "SELECT sum(No_of_Hours__c)hr,CreatedBy.Name FROM Task__c GROUP BY CreatedBy.name";
 
        org.query({ query: q }, function(err, resp){
            
              if(!err && resp.records) {
                 console.log('--- chart List--->'+resp.records);
                 res.send(resp.records);
              }else{
                 res.send('No record Available');
              }
        });


        } else {
            console.log('nforce connection failed: ' + err.message);
            oauth = resp;
        }
    });
       
        
     
};

function projectChartList(req, res, next) {
    console.log('---chartList--->'+req);
    console.log('---chartList 21--->'+req.body.spassword);
    console.log('---chartList 31--->'+req.body.suser);
    console.log('---chartList 32 --->'+JSON.stringify(req.body));
    

    var oauth;
     org = nforce.createConnection({
            clientId: config.api.clientId,
            clientSecret: config.api.clientSecret,
            redirectUri: config.api.redirectUri,
            apiVersion: config.api.apiVersion,  // optional, defaults to current salesforce API version
            environment: 'sandbox',  // optional, salesforce 'sandbox' or 'production', production default
            mode: 'single' // optional, 'single' or 'multi' user mode, multi default
        });

    //org.authenticate({ username: userName, password: password}, function(err, resp) {
    console.log('-- task--Email1--'+req.session.email);
    console.log('--tasl--Password1--'+req.session.password);
    //org.authenticate({ username: req.body.suser, password: req.body.spassword}, function(err, resp) {
    org.authenticate({ username: req.session.email, password: req.session.password}, function(err, resp) {    
        if(!err) {
        var q = "SELECT sum(No_of_Hours__c)hr, CreatedBy.Name, Project_Type__c FROM Task__c GROUP BY CreatedBy.name, Project_Type__c";
 
        org.query({ query: q }, function(err, resp){
            
              if(!err && resp.records) {
                 console.log('--- chart List--->'+resp.records);
                 res.send(resp.records);
              }else{
                 res.send('No record Available');
              }
        });


        } else {
            console.log('nforce connection failed: ' + err.message);
            oauth = resp;
        }
    });
       
        
     
};




exports.chartList = chartList;
