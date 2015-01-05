// -----------------------------------------------------------------
// @author:  Mark McCann (www.markmccann.me)
// @license: None, Public Domain
// -----------------------------------------------------------------

var Modality = (function () {

    /**
     * list of Modality defaults
     */
    var body = document.getElementsByTagName('body')[0], 
        defaults = {
            modalClass: "modality-modal", // outer-most container
            innerClass: "mm-wrap", // inner wrapper
            openClass: "mm-show", // when modal is visible
            userClass: '', // user can add a class to container 
            clickOffToClose: true, // click anywhere off of modal to close it
            closeOnEscape: true, // close modal with 'esc' key
            openOnLoad: false, // open on page load
            autoBind: true, // automatically bind triggers to modal
            effect: "", // animation style
            onOpen: function(){}, // function to run when modal opens
            onClose: function(){} // function to run when modal closes
        },

    /**
     * add an event to a given node
     * @param {object} target - the node you are adding the event to
     * @param {string} event - the event kind
     * @param {function} fn - the callback function
     */
    addEvent = function( target, event, fn ) {
        if ( target.attachEvent ) {
            target['e'+event+fn] = fn;
            target[event+fn] = function(){ target['e'+event+fn]( window.event ); }
            target.attachEvent( 'on'+event, target[event+fn] );
        } else {
           target.addEventListener( event, fn, false );
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
    wrap = function ( element, settings ) {

        // create the container and insert markup
        var container = document.createElement('div');
        container.setAttribute( 'class', settings.modalClass + ' ' + settings.effect + ' ' + settings.userClass );
        container.innerHTML = '<div class="'+settings.innerClass+'">' + element.outerHTML + '</div>';

        // replace the old modal with the new
        element.parentNode.replaceChild( container, element );

        return container;
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
        if(Array.isArray(target)) {
            for( var i = 0; i < target.length; i++ ) {
                addClass( target[i], className );
            }
        } else {
            if( ! hasClass(target, className) ) {
                target.className += " " + className;
            }
        }
    },
    removeClass = function( target, className ) {
        if(Array.isArray(target)) {
            for( var i = 0; i < target.length; i++ ) {
                removeClass( target[i], className );
            }
        } else {
            if( hasClass(target, className) ) {
                var re = new RegExp("(\\s|^)" + className + "(\\s|$)", "g");
                target.className = target.className.replace(re , '');
            }
        }
    },

    // -----------------------------------------------------------------

    /**
     * the modality object
     * @param {object} modal
     * @param {object} options
     * @param {function} callback
     */
    Modality = function ( modal, options, callback ) {

        var t = this; // set local var to avoid scope issues

        t._body     = body;
        t._defaults = defaults;
        t.id        = modal.getAttribute( 'id' );
        t.settings  = Modality.extend( {}, defaults, options );
        t.wrapper   = wrap( modal, t.settings );
        t.triggers  = document.querySelectorAll( 'a[href="#'+t.id+'"], [data-modality="#'+t.id+'"]' );
        t.element   = document.getElementById( t.id );

        // ------------------------------------------------------------

        // toggle modal on all triggers
        if( t.settings.autoBind ) {
            for( var i = 0; i < t.triggers.length; i++ )
                t.setTrigger( t.triggers[i] );
        }

        // close modal if users clicks anywhere off of it
        if( t.settings.clickOffToClose ) {
            addEvent( t.wrapper, "click", function(e) {
                e.preventDefault(); if(e.target == t.wrapper) t.close();
            }, false );
        }

        // close modal with 'esc' key
        if( t.settings.closeOnEscape ) {
            addEvent( t._body, "keyup", function (e) {
                if(e.keyCode == 27) t.close();
            }, false);
        }

        // ------------------------------------------------------------

        // make sure modal is not hidden
        if( t.element.style.display == 'none' ) t.element.style.display = '';

        // open modal if set to true
        if( t.settings.openOnLoad ) t.open(); 

        // run the user's callback function
        if( typeof callback == 'function' ) callback();

        // save modal and return it
        return Modality.lookup[t.id] = t;

    };

    // -----------------------------------------------------------------

    /**
     * class methods for the modality object
     */
    Modality.extend( Modality.prototype, {

        /**
         * opens the modal
         * @param  {function} callback
         * @return {instance}
         */
        open: function ( callback ) {

            // add classes to open the modal
            addClass( [this.wrapper,this._body], this.settings.openClass );

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
            removeClass( [this.wrapper,this._body], this.settings.openClass );

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

            var t = this; // set local var for instance

            // set click event for new trigger
            addEvent( trigger, "click", function (e) {
                e.preventDefault(); t.toggle(); 
            }, false );

            return this;
        }

    });

    // -----------------------------------------------------------------
    
    /**
     * initalizes modal(s)
     * @param  {string} query
     * @param  {object} settings
     * @param  {function} fn
     * @return {object,array}
     */
    Modality.init = function ( query, settings, fn ) {

        // collect the modals from the DOM
        var modals = document.querySelectorAll(query);

        // loop through the modals and initialize each one
        for( var i = 0; i < modals.length; i++ ) {

            // Initialize the modal
            var modal = new Modality(modals[i], settings, fn);

            // return only this modal if only one
            if(modals.length == 1) { return modal; }
        }

        // return array of modals
        return Modality.lookup;
    }

    /**
     * combines javascript objects
     * @return {object}
     */
    Modality.extend = function () {
        var a = arguments;
        for( var i = 1; i < a.length; i++ )
            for( var key in a[i] )
                if(a[i].hasOwnProperty(key))
                    a[0][key] = a[i][key];
        return a[0];
    }

    /**
     * an empty object to collect all modals on page
     */
    Modality.lookup = {};

    // -----------------------------------------------------------------
    
    return Modality;

})();
