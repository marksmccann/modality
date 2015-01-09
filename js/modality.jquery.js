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
            

    // Constructor -----------------------------------

    /**
     * defines object on init
     * @param {object} element - dom element
     * @param {object} options - user settings
     * @return {object}
     */
    Plugin = function ( element, options ) {
                
        var inst = this; // local var to avoid scope issues

        // Class Attributes ---------------
            
        inst.defaults  = _defaults;
        inst.element   = element;
        inst.body      = _body;
        inst.id        = $(element).attr( 'id' );
        inst.settings  = $.extend( {}, _defaults, options );
        inst.$element  = $(element).wrap(
            '<div class="'+ inst.settings.modalClass + ' ' + inst.settings.effect + ' ' + inst.settings.userClass +'">'+
                '<div class="'+ inst.settings.innerClass + '">'+
                    // user's #modal goes here
                '</div>'+
            '</div>'
        ).show();
        inst.$wrapper  = inst.$element.parents('.' + inst.settings.modalClass);
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
            $(inst.body).keyup( function (e) {
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

    $.extend( Plugin.prototype, {

        /**
         * opens the modal
         * @param  {function} callback
         * @return {instance}
         */
        open: function ( fn ) {

            // add classes to open the modal
            this.$wrapper.add(this.body).addClass( this.settings.openClass );

            // run the callback(s)
            if ( typeof this.settings.onOpen == 'function' ) this.settings.onOpen();
            if ( typeof fn == 'function' ) fn();

            return this;
        },

        /**
         * closes the modal
         * @param  {function} callback
         * @return {instance} 
         */
        close: function ( fn ) {

            // add classes to open the modal
            this.$wrapper.add(this.body).removeClass( this.settings.openClass );

            // run the callback(s)
            if ( typeof this.settings.onClose == 'function' ) this.settings.onClose();
            if ( typeof fn == 'function' ) fn();

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
        
    $.extend( Plugin, { 
            
        instances: [], // for storing instances
        
        /**
         * creates new instance for element(s), stores/returns it(them)
         * @param  {string} query - css query selector
         * @param  {object} options - user settings
         * @return {array}
         */
        init: function ( elements, options ) {
            var a = {}, Plugin = this, i = 0;
            elements.each(function() {
                var inst = new Plugin( this, options );
    	        Plugin.instances[ inst.id ] = a[i] = inst;   
            });  
            return ( a[1] === undefined ) ? a[0] : a;
        }
        
    });
        
        
    // Globalize ------------------------------------

    $[ _name ] = Plugin;
    $.fn[ _name ] = function ( options ) {  
        return $[ _name ].init( this, options );
    };

})( jQuery, window, document );

// ----------------------------------------------------------
