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
   Maps
-------------------------------------------------- */

$(document).on('ready page:load', function () {
  L.mapbox.accessToken = 'pk.eyJ1IjoiZ2VvcmdlYm9yZyIsImEiOiJjaWk3bnFqYzEwMDlidm5tMnJyMGVvMTFlIn0.t-lvmWyHHj3EjAypomaztw';
  var map = L.mapbox.map('map', 'mapbox.streets', { zoomControl:false });
  var myLayer = L.mapbox.featureLayer().addTo(map);

  // get location
  map.locate()  

  // Once we've got a position, zoom and center the map
  // on it, and add a single marker.
  map.on('locationfound', function(e) {
    map.fitBounds(e.bounds, { paddingTopLeft: [1000, 0] }); // Center when sidebar is out
    map.setZoom(17);

    // If the user chooses not to allow their location
    // to be shared, display an error message.
    map.on('locationerror', function() {
        geolocate.innerHTML = 'Position could not be found';
    });

  // For events/home display page

    if(window.location.pathname == '/') {

      myLayer.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
            'title': 'Here I am!',
            'marker-color': '#ff8888',
            'marker-symbol': 'star'
        }
      });

  // for create event  

    } else if(window.location.pathname == '/events/new') { 

      // place a marker at current location
      marker = L.marker(e.latlng, {draggable:'true'}).addTo(map); 

      function onMapClick(e) {
          // remove the marker
          map.removeLayer(marker);

          // create marker at click location
          marker = new L.marker(e.latlng, {draggable:'true'});
          var position = marker.getLatLng();

          // move marker on drag
          marker.on('dragend', function(event){
            var marker = event.target;
            var position = marker.getLatLng();
            // add marker
            map.addLayer(marker);

            // zoom and pan to marker
            map.setView([position.lat, position.lng - 0.0035], 17);

            // fill in corodinates
            document.getElementById("centre_latitude").value = position.lat;
            document.getElementById("centre_longitude").value = position.lng;
          });

          // add marker
          map.addLayer(marker);

          // zoom and pan to marker
          map.setView([position.lat, position.lng - 0.0035], 17);

          // fill in corodinates
          document.getElementById("centre_latitude").value = position.lat;
          document.getElementById("centre_longitude").value = position.lng;
      };

      // if marker is dragged before clicked
      function onMarkerDrag (event) {
          var marker = event.target;
          var position = marker.getLatLng();
          // add marker
          map.addLayer(marker);

          // zoom and pan to marker
          map.setView([position.lat, position.lng - 0.0035], 17);

          // fill in corodinates
          document.getElementById("centre_latitude").value = position.lat;
          document.getElementById("centre_longitude").value = position.lng;
      };


      map.on('click', onMapClick) // initialise if map is clicked
      marker.on('dragend', onMarkerDrag) // initialise if marker is dragged


      // search input for place
      document.getElementById('link').onclick = function() {
        var search = document.getElementById('search').value;

        // Credit Foursquare for their wonderful data
        // map.attributionControl
        //     .addAttribution('<a href="https://foursquare.com/">Places data from Foursquare</a>');

        // Create a Foursquare developer account: https://developer.foursquare.com/
        // NOTE: CHANGE THESE VALUES TO YOUR OWN:
        // Otherwise they can be cycled or deactivated with zero notice.
        var CLIENT_ID = 'L4UK14EMS0MCEZOVVUYX2UO5ULFHJN3EHOFVQFSW0Z1MSFSR';
        var CLIENT_SECRET = 'YKJB0JRFDPPSGTHALFOEP5O1NDDATHKQ2IZ5RO2GOX452SFA';

        // https://developer.foursquare.com/start/search
        var API_ENDPOINT = 'https://api.foursquare.com/v2/venues/search' +
          '?client_id=CLIENT_ID' +
          '&client_secret=CLIENT_SECRET' +
          '&v=20130815' +
          '&ll=LATLON' +
          '&query=' + search
          '&callback=?';

        


        // Keep our place markers organized in a nice group.
        var foursquarePlaces = L.layerGroup().addTo(map);

        // Use jQuery to make an AJAX request to Foursquare to load markers data.
        $.getJSON(API_ENDPOINT
          .replace('CLIENT_ID', CLIENT_ID)
          .replace('CLIENT_SECRET', CLIENT_SECRET)
          .replace('LATLON', map.getCenter().lat +
              ',' + map.getCenter().lng), function(result, status) {

          if (status !== 'success') return alert('Request to Foursquare failed');

          // Transform each venue result into a marker on the map.
          for (var i = 0; i < result.response.venues.length; i++) {
            var venue = result.response.venues[i];
            var latlng = L.latLng(venue.location.lat, venue.location.lng);
            var search_marker = L.marker(latlng, {
                icon: L.mapbox.marker.icon({
                  'marker-color': '#BBB',
                  'marker-symbol': 'cafe',
                  'marker-size': 'large'
                })
              })
              .bindPopup('<strong><a href="https://foursquare.com/v/' + venue.id + '">' +
              venue.name + '</a></strong><br><a href=""> set this location </a>')
              .addTo(foursquarePlaces);
          }
        });
      };

  // map on every other page (background only/non-interactive)

    } else {}

  });

});

