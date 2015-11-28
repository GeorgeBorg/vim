// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require underscore
//= require gmaps/google
//= require_tree .

/* --------------------------------------------------
   User Profile Popup
-------------------------------------------------- */

$(document).on('ready page:load', function () {
    $(".login-section").click(function(e) {
        $(".user-popup").toggle();
        e.stopPropagation();
    });

    $(document).click(function(e) {
        if (!$(e.target).is('.user-popup, .user-popup*')) {
            $(".user-popup").hide();
        }
    });
});


/* --------------------------------------------------
   Preferences Popup
-------------------------------------------------- */

$(document).on('ready page:load', function () {
    $(".preference-section").click(function(e) {
        $(".preference-popup").show();
        e.stopPropagation();
    });

    $(document).click(function(e) {
        if (!$(e.target).is('.preference-popup, .preference-popup*')) {
            $(".preference-popup").hide();
        }
    });

    $(".preferences").click(function(e) {
        $(".preference-popup").toggle();
        e.stopPropagation();
    });

});


/* --------------------------------------------------
   Preferences Distance Slider
-------------------------------------------------- */
$(document).on('ready page:load', function () {
  $(function() {
    $( "#slider" ).slider();
  });
});


/* --------------------------------------------------
   Google Maps for location
-------------------------------------------------- */

$(document).on('ready page:load', function () {
var handler = Gmaps.build('Google');
var markers_options = { draggable: true };

handler.buildMap({ provider: {}, internal: {id: 'map'}}, function(){
  var markers_json =           [
    {
      "lat": 51.5072,
      "lng": -0.1275
    }
  ];
  Gmaps.markers = handler.addMarkers(markers_json, markers_options);

  handler.bounds.extendWith(Gmaps.markers);
  handler.fitMapToBounds();
  handler.getMap().setZoom(10);

  // Callback function
  _.each(Gmaps.markers, listenToDragDrop)

  // On click, clear markers, place a new one, update coordinates in the form
  google.maps.event.addListener(handler.getMap(), 'click', function(event) {
    clearOverlays();
    placeMarker(event.latLng);
    updateFormLocation(event.latLng);
  });
});

function listenToDragDrop(marker){
  google.maps.event.addListener(marker.getServiceObject(), 'dragend', function() {
    updateFormLocation(marker.getServiceObject().getPosition());
  });    
}

// Other functions
// Update form attributes with given coordinates
function updateFormLocation(latLng) {
  $('#centre_latitude').val(latLng.lat());
  $('#centre_longitude').val(latLng.lng());
}
// Add a marker with an open infowindow
function placeMarker(latLng) {
  var marker = handler.addMarker({
    lat: latLng.lat(),
    lng: latLng.lng(),
    // infowindow: '<div class="popup"><h2>Awesome!</h2><p>Drag me and adjust the zoom level.</p>'
  }, markers_options)
  
  Gmaps.markers.push(marker)

  // Set and open infowindow
  google.maps.event.trigger(marker.getServiceObject(), 'click');

  listenToDragDrop(marker);
}
// // Removes the overlays from the map, including the ones loaded with the map itself
function clearOverlays() {
  handler.removeMarkers(Gmaps.markers);
  Gmaps.markers = [];
}
});