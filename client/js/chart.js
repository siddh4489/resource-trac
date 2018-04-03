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

       $scope.sfu = {'suser':$window.localStorage.getItem('sfuser'),'spassword':$window.localStorage.getItem('sfpassword')};
       
       Chart.getChartList($scope.sfu).success(function(datalist) {
           
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
     /* var data = google.visualization.arrayToDataTable([
            ["Employee", "Total Hours" ],
            ["Siddhraj", 100],
            ["Shantinath", 110],
            ["Pankaj", 89],
            ["Shubham", 56],
            ["Sweta", 16]
          ]);*/
        var data = new google.visualization.DataTable();
            data.addColumn('string','Employee');
            data.addColumn('number','Total Hours')
            for(var i =0; i<datalist;i++){
                var r = result[i];
                data.addRow([r.name, parseInt(r.hr)]); 
              }
        //alert(JSON.stringify(datalist));

          var view = new google.visualization.DataView(data);
          view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" }
                       ]);
              var options = {
                title: "March 2018 : Monthly Total Hour Worked, in hr/mo ",
                hAxis: {
                //direction:-1,
                slantedText:true,
                slantedTextAngle:90 // here you can even use 180
            },
            width: 450,
            height: 400,
            //bar: {groupWidth: "30%"},
            legend: { position: "left" },
          };
          var chart = new google.visualization.ColumnChart(document.getElementById("chart_div"));
          chart.draw(view, options);
             }  
       });
       

      /* $scope.submit = function () {
           Task.create($scope.task).success(function() {
                     $ionicPopup.alert({title: 'Thank You', content: 'Your Task submitted successfully.'});
                     $scope.task = {};
                });
          
        };*/

    });
