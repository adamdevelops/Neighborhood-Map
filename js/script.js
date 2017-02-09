

var marker;

function initMap() {
  var uluru = {lat: 40.715272, lng: -73.9974404}; //Location on China Town
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: uluru
  });

  marker = new google.maps.Marker({ //Bubbly Tea
    position: {lat: 40.7152875, lng: -73.9977593},
    animation: google.maps.Animation.DROP,
    map: map
  });

  var marker2 = new google.maps.Marker({ //Confucius Plaza
    position: {lat: 40.7158642, lng: -73.9954891},
    map: map
  });
  var marker3 = new google.maps.Marker({ //Nom Wah Tea Palor
    position: {lat: 40.7144448, lng: -73.9982542},
    map: map
  });
  var marker4 = new google.maps.Marker({ //Great NY Noodle Town
    position: {lat: 40.7150319, lng: -73.997038},
    map: map
  });
  var marker5 = new google.maps.Marker({ //Golden Fung Wong Bakery Shop
    position: {lat: 40.7151294, lng: -73.9988711},
    map: map
  });

  marker.addListener('click', toggleBounce);

}

function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }

google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, "resize", function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
  });
