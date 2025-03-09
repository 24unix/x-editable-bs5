// debugger
import $ from 'jquery';
window.$ = window.jQuery = $;
//
console.log("jQuery version:", $.fn?.jquery);
// // import $ from './dist/jquery';
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"

import "bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";

const Editable = require("bootstrap5-editable/js/bootstrap-editable");
console.log("Editable:", Editable);
$.fn.editable.defaults.mode = 'inline';

// import("bootstrap5-editable/js/bootstrap-editable")
//     .then((module) => {
//         console.log("Loaded bootstrap-editable:", module);
//         console.log("Module exports:", Object.keys(module)); // Log what is actually exported
//         window.EditableForm = module.default || module;
//         console.log("Window.EditableForm:", window.EditableForm);
//     })
//     .catch((err) => console.error("Error loading module:", err));
$(function() {
    console.log("hello world");

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

    $('#datepicker').editable({
        type: 'date',
        url: 'test.php',  // URL to send the POST request
        format: 'yyyy-mm-dd', // Date format
        viewformat: 'dd/mm/yyyy', // How the user sees it
        datepicker: {
            weekStart: 1,
            autoclose: true,
            todayHighlight: true
        },
        success: (response, newValue)=> {
            console.log("Date saved successfully:", response);
        },
        error: (response) => {
            console.error("Date save error:", response);
        }
    }).on('shown', (e, editable)=>  {
        console.log("Datepicker shown:", editable);
        $(editable.input.$input).datepicker({
            weekStart: 1,
            autoclose: true,
            todayHighlight: true
        }).datepicker('show')
    });

})
