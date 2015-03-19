// -----------------------------------------------------------------
// @author:  Mark McCann (www.markmccann.me)
// @license: None, Public Domain
// -----------------------------------------------------------------

/**
 * Modality JavaScript Plugin
 */
;(function () {

    // Private ---------------------------------------

    var _name = "Modality", // the plugin name
        _body = document.querySelector('body'), // get the body only once
        _event = "click", // event type for toggling modal

        // default settings for plugin
        _defaults = {
            autoBind: true, // automatically bind triggers to modal
            clickOffToClose: true, // click anywhere off of modal to close it
            closeOnEscape: true, // close modal with 'esc' key
            effect: "", // animation style
            enabled: true, // set false to disable modal
            innerClass: "mm-wrap", // inner wrapper
            modalClass: "modality-modal", // outer-most container
            onClose: "", // function to run when modal closes
            onOpen: "", // function to run when modal opens
            openClass: "mm-show", // when modal is visible
            openOnLoad: false, // open on page load
            userClass: "" // user can add a class to container
        }, 


    /**
     * combines objects into one
     * @param {object} - collects values
     * @param {object} - objects to add values from
     * @return {object}
     */
    _extend = function () {
        var a = arguments;
        for( var i = 1; i < a.length; i++ )
            for( var key in a[i] )
                if(a[i].hasOwnProperty(key))
                    a[0][key] = a[i][key];
        return a[0];
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
     * make sure callback is function and then execute
     * @param {function/array} fn - the function you are testing
     */
    _callback = function ( fn ) {
        for( var i = 0; i < fn.length; i++ )
            if( typeof fn[i] == 'function' ) fn[i]();
    },


    /**
     * prevent event default
     * @param {event} e - the event
     */
    _preventDefault = function ( e ) {
        (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
    },
    

    /**
     * class manipulation
     * @param {object} target - the node with the class
     * @param {string} className - the class you are checking for
     */
    _hasClass = function( target, className ) {
        return target.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
    },
    _addClass = function( target, className ) {
        for( var i = 0; i < target.length; i++ )
            if( ! _hasClass( target[i], className ) ) 
                target[i].className += " " + className;
    },
    _removeClass = function( target, className ) {
        for( var i = 0; i < target.length; i++ ) {
            if( _hasClass( target[i], className ) ) {
                var re = new RegExp("(\\s|^)" + className + "(\\s|$)", "g");
                target[i].className = target[i].className.replace(re , '');
            }
        }
    },


    /**
     * searches for a value in an array and returns key if found
     * @param {array} haystack - the array being searched 
     * @param {object} needle - the element being looked for
     * @return {int}
     */
    _contains = function (haystack, needle) {
        var i = haystack.length;
        while (i--) {
            if (haystack[i][0] === needle) return i;
        }
        return false;
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
     * return space and classname if classname exists
     * @param {object} settings - the modal's settings
     * @param {string} setting - the setting name
     * @return {string}
     */
    _concat = function ( settings, setting ) {
        return ( settings[setting] != "" ) ? ' ' + settings[setting] : "";  
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

        // create the container and insert markup
        var container = document.createElement('div');
        container.setAttribute( 'class', settings.modalClass + _concat(settings, "effect") + _concat(settings, "userClass") );
        container.innerHTML = '<div class="'+settings.innerClass+'">' + element.outerHTML + '</div>';

        // replace the old modal with the new
        element.parentNode.replaceChild( container, element );

        return container;
        
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

        var inst     = this,
            id       = element.getAttribute( 'id' ),
            settings = _extend( {}, _defaults, options ), 
            wrapper  = _wrap( element, settings ), 
            triggers = document.querySelectorAll( 'a[href="#'+id+'"], [data-modality="#'+id+'"]' ), 
            modal    = document.getElementById( id );

        // Class Attributes --------------------------

        _extend( inst, { defaults: _defaults, id: id, settings: settings, wrapper: wrapper, triggers: [], modal: modal });

        // Events ------------------------------------

        // toggle modal on all triggers
        if( settings.autoBind ) {
            for( var i = 0; i < triggers.length; i++ ) inst.addTrigger( triggers[i] );
        }

        // close modal if users clicks anywhere off of it
        if( settings.clickOffToClose ) {
            _addEvent( wrapper, "click", function(e) {
                _preventDefault(e); if(e.target == wrapper) inst.close();
            });
        }

        // close modal with 'esc' key
        if( settings.closeOnEscape ) {
            _addEvent( _body, "keyup", function (e) {
                if(e.keyCode == 27) inst.close();
            });
        }

        // Final Touches ------------------------------

        // make sure modal is not hidden
        if( modal.style.display == 'none' ) modal.style.display = '';

        // open modal if set to true
        if( settings.openOnLoad ) inst.open();
            
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

            // add classes to open the modal
            _addClass( [this.wrapper, _body], this.settings.openClass );

            // run the callback(s)
            _callback( [this.settings.onOpen, fn] );

            return this;

        },

        /**
         * closes the modal
         * @param  {function} fn
         * @return {instance} 
         */
        close: function ( fn ) {

            // remove classes to close the modal
            _removeClass( [this.wrapper, _body], this.settings.openClass );

            // run the callback(s)
            _callback( [this.settings.onClose, fn] );

            return this;

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
            return _hasClass( this.wrapper, this.settings.openClass );
        },

        /**
         * manually add a trigger to open the modal on click
         * @param  {object} element - the element you want to be the trigger
         * @return {instance}
         */
        addTrigger: function ( ele ) {

            var inst = this, triggers = inst.triggers, key = _contains( triggers, ele ),
                trigger = [ele, function (e) { _preventDefault(e); inst.toggle(); }];

            // add or replace the trigger and it's handler
            ( _isInt(key)  ) ? triggers[key] = trigger : triggers.push( trigger );

            // if the modal is enabled bind event
            if( inst.settings.enabled ) _addEvent( trigger[0], _event, trigger[1] );

            return inst;

        },

        /**
         * manually remove trigger for a modal.
         * @param  {int} - the trigger element you want action removed from
         * @return {instance}
         */
        removeTrigger: function ( ele ) {

            var inst = this, triggers = inst.triggers, key = _contains( triggers, ele );

            // if the element exists in trigger array
            if( _isInt(key) ) {

                // unbind event from trigger
                _removeEvent( triggers[key][0], _event, triggers[key][1] );

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

            var inst = this, triggers = inst.triggers, length = triggers.length;

            if( !inst.settings.enabled ) {

                // change setting to true
                inst.settings.enabled = true;

                // bind event to each trigger
                for( var i = 0; i < length; i++ ) _addEvent( triggers[i][0], _event, triggers[i][1] );

            }

            return inst;

        },

        /**
         * disables the modal
         * @return {instance}
         */
        disable: function() {

            var inst = this, triggers = inst.triggers, length = triggers.length;

            if( inst.settings.enabled ) {

                // change setting to false
                inst.settings.enabled = false;

                // unbind event to each trigger
                for( var i = 0; i < length; i++ ) _removeEvent( triggers[i][0], _event, triggers[i][1] );

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
            var a = {}, e = document.querySelectorAll(query);
    	    for( var i = 0; i < e.length; i++ ) {
    	    	var inst = new this( e[i], options );
    	        this.instances[ inst.id ] = a[i] = inst;
    	    }
    	    return ( a[1] === undefined ) ? a[0] : a;
        }

    });
    

    // Globalize ------------------------------------

    window[ _name ] = Modality;


})();

// -----------------------------------------------------------------
