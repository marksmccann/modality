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

        // get the body only once
        _body = document.querySelector('body'),

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
                
        var inst = this; // to avoid scope issues

        // Class Attributes ---------------

        inst.defaults = _defaults;
        inst.id       = element.getAttribute( 'id' );
        inst.settings = _extend( {}, _defaults, options );
        inst.wrapper  = _wrap( element, inst.settings );
        inst.triggers = document.querySelectorAll( 'a[href="#'+inst.id+'"], [data-modality="#'+inst.id+'"]' );
        inst.modal    = document.getElementById( inst.id );

        // Events ------------------------------------

        // toggle modal on all triggers
        if( inst.settings.autoBind ) {
            for( var i = 0; i < inst.triggers.length; i++ )
                inst.setTrigger( inst.triggers[i] );
        }

        // close modal if users clicks anywhere off of it
        if( inst.settings.clickOffToClose ) {
            _addEvent( inst.wrapper, "click", function(e) {
                _preventDefault(e); if(e.target == inst.wrapper) inst.close();
            });
        }

        // close modal with 'esc' key
        if( inst.settings.closeOnEscape ) {
            _addEvent( _body, "keyup", function (e) {
                if(e.keyCode == 27) inst.close();
            });
        }

        // Final Touches ------------------------------

        // make sure modal is not hidden
        if( inst.modal.style.display == 'none' ) inst.modal.style.display = '';

        // open modal if set to true
        if( inst.settings.openOnLoad ) inst.open();
            
        // --------------------------------
            
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
         * manually set trigger for a modal
         * @param  {object} - the element you want to be the trigger
         * @return {instance}
         */
        setTrigger: function ( trigger ) {

            var inst = this; // set local var for instance

            // set click event for new trigger
            _addEvent( trigger, "click", function (e) {
                _preventDefault(e); inst.toggle(); 
            });

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
