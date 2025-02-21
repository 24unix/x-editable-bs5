/*
Editableform based on Twitter Bootstrap 3
*/
(function ($) {
    "use strict";
    
    //store parent methods
    const pInitInput = $.fn.editableform.Constructor.prototype.initInput;
    
    $.extend($.fn.editableform.Constructor.prototype, {
        // initTemplate: function() {
        //     this.$form = $($.fn.editableform.template);
        //     this.$form.find('.control-group').addClass('form-group');
        //     this.$form.find('.editable-error-block').addClass('help-block');
        // },
        initInput: function() {  
            pInitInput.apply(this);

            //for bs3 set default class `input-sm` to standard inputs
            const emptyInputClass = this.input.options.inputclass === null || this.input.options.inputclass === false;
            const defaultClass = 'input-sm';
            
            //bs3 add `form-control` class to standard inputs
            const stdtypes = 'text,select,textarea,password,email,url,tel,number,range,time,typeaheadjs'.split(',');
            if(~$.inArray(this.input.type, stdtypes)) {
                this.input.$input.addClass('form-control editable');
                if(emptyInputClass) {
                    this.input.options.inputclass = defaultClass;
                    this.input.$input.addClass(defaultClass);
                }
            }
            // Automatically open select dropdown when clicked
            if (this.input.type === 'select') {
                setTimeout(() => {
                    this.input.$input.focus().click();
                }, 50);
            }
        
            //apply bs3 size class also to buttons (to fit size of control)
            const $btn = this.$form.find('.editable-buttons');
            const classes = emptyInputClass ? [defaultClass] : this.input.options.inputclass.split(' ');
            for(let i=0; i<classes.length; i++) {
                if(classes[i].toLowerCase() === 'input-lg') {
                    $btn.find('button').removeClass('btn-sm').addClass('btn-lg'); 
                }
            }
        }
    });    
    
    //buttons
    $.fn.editableform.buttons = 
      '<button type="submit" class="btn btn-primary btn-sm editable-submit">'+
        '<i class="bi bi-check"></i>'+
      '</button>'+
      '<button type="button" class="btn btn-secondary btn-sm editable-cancel">'+
        '<i class="bi bi-x"></i>'+
      '</button>';         
    
    //error classes
    $.fn.editableform.errorGroupClass = 'has-error';
    $.fn.editableform.errorBlockClass = null;  
    //engine
    $.fn.editableform.engine = 'bs3';  
}(window.jQuery));