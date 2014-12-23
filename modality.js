// -----------------------------------------------------------------
// @author:  Mark McCann (www.markmccann.me)
// @license: None, Public Domain
// -----------------------------------------------------------------

var Modality = (function () {

    /**
     * list of Modality defaults
     */
    var defaults = {
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
    },

    // grab the document's body only once
    body = document.getElementsByTagName('body')[0],

    /**
     * combines javascript objects
     * @return {object}
     */
    extend = function () {
        for( var i = 1; i < arguments.length; i++ ) {
            for( var key in arguments[i] ) {
                if(arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
        return arguments[0];
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
        container.setAttribute( 'class', settings.modalClass + ' ' + settings.effect );
        container.innerHTML = '<div class="'+settings.innerClass+'">' + element.outerHTML + '</div>';

        // replace the old modal with the new
        element.parentNode.replaceChild( container, element );

        return container;
     },

    // -----------------------------------------------------------------

    /**
     * the modality object
     * @param {object} modal
     * @param {object} options
     * @param {function} callback
     */
    Modality = function ( modal, options, callback ) {

        var $ = this; // set local var to avoid scope issues

        $._body     = body;
        $._defaults = defaults;
        $.id        = modal.getAttribute( 'id' );
        $.settings  = extend( {}, defaults, options );
        $.wrapper   = wrap( modal, $.settings );
        $.triggers  = document.querySelectorAll( 'a[href="#'+$.id+'"], [data-modality="#'+$.id+'"]' );
        $.element   = document.getElementById( $.id );

        // ------------------------------------------------------------

        // toggle modal on all triggers
        if( $.settings.autoBind ) {
            for( var i = 0; i < $.triggers.length; i++ ) {
                $.setTrigger( $.triggers[i] );
            }
        }

        // close modal if users clicks anywhere off of it
        if( $.settings.clickOffClose ) {
            $.wrapper.addEventListener( "click", function(e) {
                e.preventDefault(); if(e.target == $.wrapper) $.close();
            }, false );
        }

        // close modal with 'esc' key
        if( $.settings.closeOnEscape ) {
            $._body.addEventListener( "keyup", function (e) {
                if(e.keyCode == 27){ $.close(); }
            }, false);
        }

        // open modal if set to true
        if( $.settings.autoOpen ) $.open(); 

        // run the user's callback function
        if( typeof callback == 'function' ) callback();

        // save modal and return it
        return Modality.modals[$.id] = $;

    };

    // -----------------------------------------------------------------

    /**
     * class methods for the modality object
     */
    extend(Modality.prototype, {

        /**
         * opens the modal
         * @param  {function} callback
         * @return {instance}
         */
        open: function ( callback ) {

            // add classes to open the modal
            this.wrapper.classList.add( this.settings.openClass );
            this._body.classList.add( this.settings.openClass );

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
            this.wrapper.classList.remove( this.settings.openClass );
            this._body.classList.remove( this.settings.openClass );

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
            return ( this.wrapper.classList.contains(this.settings.openClass) ) ? true : false;
        },

        /**
         * manually set trigger for a modal
         * @param  {object} - the element you want to be the trigger
         * @return {instance}
         */
        setTrigger: function ( trigger ) {

            // set local var for instance
            var base = this;

            // set click event for new trigger
            trigger.addEventListener( "click", function (e) {
                e.preventDefault(); base.toggle(); 
            }, false );

            return this;
        }

    });

    // -----------------------------------------------------------------
    
    /**
     * initalizes modal(s)
     * @param  {string} query
     * @param  {object} options
     * @param  {function} fn
     * @return {object,array}
     */
    Modality.init = function ( query, options, fn ) {

        // collect the modals from the DOM
        var modals = document.querySelectorAll(query);

        // loop through the modals and initialize each one
        for( var i = 0; i < modals.length; i++ ) {

            // Initialize the modal
            var modal = new Modality(modals[i], options, fn);

            // return only this modal if only one
            if(modals.length == 1) { return modal; }
        }

        // return array of modals
        return Modality.modals;
    }

    /**
     * an empty object to collect all modals on page
     */
    Modality.modals = {};

    // -----------------------------------------------------------------
    
    return Modality;

})();
