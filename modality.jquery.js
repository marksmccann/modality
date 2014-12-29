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
                clickOffClose: true, // click anywhere off of modal to close it
                closeOnEscape: true, // close modal with 'esc' key
                autoOpen: false, // open on page load
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

            var t = this; // local var for instance

            t._defaults = defaults;
            t._name     = pluginName;
            t.element   = element;
            t._$body    = $body;
            t.id        = $(element).attr( 'id' );
            t.settings  = $.extend( {}, defaults, options );
            t.$element  = $(element).wrap(
                '<div class="'+ t.settings.modalClass + ' ' + t.settings.effect +'">'+
                    '<div class="'+ t.settings.innerClass + '">'+
                        // user's modal goes here
                    '</div>'+
                '</div>'
            ).show();
            t.$wrapper   = t.$element.parents('.' + t.settings.modalClass);
            t.$triggers  = $('a[href="#'+t.id+'"], [data-modality="#'+t.id+'"]');

            // ------------------------------------------------------------

            // toggle modal on all triggers
            if( t.settings.autoBind ) {
                t.$triggers.each(function() {
                    t.setTrigger( $(this) );
                });
            }

            // close modal if users clicks anywhere off of it
            if( t.settings.clickOffClose ) {
                t.$wrapper.click( function(e) {
                    e.preventDefault(); if(e.target == t.$wrapper[0]) t.close();
                });
            }

            // close modal with 'esc' key
            if( t.settings.closeOnEscape ) {
                t._$body.keyup( function (e) {
                    if(e.keyCode == 27) t.close();
                });
            }

            // ------------------------------------------------------------

            // open modal if set to true
            if( t.settings.autoOpen ) t.open(); 

            // run the user's callback function
            if( typeof fn == 'function' ) fn();

            // save modal and return it
            return t;

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
                var t = this; 

                // set click event for new trigger
                $trigger.click(function (e) {
                    e.preventDefault(); t.toggle(); 
                });

                return t;
            }

        });

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