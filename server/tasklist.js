var db = require('./pghelper'),
    config = require('./config'),
    nforce = require('nforce');

function getTasklists(req, res, next) {
   

    var oauth;
     org = nforce.createConnection({
            clientId: config.api.clientId,
            clientSecret: config.api.clientSecret,
            redirectUri: config.api.redirectUri,
            apiVersion: config.api.apiVersion,  // optional, defaults to current salesforce API version
            environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
            mode: 'single' // optional, 'single' or 'multi' user mode, multi default
        });

    org.authenticate({ username: req.body.suser, password: req.body.spassword}, function(err, resp) {
        if(!err) {
        console.log(' Logged in user id : '+req.body.uid);   
        var q = "SELECT Id,Task_Name__c,Task_Description__c,Project_Type__c,No_of_Hours__c,Manager_Name__c FROM Task__c where Task_Date__c = 2018-03-29 AND createdbyId ='"+req.body.uid+"'";
        console.log('----q---'+q);
            org.query({ query: q }, function(err, resp){
              if(!err && resp.records) {
                 console.log(' resp.records in user id : '+resp.records); 
                 res.send(resp.records);
              }else{
                  console.log(' resp. no records: ');
                 res.send('No record Available');
              }
        });
        } else {
            console.log('nforce connection failed: ' + err.message);
            oauth = resp;
        }
    });
     
};


function getResourceview(req, res, next) {
   

    var oauth;
     org = nforce.createConnection({
            clientId: config.api.clientId,
            clientSecret: config.api.clientSecret,
            redirectUri: config.api.redirectUri,
            apiVersion: config.api.apiVersion,  // optional, defaults to current salesforce API version
            environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
            mode: 'single' // optional, 'single' or 'multi' user mode, multi default
        });

    org.authenticate({ username: req.body.suser, password: req.body.spassword}, function(err, resp) {
        if(!err) {
        console.log(' Logged in user id : '+req.body.uid);   
        var q = "SELECT Id,Task_Name__c,Task_Description__c,Project_Type__c,No_of_Hours__c,Manager_Name__c,Manager__c,createdbyid,Created_Name__c  FROM Task__c where Task_Date__c = 2018-03-29 ";
            org.query({ query: q }, function(err, resp){
              if(!err && resp.records) {
                 console.log(' resp.records in user id : '+resp.records); 
                 res.send(resp.records);
              }else{
                  console.log(' resp. no records: ');
                 res.send('No record Available');
              }
        });
        } else {
            console.log('nforce connection failed: ' + err.message);
            oauth = resp;
        }
    });
     
};




function revokeToken(req, res, next) {
    org.revokeToken({token: org.oauth.access_token}, function(err) {
        if (err) {
            return next(err);
        } else {
            res.send('ok');
        }
    });

}

exports.getResourceview = getResourceview;
exports.getTasklists = getTasklists;
exports.revokeToken = revokeToken;
