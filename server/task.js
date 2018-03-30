    var db = require('./pghelper'),
    config = require('./config'),
    nforce = require('nforce');
     
function managerList(req, res, next) {
    console.log('---getManager--->'+req);
    console.log('---getManager 1--->'+req.body.spassword);
    console.log('---getManager 2--->'+req.body.suser);
    console.log('---getManager 3 --->'+JSON.stringify(req.body));
    

    var oauth;
     org = nforce.createConnection({
            clientId: config.api.clientId,
            clientSecret: config.api.clientSecret,
            redirectUri: config.api.redirectUri,
            apiVersion: config.api.apiVersion,  // optional, defaults to current salesforce API version
            environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
            mode: 'single' // optional, 'single' or 'multi' user mode, multi default
        });

    //org.authenticate({ username: userName, password: password}, function(err, resp) {

    org.authenticate({ username: req.body.suser, password: req.body.spassword}, function(err, resp) {
        if(!err) {
        var q = "SELECT Id, Name FROM User";
 
        org.query({ query: q }, function(err, resp){
            
              if(!err && resp.records) {
                 console.log('---getManager List--->'+resp.records);
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


function createTask(req, res, next) {
    console.log('---createTask name --->'+req.body.name);
    console.log('---createTask desc --->'+req.body.desc);
    console.log('---createTask hours--->'+req.body.hours);
    console.log('---createTask managerid--->'+req.body.managerid);
    console.log('---createTask projecttype--->'+req.body.projecttype);
    
    console.log('---createTask 1--->'+req.body.spassword);
    console.log('---createTask 2--->'+req.body.suser);
    console.log('---createTask 3 --->'+JSON.stringify(req.body));
    
    var taskObj = nforce.createSObject('Task__c');
            taskObj.set('No_of_Hours__c', req.body.hours);
            taskObj.set('Project_Type__c', req.body.projecttype);
            taskObj.set('Task_Description__c', req.body.desc);
            taskObj.set('Task_Name__c', req.body.name);
            taskObj.set('Manager__c', req.body.managerid);
           
            org.insert({ sobject: taskObj}, function(err, resp){
                if (err) {
                    console.log('First Task insert failed: ' + JSON.stringify(err));
                    org.authenticate({username: req.body.suser, password: req.body.spassword}, function(err) {
                        if (err) {
                            console.log('Authentication failed: ' + JSON.stringify(err));
                            return next(err);
                        } else {
                            org.insert({ sobject: taskObj}, function(err, resp) {
                                if (err) {
                                    console.log('Second case insert failed: ' + JSON.stringify(err));
                                    return next(err);
                                } else {
                                    console.log('Second case insert worked');
                                    return res.send('ok');
                                }
                            });
                        }
                    })
                } else {
                    console.log('First case insert worked');
                    res.send('ok');
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

exports.createTask = createTask;
exports.managerList = managerList;
exports.revokeToken = revokeToken;
