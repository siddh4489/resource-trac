angular.module('nibs.chart', ['nibs.config'])

    // Routes
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.chart', {
                url: "/chart",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/chart.html",
                        controller: "ChartController"
                    }
                }
            })
    })

    // Services
    .factory('Chart', function ($http, $rootScope) {
        return {
            getChartList: function(theData) {
                return $http.post($rootScope.server.url + '/chart', theData);
            }
        };
    })

    //Controllers
    .controller('ChartController', function ($scope, $window, $ionicPopup,Chart,User) {
        

       //$scope.sfu = {'suser':$window.localStorage.getItem('sfuser'),'spassword':$window.localStorage.getItem('sfpassword')};
       
       Chart.getChartList($scope.sfu).success(function(datalist) {
           
       });
       

      /* $scope.submit = function () {
           Task.create($scope.task).success(function() {
                     $ionicPopup.alert({title: 'Thank You', content: 'Your Task submitted successfully.'});
                     $scope.task = {};
                });
          
        };*/

    });
