  
app.controller('listDetCtrl', ['$scope', '$routeParams','$rootScope','$firebaseObject','$firebaseArray', function($scope, $routeParams,$rootScope ,$firebaseObject,$firebaseArray)
{
        var inputCity = $routeParams.inputCity; // Accessing input Parameter.
        console.log(inputCity);
        var sampleArr =[];
        $rootScope.recordArray = [];

       
        //Firebase query for comparning the inputCity & city from database, fetching the data and pushing it into an array
        var cityRef = firebase.database().ref("medicals");
        var recRef = cityRef.orderByChild("city").equalTo(inputCity);
        
        //adding the data to list and itereating each element.

        var list = $firebaseArray(recRef);
        list.$loaded()
        .then(function() {
        angular.forEach(list,function(element) {

                   var timeArraySend = [];
          var timingArray = String(element.timing).split("?");

        for(var i=0;i<timingArray.length;i=i+1)
        {
          console.log(timingArray[i]);
            timeToSend = {"dayTime" : timingArray[i]};
            timeArraySend.push(timeToSend);
        }
        //adding values to array to show on html.
        
        $rootScope.recordArray.push({"Name":element.name,"Contact":element.phone_number,"Image" :element.image,
        "Timing":timeArraySend,"Address":element.address,"city" : element.city,"latitude":element.latitude,"longitude":element.longitude
        
    });
        sampleArr.push({"Name":element.name,"Contact":element.phone_number,"Image" : element.image,
        "Timing":timeArraySend,"Address":element.address,"city":element.city,"latitude":element.latitude,"longitude":element.longitude});
   
  });
  })
  .catch(function(error) {
    console.log("Error:", error);
  });

/*code map*/
var map;
var marker;
var currentLat;
var currentLon;
var currentLatLon;
var prevLati;
var prevLongi;
var isShowingSomething = false;
var markerArray = [];
var directionsDisplay;
//Wrinting a function to initializa google maps.

  $scope.initMap = function(){

                if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
                currentLat= position.coords.latitude;
                currentLon= position.coords.longitude;
       
                 var myCenter = new google.maps.LatLng(currentLat,currentLon);//(51.508742,-0.120850);
                 currentLatLon = new google.maps.LatLng(currentLat, currentLon);
                 var mapCanvas = document.getElementById("map");
                 console.log("hi");
                 var mapOptions = {center: myCenter, zoom: 14,  mapTypeId: google.maps.MapTypeId.ROADMAP};
                 map = new google.maps.Map(mapCanvas, mapOptions);
                 marker = new google.maps.Marker({
                 position: myCenter,
                 animation: google.maps.Animation.DROP
                 });                
                 marker.setMap(map);
                 markerArray.push(marker);
                 
                 }) }
                 
            }
//A function to calculate distance usign latitude and longitude.

   $scope.distanceCalculator = function calculateAndDisplayRoute(lati,longi) {
     if(directionsDisplay != null) { 
   directionsDisplay.setMap(null);
   directionsDisplay.setOptions( { suppressMarkers: true } );

   directionsDisplay = null; }

   if(markerArray.length > 1){
     console.log("The length is more than 1 ." + markerArray.length);
   for(var i=1; i<markerArray.length; i=i+1){
        markerArray[i].setMap(null);
    }
    markerArray.length=1;
    }
    //markerArray = [];
     
          directionsDisplay = new google.maps.DirectionsRenderer({
    'map': map,
    'preserveViewport': true,
    'draggable': true
});

          directionsDisplay.setOptions( { suppressMarkers: true } );
          var directionsService = new google.maps.DirectionsService();

          console.log("Current position = " + currentLat + "     " + currentLon);
          console.log("Destination position = " + lati + "     " + longi);
          var selectedMode = document.getElementById('mode').value;
        
          prevLati=lati;
          prevLongi=longi;

          directionsService.route({
            origin: {lat: parseFloat(currentLat), lng: parseFloat(currentLon)},  
            destination: {lat: parseFloat(lati), lng: parseFloat(longi)},  
            optimizeWaypoints: true,
            provideRouteAlternatives: true,
            // Note that Javascript allows us to access the constant
            // using square brackets and a string value as its
            // "property."
            travelMode: google.maps.TravelMode[selectedMode]
          }, 

          //Setting directions on the map between two points.


          function(response, status) {
            if (status == 'OK') {
             directionsDisplay.setDirections(response);

             var distance = response.routes[0].legs[0].distance.text;
             var time = response.routes[0].legs[0].duration.text;

             $scope.distanceModel = distance;
             $scope.timeModel = time;

              var contentString = "<div> Distance = " + $scope.distanceModel + "Duration = " + $scope.timeModel + "</div>";
        var infowindow = new google.maps.InfoWindow({
          content: "<div> Distance = " + $scope.distanceModel + " Duration = " + $scope.timeModel + "</div>"
        });

        var markerNew = new google.maps.Marker({
          position: new google.maps.LatLng(lati, longi),
          map: map,
          title: "Distance = " + $scope.distanceModel + " Duration = " + $scope.timeModel
        
      });
        markerArray.push(markerNew);
        
        markerNew.addListener('click', function() {
          infowindow.open(map, markerNew);
        });


             console.log("Distance = " + distance);
             console.log("Duration = " + time);
             
             isShowingSomething=true;
            } else {
              window.alert('Directions request failed due to ' + status);
            }
        });
        
      }
      //A function to set marker on the map.

  $scope.setMarker = function(lati,longi){
   console.log(lati);
    
    var latlng = new google.maps.LatLng(lati, longi);
    map.setZoom(14);
    map.setCenter(latlng);

    marker = new google.maps.Marker({
                 position: latlng,
                 animation: google.maps.Animation.DROP
                 });   

    marker.setPosition(latlng);
    markerArray.push(marker);

        $scope.distanceCalculator(lati,longi);
        document.getElementById('mode').addEventListener('change', function() {
                
          $scope.distanceCalculator(lati, longi);
        });


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