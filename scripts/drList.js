app.controller("drlistCtrl",function ($scope,$routeParams,$firebaseObject,$rootScope,$firebaseArray,$filter) {
   
/* fetching parameters for routing purpose */

    var SelectedCategory=$routeParams.selectedCategory;
    var SelectedCity=$routeParams.selectedCity;
    var SelectedInsurance=$routeParams.selectedInsurance;



var sampleArr =[];
        $rootScope.recordArray = [];  

/*Creating referenec to firebase and doctor child*/ 
        var cityRef = firebase.database().ref("doctors");
        console.log(cityRef+"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<--");
     
       var recRef =  cityRef.orderByChild("city").equalTo(SelectedCity);

/*loading all records in list and looping throught each element*/ 

 var list = $firebaseArray(recRef);
 list.$loaded()
   .then(function() {
    angular.forEach(list,function(element) {
      if(element.specialization == SelectedCategory){
    
    
    var commentsArray = element.review.split(":");
    var commentSend;
    var commentArraySend= [];
    var timeArraySend = [];
    var timeToSend;
    var mainKey;
    
//Calculating average ratings

    var totalRating=0;
    for(var i=0; i<commentsArray.length-1;i++){
      commentSend = {"ratingByUser" : commentsArray[i].split("`")[0],"commentByUser" : commentsArray[i].split("`")[1],"dateTimeByUser" : commentsArray[i].split("`")[2]}
      console.log(commentsArray[i]);
      totalRating=totalRating+parseInt(commentsArray[i].split("`")[0]);
      commentArraySend.push(commentSend);
}

      var avgRating = parseFloat(totalRating/(commentsArray.length-1));

        var timingsArray = String(element.timing).split("?");
        //Storing timings on array
        for(var i=0; i<timingsArray.length;i++)
        {
          timeToSend = {"dayTime" : timingsArray[i]};
          timeArraySend.push(timeToSend);
        }
    
//Storing data on array that we have to return.
   $rootScope.recordArray.push({"name":element.name,"city":element.city,"image" : element.image,"address" : element.address,
    "phone_number" : element.phone_number,"timings":timeArraySend,"qualification" : element.qualification,
    "specialization" : element.specialization, "website":element.website,"email": element.email,"languages":element.languages,
    "latitude" : element.latitude,"longitude" : element.longitude,"rating" : commentArraySend, "avgRating" : avgRating
    //, "comment" : commentsArray, "dateTime" : dateTime
  });
    sampleArr.push({"name":element.name,"city":element.city,"image" : element.image,"address" : element.address,
    "phone_number" : element.phone_number,"timings":timeArraySend,"qualification" : element.qualification,
    "specialization" : element.specialization, "website":element.website,"email": element.email,"languages":element.languages,
    "latitude" : element.latitude,"longitude" : element.longitude,"rating" : commentArraySend, "avgRating" : avgRating
    //, "comment" : comment, "dateTime" : dateTime
});

}
    });
   })
   .catch(function(error) {
     console.log("Error:", error);
   });



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
       //centering a marker on map.
                 var myCenter = new google.maps.LatLng(currentLat,currentLon);//(51.508742,-0.120850);
                 currentLatLon = new google.maps.LatLng(currentLat, currentLon);
                 var mapCanvas = document.getElementById("map");
                 
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
              //window.alert('Directions request failed due to ' + status);
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


/* code for processing ng-model values of rating and comments */

$scope.formData={}; 
 
$scope.onComment=function(name,SelectedCity)
{
    var rate= $scope.formData.rate;
    console.log("Ratings = " + rate);
    console.log("main key rate: "+ name);
    var comment= $scope.formData.alltext;
    var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd='0'+dd
} 

if(mm<10) {
    mm='0'+mm
} 

today = mm+'-'+dd+'-'+yyyy;

    if(comment==null || rate==null)
    {
      alert("Enter a valid comment.");
      return;
    }
    else
    {
        //updahe comment in the database
    var cityRef = firebase.database().ref("doctors");
    var recRef =  cityRef.orderByChild("city").equalTo(SelectedCity);
    recRef.on("child_added",function(snapshot){

      
              var previousComment = snapshot.child("review").val();
              console.log("Previous = " + previousComment);
            
              if(snapshot.child("name").val() == name)
              {
                 var toUpdate = previousComment + rate +"`"+comment+"`"+today+":";
                 snapshot.ref.update({review : toUpdate});
                 alert("Your comment has been sent ! ");              
              }
          })

    /* clearing the rating box and textarea */

    $scope.formData.alltext="";
    $scope.formData.rate="";
    }
}


});//controller "drlistCtrl"