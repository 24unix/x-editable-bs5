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
            this.$input = this.$tpl.find('input');
            this.setClass();
            this.setAttr('placeholder');
    
            //use datepicker instead of bdatepicker      
            this.$tpl.datepicker(this.options.datepicker);
            
            //need to disable original event handlers
            this.$input.off('focus keydown');
            
            //update value of datepicker
            this.$input.keyup($.proxy(function(){
               this.$tpl.removeData('date');
               this.$tpl.datepicker('update');
            }, this));
            
        },   
        
       value2input: function(value) {
           var formattedValue = value ? this.dpg.formatDate(value, this.parsedViewFormat, this.options.datepicker.language) : '';
           this.$input.val(formattedValue);
           this.$tpl.datepicker('update');
       },
        
       input2value: function() { 
           // First try the container datepicker (ideal case)
           var containerDatepicker = this.$tpl.data('datepicker');
           
           if (containerDatepicker && containerDatepicker.dates && containerDatepicker.dates.length > 0) {
               return containerDatepicker.dates[0];
           }
           
           // Fallback: try the input datepicker (in case manual init worked)
           var inputDatepicker = this.$input.data('datepicker');
           
           if (inputDatepicker && inputDatepicker.dates && inputDatepicker.dates.length > 0) {
               return inputDatepicker.dates[0];
           }
           
           // Try getDate methods
           if (containerDatepicker && typeof containerDatepicker.getDate === 'function') {
               var containerDate = containerDatepicker.getDate();
               if (containerDate) {
                   return containerDate;
               }
           }
           
           if (inputDatepicker && typeof inputDatepicker.getDate === 'function') {
               var inputDate = inputDatepicker.getDate();
               if (inputDate) {
                   return inputDate;
               }
           }
           
           // Final fallback to text parsing
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