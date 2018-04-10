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
    
           .state('app.chart1', {
                url: "/projectchart",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/projectchart.html",
                        controller: "ProjectChartController"
                    }
                }
            })

    })

    // Services
    .factory('Chart', function ($http, $rootScope) {
        return {
            getChartList: function(theData) {
                return $http.post($rootScope.server.url + '/chart', theData);
            },
            getProjectChartList: function(theData) {
                return $http.post($rootScope.server.url + '/projectchart', theData);
            }
        };
    })

    //Controllers
    .controller('ChartController', function ($scope,$rootScope, $window, $ionicPopup,Chart,User) {
       $(document).ready(function() {
		$('.Default').MonthPicker();

		// Hide the icon and open the menu when you 
		// click on the text field.
		$('#NoIconDemo').MonthPicker({ Button: false });

 	});	
	
       $rootScope.username = $window.localStorage.getItem('username');

       $scope.sfu = {'suser':$window.localStorage.getItem('sfuser'),'spassword':$window.localStorage.getItem('sfpassword')};
       
       Chart.getChartList($scope.sfu).success(function(datalist) {
           
    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      
        var data = new google.visualization.DataTable();
            data.addColumn('string','Employee');
            data.addColumn('number','Total Hours')
            for(var i =0; i<datalist.length;i++){
                var r = datalist[i];
                data.addRow([(r.name).split(" ")[0], parseInt(r.hr)]); 
              }

          var view = new google.visualization.DataView(data);
          view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" }
                       ]);
              var options = {
                title: "March 2018 ",
		tooltip: {
		    isHtml: true,
		    trigger: 'both'
		},
                hAxis: {
                //direction:-1,
                slantedText:true,
                slantedTextAngle:90,
	        title: 'Total Hours',
		minValue: 0,
            },vAxis: {
		  title: 'Employees'
		},
		      
            width: 500,
            height: 400,
            //bar: {groupWidth: "30%"},
            legend: { position: "left" },
          };
          var chart = new google.visualization.ColumnChart(document.getElementById("chart_div"));
          chart.draw(view, options);
             }  
        $(window).resize(function(){
          drawChart();
        });   
       });
      
    })
    
  .controller('ProjectChartController', function ($scope,$rootScope, $window, $ionicPopup,Chart,User) {
       $rootScope.username = $window.localStorage.getItem('username');

       $scope.sfu = {'suser':$window.localStorage.getItem('sfuser'),'spassword':$window.localStorage.getItem('sfpassword')};
       
       Chart.getProjectChartList($scope.sfu).success(function(datalist) {
	    google.charts.load('current', {'packages':['corechart','corechart', 'bar']});
            google.charts.setOnLoadCallback(drawbarChart);
           
           function drawbarChart() {                                                        
                                                                      
                var data = new google.visualization.DataTable();
                data.addColumn('string','Employees');
                data.addColumn('number','Subscription');
                data.addColumn('number','Deployment time reduction');
                data.addColumn('number','Code Optimization');
                data.addColumn('number','Config Cleanup');
                data.addColumn('number','Data Purge');
                data.addColumn('number','Platform Enhancements');
                data.addColumn('number','UIPM');
                data.addColumn('number','INC');
                data.addColumn('number','Self Study');
               
                var projectType = ["Subscription","Deployment time reduction","Code Optimization","Config Cleanup","Data Purge","Platform Enhancements","UIPM","INC","Self Study"];  

				var names = [];
				var index;
				for(var i=0;i<datalist.length;i++)
				{
					index= names.indexOf(datalist[i].name);
					
					if(index == -1)
					{
					 names.push(datalist[i].name);
					}
				}
				var abc="";
				var hr;
				for(i=0;i<names.length;i++){
					abc="";
					abc+=names[i];
					
					for(j=0;j<projectType.length;j++)
					{
					  hr=0;
					for(k=0;k<datalist.length;k++)
					 {
						   if(names[i]==datalist[k].name && projectType[j] == datalist[k].project_type__c)
						   {
						   console.log(names[i]+"  "+projectType[j]+" "+datalist[k].hr);
					   hr=datalist[k].hr;       
						   }
						}
						if(hr!=0)
						{
						 abc+=","+hr;
						}
						else
						{
						 abc+=","+"0";
						}
					}
					//alert(""+abc);
					data.addRow([(abc.split(",")[0]).split(" ")[0], parseInt(abc.split(",")[1]), parseInt(abc.split(",")[2]),parseInt(abc.split(",")[3]),parseInt(abc.split(",")[4]),parseInt(abc.split(",")[5]),parseInt(abc.split(",")[6]),parseInt(abc.split(",")[7]),parseInt(abc.split(",")[8]),parseInt(abc.split(",")[9])]); 

				}


                       var view = new google.visualization.DataView(data);
			   view.setColumns([0, 1,
				       { calc: "stringify",
					 sourceColumn: 1,
					 type: "string",
					 role: "annotation" }
				       ]);


			var options = {
				title: 'March 2018',
				legend: { position: 'top', maxLines: 4 },
				isStacked: true,
				 tooltip: {
				    isHtml: true,
				    trigger: 'both'
				},
				hAxis: {
				  title: 'Total Hours',
				  minValue: 0,
				},
				vAxis: {
				  title: 'Employees'
				},
				width: 500,
            			height: 400,
			  };

                var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
                chart.draw(data, options);
              }


       });
       
    });

  
