/*
X-Editable Bootstrap 5 - Complete Bundle
Uses npm bootstrap-datepicker instead of bundled version
Order matches Gruntfile.js for compatibility
*/
import $ from "jquery";

// Note: bootstrap-datepicker should be included separately by the user
// This bundle does not include bootstrap-datepicker to avoid dependency conflicts

// Import select2 from npm (JS + CSS)
import "select2";
import "select2/dist/css/select2.min.css";
// Ensure select2 is attached to window.jQuery if it exists
if (typeof window !== 'undefined' && window.jQuery && !window.jQuery.fn.select2) {
    // Re-import select2 to ensure it attaches to global jQuery
    require('select2');
}

// Core editable functionality - EXACT ORDER from Gruntfile
import "./editable-form/editable-form.js";
import "./editable-form/editable-form-utils.js";
import "./containers/editable-container.js"; 
import "./containers/editable-inline.js";
import "./element/editable-element.js";
import "./inputs/abstract.js";
import "./inputs/list.js";
import "./inputs/text.js";
import "./inputs/textarea.js";
import "./inputs/select.js";
import "./inputs/select2/select2.js";

// Date input (now uses npm bootstrap-datepicker)
import "./inputs/date/date.js";
import "./inputs/date/datefield.js";

// Bootstrap 5 specific containers and forms
import "./containers/editable-popover5.js";
import "./editable-form/editable-form-bootstrap5.js";

// Export jQuery for compatibility
export default $;