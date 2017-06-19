
app.controller('listAccSpecializationCtrl', ['$scope', '$routeParams','$rootScope','$firebaseObject','$firebaseArray', function($scope, $routeParams,$rootScope ,$firebaseObject,$firebaseArray)
{
        console.info("inside me");
        var inputCategory = $rootScope.input; //store the value of input in inputCategory.
        console.log(inputCategory);
        var sampleArr =[];
        $rootScope.recordArray = [];

        
        // firebase query for comparing inputCategory, fetching the data and specialization from firebase database.
        var cityRef = firebase.database().ref("doctors");
        console.log(cityRef+"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<--");
        var recRef = cityRef.orderByChild("specialization").equalTo(inputCategory); 
        
        var list = $firebaseArray(recRef);
        list.$loaded()
        .then(function() {
        angular.forEach(list,function(element) {
        console.log("name:"+element.name);
        
        
    var commentsArray = element.review.split(":");
    var commentSend;
    var commentArraySend= [];
    var timeArraySend = [];
    var timeToSend;
    var mainKey;
    
    var totalRating=0;
    for(var i=0; i<commentsArray.length-1;i++){
      commentSend = {"ratingByUser" : commentsArray[i].split("`")[0],"commentByUser" : commentsArray[i].split("`")[1],"dateTimeByUser" : commentsArray[i].split("`")[2]}
      console.log(commentsArray[i]);
      totalRating=totalRating+parseInt(commentsArray[i].split("`")[0]);
      commentArraySend.push(commentSend);
}

      var avgRating = parseFloat(totalRating/(commentsArray.length-1));

        var timingsArray = String(element.timing).split("?");
        for(var i=0; i<timingsArray.length;i++)
        {
          timeToSend = {"dayTime" : timingsArray[i]};
          timeArraySend.push(timeToSend);
        }
    

   $rootScope.recordArray.push({"name":element.name,"city":element.city,"image" : element.image,"address" : element.address,
    "phone_number" : element.phone_number,"timings":timeArraySend,"qualification" : element.qualification,
    "specialization" : element.specialization, "website":element.website,"email": element.email,"languages":element.languages,
    "city":element.city,"latitude" : element.latitude,"longitude" : element.longitude,"rating" : commentArraySend, "avgRating" : avgRating
    //, "comment" : commentsArray, "dateTime" : dateTime
  });
    sampleArr.push({"name":element.name,"city":element.city,"image" : element.image,"address" : element.address,
    "phone_number" : element.phone_number,"timings":timeArraySend,"qualification" : element.qualification,
    "specialization" : element.specialization, "website":element.website,"email": element.email,"languages":element.languages,
    "city":element.city,"latitude" : element.latitude,"longitude" : element.longitude,"rating" : commentArraySend, "avgRating" : avgRating
    //, "comment" : comment, "dateTime" : dateTime
});

    });

  })
  .catch(function(error) {
    console.log("Error:", error);
  });
  // map code..
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

  $scope.initMap = function(){

                     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
                currentLat= position.coords.latitude;
                currentLon= position.coords.longitude;
       
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

$scope.formData={}; 
 
$scope.onComment=function()
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
    console.log(" var comment :"+comment);
    var cityRef = firebase.database().ref("doctors");
    var recRef =  cityRef.orderByChild("specialization").equalTo(inputCategory);
    recRef.on("child_added",function(snapshot){
              var previousComment = snapshot.child("review").val();
              if(snapshot.child("name").val() == name)
              {
                 var toUpdate = previousComment + rate +"`"+comment+"`"+today+":";
                 snapshot.ref.update({review : toUpdate});
              }
          })

    alert("Your comment has been sent ! ");
    $scope.formData.alltext="";
    $scope.formData.rate="";
}


}]);

