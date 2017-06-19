// module for config file
var app = angular.module("drSearchNg", ["ngRoute","firebase"]);

/* configuration file for routing, mapping html pages to respective controllers*/
app.config(function($routeProvider) {
    $routeProvider

    .when("/drIndex",{

        templateUrl : "drIndex.html",
        controller : "mainCtrl"
    })

    .when("/drSearchMain",{

        templateUrl : "drSearchMain.html",
        controller : "drsearchCtrl"
    })
  
    .when("/drList/:selectedCategory/:selectedCity/:selectedInsurance" , {
        templateUrl : "drList.html",
        controller : "drlistCtrl"
    })
    
    .otherwise({
        redirectTo: '/drSearchMain'
      });
});
/* controller for main page */
app.controller("mainCtrl", function($location){

$location.path('/drSearchMain');

});

app.controller("drsearchCtrl", function(){


});

