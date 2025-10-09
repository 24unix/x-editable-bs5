/**
 * Editable Popover for Bootstrap 5 based on Popper.js
 * ---------------------
 * requires bootstrap-popover.js
 */

(function ($) {
    "use strict";

    //extend methods
    $.extend($.fn.editableContainer.Popup.prototype, {
        containerName: 'popover',
        containerDataName: 'bs.popover',
        innerCss: '.popover-body',
        defaults: bootstrap.Popover.Default,

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
            // Preserve scroll position to prevent page jumping
            var scrollTop = $(window).scrollTop();
            var scrollLeft = $(window).scrollLeft();
            
            this.call('show');
            
            // Multiple restoration attempts to handle async positioning
            setTimeout(function() {
                $(window).scrollTop(scrollTop);
                $(window).scrollLeft(scrollLeft);
            }, 0);
            
            setTimeout(function() {
                $(window).scrollTop(scrollTop);
                $(window).scrollLeft(scrollLeft);
            }, 10);
            
            setTimeout(function() {
                $(window).scrollTop(scrollTop);
                $(window).scrollLeft(scrollLeft);
            }, 50);
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
                    bootstrap.Popover.getOrCreateInstance(this.$element, this.containerOptions)
                );
            }

            return this.$element[this.containerName].apply(this.$element, arguments);
        },

        tip: function() {
            return this.container() ? $(this.container().tip) : null;
        }
    });

}(window.jQuery));