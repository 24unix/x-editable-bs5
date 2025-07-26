import $ from 'jquery';
window.$ = window.jQuery = $;
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"

// bootstrap-datepicker loaded separately (not bundled in grunt build)
import "bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";

// Import the editable functionality (attaches to jQuery.fn) - using Grunt-built version
require("./dist/bootstrap5-editable/js/bootstrap-editable");
$.fn.editable.defaults.mode = 'inline';

$(function() {

    $('#yes-no-switch').editable({
        type: 'select',
        url: 'test.php',  // URL to send the POST request
        source: 'test.php', // URL to fetch select options
        value: 1,
        success: function(response, newValue) {
            // Handle success
        },
        error: function(response) {
            // Handle error
        }
    });



    $('#yes-no-switch-json').editable({
        type: 'select',
        url: 'test.php',  // URL to send the POST request
        source: [         // Static array instead of URL
            {value: 0, text: "No"},
            {value: 1, text: "Yes"},
            {value: 2, text: "Maybe"}
        ],
        value: 1,
        success: function(response, newValue) {
            // Handle success
        },
        error: function(response) {
            // Handle error
        }
    });

    const initialDateValue = new Date().toISOString().split('T')[0];
    
    $('#datepicker').editable({
        type: 'date',
        url: 'test.php',  // URL to send the POST request
        value: initialDateValue, // Set to current date (YYYY-MM-DD)
        format: 'yyyy-mm-dd', // Date format
        viewformat: 'dd/mm/yyyy', // How the user sees it
        datepicker: {
            weekStart: 1,
            autoclose: true,
            todayHighlight: true
        },
        success: (response, newValue)=> {
            // Handle success
        },
        error: (response) => {
            // Handle error
        }
    });

})
