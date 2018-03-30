angular.module('nibs.task', ['nibs.config'])

    // Routes
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.task', {
                url: "/task",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/task.html",
                        controller: "TaskController"
                    }
                }
            })
    })

    // Services
    .factory('Task', function ($http, $rootScope) {
        return {
            create: function(theTask) {
                return $http.post($rootScope.server.url + '/task/', theTask);
            },
            getManager: function(theManager) {
                return $http.post($rootScope.server.url + '/manager', theManager);
            }
        };
    })

    //Controllers
    .controller('TaskController', function ($scope, $window, $ionicPopup, Task, User) {
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
       $("#date").text(today);
       $scope.manager = {};
       $scope.task = {};
       $scope.task = {managerid:'',projecttype:'',suser: $window.localStorage.getItem('sfuser'),spassword: $window.localStorage.getItem('sfpassword')};
       var managerList;
       $scope.sfu = {'suser':$window.localStorage.getItem('sfuser'),'spassword':$window.localStorage.getItem('sfpassword')};
       var mId;
       var pName;
       Task.getManager($scope.sfu).success(function(datalist) {
           $("#manager").dxLookup({
                        items: datalist,
                        title: "Select Manager",
                        displayExpr: "name",
                        placeholder: "Select Task Manager / Assignee",
                        onValueChanged: function(data) {
                              mId = data.value.id;
                              $scope.task.managerid =  mId;

                        }
                 });
        });
         
    
             var projectType = ["Subscription","Deployment time reduction","Code Optimization","Config Cleanup","Data Purge","Platform Enhancements","UIPM","INC","Self Study"];
    
               $("#project").dxLookup({
                        items: projectType,
                        title: "Select Project Type",
                        placeholder: "Select Project Type",
                        onValueChanged: function(data) {
                            pName = data.value;
                            $scope.task.projecttype =  pName;
                           
                        }
                    });
       

       $scope.submit = function () {
           Task.create($scope.task).success(function() {
                     $ionicPopup.alert({title: 'Thank You', content: 'Your Task submitted successfully.'});
                     $scope.task = {};
                });
          
        };

    });
