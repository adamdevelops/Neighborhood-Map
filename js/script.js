
// //Open the drawer when the menu ison is clicked.
// var menu = document.querySelector('#search-menu');
// var main = document.querySelector('main');
// var drawer = document.querySelector('#drawer');
//
// menu.addEventListener('click', function(e) {
//     drawer.classList.toggle('open');
//     e.stopPropagation();
// });
// main.addEventListener('click', function() {
//     drawer.classList.remove('open');
// });


var initialMarkers = [
    {
      title: "Bubbly Tea",
      type: "tea",
      lat: 40.7152875,
      lng: -73.9977593
    },
    {
      title: "Confucius Plaza",
      type: "sight seeing",
      lat: 40.7158642,
      lng: -73.9954891
    },
    {
      title: "Nom Wah Tea Palor",
      type: "tea",
      lat: 40.7144448,
      lng: -73.9982542
    },
    {
      title: "Great NY Noodle Town",
      type: "noodles",
      lat: 40.7150319,
      lng: -73.997038
    },
    {
      title: "Golden Fung Wong Bakery Shop",
      type: "bakery",
      lat: 40.7151294,
      lng: -73.9988711
    },
    {
      title: "Noodle Village",
      type: "noodles",
      lat: 40.7141342,
      lng: -73.9989576
    }

];

// Code for OpenWeather API
function initWeatherAPI() {
  console.log("Entering initWeatherAPI");

  $(document).ready(function() {

    //var $currentWeather = $('#weather');

    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/weather?q=NewYork&appid=5a27d887bbdde6caf751f24ec02c5a1b&units=metric",
      type: "GET",
      dataType: "jsonp",
      success: function(data) {
        console.log(data);
        console.log(data.weather[0].main);
        console.log(data.weather[0].main);
        temp = Math.trunc(((data.main.temp * 9)/5) + 32);

        $( "#forecast" ).html( "<div id='temp_display'>"
        +"<img id='icon' src ='http://openweathermap.org/img/w/"+data.weather[0].icon+".png'><div id='temp'>"+temp+"&deg;</div></div><div id='weather-title'><p>"+data.weather[0].description
        +"</p></div><div id='api-credit'>powered by OpenWeatherAPI</div>");

      },
      error: function() {

        console.log("Error accessing API");
        $( "#forecast" ).html("Error accessing API");

      }

      });
  });

  console.log("Exiting initWeatherAPI");
}


// Code for Google Maps API
var initialMarkers_length = initialMarkers.length;

var markers = [];
var markers_infowindow = [];

var marker;

function initMap() {
  console.log("Entering initMap");

  var uluru = {lat: 40.710348, lng: -73.998234}; //Location on China Town
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: uluru,
    // mapTypeControl: false,
    disableDefaultUI: true
  });

  //If the screen-width is less than 750px, adjust the map
  if($(document).width() <= 750) {
        map.zoom = 16;
    }

  for (i = 0; i < initialMarkers_length; i++){
    markers[i] = new google.maps.Marker({
      position: {lat: initialMarkers[i].lat, lng: initialMarkers[i].lng},
      animation: google.maps.Animation.DROP,
      map: map,
      title: initialMarkers[i].title,
      id: i
    });

    var infoWindow_content = initialMarkers[i].title;

    markers_infowindow[i] = new google.maps.InfoWindow({
              content: infoWindow_content,
            });


    console.log(markers[i].title);
    marker = markers[i];

    marker.addListener('click', toggleBounceInfoWindow);

    console.log(initialMarkers[i]);
    console.log("end of markers");


  }

  var vm = new ViewModel();
  ko.applyBindings(vm);

  console.log("Exiting initMap");

}


//Toggle the bounce animation for selected marker
function toggleBounceInfoWindow() {
        if (this.getAnimation() !== null) {
          this.setAnimation(null);
          markers_infowindow[this.id].close(map, this); //Close the info window for the according marker
        } else {
          this.setAnimation(google.maps.Animation.BOUNCE); //Set markers animation to bounce
          markers_infowindow[this.id].open(map, this); //Open the info window for the according marker
        }
      }


