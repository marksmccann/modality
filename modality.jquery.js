;(function ( $, window, document, undefined ) {

        /**
         * list of Modality defaults
         */
        var pluginName = "modality",
            $body = $('body'),
            defaults = {
                modalClass: "modality-modal", // outer-most container
                innerClass: "mm-wrap", // inner wrapper
                openClass: "mm-show", // when modal is visible
                userClass: '', // user can add a class to container 
                clickOffToClose: true, // click anywhere off of modal to close it
                closeOnEscape: true, // close modal with 'esc' key
                openOnLoad: false, // open on page load
                autoBind: true, // automatically bind triggers to modal
                effect: "effect-1", // animation style
                onOpen: function(){}, // function to run when modal opens
                onClose: function(){} // function to run when modal closes
            };

        // -----------------------------------------------

        /**
         * the modality object
         * @param {object} modal
         * @param {object} options
         * @param {function} callback
         */
        function Modality ( element, options, fn ) {

            var inst = this; // local var for instance

            inst._defaults = defaults;
            inst._name     = pluginName;
            inst.element   = element;
            inst._$body    = $body;
            inst.id        = $(element).attr( 'id' );
            inst.settings  = $.extend( {}, defaults, options );
            inst.$element  = $(element).wrap(
                '<div class="'+ inst.settings.modalClass + ' ' + inst.settings.effect + ' ' + inst.settings.userClass +'">'+
                    '<div class="'+ inst.settings.innerClass + '">'+
                        // user's #modal goes here
                    '</div>'+
                '</div>'
            ).show();
            inst.$wrapper   = inst.$element.parents('.' + inst.settings.modalClass);
            inst.$triggers  = $('a[href="#'+inst.id+'"], [data-modality="#'+inst.id+'"]');

            // ------------------------------------------------------------

            // add node for IE 7 compatibility
            if (navigator.appVersion.indexOf("MSIE 7.") != -1) {
                inst.$wrapper.prepend('<div class="mm-ghost"></div>');
            }

            // ------------------------------------------------------------

            // toggle modal on all triggers
            if( inst.settings.autoBind ) {
                inst.$triggers.each(function() {
                    inst.setTrigger( $(this) );
                });
            }

            // close modal if users clicks anywhere off of it
            if( inst.settings.clickOffToClose ) {
                inst.$wrapper.click( function(e) {
                    e.preventDefault(); if(e.target == inst.$wrapper[0]) inst.close();
                });
            }

            // close modal with 'esc' key
            if( inst.settings.closeOnEscape ) {
                inst._$body.keyup( function (e) {
                    if(e.keyCode == 27) inst.close();
                });
            }

            // ------------------------------------------------------------

            // open modal if set to true
            if( inst.settings.openOnLoad ) inst.open(); 

            // run the user's callback function
            if( typeof fn == 'function' ) fn();

            // save modal and return it
            return $.modality.lookup[inst.id] = inst;

        }

        // -----------------------------------------------

        $.extend(Modality.prototype, {

            /**
             * opens the modal
             * @param  {function} callback
             * @return {instance}
             */
            open: function () {

                // add classes to open the modal
                this.$wrapper.add(this._$body).addClass( this.settings.openClass );

                // run the callback(s)
                if ( typeof this.settings.onOpen == 'function' ) this.settings.onOpen();

                return this;
            },

            /**
             * closes the modal
             * @param  {function} callback
             * @return {instance} 
             */
            close: function () {

                // add classes to open the modal
                this.$wrapper.add(this._$body).removeClass( this.settings.openClass );

                // run the callback(s)
                if ( typeof this.settings.onClose == 'function' ) this.settings.onClose();

                return this;
            },

            /**
             * toggles the modal
             * @param  {function} callback
             * @return {instance}
             */
            toggle: function () {
                return ( this.isOpen() ) ? this.close() : this.open();
            },

            /**
             * determines if the modal is open or not
             * @return {Boolean}
             */
            isOpen: function () {
                return this.$wrapper.hasClass(this.settings.openClass);
            },

            /**
             * manually set trigger for a modal
             * @param  {object} - the element you want to be the trigger
             * @return {instance}
             */
            setTrigger: function ( $trigger ) {

                // set local var for instance
                var inst = this; 

                // set click event for new trigger
                $trigger.click(function (e) {
                    e.preventDefault(); inst.toggle(); 
                });

                return inst;
            }

        });

        // -----------------------------------------------
        
        /**
         * Special plugin object for instances.
         * @type {Object}
         * @public
         */
        $[pluginName] = {
            root: Modality,
            lookup: []
        };

        // -----------------------------------------------

        /**
         * initalizes modal(s)
         * @param  {object} settings
         * @return {object, array}
         */
        $.fn[ pluginName ] = function ( options ) {
            this.each(function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, "plugin_" + pluginName, new Modality( this, options ) );
                }
            });

            return this;
        };

})( jQuery, window, document );