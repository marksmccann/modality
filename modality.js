// -----------------------------------------------------------------
// @author:  Mark McCann (www.markmccann.me)
// @license: None, Public Domain
// -----------------------------------------------------------------

var Modality = (function () {

    /**
     * combines javascript objects
     * @return {object}
     */
    var extend = function () {
        var a = arguments;
        for( var i in a ) {
            for( var key in a[i] ) {
                if( a[i].hasOwnProperty(key) ) {
                    a[0][key] = a[i][key];
                }
            }
        }
        return a[0];
    };

    // -----------------------------------------------------------------

    /**
     * the modality object
     * @param {object} modal
     * @param {object} options
     * @param {function} callback
     */
    var Modality = function ( modal, options, callback ) {

        // create local var to avoid scope issues
        var base = this;

        // set initial attributes
        base.id       = modal.getAttribute( 'id' );
        base.options  = extend( {}, Modality.defaults, options );
        base.body     = document.getElementsByTagName( 'body' )[0];
        base.triggers = document.querySelectorAll( 'a[href="#'+base.id+'"], [data-modality="#'+base.id+'"]' );

        // build and set modal wrapper 
        base.wrapper = document.createElement('div');
        base.wrapper.setAttribute( 'class', base.options.modalClass + ' ' + base.options.effect );
        base.wrapper.innerHTML = '<div class="'+base.options.innerClass+'">' + modal.outerHTML + '</div>';
        modal.parentNode.replaceChild( base.wrapper, modal );

        // set the original modal
        base.modal = document.getElementById( base.id );

        // --------------------------------------------

        // toggle modal on all triggers
        if( base.options.autoBind ) {
            for( var i = 0; i < base.triggers.length; i++ ) {
                base.setTrigger(base.triggers[i]);
            }
        }

        // close modal if users clicks anywhere off of it
        if( base.options.clickOffClose ) {
            base.wrapper.addEventListener( "click", function(e) {
                e.preventDefault(); if(e.target == base.wrapper) base.close();
            }, false );
        }

        // close modal with 'esc' key
        if( this.options.closeOnEscape ) {
            base.body.addEventListener( "keyup", function (e) {
                if(e.keyCode == 27){ base.close(); }
            }, false);
        }

        if( base.options.autoOpen ) base.open(); 

        // --------------------------------------------

        if( typeof callback == 'function' ) callback();

        return Modality.modals[base.id] = base;

    };

    // -----------------------------------------------------------------

    /**
     * class methods for the modality object
     */
    Modality.prototype = {

        /**
         * closes the modal
         * @param  {function} callback
         * @return {instance} 
         */
        close: function ( callback ) {

            // remove classes to close the modal
            this.wrapper.classList.remove( this.options.openClass );
            this.body.classList.remove( this.options.openClass );

            // run the callback(s)
            if ( typeof this.options.onClose == 'function' ) this.options.onClose();
            if ( typeof callback == 'function' ) callback();

            return this;

        },

        /**
         * opens the modal
         * @param  {function} callback
         * @return {instance}
         */
        open: function ( callback ) {

            // add classes to open the modal
            this.wrapper.classList.add( this.options.openClass );
            this.body.classList.add( this.options.openClass );

            // run the callback(s)
            if ( typeof this.options.onOpen == 'function' ) this.options.onOpen();
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
            return ( this.wrapper.classList.contains(this.options.openClass) ) ? true : false;
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

    };

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

    // -----------------------------------------------------------------

    /**
     * list of Modality defaults
     */
    Modality.defaults = {
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
    }

    /**
     * an empty object to collect all modals on page
     */
    Modality.modals = {};

    // -----------------------------------------------------------------
    
    return Modality;

})();
