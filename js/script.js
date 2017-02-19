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

var initialMarkers_length = initialMarkers.length;

var markers = [];
var markers_infowindow = [];

var marker;

function initMap() {
  console.log("Entering initMap");

  var uluru = {lat: 40.715272, lng: -73.9974404}; //Location on China Town
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: uluru
  });

  for (i = 0; i < initialMarkers_length; i++){
    markers[i] = new google.maps.Marker({ //Bubbly Tea
      position: {lat: initialMarkers[i].lat, lng: initialMarkers[i].lng},
      animation: google.maps.Animation.DROP,
      map: map,
      title: initialMarkers[i].title,
      id: i
    });

    markers_infowindow[i] = new google.maps.InfoWindow({
              content: initialMarkers[i].title,
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


//Toggle the bounce animation for selected marker
function toggleinfoWindow() {
        if (this.getAnimation() !== null) {
            this.setAnimation(null);
        } else {
            this.setAnimation(google.maps.Animation.BOUNCE);
        }
      }



// google.maps.event.addDomListener(window, 'load', initialize);
// google.maps.event.addDomListener(window, "resize", function() {
//     var center = map.getCenter();
//     google.maps.event.trigger(map, "resize");
//     map.setCenter(center);
//   });



// var Location = function(data){
//   this.title = ko.observable(data.title);
//   this.lat = ko.observable(data.lat);
//   this.lng = ko.observable(data.lng);
//   this.id = ko.observable(data.id);
//
// }




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
    };

    console.log("index 1 with marker");
    console.log(this.locationsList()[1]);


    //Animate marker when location is selected
    this.selectedLocation = function(clickedLocation){
      for (i = 0; i < initialMarkers_length; i++){
        var location_title = self.locationsList()[i].title;
        if (clickedLocation.title == location_title){
          this.currentLocation = self.locationsList()[i];
        }
      };
      console.log("currentLocation");
      console.log(this.currentLocation.marker);
      //Set selected location marker animation to Bounce and open up the InfoWindow
      //this.currentLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
      this.marker.setAnimation(google.maps.Animation.BOUNCE);
      markers_infowindow[this.marker.id].open(map, this.marker);

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

    console.log("Exiting ViewModel");


  };