/* --------------------------------------------------
   Autocomplete search with foursquare
-------------------------------------------------- */

$(document).on('ready page:load', function ($) {

    $.foursquareAutocomplete = function (element, options) {
        this.options = {};

        element.data('foursquareAutocomplete', this);

        this.init = function (element, options) {
            this.options = $.extend({}, $.foursquareAutocomplete.defaultOptions, options);
            this.options = $.metadata ? $.extend({}, this.options, element.metadata()) : this.options;
            updateElement(element, this.options);
        };
        this.init(element, options);
        this.select = function (event, ui) {
        };
        
    };
    $.fn.foursquareAutocomplete = function (options) {
        return this.each(function () {
            (new $.foursquareAutocomplete($(this), options));
        });
    };

    function updateElement(element, options) {
        element.autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "https://api.foursquare.com/v2/venues/suggestcompletion",
                    dataType: "jsonp",
                    data: {
                        ll: options.latitude + "," + options.longitude,
                        v: "20120214",
                        oauth_token: options.oauth_token,
                        query: request.term
                    },
                    success: function (data) {
                        // Check to see if there was success
                        if (data.meta.code != 200)
                        {
                          element.removeClass("ui-autocomplete-loading")
                          options.onError(data.meta.code, data.meta.errorType, data.meta.errorDetail);
                          return false;
                        }
                      
                        response($.map(data.response.minivenues, function (item) {
                            return {
                                name: item.name,
                                id: item.id,
                                address: (item.location.address == undefined ? "" : item.location.address),
                                cityLine: (item.location.city == undefined ? "" : item.location.city + ", ") + (item.location.state == undefined ? "" : item.location.state + " ") + (item.location.postalCode == undefined ? "" : item.location.postalCode),
                                photo: (item.category == undefined ? "" : item.category.icon.prefix + "32" + item.category.icon.name), 
                                full: item
                            };
                        }));
                    },
                    error: function (header, status, errorThrown) {
                        options.onAjaxError(header, status, errorThrown);
                    }
                });
            },
            minLength: options.minLength,
            select: function (event, ui) {
                element.val(ui.item.name);
                options.search(event, ui);
                return false;
            },
            open: function () {
                $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
            },
            close: function () {
                $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
            }
        })
            .data("autocomplete")._renderItem = function (ul, item) {
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + getAutocompleteText(item) + "</a>")
                    .appendTo(ul);
            };

    };

    $.foursquareAutocomplete.defaultOptions = {
        'latitude': 47.22,
        'longitude': -122.2,
        'oauth_token': "",
        'minLength': 3,
        'select': function (event, ui) {},
        'onError': function (errorCode, errorType, errorDetail) {},
        'onAjaxError' : function (header, status, errorThrown) {}
    };
    

    /// Builds out the <select> portion of autocomplete control
    function getAutocompleteText(item) {
        var text = "<div>";
        text += "<div class='categoryIconContainer'><img src='" + (item.photo == "" ? "" : item.photo) + "' /></div>";
        text += "<div class='autocomplete-name'>" + item.name + "</div>";
        if (item.address == "" && item.cityLine == "")
            text += "<div class='autocomplete-detail'>&nbsp;</div>";
        if (item.address != "")
            text += "<div class='autocomplete-detail'>" + item.address + "</div>";
        if (item.cityLine != "")
            text += "<div class='autocomplete-detail'>" + item.cityLine + "</div>";
        text += "</div>";
        return text;
    }
})(jQuery);

