/**
Bootstrap-datepicker.  
Description and examples: https://github.com/eternicode/bootstrap-datepicker.  
For **i18n** you should include js file from here: https://github.com/eternicode/bootstrap-datepicker/tree/master/js/locales
and set `language` option.  
Since 1.4.0 date has different appearance in **popup** and **inline** modes. 

@class date
@extends abstractinput
@final
@example
<a href="#" id="dob" data-type="date" data-pk="1" data-url="/post" data-title="Select date">15/05/1984</a>
<script>
$(function(){
    $('#dob').editable({
        format: 'yyyy-mm-dd',    
        viewformat: 'dd/mm/yyyy',    
        datepicker: {
                weekStart: 1
           }
        }
    });
});
</script>
**/
(function ($) {
    "use strict";
    
    //store bootstrap-datepicker as bdateicker to exclude conflict with jQuery UI one
    $.fn.bdatepicker = $.fn.datepicker.noConflict();
    if(!$.fn.datepicker) { //if there were no other datepickers, keep also original name
        $.fn.datepicker = $.fn.bdatepicker;    
    }    
    
    var Date = function (options) {
        console.log("Date constructor called with options:", options);
        this.init('date', options, Date.defaults);
        this.initPicker(options, Date.defaults);
        
        // Ensure type is set correctly
        this.type = 'date';
        console.log("Date constructor completed, type set to:", this.type);
    };

    $.fn.editableutils.inherit(Date, $.fn.editabletypes.abstractinput);    
    
    $.extend(Date.prototype, {
        prerender: function() {
            console.log("Date.prerender() called");
            // Call parent prerender
            Date.superclass.prerender.call(this);
            console.log("Date.prerender() completed, $input:", this.$input[0]);
        },
        
        initPicker: function(options, defaults) {
            console.log("Date.initPicker() called");
            //'format' is set directly from settings or data-* attributes

            //by default viewformat equals to format
            if(!this.options.viewformat) {
                this.options.viewformat = this.options.format;
            }
            
            //try parse datepicker config defined as json string in data-datepicker
            options.datepicker = $.fn.editableutils.tryParseJson(options.datepicker, true);
            
            //overriding datepicker config (as by default jQuery extend() is not recursive)
            //since 1.4 datepicker internally uses viewformat instead of format. Format is for submit only
            this.options.datepicker = $.extend({}, defaults.datepicker, options.datepicker, {
                format: this.options.viewformat
            });
            
            //language
            this.options.datepicker.language = this.options.datepicker.language || 'en'; 

            //store DPglobal - use datepicker instead of bdatepicker
            this.dpg = $.fn.datepicker.DPGlobal; 

            //store parsed formats
            this.parsedFormat = this.dpg.parseFormat(this.options.format);
            this.parsedViewFormat = this.dpg.parseFormat(this.options.viewformat);            
        },
        
        render: function () {
            // Debug: Check if render is being called
            console.log("Date.render() called, options:", this.options.datepicker);
            console.log("Input element for datepicker:", this.$input[0]);
            
            // Ensure we have an input element
            if (!this.$input || !this.$input.length) {
                console.error("No input element found in render()");
                return;
            }
            
            // Initialize datepicker immediately
            try {
                console.log("Attempting datepicker initialization in render()...");
                this.$input.datepicker(this.options.datepicker);
                console.log("Datepicker initialized successfully in render()");
                console.log("Datepicker data after render:", this.$input.data('datepicker'));
                
                // Force set the initial value if we have one
                if (this.value) {
                    console.log("Setting initial value in render():", this.value);
                    this.$input.datepicker('setDate', this.value);
                }
            } catch (error) {
                console.error("Error initializing datepicker in render():", error);
            }
            
            //"clear" link
            if(this.options.clear) {
                this.$clear = $('<a href="#"></a>').html(this.options.clear).click($.proxy(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    this.clear();
                }, this));
                
                this.$tpl.parent().append($('<div class="editable-clear">').append(this.$clear));  
            }                
        },
        
        value2html: function(value, element) {
           var text = value ? this.dpg.formatDate(value, this.parsedViewFormat, this.options.datepicker.language) : '';
           Date.superclass.value2html.call(this, text, element); 
        },

        html2value: function(html) {
            return this.parseDate(html, this.parsedViewFormat);
        },   

        value2str: function(value) {
            return value ? this.dpg.formatDate(value, this.parsedFormat, this.options.datepicker.language) : '';
        }, 

        str2value: function(str) {
            return this.parseDate(str, this.parsedFormat);
        }, 

        value2submit: function(value) {
            return this.value2str(value);
        },                    

        value2input: function(value) {
            console.log("Date.value2input() called with value:", value);
            console.log("Input element in value2input:", this.$input[0]);
            console.log("Datepicker data in value2input:", this.$input.data('datepicker'));
            
            // Ensure datepicker is initialized before trying to update
            if (!this.$input.data('datepicker')) {
                console.log("Datepicker not initialized in value2input, initializing now...");
                this.$input.datepicker(this.options.datepicker);
                console.log("Datepicker data after manual init in value2input:", this.$input.data('datepicker'));
            }
            
            this.$input.datepicker('update', value);
        },

        input2value: function() { 
            console.log("Date.input2value() called");
            var datepicker = this.$input.data('datepicker');
            console.log("Datepicker object in input2value:", datepicker);
            
            if (datepicker) {
                console.log("Datepicker.date:", datepicker.date);
                console.log("Datepicker.dates:", datepicker.dates);
                console.log("Datepicker.getDate():", typeof datepicker.getDate === 'function' ? datepicker.getDate() : 'getDate not available');
                
                if (datepicker.date) {
                    console.log("Returning datepicker.date:", datepicker.date);
                    return datepicker.date;
                }
                
                // Try getting date from dates array
                if (datepicker.dates && datepicker.dates.length > 0) {
                    console.log("Returning from dates array:", datepicker.dates[0]);
                    return datepicker.dates[0];
                }
                
                // Try using getDate method
                if (typeof datepicker.getDate === 'function') {
                    var dateFromMethod = datepicker.getDate();
                    console.log("Returning from getDate():", dateFromMethod);
                    return dateFromMethod;
                }
            }
            
            // Fallback: try to parse the input value directly
            var inputVal = this.$input.val();
            console.log("Input value fallback:", inputVal);
            if (inputVal) {
                var parsedDate = this.parseDate(inputVal, this.parsedViewFormat);
                console.log("Parsed date fallback:", parsedDate);
                return parsedDate;
            }
            
            console.log("input2value returning null - no valid date found");
            return null;
        },       

        activate: function() {
        },

        clear:  function() {
            this.$input.data('datepicker').date = null;
            this.$input.find('.active').removeClass('active');
            if(!this.options.showbuttons) {
                this.$input.closest('form').submit(); 
            }
        },

        autosubmit: function() {
            this.$input.on('mouseup', '.day', function(e){
                if($(e.currentTarget).is('.old') || $(e.currentTarget).is('.new')) {
                    return;
                }
                var $form = $(this).closest('form');
                setTimeout(function() {
                    $form.submit();
                }, 200);
            });
           //changedate is not suitable as it triggered when showing datepicker. see #149
           /*
           this.$input.on('changeDate', function(e){
               var $form = $(this).closest('form');
               setTimeout(function() {
                   $form.submit();
               }, 200);
           });
           */
       },
       
       /*
        For incorrect date bootstrap-datepicker returns current date that is not suitable
        for datefield.
        This function returns null for incorrect date.  
       */
       parseDate: function(str, format) {
           var date = null, formattedBack;
           if(str) {
               date = this.dpg.parseDate(str, format, this.options.datepicker.language);
               if(typeof str === 'string') {
                   formattedBack = this.dpg.formatDate(date, format, this.options.datepicker.language);
                   if(str !== formattedBack) {
                       date = null;
                   }
               }
           }
           return date;
       }

    });

    Date.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        /**
        @property tpl 
        @default <div></div>
        **/         
        tpl:'<div class="editable-date well"></div>',
        /**
        @property inputclass 
        @default null
        **/
        inputclass: null,
        /**
        Format used for sending value to server. Also applied when converting date from <code>data-value</code> attribute.<br>
        Possible tokens are: <code>d, dd, m, mm, yy, yyyy</code>  

        @property format 
        @type string
        @default yyyy-mm-dd
        **/
        format:'yyyy-mm-dd',
        /**
        Format used for displaying date. Also applied when converting date from element's text on init.   
        If not specified equals to <code>format</code>

        @property viewformat 
        @type string
        @default null
        **/
        viewformat: null,
        /**
        Configuration of datepicker.
        Full list of options: http://bootstrap-datepicker.readthedocs.org/en/latest/options.html

        @property datepicker 
        @type object
        @default {
            weekStart: 0,
            startView: 0,
            minViewMode: 0,
            autoclose: false
        }
        **/
        datepicker:{
            weekStart: 0,
            startView: 0,
            minViewMode: 0,
            autoclose: false
        },
        /**
        Text shown as clear date button. 
        If <code>false</code> clear button will not be rendered.

        @property clear 
        @type boolean|string
        @default 'x clear'
        **/
        clear: '&times; clear'
    });

    $.fn.editabletypes.date = Date;

}(window.jQuery));
