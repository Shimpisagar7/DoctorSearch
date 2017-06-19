var app= angular.module("test",["firebase","ngRoute"])
//Config file for Routing through all Pages of Medical Store Search.
app.config(['$routeProvider',function($routeProvider)
{
    $routeProvider.when('/listAccCity', 
    {
        templateUrl: 'listAccCity.html',
        controller : 'listAccCityCtrl'
    })
    .when('/indexDetails', 
    {
        templateUrl: 'indexDetails.html',
        controller : 'indexDetCtrl',
        
    })
    .when('/listAccSpecialization', 
    {
        templateUrl: 'listAccSpecialization.html',
        controller : 'listAccSpecializationCtrl'
    })
    .when('otherwise',
    {
        template: '<strong>No Content Available</strong>'
    })
}]);
// Controller for indexDetails.html to perform funtionality.
app.controller('indexDetCtrl',['$scope','$rootScope','$routeParams','$interpolate','$location','$window', function($scope, $rootScope, $routeParams, $interpolate, $location,$window){

    var url = new URL($location.absUrl());
    console.info("url valures==>>"+url.searchParams.get("detail"));
    $rootScope.input =url.searchParams.get("detail");
    
    if($rootScope.input == "Heidelberg" || $rootScope.input == "Mannheim" || $rootScope.input =="Berlin" || $rootScope.input == "Walldorf")
    {
        var url = $interpolate('/listAccCity')($scope);  
        console.log(url);
        $location.path(url);
        console.info("bypassed");
        // $window.location.href = '/listAccCity';
        //$location.path('/listAccCity?input'); 
    }
    else
    {
         var url = $interpolate('/listAccSpecialization')($scope);
         console.log(url);
         $location.path(url); 
       // $location.path('/listAccSpecialization?input');
    }

}]);


