// -----------------------------------------------------------------
// @author:  Mark McCann (www.markmccann.me)
// @license: None, Public Domain
// -----------------------------------------------------------------

/**
 * Modality jQuery Plugin
 */
;(function ( $, window, document, undefined ) {
        
    // Private ---------------------------------------

    var _name = "modality", // the plugin name

        // local vars to shorten app
        _accessible = 'accessible',
        _aria = 'aria-hidden',
        _body = $('body')[0],
        _click = 'click',
        _index = 'tabindex',
        _length = 'length',
        _overflow = 'overflow',
        _settings = 'settings',
        _style = 'style',
        _triggers = 'triggers',
        _wrapper = 'wrapper',

        // default settings for plugin
        _defaults = {

            // settings
            accessible: true, // set false to remove accesibility features
            bind: true, // automatically bind triggers to modal
            class: '', // user can add a class to container
            clickoff: true, // click anywhere off of modal to close it
            effect: '', // animation style
            enabled: true, // set false to disable modal
            keyboard: true, // close modal with 'esc' key
            open: false, // open on page load

            // event callbacks
            onClose: '', // function to run when modal closes
            onOpen: '', // function to run when modal opens

            // classes
            inner: _name + '-inner', // inner wrapper
            outer: _name + '-outer', // outer-most container 

        }, 

    /**
     * make sure callback is function and then execute
     * @param {function/array} fn - the function you are testing
     */
    _callback = function ( fn ) {
        if( typeof fn == 'function' ) fn();
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

    /**
     * searches for a value in an array and returns key if found
     * @param {array} haystack - the array being searched 
     * @param {object} needle - the element being looked for
     * @return {int}
     */
    _contains = function ( haystack, needle ) {
        var i = haystack.length;
        while (i--) {
            if (haystack[i][0][0] === needle[0]) return i;
        }
        return false;
    },

    /**
     * updates settings with values from data-attributes
     * @param {object} dataset - data-attribute settings
     * @param {object} settings - modal settings
     * @return {object}
     */
    _data = function ( dataset, settings ) {
        for( var key in dataset ) {
            settings[key] = ( typeof settings[key] == 'boolean' ) ? _strToBool(dataset[key]) : dataset[key];
        }
        return settings;
    },

    /**
     * tests if var is an integer or not
     * @param {array} a - the array being tested
     * @return {int}
     */
    _isInt = function ( a ) {
        return a === parseInt(a, 10);
    },

    /**
     * accurately converts a string into a boolean
     * @param {string} string - the string being converted
     * @return {int}
     */
    _strToBool = function( string ) {
        switch( string.toLowerCase() ) {
            case 'false': case 'no': case '0': case '': return false; 
            default: return true;
        }
    },
            

    // Constructor -----------------------------------

    /**
     * defines object on init
     * @param {object} element - dom element
     * @param {object} options - user settings
     * @return {object}
     */
    Modality = function ( element, options ) {

        var inst      = this,
            id        = $(element).attr( 'id' ),
            settings  = _data( element.dataset, $.extend( {}, _defaults, options ) ),
            modal     = $(element).wrap(
                '<div class="'+ settings.outer + _concat(settings,'effect') + _concat(settings,'class') +'" '+ _aria+'="true">'+
                    '<div class="'+ settings.inner + '">'+
                        // user's #modal goes here
                    '</div>'+
                '</div>'
            ).show(),
            wrapper   = modal.parents('.' + settings.outer);
            triggers  = $('a[href="#'+id+'"], [data-modality="#'+id+'"]');

        // Class Attributes --------------------------

        $.extend( inst, {
            id: id, 
            settings: settings, 
            wrapper: wrapper, 
            triggers: [], 
            modal: modal,
            triggered: {}
        });

        // Events ------------------------------------

        // toggle modal on all triggers
        if( settings.bind ) {
            triggers.each( function() {
                inst.addTrigger( $(this) );
            });
        }

        // close modal if users clicks anywhere off of it
        if( settings.clickoff ) {
            wrapper[_click]( function(e) {
                if ( e.target == wrapper[0] ) inst.close(); 
            });
        }

        // close modal with 'esc' key
        if( settings.keyboard ) {
            $(_body).keyup( function (e) {
                if(e.keyCode == 27) inst.close();
            });
        }

        // keep user locked in modal until closed
        if( settings[_accessible] ) {
            $(_body).keyup( function(e) {
                if( inst.isOpen() && !modal[0].contains( document.activeElement ) ) {
                    e.stopPropagation(); modal[0].focus();
                }
            });
        }

        // Final Touches ------------------------------
            
        // add node for IE 7 compatibility
        if (navigator.appVersion.indexOf("MSIE 7.") != -1) {
            wrapper.prepend('<div class="'+_name+'-ghost"></div>');
        }

        // open modal if set to true
        if( settings.open ) inst.open();
            
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

            var inst = this;

            // prevent body from scrolling on mobile devices
            $(_body).css( _overflow, 'hidden' );

            // show the modal
            inst[_wrapper].attr( _aria,'false' );

            // if accessible, add tab-index and set focus on modal
            if( inst[_settings][_accessible] ) {
                inst.modal.attr( _index, '0' );
                setTimeout( function(){ inst.modal[0].focus(); }, 50 );
            }

            // run the callback(s)
            _callback( inst[_settings].onOpen );
            _callback( fn );

            return inst;

        },

        /**
         * closes the modal
         * @param  {function} callback
         * @return {instance} 
         */
        close: function ( fn ) {

            var inst = this;

            // remove style
            $(_body).css( _overflow, '' );

            // set accessiblity attributes
            inst[_wrapper].attr( _aria, 'true' );

            // if accessible, change tab-index and return focus to trigger
            if( inst[_settings][_accessible] ) {
                inst.modal.attr( _index, '-1' );
                inst.triggered.focus();
            }

            // run the callback(s)
            _callback( inst[_settings].onClose );
            _callback( fn );

            return inst;

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
            return ( this[_wrapper].attr( _aria ) == "true" ) ? false : true;
        },

        /**
         * manually add a trigger to open the modal on click
         * @param  {object} element - the element you want to be the trigger
         * @return {instance}
         */
        addTrigger: function ( ele ) {

            var inst = this, triggers = inst[_triggers], key = _contains( triggers, ele ),
                trigger = [ele, function (e) { e.preventDefault(); inst.toggle().triggered = ele; }];

            // add or replace the trigger and it's handler
            ( _isInt(key)  ) ? triggers[key] = trigger : triggers.push( trigger );

            // if the modal is enabled bind event
            if( inst[_settings].enabled ) trigger[0].bind( _click, trigger[1] );

            return inst;

        },

        /**
         * manually remove trigger for a modal.
         * @param  {int} - the trigger element you want action removed from
         * @return {instance}
         */
        removeTrigger: function ( ele ) {

            var inst = this, triggers = inst[_triggers], key = _contains( triggers, ele );

            // if the element exists in trigger array
            if( _isInt(key) ) {

                // unbind event from trigger
                triggers[key][0].unbind( _click, triggers[key][1] );

                // remove the trigger and handler from array
                triggers.splice(key, 1);

            }

            return inst;

        },

        /**
         * enables the modal
         * @return {instance}
         */
        enable: function()  {

            var i = 0, inst = this, triggers = inst[_triggers], length = triggers.length;

            if( !inst[_settings].enabled ) {

                // change settings to true
                inst[_settings].enabled = true;

                // bind event to each trigger
                for( i; i < length; i++ ) triggers[i][0].bind( _click, triggers[i][1] );

            }

            return inst;

        },

        /**
         * disables the modal
         * @return {instance}
         */
        disable: function() {

            var i = 0, inst = this, triggers = inst[_triggers], length = triggers.length;

            if( inst[_settings].enabled ) {

                // change settings to false
                inst[_settings].enabled = false;

                // unbind event to each trigger
                for( i; i < length; i++ ) triggers[i][0].unbind( _click, triggers[i][1] );

            }

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
            var id, i = 0, a = {}, inst = this, insts = inst.instances;
            elements.each(function() {
                id = $(this).attr( 'id' );
                if( !(id in insts) ) insts[ id ] = a[i] = new inst( this, options );  
            });
            return ( a[1] === undefined ) ? a[0] : a;
        }
        
    });
        
        
    // Globalize ------------------------------------

    $[ _name ] = Modality;
    $.fn[ _name ] = function ( options ) {  
        return $[ _name ].init( this, options );
    };


    // Auto Init --------------------------------

    /**
     * initializes any modal with '[data-modality="auto"]' and an 'id'
     */
    (function () {
        var modals = $('[data-modality="auto"]');
        for(var i = 0; i < modals.length; i++) {
            var id = $(modals[i]).attr( 'id' );
            if( id != undefined ) $( '#'+id ).modality();
        }
    })();


})( jQuery, window, document );

// ----------------------------------------------------------
