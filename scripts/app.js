
var app= angular.module("test",["firebase","ngRoute"])
app.config(function($routeProvider){
    $routeProvider.when('/',{
        templateUrl: 'medicalIndex.html',
        controller: 'testCtrl',
    })
    .when('/medicalSearchMain',{
        templateUrl: 'medicalSearchMain.html',
        controller : 'homeCtrl'
    })
    .when('/medicalList/:inputCity',{
        templateUrl: 'medicalList.html',
        controller: 'listDetCtrl'
    })

    .otherwise({
        redirectTo: '/medicalSearchMain'
      });

   
});

app.controller("testCtrl", function($scope, $location){
    $location.path("/medicalSearchMain");
});

