angular.module('nibs.profile', ['nibs.config'])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.profile', {
                url: "/home",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/profile.html",
                        controller: "ProfileCtrl"
                    }
                }
            })

            .state('app.edit-profile', {
                url: "/edit-profile",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/edit-profile.html",
                        controller: "EditProfileCtrl"
                    }
                }
            })

    })

    // Services
    .factory('User', function ($http, $rootScope) {
        return {
            get: function () {
                return $http.get($rootScope.server.url + '/users/me', null)
            },

            update: function (user) {
                return $http.put($rootScope.server.url + '/users/me', user)
            },
            getResourveView: function(theTasklst) {
                return $http.post($rootScope.server.url + '/resourceview/',theTasklst);
            }
            /*getViewOnSelectedDate: function(theTasklst) {
                return $http.post($rootScope.server.url + '/resourceview/',theTasklst);
            }*/
            
            
        };

    })

    .factory('Taskview', function ($http, $rootScope) {
        return {
      
            getResourveView: function(theTasklst) {
                return $http.post($rootScope.server.url + '/resourceview/',theTasklst);
            }
        };

    })

    .factory('Preference', function() {

        var preferences = [
            { text: 'Shred', value: 'Shred' },
            { text: 'Open/Scan', value: 'Open/Scan' },
            { text: 'Fwd', value: 'Fwd' }
        ];

        return {
            all: function() {
                return preferences;
            }
        }
    })

    .factory('Size', function() {

        var sizes = [
            { text: 'USPS', value: 'USPS' },
            { text: 'FedEx', value: 'FedEx' },
            { text: 'UPS', value: 'UPS' },
            { text: 'Courier', value: 'Courier' }
        ];

        return {
            all: function() {
                return sizes;
            }
        }
    })

    //Controllers
    .controller('ProfileCtrl', function ($rootScope, $scope,$window, $state, Taskview, STATUS_LABELS, STATUS_DESCRIPTIONS) {
   
    
    $scope.sfu = {'date':'','suser':$window.localStorage.getItem('sfuser'),'spassword':$window.localStorage.getItem('sfpassword'),'uid':$window.localStorage.getItem('uid')};

        $(".date-picker").datepicker();
        $(".date-picker").on("change", function () {
            $scope.sfu.date =  $("#date-picker-3").val();
        });
      $rootScope.username = $window.localStorage.getItem('username');
      $scope.taskview = {};
    $scope.view = function () {
    Taskview.getResourveView($scope.sfu).success(function(datalist) {
                
                   var taskDataList = [];
                   if(datalist.length>0){
                      for(i=0;i<datalist.length;i++){
                       var taskData = {};
                        taskData.id = datalist[i].uniqueid__c;
                        taskData.parentId = datalist[i].manager__c;
                        taskData.taskname = 'Task :'+datalist[i].name;
                        taskData.desc = 'Description :'+datalist[i].task_description__c;
                        taskData.project = 'Project Type :'+datalist[i].project_type__c;
                        taskData.image = 'data:image/png;base64,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';
                        taskData.hours = 'Hours :'+datalist[i].no_of_hours__c;
                        taskData.name = datalist[i].created_name__c;
                        taskDataList.push(taskData);
                   }
                       
                   var peopleElement = document.getElementById("people");
                    var orgChart = new getOrgChart(peopleElement, {
                        color:"mediumdarkblue",
                        enableEdit: false,
                        //scale: 0.5,
                        //siblingSeparation: 20,
                        primaryFields: ["name","taskname","desc","project","hours"],
                        photoFields: ["image"],
                        dataSource: taskDataList,
                        renderNodeEvent: renderNodeEventHandler

                    });
                    
                   function renderNodeEventHandler(sender, args) {
                   
                        var hours = parseInt(args.node.data["hours"].split(":")[1]);
                        var hex;
                           if(hours<3){
                             hex = '#b32400'
                            }else if(hours>=3 && hours<6){
                              hex = '#004d99';
                            }else{
                              hex = '#669900';  
                            }
                        args.content[1] = args.content[1].replace("rect", "rect style='fill: " + hex + "; stroke: " + hex + ";'")
                    }
    
                  }else{
                    document.getElementById("people").innerHTML= "<H5 style='text-align:center;'>No Records</H5>";
                  }
                
                    
                    
                  
             });
          }; 
    })

    .controller('EditProfileCtrl', function ($scope, $window, $ionicPopup, S3Uploader, User, Preference, Size, Status) {

        User.get().success(function(user) {
            $scope.user = user;
        });
        $scope.preferences = Preference.all();
        $scope.sizes = Size.all();

        $scope.panel = 1;

        $scope.update = function () {
            //alert('user json'+JSON.stringify($scope.user));
            User.update($scope.user).success(function() {
                Status.show('Your profile has been saved.');
            })
        };

        $scope.addPicture = function (from) {
        //    alert('camera'+navigator.camera);
            if (!navigator.camera) {
                $ionicPopup.alert({title: 'Sorry', content: 'This device does not support Camera'});
                return;
            }

            var fileName,
                options = {   quality: 45,
                    allowEdit: true,
                    targetWidth: 300,
                    targetHeight: 300,
                    destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.JPEG };
            if (from === "LIBRARY") {
                options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                options.saveToPhotoAlbum = false;
            } else {
                options.sourceType = Camera.PictureSourceType.CAMERA;
                options.saveToPhotoAlbum = true;
            }

            navigator.camera.getPicture(
                function (imageURI) {
                    // without setTimeout(), the code below seems to be executed twice.
                    setTimeout(function () {
                        fileName = new Date().getTime() + ".jpg";
                        S3Uploader.upload(imageURI, fileName).then(function () {
                            //alert('S3uploader called'+fileName);
                            //$scope.user.pictureurl = 'https://s3-us-west-1.amazonaws.com/sfdc-demo/' + fileName;
                              $scope.user.pictureurl = 'https://s3.amazonaws.com/mailgapp/'+fileName;
                        });
                    });
                },
                function (message) {
                    // We typically get here because the use canceled the photo operation. Seems better to fail silently.
                }, options);
            return false;
        };
    });
