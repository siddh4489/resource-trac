 //var db = require('./pghelper'),
   var config = require('./config'),
    nforce = require('nforce'),
    session = require('express-session');

function getTasklists(req, res, next) {
    
    console.log('--3---'+req.session);
    console.log('---33----'+req.session.email);
    console.log('---3---3---'+req.session.password);
    var oauth;
     org = nforce.createConnection({
            clientId: config.api.clientId,
            clientSecret: config.api.clientSecret,
            redirectUri: config.api.redirectUri,
            apiVersion: config.api.apiVersion,  // optional, defaults to current salesforce API version
            environment: 'sandbox',  // optional, salesforce 'sandbox' or 'production', production default
            mode: 'single' // optional, 'single' or 'multi' user mode, multi default
        });

    org.authenticate({ username:  req.session.email, password: req.session.password}, function(err, resp) {
        if(!err) {
        console.log(' Logged in user id : '+req.body.uid);   
        var q = "SELECT Id,Name,Task_Description__c,Project_Type__c,No_of_Hours__c,Manager_Name__c FROM Task__c where  createdbyId ='"+req.body.uid+"'";
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
    
    console.log('--3---'+req.session);
    console.log('---33----'+req.session.email);
    console.log('---3---3---'+req.session.password);
    console.log(' Logged in user date : '+req.body.date);   

    var oauth;
     org = nforce.createConnection({
            clientId: config.api.clientId,
            clientSecret: config.api.clientSecret,
            redirectUri: config.api.redirectUri,
            apiVersion: config.api.apiVersion,  // optional, defaults to current salesforce API version
            environment: 'sandbox',  // optional, salesforce 'sandbox' or 'production', production default
            mode: 'single' // optional, 'single' or 'multi' user mode, multi default
        });

    org.authenticate({ username:  req.session.email, password:  req.session.password}, function(err, resp) {
        if(!err) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd = '0'+dd
        } 

        if(mm<10) {
            mm = '0'+mm
        } 

       today = mm + '/' + dd + '/' + yyyy;  
         
       if(req.body.date != ''){
         today = req.body.date;
       }
        var q = "SELECT Id,Name,uniqueId__c,Task_Description__c,Project_Type__c,No_of_Hours__c,Manager_Name__c,Manager__c,createdbyid,Created_Name__c,Task_Date__c,System_Date__c  FROM Task__c where System_Date__c = '"+today+"'";
            console.log('----tree vie ----'+q);
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