// var Location = function(data){
//   this.title = ko.observable(data.title);
//   this.lat = ko.observable(data.lat);
//   this.lng = ko.observable(data.lng);
//   this.id = ko.observable(data.id);
//
// }


// Code for the ViewModel
var ViewModel = function(){
    console.log("Entering ViewModel");

    var self = this;    //--- referencing the ViewModel itself, thus the outer this outside of the div of where we applied the 'with data-bind'

    //KnockOut array of list of recommended locations
    this.locationsList = ko.observableArray([]);

    this.searchTerm = ko.observable("");

    console.log(markers);


    //Add initial marker locations
    initialMarkers.forEach(function(locationItem, i){
      //console.log(locationItem);
      self.locationsList.push(locationItem);
      //console.log(self.locationsList());
    });

    //Testing to see content of locationsList observableArray
    console.log("index 1 without marker");
    console.log(this.locationsList()[1]);

    //Set default currentLocation to first location in the array
    this.currentLocation = ko.observable(this.locationsList()[0]);

    //Store the Google Map markers for each location as a property for each location
    for (i = 0; i < initialMarkers_length; i++){
      this.locationsList()[i].marker = markers[i];
    }

    console.log("index 1 with marker");
    console.log(this.locationsList()[1]);


    //Animate marker when location is selected
    this.selectedLocation = function(clickedLocation){
      for (i = 0; i < initialMarkers_length; i++){
        var location_title = self.locationsList()[i].title;
        if (clickedLocation.title == location_title){
          this.currentLocation = self.locationsList()[i];
        }
      }
      console.log("currentLocation");
      console.log(this.currentLocation);

      this.currentmarker = this.currentLocation.marker;

      //Set selected location marker animation to Bounce and open up the InfoWindow
      //this.currentLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
      //Close the infoWindow and disable bounce animation if selected location is clicked on again.
      if (this.currentLocation.marker.getAnimation() !== null) {
          this.currentLocation.marker.setAnimation(null);
          markers_infowindow[this.marker.id].close(map, this); //Close the info window for the according marker
      } else {
          this.currentLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
          markers_infowindow[this.marker.id].open(map, this.marker); //setTimeout(function(){ myWindow.close() }, 3000);
          setTimeout(function(){this.currentmarker.setAnimation(google.maps.Animation.DROP) }, 3000);
      }

    };

    //Filter for recommendations locations based on the input field's text
    this.filteredLocations = ko.computed(function() {
    var filter = self.searchTerm().toLowerCase();
    if (!filter) { //No searchTerm is entered into the input field
      self.locationsList().forEach(function(location){
				location.marker.setVisible(true);
      });
      return self.locationsList();
    } else {
        return ko.utils.arrayFilter(self.locationsList(), function(location) {
          if (location.type.toLowerCase().indexOf(filter) > -1){  //searchTerm of location found
            location.marker.setVisible(true); //Show the marker
            return true; //Make that location visible in the recommendations list
          } else { //searchTerm of location is not found
            location.marker.setVisible(false); //Hide the marker
            return false; //Make that location invisible in the recommendations list
          }
            });
        }
    }, self);


    // console.log("locationsList:");
    // console.log(this.locationsList());

    /*
     * Open the drawer when the menu ison is clicked.
     */
    var menu = document.querySelector('#menu');
    var app = document.querySelector('#app');
    var drawer = document.querySelector('#search-menu');

    menu.addEventListener('click', function(e) {
      drawer.classList.toggle('open');
      e.stopPropagation();
    });
    header.addEventListener('click', function() {
      drawer.classList.remove('open');
    });


    console.log("Exiting ViewModel");


};



// Foursquare API
// var url = 'https://api.foursquare.com/v2/venues/search?client_id=3O2CJNQWJIU4EV0NQ3QPU2SBRW0SOQRPF4XDG5EUMS3WGNAP&v=20161016&client_secret=5FQQLNQV2LZ1HJOZZBYNPRVWLMR14ETJRGPJSYRWD3ITVQNM'+'&ll='+';
//
// $.getJSON(url)
//             .done(function(data){
