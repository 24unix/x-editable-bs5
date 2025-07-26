/*
X-Editable Bootstrap 5 - Complete Bundle
Uses npm bootstrap-datepicker instead of bundled version
Order matches Gruntfile.js for compatibility
*/
import $ from "jquery";

// Import bootstrap-datepicker from npm
import "bootstrap-datepicker";

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

// Date input (now uses npm bootstrap-datepicker)
import "./inputs/date/date.js";
import "./inputs/date/datefield.js";

// Bootstrap 5 specific containers and forms
import "./containers/editable-popover5.js";
import "./editable-form/editable-form-bootstrap5.js";

// Export jQuery for compatibility
export default $;