/*
Editableform based on Twitter Bootstrap 5
*/

(function ($) {
    "use strict";

    //store parent methods
    const pInitInput = $.fn.editableform.Constructor.prototype.initInput;

    $.extend($.fn.editableform.Constructor.prototype, {
        initTemplate: function() {
            this.$form = $($.fn.editableform.template);
            this.$form.find('.control-group').removeClass('control-group');
            this.$form.find('.editable-error-block').removeClass('help-block').addClass('invalid-feedback');
        },
        initInput: function() {
            pInitInput.apply(this);

            //for bs5 set default class `form-select-sm` to standard inputs
            var emptyInputClass = this.input.options.inputclass === null || this.input.options.inputclass === false;
            var defaultClass = 'form-select-sm';

            //bs5 add `form-select` class to standard inputs
            var stdtypes = 'text,select,textarea,password,email,url,tel,number,range,time,typeaheadjs'.split(',');
            if(~$.inArray(this.input.type, stdtypes)) {
                this.input.$input.addClass('form-select');
                if(emptyInputClass) {
                    this.input.options.inputclass = defaultClass;
                    this.input.$input.addClass(defaultClass);
                }
            }

            //apply bs3 size class also to buttons (to fit size of control)
            var $btn = this.$form.find('.editable-buttons');
            var classes = emptyInputClass ? [defaultClass] : this.input.options.inputclass.split(' ');
            for(var i=0; i<classes.length; i++) {
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
        '<button type="button" class="btn btn-outline-secondary btn-sm editable-cancel">'+
        '<i class="bi bi-x"></i>'+
        '</button>';

    //error classes
    $.fn.editableform.errorGroupClass = 'has-error';
    $.fn.editableform.errorBlockClass = null;
    //engine
    $.fn.editableform.engine = 'bs5';
}(window.jQuery));