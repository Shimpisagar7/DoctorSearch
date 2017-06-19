
app.controller('homeCtrl', ['$scope','$interpolate','$location', function($scope, $interpolate, $location)
{
   //OnClick Funtion to redirect the page after clicking submit.  
    $scope.onSubmit = function()
    {
        console.log($scope.formModel);
        $scope.inputCity=$scope.formModel.city;
       // console.log(inp);
        var url = $interpolate('/medicalList/{{inputCity}}')($scope);
        console.log(url);
        $location.path(url); 
    }  



}]);


    function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}
