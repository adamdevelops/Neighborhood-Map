
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
    },
    {
      title: "ChinaTown Ice Cream Factory",
      type: "ice cream",
      lat: 40.7153513,
      lng: -73.998655
    }

];

  function loadWeatherInfo(weatherData) {
          var id = '5a27d887bbdde6caf751f24ec02c5a1b';

          var weatherUrl = 'https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?' +
              'lat=40.715735' +
              '&lon=-73.997511' +
              '&units=metric'+
              '&appid=' + id;

          $.getJSON(weatherUrl, function(response) {
            var error = response.error;
            var temp;
            if (error) {
              console.log(error);
            } else {
              console.log(response.weather[0].description + "   " + Math.round(response.main.temp) + " °C");
              temp = (((response.main.temp * 9)/5) + 32);
              tempF = (Math.round(temp));

              var weatherInfoString = '<div id="temp_display">'
               +'<img id="icon" src ="https://openweathermap.org/img/w/'+ response.weather[0].icon +'.png"><div id="temp">'+ tempF +'&deg;'+'</div>'+ '</div><div id="weather-title"><p>'+response.weather[0].description
               +'</p></div><div id="api-credit">powered by OpenWeatherAPI</div>';

              weatherData(weatherInfoString);
            }
          }).done(function() {
            console.log('GetWeather request succeeded!');
          }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log('GetWeather request failed! ' + textStatus);
          }).always(function() {
              console.log('GetWeather request ended!');
          });
      }

/*
*  Code for Google Maps API
*/


// Length of initialMarkers array
var initialMarkers_length = initialMarkers.length;

var markers = [];
var markers_infowindow = [];

var marker;

function initMap() {
  //console.log("Entering initMap");

  var uluru = {lat: 40.7136291, lng: -73.9974581}; //Location on China Town
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: uluru,
    // mapTypeControl: false,
    disableDefaultUI: true
  });

  //InfoWindow for the markers
  marker_infowindow = new google.maps.InfoWindow();


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
      id: i,
      lat: initialMarkers[i].lat,
      lng: initialMarkers[i].lng
    });

  }

  var vm = new ViewModel();
  ko.applyBindings(vm);
// console.log("Exiting initMap");
}


function load4SAPI(location, infowindow) {
   // console.log("Entering init4SAPI");

    var url = 'https://api.foursquare.com/v2/venues/search?client_id=3O2CJNQWJIU4EV0NQ3QPU2SBRW0SOQRPF4XDG5EUMS3WGNAP&v=20161016&client_secret=5FQQLNQV2LZ1HJOZZBYNPRVWLMR14ETJRGPJSYRWD3ITVQNM' +
        '&ll=' + location.lat + ',' +
              location.lng + '&query=' + location.title + '&limit=1';

    $.getJSON(url)
            .done(function(data){
              // console.log(data);
              console.log(data.response);

              var content  = '<div id="location-name"> <h1>'+ data.response.venues[0].name + '</h1></div>'+
            '<div id="location-address"><h3>' + data.response.venues[0].location.formattedAddress + '</h3></div>';

           infowindow.setContent(content);
            })
            .fail(function(){
              var content = "failed"

              console.log("fail");
              return content;
            });
  }


  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      load4SAPI(marker, infowindow);
      //infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
    }
  }


// Code for the ViewModel
var ViewModel = function(){
  //  console.log("Entering ViewModel");

    var self = this;    //--- referencing the ViewModel itself, thus the outer this outside of the div of where we applied the 'with data-bind'

    /*
    * Open the drawer when the menu is clicked.
    */

    self.isOpen = ko.observable(false);

    self.toggle = function() {
      self.isOpen(!self.isOpen());
    }

    self.close = function() {
      self.isOpen(false);
    }


    //KnockOut array of list of recommended locations
    this.locationsList = ko.observableArray([]);

    this.searchTerm = ko.observable("");

    // KO Observable that will contain with the weather app API content
    this.foreCast = ko.observable("");
    // Load the weather app API content
    loadWeatherInfo(this.foreCast);


    //Add initial marker locations
    initialMarkers.forEach(function(locationItem, i){
      //console.log(locationItem);
      self.locationsList.push(locationItem);
      //console.log(self.locationsList());
    });

    //Set default currentLocation to first location in the array
    this.currentLocation = ko.observable(this.locationsList()[0]);


    //Store the Google Map markers from initMap for each location as a property for each location
    markers.forEach(function(marker,i) {
      // Storing a marker from markers as a property for each individual location
      self.locationsList()[i].marker = marker;
      // Add an click event listner for each marker to toggle bounce animation
      marker.addListener('click', toggleBounce);

      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          populateInfoWindow(marker, marker_infowindow);
        }
        // Reset marker to a null animation after 1second
        setTimeout(function() {
          marker.setAnimation(null);
          marker_infowindow.close(map, marker);
        }, 2000);
      }
    });

    // console.log("index 1 with marker");
    // console.log(this.locationsList()[1]);


    //Animate marker when location is selected on the recommendations list
    this.selectedLocation = function(clickedLocation){
      var marker = clickedLocation.marker;

      this.currentLocation = clickedLocation;

        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          //console.log(marker_infowindow);
          //console.log(this);
          //console.log(this);
          populateInfoWindow(marker, marker_infowindow);

          // Reset marker to a null animation after 1second
          setTimeout(function() {
            console.log(this); // window object
            marker.setAnimation(null);
            marker_infowindow.close(map, marker);
          }, 2000);
        }
      //console.log("exiting selectedLocation");
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





   // console.log("Exiting ViewModel");
};
