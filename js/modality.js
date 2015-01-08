// -----------------------------------------------------------------
// @author:  Mark McCann (www.markmccann.me)
// @license: None, Public Domain
// -----------------------------------------------------------------

/**
 * JavaScript Plugin Template
 */
;(function () {

    // Private ---------------------------------------

    var _name = "Modality", // the plugin name

        // get the body only once
        _body = document.getElementsByTagName('body')[0],

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
     * class manipulation
     * @param {object} target - the node with the class
     * @param {string} className - the class you are checking for
     */
    hasClass = function( target, className ) {
        return target.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
    },
    addClass = function( target, className ) {
        if(Object.prototype.toString.call( target ) === '[object Array]') {
            for( var i = 0; i < target.length; i++ ) {
                addClass( target[i], className );
            }
        } else {
            if( ! hasClass( target, className ) ) {
                target.className += " " + className;
            }
        }
    },
    removeClass = function( target, className ) {
        if(Object.prototype.toString.call( target ) === '[object Array]') {
            for( var i = 0; i < target.length; i++ ) {
                removeClass( target[i], className );
            }
        } else {
            if( hasClass( target, className ) ) {
                var re = new RegExp("(\\s|^)" + className + "(\\s|$)", "g");
                target.className = target.className.replace(re , '');
            }
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

        // create the container and insert markup
        var container = document.createElement('div');
        container.setAttribute( 'class', settings.modalClass + ' ' + settings.effect + ' ' + settings.userClass );
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
    Plugin = function ( element, options ) {
                
        var inst = this; // to avoid scope issues

        // Class Attributes ---------------



        inst.body     = _body;
        inst.defaults = _defaults;
        inst.id       = element.getAttribute( 'id' );
        inst.settings = _extend( {}, _defaults, options );
        inst.wrapper  = _wrap( element, inst.settings );
        inst.triggers = document.querySelectorAll( 'a[href="#'+inst.id+'"], [data-modality="#'+inst.id+'"]' );
        inst.element  = document.getElementById( inst.id );

        // Events ------------------------------------

        // toggle modal on all triggers
        if( inst.settings.autoBind ) {
            for( var i = 0; i < inst.triggers.length; i++ )
                inst.setTrigger( inst.triggers[i] );
        }

        // close modal if users clicks anywhere off of it
        if( inst.settings.clickOffToClose ) {
            _addEvent( inst.wrapper, "click", function(e) {
                e.preventDefault(); if(e.target == inst.wrapper) inst.close();
            }, false );
        }

        // close modal with 'esc' key
        if( inst.settings.closeOnEscape ) {
            _addEvent( inst.body, "keyup", function (e) {
                if(e.keyCode == 27) inst.close();
            }, false);
        }

        // Final Touches ------------------------------

        // make sure modal is not hidden
        if( inst.element.style.display == 'none' ) inst.element.style.display = '';

        // open modal if set to true
        if( inst.settings.openOnLoad ) inst.open();
            
        // --------------------------------
            
        return inst;
            
    };


    // Class Methods ---------------------------------

    _extend( Plugin.prototype, {

        /**
         * opens the modal
         * @param  {function} callback
         * @return {instance}
         */
        open: function ( callback ) {

            // add classes to open the modal
            addClass( [this.wrapper,this.body], this.settings.openClass );

            // run the callback(s)
            if ( typeof this.settings.onOpen == 'function' ) this.settings.onOpen();
            if ( typeof callback == 'function' ) callback();

            return this;

        },

        /**
         * closes the modal
         * @param  {function} callback
         * @return {instance} 
         */
        close: function ( callback ) {

            // remove classes to close the modal
            removeClass( [this.wrapper,this.body], this.settings.openClass );

            // run the callback(s)
            if ( typeof this.settings.onClose == 'function' ) this.settings.onClose();
            if ( typeof callback == 'function' ) callback();

            return this;

        },

        /**
         * toggles the modal
         * @param  {function} callback
         * @return {instance}
         */
        toggle: function ( callback ) {
            return ( this.isOpen() ) ? this.close(callback) : this.open(callback);
        },

        /**
         * determines if the modal is open or not
         * @return {Boolean}
         */
        isOpen: function () {
            return hasClass( this.wrapper, this.settings.openClass );
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
                e.preventDefault(); inst.toggle(); 
            }, false );

            return inst;
        }

    });
        
        
    // Static Methods --------------------------------
        
    _extend( Plugin, { 

        instances: [], // for storing instances
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

    window[ _name ] = Plugin;


})();

// -----------------------------------------------------------------
