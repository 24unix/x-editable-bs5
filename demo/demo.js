import $ from 'jquery';
// Ensure jQuery is available globally before any other imports
window.$ = window.jQuery = $;
global.$ = global.jQuery = $;

import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"

// Import bootstrap-datepicker for date inputs
import "bootstrap-datepicker";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";


// Import the editable functionality (attaches to jQuery.fn) - using webpack source build
require("../src/bootstrap5-editable.js");
$.fn.editable.defaults.mode = 'inline';

$(function() {

    $('#yes-no-switch').editable({
        type: 'select',
        url: 'demo/demo.php',  // URL to send the POST request
        source: 'demo/demo.php', // URL to fetch select options
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
        url: 'demo/demo.php',  // URL to send the POST request
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
        url: 'demo/demo.php',  // URL to send the POST request
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

    // Select2 functionality (now bundled with x-editable)
    
    $('#select2-test').editable({
        type: 'select2',
        url: 'demo/demo.php',
        source: [
            {id: 'us', text: 'United States'},
            {id: 'gb', text: 'Great Britain'},
            {id: 'ru', text: 'Russia'},
            {id: 'de', text: 'Germany'},
            {id: 'fr', text: 'France'},
            {id: 'es', text: 'Spain'},
            {id: 'it', text: 'Italy'}
        ],
        value: 'us',
        savenochange: true, // Allow saving even when value hasn't changed
        select2: {
            placeholder: 'Select Country',
            allowClear: true
        },
        success: function(response, newValue) {
            // Handle success
        },
        error: function(response) {
            // Handle error
        }
    });

})
