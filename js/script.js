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

function initMap() {
  var uluru = {lat: 40.715272, lng: -73.9974404}; //Location on China Town
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: uluru
  });

  for (i = 0; i < initialMarkers_length; i++){
    markers[i] = new google.maps.Marker({ //Bubbly Tea
      position: {lat: initialMarkers[i].lat, lng: initialMarkers[i].lng},
      animation: google.maps.Animation.DROP,
      map: map
    });

    markers[i].addListener('click', toggleBounce(markers[i]));
  }

}

//Toggle the bounce animation for selected marker
function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
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

  }




  var ViewModel = function(){
    var self = this;    //--- referencing the ViewModel itself, thus the outer this outside of the div of where we applied the 'with data-bind'

    //KnockOut array of list of recommended locations
    this.locationsList = ko.observableArray([]);

    //Add initial marker locations
    initialMarkers.forEach(function(locationItem){
      self.locationsList.push( new Location(locationItem) );
  });

  };

  ko.applyBindings(new ViewModel());
