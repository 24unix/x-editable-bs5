import $ from 'jquery';
window.jQuery = window.$ = $;

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

$(document).ready(function () {
    $('#testButton').click(function () {
        alert('Bootstrap 3.4.1 and jQuery are working!');
    });
});