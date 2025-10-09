/**
Select2 input. Based on amazing work of Igor Vaynberg https://github.com/select2/select2.  
Please see [Select2 docs](https://select2.org/) for detailed description and options.  
 
You should manually download and include Select2 v4.x distributive:  

    <link href="node_modules/select2/dist/css/select2.css" rel="stylesheet" type="text/css"></link>  
    <script src="node_modules/select2/dist/js/select2.js"></script>  
    
To make it **bootstrap-styled** you can use css from [select2-bootstrap-5-theme](https://github.com/apalfrey/select2-bootstrap-5-theme): 

    <link href="select2-bootstrap-5-theme.css" rel="stylesheet" type="text/css"></link>    
    
**Note:** This version requires Select2 v4.x. For remote sources, you may need to provide custom 
`templateResult` and `templateSelection` functions.
    
@class select2
@extends abstractinput
@since 1.4.1
@final
@example
<a href="#" id="country" data-type="select2" data-pk="1" data-value="ru" data-url="/post" data-title="Select country"></a>
<script>
$(function(){
    //local source
    $('#country').editable({
        source: [
              {id: 'gb', text: 'Great Britain'},
              {id: 'us', text: 'United States'},
              {id: 'ru', text: 'Russia'}
           ],
        select2: {
           multiple: true
        }
    });
    //remote source (simple)
    $('#country').editable({
        source: '/getCountries',
        select2: {
            placeholder: 'Select Country',
            minimumInputLength: 1
        }
    });
    //remote source (advanced) - Select2 v4.x format
    $('#country').editable({
        select2: {
            placeholder: 'Select Country',
            allowClear: true,
            minimumInputLength: 3,
            ajax: {
                url: '/getCountries',
                dataType: 'json',
                delay: 250,
                data: function (params) {
                    return {
                        query: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    return {
                        results: data.map(function(item) {
                            return {
                                id: item.CountryId,
                                text: item.CountryName
                            };
                        })
                    };
                },
                cache: true
            },
            templateResult: function (item) {
                return item.text || item.CountryName;
            },
            templateSelection: function (item) {
                return item.text || item.CountryName;
            }
        }  
    });
});
</script>
**/
(function ($) {
    "use strict";
    
    var Constructor = function (options) {
        this.init('select2', options, Constructor.defaults);

        options.select2 = options.select2 || {};

        this.sourceData = null;
        
        //placeholder
        if(options.placeholder) {
            options.select2.placeholder = options.placeholder;
        }
       
        //if not `tags` mode, use source
        if(!options.select2.tags && options.source) {
            var source = options.source;
            //if source is function, call it (once!)
            if (typeof (options.source) === 'function') {
                source = options.source.call(options.scope);
            }               

            if (typeof source === 'string') {
                options.select2.ajax = options.select2.ajax || {};
                //default ajax params for Select2 v4.x
                if(!options.select2.ajax.data) {
                    options.select2.ajax.data = function(params) {
                        return { 
                            query: params.term,
                            page: params.page
                        };
                    };
                }
                if(!options.select2.ajax.processResults) {
                    options.select2.ajax.processResults = function(data) { 
                        return {results: data };
                    };
                }
                options.select2.ajax.url = source;
            } else {
                //check format and convert x-editable format to select2 format (if needed)
                this.sourceData = this.convertSource(source);
                options.select2.data = this.sourceData;
            }
        } 

        //overriding objects in config (as by default jQuery extend() is not recursive)
        this.options.select2 = $.extend({}, Constructor.defaults.select2, options.select2);

        //detect whether it is multi-valued
        this.isMultiple = this.options.select2.tags || this.options.select2.multiple;
        this.isRemote = ('ajax' in this.options.select2);

        //store function that renders text in select2
        this.formatSelection = this.options.select2.templateSelection;
        if (typeof(this.formatSelection) !== "function") {
            this.formatSelection = function (e) { return e.text; };
        }
    };

    $.fn.editableutils.inherit(Constructor, $.fn.editabletypes.abstractinput);

    $.extend(Constructor.prototype, {
        render: function() {
            this.setClass();
            
            
            //trigger resize of editableform to re-position container in multi-valued mode
            if(this.isMultiple) {
               this.$input.on('change', function() {
                   $(this).closest('form').parent().triggerHandler('resize');
               });
            }
       },

       autosubmit: function() {
            var self = this;
            var submitting = false;
            
            // Use Select2 v4.x events for autosubmit - avoid double submissions
            this.$input.on('select2:select select2:unselect', $.proxy(function(e){
                if (!submitting) {
                    submitting = true;
                    setTimeout(function() {
                        $(self.$input).closest('form').submit();
                        submitting = false;
                    }, 100);
                }
            }, this));
       },

       value2html: function(value, element) {
           var text = '', data,
               that = this;

           // Use stored selected data if available (for visual display after selection)
           if(this.selectedData && this.selectedData.length > 0) {
               data = this.selectedData;
           } else if(this.options.select2.tags) { //in tags mode just assign value
              data = value; 
           } else if(this.sourceData) {
              data = $.fn.editableutils.itemsByValue(value, this.sourceData, function(e) { return e.id; }); 
           } else {
              //can not get list of possible values 
              //(e.g. autotext for select2 with ajax source)
           }

           //data may be array (when multiple values allowed)
           if(Array.isArray(data)) {
               //collect selected data and show with separator
               text = [];
               $.each(data, function(k, v){
                   text.push(v && typeof v === 'object' ? that.formatSelection(v) : v);
               });
           } else if(data) {
               text = that.formatSelection(data);
           }

           text = Array.isArray(text) ? text.join(this.options.viewseparator) : text;

           Constructor.superclass.value2html.call(this, text, element); 
       },

       html2value: function(html) {
           return this.options.select2.tags ? this.str2value(html, this.options.viewseparator) : null;
       },

       value2input: function(value) {
           
           // if value array => join it anyway
           if(Array.isArray(value)) {
              value = value.join(this.getSeparator());
           }

           // For remote sources with existing value, create option element before Select2 init
           if(this.isRemote && !this.isMultiple && value) {
               var $el = $(this.options.scope);
               if (!$el.data('editable').isEmpty) {
                   var text = $el.text();
                   var $option = new Option(text, value, true, true);
                   this.$input.append($option);
               }
           }

           //initialize select2 if not already done
           if(!this.$input.data('select2')) {
               this.$input.val(value);
               this.$input.select2(this.options.select2);
               
               // Set up minimal event handling AFTER initialization
               this.$input.on('select2:select', $.proxy(function(e) {
                   
                   if (e.params && e.params.data) {
                       var selectedData = e.params.data;
                       this.selectedData = [selectedData];
                       
                       // Fix Select2's visual display by ensuring the option exists and is selected
                       var $existingOption = this.$input.find('option[value="' + selectedData.id + '"]');
                       if ($existingOption.length === 0) {
                           // Create the option if it doesn't exist
                           var $option = $('<option></option>')
                               .attr('value', selectedData.id)
                               .text(selectedData.text)
                               .prop('selected', true);
                           this.$input.append($option);
                       } else {
                           // Make sure existing option is selected
                           $existingOption.prop('selected', true);
                       }
                       
                       // Force Select2 to update its display
                       this.$input.trigger('change.select2');
                       
                       // Mark that a selection was just made (for blur handling)
                       this._justSelected = true;
                   }
               }, this));
               
               this.$input.on('select2:unselect', $.proxy(function(e) {
                   this.selectedData = [];
               }, this));
               
               // Ensure Select2 doesn't interfere with x-editable's document click handling
               // by making sure clicks on Select2 elements don't stop propagation
               this.$input.on('select2:open', $.proxy(function(e) {
                   // Find the Select2 dropdown container and ensure it allows document clicks to propagate
                   setTimeout(function() {
                       $('.select2-container--open .select2-dropdown').off('click.editable-prevent-close');
                       $('.select2-container--open .select2-results').off('click.editable-prevent-close');
                   }, 10);
               }, this));
               
               
               
           } else {
               //update value on existing select2
               this.$input.val(value).trigger('change.select2'); 
           }
       },
       
       input2value: function() { 
           var val = this.$input.val();
           
           // For Select2 v4.x, ensure we get the actual selected value
           if (this.$input.data('select2')) {
               var selectedData = this.$input.select2('data');
               if (selectedData && selectedData.length > 0) {
                   val = this.isMultiple ? selectedData.map(function(item) { return item.id; }) : selectedData[0].id;
               }
           }
           
           return val;
       },

       str2value: function(str, separator) {
            if(typeof str !== 'string' || !this.isMultiple) {
                return str;
            }

            separator = separator || this.getSeparator();

            var val, i, l;

            if (str === null || str.length < 1) {
                return null;
            }
            val = str.split(separator);
            for (i = 0, l = val.length; i < l; i = i + 1) {
                val[i] = val[i].trim();
            }

            return val;
       },


        getSeparator: function() {
            // Select2 v4.x uses different separator handling
            return this.options.select2.separator || ',';
        },

        /*
        Converts source from x-editable format: {value: 1, text: "1"} to
        select2 format: {id: 1, text: "1"}
        */
        convertSource: function(source) {
            if(Array.isArray(source) && source.length && source[0].value !== undefined) {
                for(var i = 0; i<source.length; i++) {
                    if(source[i].value !== undefined) {
                        source[i].id = source[i].value;
                        delete source[i].value;
                    }
                }
            }
            return source;
        },
        
        destroy: function() {
	        if(this.$input) {
	            if(this.$input.data('select2')) {
	                this.$input.select2('destroy');
	            }
	        }
        }
        
    });

    Constructor.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        /**
        @property tpl 
        @default <input type="hidden">
        **/
        tpl:'<input type="hidden">',
        /**
        Configuration of select2. [Full list of options](https://select2.org/configuration).

        @property select2 
        @type object
        @default null
        **/
        select2: null,
        /**
        Placeholder attribute of select

        @property placeholder 
        @type string
        @default null
        **/
        placeholder: null,
        /**
        Source data for select. It will be assigned to select2 `data` property and kept here just for convenience.
        Please note, that format is different from simple `select` input: use 'id' instead of 'value'.
        E.g. `[{id: 1, text: "text1"}, {id: 2, text: "text2"}, ...]`.

        @property source 
        @type array|string|function
        @default null        
        **/
        source: null,
        /**
        Separator used to display tags.

        @property viewseparator 
        @type string
        @default ', '        
        **/
        viewseparator: ', '
    });

    $.fn.editabletypes.select2 = Constructor;

}(window.jQuery));