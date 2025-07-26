/**
Bootstrap datefield input - modification for inline mode.
Shows normal <input type="text"> and binds popup datepicker.  
Automatically shown in inline mode.

@class datefield
@extends date

@since 1.4.0
**/
(function ($) {
    "use strict";
    
    var DateField = function (options) {
        this.init('datefield', options, DateField.defaults);
        this.initPicker(options, DateField.defaults);
        
        // Ensure type is set correctly
        this.type = 'datefield';
    };

    $.fn.editableutils.inherit(DateField, $.fn.editabletypes.date);    
    
    $.extend(DateField.prototype, {
        render: function () {
            console.log("DateField.render() called");
            this.$input = this.$tpl.find('input');
            this.setClass();
            this.setAttr('placeholder');
    
            console.log("DateField initializing datepicker on container:", this.$tpl[0]);
            console.log("DateField datepicker options:", this.options.datepicker);
            
            //use datepicker instead of bdatepicker      
            this.$tpl.datepicker(this.options.datepicker);
            
            console.log("DateField datepicker initialized, data:", this.$tpl.data('datepicker'));
            
            // Add event listeners to track date changes
            this.$tpl.on('changeDate', $.proxy(function(e) {
                console.log("DateField changeDate event triggered:", e.date);
            }, this));
            
            this.$tpl.on('hide', $.proxy(function(e) {
                console.log("DateField datepicker hide event triggered");
                console.log("DateField datepicker data on hide:", this.$tpl.data('datepicker'));
            }, this));
            
            //need to disable original event handlers
            this.$input.off('focus keydown');
            
            //update value of datepicker
            this.$input.keyup($.proxy(function(){
               this.$tpl.removeData('date');
               this.$tpl.datepicker('update');
            }, this));
            
        },   
        
       value2input: function(value) {
           console.log("DateField.value2input() called with value:", value);
           var formattedValue = value ? this.dpg.formatDate(value, this.parsedViewFormat, this.options.datepicker.language) : '';
           console.log("DateField formatted value for input:", formattedValue);
           this.$input.val(formattedValue);
           this.$tpl.datepicker('update');
           console.log("DateField after update, datepicker data:", this.$tpl.data('datepicker'));
       },
        
       input2value: function() { 
           console.log("DateField.input2value() called");
           
           // First try the container datepicker (ideal case)
           var containerDatepicker = this.$tpl.data('datepicker');
           console.log("DateField container datepicker object:", containerDatepicker);
           
           if (containerDatepicker && containerDatepicker.dates && containerDatepicker.dates.length > 0) {
               console.log("DateField returning from container dates array:", containerDatepicker.dates[0]);
               return containerDatepicker.dates[0];
           }
           
           // Fallback: try the input datepicker (in case manual init worked)
           var inputDatepicker = this.$input.data('datepicker');
           console.log("DateField input datepicker object:", inputDatepicker);
           
           if (inputDatepicker && inputDatepicker.dates && inputDatepicker.dates.length > 0) {
               console.log("DateField returning from input dates array:", inputDatepicker.dates[0]);
               return inputDatepicker.dates[0];
           }
           
           // Try getDate methods
           if (containerDatepicker && typeof containerDatepicker.getDate === 'function') {
               var containerDate = containerDatepicker.getDate();
               if (containerDate) {
                   console.log("DateField returning from container getDate():", containerDate);
                   return containerDate;
               }
           }
           
           if (inputDatepicker && typeof inputDatepicker.getDate === 'function') {
               var inputDate = inputDatepicker.getDate();
               if (inputDate) {
                   console.log("DateField returning from input getDate():", inputDate);
                   return inputDate;
               }
           }
           
           // Final fallback to text parsing
           console.log("DateField fallback to text input value:", this.$input.val());
           return this.html2value(this.$input.val());
       },              
        
       activate: function() {
           $.fn.editabletypes.text.prototype.activate.call(this);
       },
       
       autosubmit: function() {
         //reset autosubmit to empty  
       }
    });
    
    DateField.defaults = $.extend({}, $.fn.editabletypes.date.defaults, {
        /**
        @property tpl 
        **/         
        tpl:'<div class="input-group input-group-sm date datepicker-above" style="width: 200px; border: 1px solid #dee2e6; border-radius: 0.375rem; position: relative;"><input type="text" class="form-control form-control-sm" style="border: none;"/><span class="input-group-text" style="border: none; background: transparent;"><i class="bi bi-calendar"></i></span></div>',
        /**
        @property inputclass 
        @default 'form-control form-control-sm'
        **/         
        inputclass: 'form-control form-control-sm',
        
        /* datepicker config */
        datepicker: {
            weekStart: 0,
            startView: 0,
            minViewMode: 0,
            autoclose: true,
            orientation: 'top',
            container: 'body'
        }
    });
    
    $.fn.editabletypes.datefield = DateField;

}(window.jQuery));