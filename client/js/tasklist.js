angular.module('nibs.tasklist', ['nibs.config'])

    // Routes
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.tasklist', {
                url: "/tasklist",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/tasklist.html",
                        controller: "TaskListController"
                    }
                }
            })
    })

    // Services
    .factory('Tasklist', function ($http, $rootScope) {
        return {
            getTaskList: function(theTasklst) {
                return $http.post($rootScope.server.url + '/tasklist/',theTasklst);
            }
        };
    })

    //Controllers
    .controller('TaskListController', function ($scope, $window, $ionicPopup, Tasklist, User) {
        $scope.claimlist = {};
        $scope.sfu = {'suser':$window.localStorage.getItem('sfuser'),'spassword':$window.localStorage.getItem('sfpassword'),'uid':$window.localStorage.getItem('uid')};
            Tasklist.getTaskList($scope.sfu).success(function(datalist) {
                     $scope.claimlist = datalist;
                });
  });
