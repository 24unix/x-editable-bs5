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
    
    
    
    var Date = function (options) {
        console.log('Date input constructor called');
        this.init('date', options, Date.defaults);
        this.initPicker(options, Date.defaults);
        
        // Ensure type is set correctly
        this.type = 'date';
        console.log('Date input initialized');
    };

    $.fn.editableutils.inherit(Date, $.fn.editabletypes.abstractinput);    
    
    $.extend(Date.prototype, {
        prerender: function() {
            // Call parent prerender
            Date.superclass.prerender.call(this);
        },
        
        initPicker: function(options, defaults) {
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

            //store DPglobal - ensure bootstrap-datepicker is available
            if (!$.fn.datepicker || !$.fn.datepicker.DPGlobal) {
                console.error('Bootstrap-datepicker not found or DPGlobal not available');
                console.error('Please include bootstrap-datepicker.js and bootstrap-datepicker.css in your page');
                // Set error state instead of throwing
                this.error = 'Bootstrap-datepicker is required but not found. Please include bootstrap-datepicker.js and bootstrap-datepicker.css';
                return;
            }
            this.dpg = $.fn.datepicker.DPGlobal; 

            //store parsed formats
            this.parsedFormat = this.dpg.parseFormat(this.options.format);
            this.parsedViewFormat = this.dpg.parseFormat(this.options.viewformat);            
        },
        
        render: function () {
            console.log('Date render method called');
            // Ensure we have an input element
            if (!this.$input || !this.$input.length) {
                console.log('Date render: No input element found');
                return;
            }
            
            console.log('Date render: Input element found');
            
            // Initialize datepicker immediately
            try {
                this.$input.datepicker(this.options.datepicker);
                console.log('Date render: Datepicker initialized');
                
                // Force set the initial value if we have one
                if (this.value) {
                    this.$input.datepicker('setDate', this.value);
                }
            } catch (error) {
                console.log('Date render: Datepicker error:', error);
            }
            
            // Use a more aggressive approach - hide buttons with multiple methods
            var self = this;
            setTimeout(function() {
                // Try multiple selectors to find buttons
                var $buttons = self.$form ? self.$form.find('.editable-buttons') : $();
                if ($buttons.length === 0) {
                    $buttons = self.$tpl.closest('.editableform').find('.editable-buttons');
                }
                if ($buttons.length === 0) {
                    $buttons = self.$tpl.closest('.editable-container').find('.editable-buttons');
                }
                
                console.log('Date render: Found buttons:', $buttons.length);
                if ($buttons.length > 0) {
                    $buttons.hide();
                    $buttons.css('display', 'none');
                    console.log('Date render: Hidden buttons');
                }
            }, 100);
            
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
            // Ensure datepicker is initialized before trying to update
            if (!this.$input.data('datepicker')) {
                this.$input.datepicker(this.options.datepicker);
            }
            
            this.$input.datepicker('update', value);
        },

        input2value: function() { 
            var datepicker = this.$input.data('datepicker');
            
            if (datepicker) {
                if (datepicker.date) {
                    return datepicker.date;
                }
                
                // Try getting date from dates array
                if (datepicker.dates && datepicker.dates.length > 0) {
                    return datepicker.dates[0];
                }
                
                // Try using getDate method
                if (typeof datepicker.getDate === 'function') {
                    var dateFromMethod = datepicker.getDate();
                    return dateFromMethod;
                }
            }
            
            // Fallback: try to parse the input value directly
            var inputVal = this.$input.val();
            if (inputVal) {
                var parsedDate = this.parseDate(inputVal, this.parsedViewFormat);
                return parsedDate;
            }
            
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
            // Override default autosubmit behavior for datepicker workflow
            // Show buttons only after date selection
            this.$input.on('changeDate', $.proxy(function(e) {
                console.log('Date changeDate event triggered');
                // Hide the datepicker
                this.$input.datepicker('hide');
                // Show save/cancel buttons after date selection
                setTimeout($.proxy(function() {
                    if (this.options.showbuttons !== false) {
                        var $buttons = this.$form ? this.$form.find('.editable-buttons') : $();
                        if ($buttons.length === 0) {
                            $buttons = this.$tpl.closest('.editableform').find('.editable-buttons');
                        }
                        if ($buttons.length === 0) {
                            $buttons = this.$tpl.closest('.editable-container').find('.editable-buttons');
                        }
                        
                        console.log('Date changeDate: Found buttons to show:', $buttons.length);
                        $buttons.show();
                        $buttons.css('display', 'inline-block');
                    }
                }, this), 100);
            }, this));
            
            // Keep the original click behavior as backup
            this.$input.on('mouseup', '.day', function(e){
                if($(e.currentTarget).is('.old') || $(e.currentTarget).is('.new')) {
                    return;
                }
                console.log('Date mouseup on day');
                var $form = $(this).closest('form');
                setTimeout(function() {
                    $form.find('.editable-buttons').show();
                }, 200);
            });
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
