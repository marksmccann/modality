// -----------------------------------------------------------------
// @author:  Mark McCann (www.markmccann.me)
// @license: None, Public Domain
// -----------------------------------------------------------------

/**
 * jQuery Plugin Template
 */
;(function ( $, window, document, undefined ) {
        
    // Private ---------------------------------------

    var _name = "modality", // the plugin name

        // get the body only once
        _body = $('body')[0],

        // default settings for plugin
        _defaults = {
            autoBind: true, // automatically bind triggers to modal
            clickOffToClose: true, // click anywhere off of modal to close it
            closeOnEscape: true, // close modal with 'esc' key
            effect: "", // animation style
            innerClass: "mm-wrap", // inner wrapper
            modalClass: "modality-modal", // outer-most container
            onClose: "", // function to run when modal closes
            onOpen: "", // function to run when modal opens
            openClass: "mm-show", // when modal is visible
            openOnLoad: false, // open on page load
            userClass: "" // user can add a class to container 
        },


    /**
     * make sure callback is function and then execute
     * @param {function/array} fn - the function you are testing
     */
    _callback = function ( fn ) {
        for( var i = 0; i < fn.length; i++ )
            if( typeof fn[i] == 'function' ) fn[i]();
    },


    /**
     * return space and classname if classname exists
     * @param {object} settings - the modal's settings
     * @param {string} setting - the setting name
     * @return {string}
     */
    _concat = function ( settings, setting ) {
        return ( settings[setting] != "" ) ? ' ' + settings[setting] : "";  
    },
            

    // Constructor -----------------------------------

    /**
     * defines object on init
     * @param {object} element - dom element
     * @param {object} options - user settings
     * @return {object}
     */
    Modality = function ( element, options ) {
                
        var inst = this; // local var to avoid scope issues

        // Class Attributes ---------------
            
        inst.defaults  = _defaults;
        inst.id        = $(element).attr( 'id' );
        inst.settings  = $.extend( {}, _defaults, options );
        inst.$modal    = $(element).wrap(
            '<div class="'+ inst.settings.modalClass + _concat(inst.settings,'effect') + _concat(inst.settings,'userClass') +'">'+
                '<div class="'+ inst.settings.innerClass + '">'+
                    // user's #modal goes here
                '</div>'+
            '</div>'
        ).show();
        inst.$wrapper  = inst.$modal.parents('.' + inst.settings.modalClass);
        inst.$triggers = $('a[href="#'+inst.id+'"], [data-modality="#'+inst.id+'"]');

        // Events ------------------------------------

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
            $(_body).keyup( function (e) {
                if(e.keyCode == 27) inst.close();
            });
        }

        // Final Touches ------------------------------
            
        // add node for IE 7 compatibility
        if (navigator.appVersion.indexOf("MSIE 7.") != -1) {
            inst.$wrapper.prepend('<div class="mm-ghost"></div>');
        }

        // open modal if set to true
        if( inst.settings.openOnLoad ) inst.open(); 
            
        // --------------------------------
            
        return inst;
            
    };
        

    // Class Methods ---------------------------------

    $.extend( Modality.prototype, {

        /**
         * opens the modal
         * @param  {function} callback
         * @return {instance}
         */
        open: function ( fn ) {

            // add classes to open the modal
            this.$wrapper.add(_body).addClass( this.settings.openClass );

            // run the callback(s)
            _callback( [this.settings.onOpen,fn] );

            return this;
        },

        /**
         * closes the modal
         * @param  {function} callback
         * @return {instance} 
         */
        close: function ( fn ) {

            // add classes to open the modal
            this.$wrapper.add(_body).removeClass( this.settings.openClass );

            // run the callback(s)
            _callback( [this.settings.onClose,fn] );

            return this;
        },

        /**
         * toggles the modal
         * @param  {function} callback
         * @return {instance}
         */
        toggle: function ( fn ) {
            return ( this.isOpen() ) ? this.close( fn ) : this.open( fn );
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
        
        
    // Static Methods --------------------------------
        
    $.extend( Modality, { 
            
        instances: {}, // for storing instances
        
        /**
         * creates new instance for element(s), stores/returns it(them)
         * @param  {string} query - css query selector
         * @param  {object} options - user settings
         * @return {array}
         */
        init: function ( elements, options ) {
            var a = {}, Obj = this, i = 0;
            elements.each(function() {
                var inst = new Obj( this, options );
    	        Obj.instances[ inst.id ] = a[i] = inst;   
            });  
            return ( a[1] === undefined ) ? a[0] : a;
        }
        
    });
        
        
    // Globalize ------------------------------------

    $[ _name ] = Modality;
    $.fn[ _name ] = function ( options ) {  
        return $[ _name ].init( this, options );
    };

})( jQuery, window, document );

// ----------------------------------------------------------
