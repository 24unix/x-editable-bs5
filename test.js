// debugger
import $ from 'jquery';
window.$ = window.jQuery = $;
//
console.log("jQuery version:", $.fn?.jquery);
// // import $ from './dist/jquery';
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"

// bootstrap-datepicker loaded separately (not bundled in grunt build)
import "bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";

// Import the editable functionality (attaches to jQuery.fn) - using Grunt-built version
require("./dist/bootstrap5-editable/js/bootstrap-editable");
console.log("$.fn.editable available:", typeof $.fn.editable);
console.log("$.fn.datepicker available:", typeof $.fn.datepicker);
console.log("$.fn.bdatepicker available:", typeof $.fn.bdatepicker);
$.fn.editable.defaults.mode = 'inline';

$(function() {

    $('#yes-no-switch').editable({
        type: 'select',
        url: 'test.php',  // URL to send the POST request
        source: 'test.php', // URL to fetch select options
        value: 1,
        success: function(response, newValue) {
            console.log("Saved successfully:", response);
        },
        error: function(response) {
            console.error("Save error:", response);
        }
    });
    console.log("Internal editable data:", $('#yes-no-switch').data('editable'));
    const ed = $('#yes-no-switch').data('editable');
    console.log("Internal editable data:", ed);
    if (ed) {
        console.log("TYPE:", ed.type, "OPTIONS:", ed.options);
    }



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
            console.log("Static source saved successfully:", response);
        },
        error: function(response) {
            console.error("Static source save error:", response);
        }
    });

    const initialDateValue = new Date().toISOString().split('T')[0];
    console.log("Setting up datepicker with initial value:", initialDateValue);
    
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
            console.log("Date saved successfully:", response);
            console.log("New value received:", newValue);
        },
        error: (response) => {
            console.error("Date save error:", response);
        }
    }).on('save', function(e, params) {
        console.log("Date save event:", params);
        console.log("Value being saved:", params.newValue);
        console.log("Submit value:", params.submitValue);
    }).on('nochange', function(e) {
        console.log("Date nochange event fired - values are considered equal");
    }).on('shown', function(e, editable) {
        console.log("Datepicker shown event fired", editable);
        
        // Check if the type is now set
        if (editable && editable.input) {
            console.log("Input type after shown:", editable.input.type);
            console.log("Editable type after shown:", editable.type);
        }
        
        // Debug: Check if datepicker elements exist in DOM
        console.log("Looking for datepicker in DOM...");
        console.log("Datepicker elements found:", $('.datepicker').length);
        console.log("Bootstrap datepicker elements found:", $('.bootstrap-datepicker').length);
        console.log("All datepicker classes:", $('[class*="datepicker"]').length);
        
        // Check if any datepicker elements are visible
        $('.datepicker, .bootstrap-datepicker, [class*="datepicker"]').each(function(i, el) {
            console.log(`Datepicker element ${i}:`, {
                class: el.className,
                visible: $(el).is(':visible'),
                display: $(el).css('display'),
                position: $(el).css('position'),
                zIndex: $(el).css('z-index')
            });
        });
        
        // Debug the input element that should have datepicker
        if (editable && editable.input && editable.input.$input) {
            console.log("Input element:", editable.input.$input[0]);
            console.log("Input datepicker data:", editable.input.$input.data('datepicker'));
            
            // Check if bootstrap-datepicker functions are available on the input
            console.log("Input $input.datepicker available:", typeof editable.input.$input.datepicker);
            console.log("Input $input.bdatepicker available:", typeof editable.input.$input.bdatepicker);
            
            // Check if the datepicker is properly initialized (no manual override)
            console.log("Checking if datepicker is properly initialized without manual intervention");
        }
    }).on('hidden', function(e, reason) {
        console.log("Datepicker hidden event fired, reason:", reason);
    });
    
    console.log("Datepicker element setup complete:", $('#datepicker').data('editable'));
    
    // Wait a bit for initialization and then check again
    setTimeout(function() {
        console.log("=== CHECKING DATEPICKER AFTER TIMEOUT ===");
        const datepickerEd = $('#datepicker').data('editable');
        if (datepickerEd) {
            console.log("DATEPICKER TYPE:", datepickerEd.type, "OPTIONS:", datepickerEd.options);
            console.log("DATEPICKER INPUT:", datepickerEd.input);
            if (datepickerEd.input) {
                console.log("DATEPICKER INPUT TYPE:", typeof datepickerEd.input);
                console.log("DATEPICKER INPUT CONSTRUCTOR:", datepickerEd.input.constructor.name);
                console.log("DATEPICKER INPUT internal type:", datepickerEd.input.type);
            }
        } else {
            console.log("NO DATEPICKER EDITABLE DATA FOUND!");
        }
        
        // Also check available input types
        console.log("Available input types:", Object.keys($.fn.editabletypes || {}));
    }, 100);

})
