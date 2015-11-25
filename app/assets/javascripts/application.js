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