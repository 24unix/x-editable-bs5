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
            
            // Hide buttons initially for datepicker workflow
            var self = this;
            setTimeout(function() {
                if (!self.$form) {
                    // Find buttons in the broader DOM and hide them directly
                    var $allButtons = $('.editable-buttons:visible');
                    if ($allButtons.length > 0) {
                        $allButtons.each(function(i, btn) {
                            // Directly hide this button for datepicker
                            var $btn = $(btn);
                            $btn.hide();
                            $btn.css('display', 'none !important');
                            $btn.addClass('datepicker-hidden');
                            
                            // Store reference for later showing
                            self.$dateButtons = $btn;
                        });
                    }
                }
            }, 500);
            
            //update value of datepicker
            this.$input.keyup($.proxy(function(){
               this.$tpl.removeData('date');
               this.$tpl.datepicker('update');
            }, this));
            
            // Manually call autosubmit to set up our event handlers
            this.autosubmit();
            
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
         // Override default autosubmit behavior for datepicker workflow
         // We handle this manually with changeDate event
         
         // Setup the manual workflow: show buttons only after date selection
         this.$tpl.on('changeDate', $.proxy(function(e) {
             // Hide the datepicker using multiple methods to ensure it closes
             setTimeout($.proxy(function() {
                 // Try datepicker hide methods
                 try {
                     this.$tpl.datepicker('hide');
                 } catch(err) {
                     // Fallback to input method
                 }
                 
                 try {
                     this.$input.datepicker('hide');
                 } catch(err) {
                     // Continue to force methods
                 }
                 
                 // Force hide all datepicker elements
                 $('.datepicker').hide();
                 $('.datepicker-dropdown').hide();
                 
                 // Ensure any remaining visible datepickers are hidden
                 var $visiblePicker = $('.datepicker:visible, .datepicker-dropdown:visible');
                 if ($visiblePicker.length > 0) {
                     $visiblePicker.css('display', 'none !important');
                     $visiblePicker.css('visibility', 'hidden');
                 }
             }, this), 10);
             
             // Show save/cancel buttons after date selection
             setTimeout($.proxy(function() {
                 if (this.options.showbuttons !== false) {
                     var $buttons = this.$dateButtons || $('.editable-buttons.datepicker-hidden');
                     if ($buttons.length === 0) {
                         $buttons = this.$form ? this.$form.find('.editable-buttons') : $();
                     }
                     if ($buttons.length === 0) {
                         $buttons = this.$tpl.closest('.editableform').find('.editable-buttons');
                     }
                     if ($buttons.length === 0) {
                         $buttons = this.$tpl.closest('.editable-container').find('.editable-buttons');
                     }
                     
                     $buttons.show();
                     $buttons.css('display', 'inline-flex');
                     $buttons.addClass('show-buttons');
                     $buttons.removeClass('datepicker-hidden');
                 }
             }, this), 100);
         }, this));
         
         // Do NOT call parent autosubmit to prevent immediate form submission
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