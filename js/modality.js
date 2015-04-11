// -----------------------------------------------------------------
// @author:  Mark McCann (www.markmccann.me)
// @license: None, Public Domain
// -----------------------------------------------------------------

/**
 * Modality JavaScript Plugin
 */
;(function ( window, document ) {

    // Private ---------------------------------------

    var _name = 'Modality', // the plugin name

        // local vars to shorten app
        _body = document.querySelector('body'),
        _accessible = 'accessible',
        _aria = 'aria-hidden',
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
            'class': '', // user can add a class to container
            clickoff: true, // click anywhere off of modal to close it
            effect: '', // animation style
            enabled: true, // set false to disable modal
            keyboard: true, // close modal with 'esc' key
            open: false, // open on page load

            // event callbacks
            onClose: '', // function to run when modal closes
            onOpen: '', // function to run when modal opens

            // classes
            inner: 'modality-inner', // inner wrapper
            outer: 'modality-outer' // outer-most container 

        }, 

    /**
     * add an event to a given node
     * @param {object} target - the node you are adding the event to
     * @param {string} event - the event kind
     * @param {function} fn - the callback function
     */
    _addEvent = function( target, event, fn ) {
        if ( target.attachEvent ) {
            target['e'+event+fn] = fn;
            target[event+fn] = function(){ target['e'+event+fn]( window.event ); }
            target.attachEvent( 'on'+event, target[event+fn] );
        } else {
            target.addEventListener( event, fn, false );
        }
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
        return ( settings[setting] != '' ) ? ' ' + settings[setting] : '';  
    },

    /**
     * searches for a value in an array and returns key if found
     * @param {array} haystack - the array being searched 
     * @param {object} needle - the element being looked for
     * @return {int}
     */
    _contains = function ( haystack, needle ) {
        var i = haystack[_length];
        while (i--) {
            if (haystack[i][0] === needle) return i;
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
            settings[key] = ( typeof settings[key] == 'boolean' ) ? _stringToBool(dataset[key]) : dataset[key];
        }
        return settings;
    },

    /**
     * combines objects into one
     * @param {object} - collects values
     * @param {object} - objects to add values from
     * @return {object}
     */
    _extend = function () {
        var key, i = 1, a = arguments;
        for( i; i < a[_length]; i++ )
            for( key in a[i] )
                if(a[i].hasOwnProperty(key))
                    a[0][key] = a[i][key];
        return a[0];
    },

    /**
     * shorthand version of getAttribute to shorten app
     * @param {object} element
     * @param {object} attr
     * @return {object}
     */
    _getAttr = function ( element, attr ) {
        return element.getAttribute( attr );
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
     * prevent event default
     * @param {event} e - the event
     */
    _preventDefault = function ( e ) {
        (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
    },

    /**
     * remove an event from a given node
     * @param {object} target - the node you are removing the event from
     * @param {string} event - the event kind
     * @param {function} fn - the callback function
     */
    _removeEvent = function( target, event, fn ) {
        if ( target.detachEvent ) {
            target.detachEvent( 'on'+event, target[event+fn] );
            target[event+fn] = null;
        } else {
            target.removeEventListener( event, fn, false );
        }
    },

    /**
     * shorthand version of setAttribute to shorten app
     * @param {object} element
     * @param {object} attr
     * @return {object}
     */
    _setAttr = function ( element, attr, value ) {
        element.setAttribute( attr, value );
    },

    /**
     * accurately converts a string into a boolean
     * @param {string} string - the string being converted
     * @return {int}
     */
    _stringToBool = function( string ) {
        switch( string.toLowerCase() ) {
            case 'false': case 'no': case '0': case '': return false; 
            default: return true;
        }
    },

    /**
     * wraps the users modal element in modality's frame:
     * 
     * <div class="modality-modal effect-1">
     *    <div class="mm-wrap">
     *        // user's modal goes here
     *    </div>
     * </div>
     *
     * @return {object}
     */
    _wrap = function ( element, settings ) {

        // create the container
        var wrapper = document.createElement('div');

        // set the attributes
        _setAttr( wrapper, 'class', settings['outer'] + _concat(settings, 'effect') + _concat(settings, 'class') );
        _setAttr( wrapper, _aria, 'true');

        // insert the contents
        wrapper.innerHTML = '<div class="'+settings.inner+'">' + element.outerHTML + '</div>';

        // replace the old with the new
        element.parentNode.replaceChild( wrapper, element );

        return wrapper;
        
    },


    // Constructor -----------------------------------

    /**
     * defines object on init
     * @param {object} element - dom element
     * @param {object} options - user settings
     * @return {object}
     */
    Modality = function ( element, options ) {
                
        // Local Vars --------------------------------

        var i = 0,
            inst     = this,
            id       = _getAttr( element, 'id' ),
            settings = _data( element.dataset, _extend( {}, _defaults, options ) ),
            wrapper  = _wrap( element, settings ),
            triggers = document.querySelectorAll( 'a[href="#'+id+'"],[data-target="#'+id+'"]' ), 
            modal    = document.getElementById( id );

        // Class Attributes --------------------------

        _extend( inst, {
            id: id,  
            settings: settings, 
            wrapper: wrapper, 
            triggers: [], 
            modal: modal,
            triggered: {}
        });

        // Events ------------------------------------

        // bind each trigger to the modal
        if( settings.bind ) {
            for( i; i < triggers[_length]; i++ ) inst.addTrigger( triggers[i] );
        }

        // close modal if users clicks anywhere off of it
        if( settings.clickoff ) {
            _addEvent( wrapper, _click, function( e ) {
                if ( e.target == wrapper ) inst.close();
            });
        }

        // close modal with 'esc' key
        if( settings.keyboard ) {
            _addEvent( _body, 'keyup', function (e) {
                if(!e.keyCode || e.keyCode === 27) inst.close();
            });
        }

        // keep user locked in modal until closed
        if( settings[_accessible] ) {
            _addEvent( _body, 'keyup', function (e) {
                if( inst.isOpen() && !modal.contains( document.activeElement ) ) {
                    e.stopPropagation(); modal.focus();
                }
            });
        }

        // Final Touches ------------------------------

        // make sure modal is not hidden
        if( modal[_style].display == 'none' ) modal[_style].display = '';

        // open modal if set to true
        if( settings.open ) inst.open();
            
        // --------------------------------------------
            
        return inst;
            
    };


    // Class Methods ---------------------------------

    _extend( Modality.prototype, {

        /**
         * opens the modal
         * @param  {function} fn
         * @return {instance}
         */
        open: function ( fn ) {

            var inst = this;

            // prevent body from scrolling on mobile devices
            _body[_style][_overflow] = 'hidden';

            // show the modal
            _setAttr( inst[_wrapper], _aria, 'false' );

            // if accessible, add tab-index and set focus on modal
            if( inst[_settings][_accessible] ) {
                _setAttr( inst.modal, _index, '0' );
                setTimeout( function(){ inst.modal.focus(); }, 25 );
            }

            // run the callback(s)
            _callback( inst[_settings].onOpen );
            _callback( fn );

            return inst;

        },

        /**
         * closes the modal
         * @param  {function} fn
         * @return {instance} 
         */
        close: function ( fn ) {

            var inst = this;

            // remove style
            _body[_style][_overflow] = '';

            // set accessiblity attributes
            _setAttr( inst[_wrapper], _aria, 'true' );

            // if accessible, change tab-index and return focus to trigger
            if( inst[_settings][_accessible] ) {
                _setAttr( inst.modal, _index, '-1' );
                inst.triggered.focus();
            }

            // run the callback(s)
            _callback( inst[_settings].onClose );
            _callback( fn );

            return inst;

        },

        /**
         * toggles the modal
         * @param  {function} fn
         * @return {instance}
         */
        toggle: function ( fn ) {
            return ( this.isOpen() ) ? this.close(fn) : this.open(fn);
        },

        /**
         * determines if the modal is open or not
         * @return {Boolean}
         */
        isOpen: function () {
            return ( _getAttr( this[_wrapper], _aria ) == "true" ) ? false : true;
        },

        /**
         * manually add a trigger to open the modal on click
         * @param  {object} element - the element you want to be the trigger
         * @return {instance}
         */
        addTrigger: function ( ele ) {

            var inst = this, triggers = inst[_triggers], key = _contains( triggers, ele ),
                trigger = [ele, function (e) { _preventDefault(e); inst.toggle().triggered = ele; }];
 
            // add or replace the trigger and it's handler
            ( _isInt(key)  ) ? triggers[key] = trigger : triggers.push( trigger );

            // if the modal is enabled bind event
            if( inst[_settings].enabled ) _addEvent( trigger[0], _click, trigger[1] );

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

                // unbind events from trigger
                _removeEvent( triggers[key][0], _click, triggers[key][1] );

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

            var i = 0, inst = this, triggers = inst[_triggers], length = triggers[_length];

            if( !inst[_settings].enabled ) {

                // change setting to true
                inst[_settings].enabled = true;

                // bind events to each trigger
                for( i; i < length; i++ ) _addEvent( triggers[i][0], _click, triggers[i][1] );

            }

            return inst;

        },

        /**
         * disables the modal
         * @return {instance}
         */
        disable: function() {

            var i = 0, inst = this, triggers = inst[_triggers], length = triggers[_length];

            if( inst[_settings].enabled ) {

                // change setting to false
                inst[_settings].enabled = false;

                // unbinds event from each trigger
                for( i; i < length; i++ ) _removeEvent( triggers[i][0], _click, triggers[i][1] );

            }

            return inst;

        }

    });
        
        
    // Static Methods --------------------------------
        
    _extend( Modality, { 

        instances: {}, // for storing instances
        extend: _extend, // externalize method

        /**
         * creates new instance for element(s), stores/returns it(them)
         * @param  {string} query - css query selector
         * @param  {object} options - user settings
         * @return {array}
         */
        init: function ( query, options ) {

            // local vars
            var id, i = 0, a = {}, inst = this, insts = inst.instances, 
                elements = document.querySelectorAll(query);

            // loop through query results and instantiatie
            for( i; i < elements[_length]; i++ ) {
                id = _getAttr( elements[i], 'id' );
                if( !(id in insts) ) insts[ id ] = a[i] = new inst( elements[i], options );
            }

            return ( a[1] === undefined ) ? a[0] : a;
        }

    });

    
    // Auto Init --------------------------------

    /**
     * initializes any modal with '[data-modality="auto"]' and an 'id'
     */
    (function () {
        var id, i = 0, modals = document.querySelectorAll('[data-modality="auto"]');
        for( i; i < modals[_length]; i++ ) {
            id = _getAttr( modals[i], 'id' );
            if( id != undefined ) Modality.init( '#'+id );
        }
    })();


    // Globalize ------------------------------------

    window[ _name ] = Modality;


})( window, document );

// -----------------------------------------------------------------
