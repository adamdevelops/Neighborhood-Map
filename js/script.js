var initialMarkers = [
    {
      title: "Bubbly Tea",
      lat: 40.7152875,
      lng: -73.9977593
    },
    {
      title: "Confucius Plaza",
      lat: 40.7158642,
      lng: -73.9954891
    },
    {
      title: "Nom Wah Tea Palor",
      lat: 40.7144448,
      lng: -73.9982542
    },
    {
      title: "Great NY Noodle Town",
      lat: 40.7150319,
      lng: -73.997038
    },
    {
      title: "Golden Fung Wong Bakery Shop",
      lat: 40.7151294,
      lng: -73.9988711
    },
    {
      title: "Noodle Village",
      lat: 40.7141342,
      lng: -73.9989576
    }

];

var initialMarkers_length = initialMarkers.length;

var markers = [];

var marker;

function initMap() {
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
      id: i
    });

    initialMarkers


    console.log(markers[i].id);
    marker = markers[i];

    markers[i].addListener('click', toggleBounce);


    // google.maps.event.addListener(marker, 'click', (function(marker, i) {
    //   console.log(marker.getAnimation());
    //     if (marker.getAnimation() !== null) {
    //       marker.setAnimation(null);
    //     } else {
    //       marker.setAnimation(google.maps.Animation.BOUNCE);
    //     }
    //   })(marker, i));
  }

}

//Toggle the bounce animation for selected marker
function toggleBounce() {
        if (this.getAnimation() !== null) {
          this.setAnimation(null);
        } else {
          this.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
//Toggle the bounce animation for selected marker
function toggleListBounce() {
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



  var Location = function(data){
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.id = ko.observable(data.id);

  }




  var ViewModel = function(){
    var self = this;    //--- referencing the ViewModel itself, thus the outer this outside of the div of where we applied the 'with data-bind'

    //KnockOut array of list of recommended locations
    this.locationsList = ko.observableArray([]);

    this.currentLocation = ko.observable();

    //Add initial marker locations
    initialMarkers.forEach(function(locationItem){
      self.locationsList.push( new Location(locationItem) );
  });

  // //Animate marker when location is selected
  // this.selectedLocation = function(clickedLocation.marker){
  //   console.log(clickedLocation);
  //   self.currentLocation(clickedLocation.marker);
  //   toggleListBounce(self.currentLocation);
  // };

  };

  ko.applyBindings(new ViewModel());
