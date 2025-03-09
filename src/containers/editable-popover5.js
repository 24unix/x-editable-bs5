/**
 * Editable Popover for Bootstrap 5 based on Popper.js
 * ---------------------
 * requires bootstrap-popover.js
 */
import { Popover } from "bootstrap";

(function ($) {
    "use strict";

    //extend methods
    $.extend($.fn.editableContainer.Popup.prototype, {
        containerName: 'popover',
        containerDataName: 'bs.popover',
        innerCss: '.popover-body',
        defaults: Popover.Default,

        initContainer: function(){
            $.extend(this.containerOptions, {
                trigger: 'manual',
                selector: false,
                content: ' ',
                template: this.defaults.template
            });

            //as template property is used in inputs, hide it from popover
            var t;
            if(this.$element.data('template')) {
                t = this.$element.data('template');
                this.$element.removeData('template');
            }

            this.call(this.containerOptions);

            if(t) {
                //restore data('template')
                this.$element.data('template', t);
            }
        },

        /* show */
        innerShow: function () {
            this.call('show');
        },

        /* hide */
        innerHide: function () {
            this.call('hide');
        },

        /* destroy */
        innerDestroy: function() {
            this.call('dispose');
        },

        setContainerOption: function(key, value) {
            this.container().options[key] = value;
        },

        setPosition: function () {
            (function() {}).call(this.container());
        },

        call: function() {
            if ( ! $(this.$element).data(this.containerDataName)) {
                $(this.$element).data(this.containerDataName,
                    Popover.getOrCreateInstance(this.$element, this.containerOptions)
                );
            }

            return this.$element[this.containerName].apply(this.$element, arguments);
        },

        tip: function() {
            return this.container() ? $(this.container().tip) : null;
        }
    });

}(window.jQuery));