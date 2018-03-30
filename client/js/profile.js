angular.module('nibs.profile', ['nibs.s3uploader', 'nibs.config', 'nibs.status'])

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
       
      $scope.taskview = {};
        $scope.sfu = {'suser':$window.localStorage.getItem('sfuser'),'spassword':$window.localStorage.getItem('sfpassword')};
            Taskview.getResourveView($scope.sfu).success(function(datalist) {
                
                   var taskDataList = [];
                    for(i=0;i<datalist.length;i++){
                       var taskData = {};
                        taskData.id = datalist[i].createdbyid;
                        taskData.parentId = datalist[i].manager__c;
                        taskData.taskname = 'Task :'+datalist[i].task_name__c;
                        taskData.desc = 'Description :'+datalist[i].task_description__c;
                        taskData.project = 'Project Type :'+datalist[i].project_type__c;
                        taskData.image = 'data:image/png;base64,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';
                        taskData.hours = 'Hours :'+datalist[i].no_of_hours__c;
                        taskData.name = datalist[i].created_name__c;
                        taskDataList.push(taskData);
                    }
                
                    console.log('taskDataList---'+taskDataList);
                    var peopleElement = document.getElementById("people");
                    var orgChart = new getOrgChart(peopleElement, {
                        color:"mediumdarkblue",
                        enableEdit: false,
                        //scale: 0.5,
                        //siblingSeparation: 20,
                        primaryFields: ["name","taskname","desc","project","hours"],
                        photoFields: ["image"],
                        dataSource: taskDataList
                    });
             });
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
