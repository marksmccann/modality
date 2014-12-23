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
        for(var i in a) {
            for(var key in a[i]) {
                if(a[i].hasOwnProperty(key)) {
                    a[0][key] = a[i][key];
                }
            }
        }
        return a[0];
    },

    // -----------------------------------------------------------------

    /**
     * returns the value of a given attribute of a given dom object
     * @param  {dom object} node
     * @param  {string}     attr
     * @return {string} 
     */
    attr = function (node, attr) {
        if (node.hasAttribute(attr)) return node.getAttribute(attr);
    },

    // -----------------------------------------------------------------

    /**
     * removes duplicates from an array
     * @param  {array} array 
     * @return {array} 
     */
    uniqueArray = function (array) {
        var a = array.concat();
        for(var i=0; i < a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j]) {
                    a.splice(j--, 1);
                }
            }
        }
        return a;
    },

    // -----------------------------------------------------------------

    /**
     * binds an event listener to a given dom object
     * @param  {dom object} node 
     * @param  {string}     event
     * @param  {function}   callback
     */
    bind = function( target, event, fn ) {
        if ( target.attachEvent ) {
            target['e'+event+fn] = fn;
            target[event+fn] = function(){ target['e'+event+fn]( window.event ); }
            target.attachEvent( 'on'+event, target[event+fn] );
        } else {
           target.addEventListener( event, fn, false );
        }
    },

    // -----------------------------------------------------------------

    /**
     * inserts a new dom element after a given target element
     * @param  {dom object} newElement - the object you want to add
     * @param  {dom object} target - the object you want it added after
     */
    insertAfter = function (newElement,target) {
        var parent = target.parentNode;
        if(parent.lastchild == target) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, target.nextSibling);
        }
    },

    // -----------------------------------------------------------------

    /**
     * determine if a given node has a particular class
     * @param {object} target - the node you are adding a class to
     * @param {string} className - the class you are checking for
     * @return {boolean} 
     */
    hasClass = function( target, className ) {
        return target.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
    },

    /**
     * add class to a given node
     * @param {object} target - the node you are adding a class to
     * @param {string} className - the class you are adding
     */
    addClass = function( target, className ) {
        if( ! hasClass(target, className) ) {
            target.className += " " + className;
        }
    },

    /**
     * remove class from a given node
     * @param {object} target - the node you are removing a class from
     * @param {string} className - the class you are removing
     */
    removeClass = function( target, className ) {
        if( hasClass(target, className) ) {
            var re = new RegExp("(\\s|^)" + className + "(\\s|$)", "g");
            target.className = target.className.replace(re , '');
        }
    };

    // -----------------------------------------------------------------

    /**
     * sets up the modal by wrapping markup in appropriate classes
     * @param  {object} modal 
     * @return {object} 
     */
    var wrap = function ( modal ) {
        // create the new container
        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', modal.options.modalClass);

        // if ie, do a couple things
        var ie = '';
        if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
            var ieVersion = new Number(RegExp.$1);
            if(ieVersion <= 8) ie = '<div class="'+modal.options.ieClass+'"></div>';
            if(ieVersion == 9) wrapper.setAttribute('style', "filter:none;");
        }

        // insert modal content into the new container
        wrapper.innerHTML = ie + '<div class="'+modal.options.innerClass+'">' + modal.modal.outerHTML + '</div>';
        insertAfter(wrapper, modal.modal);

        // remove the old modal from the dom
        modal.modal.parentNode.removeChild( modal.modal );

        // add css3 effect class
        addClass( wrapper, modal.options.effect );

        // bind click event to close the modal on wrapper
        if( modal.options.clickOffClose ) {
            bind( wrapper, 'click', function(e) {
                e.preventDefault();
                if( e.target == wrapper ) modal.close();
            });
        }

        return wrapper;
    }

    // -----------------------------------------------------------------

    /**
     * collects array of anchors whose 'href' mathces the 'id' of the target
     * @param  {string} targetID 
     * @return {array}          
     */
    anchors = function (targetID) {

        // get all the anchor tags in document
        var anchors = document.getElementsByTagName('a');

        // loop through anchors and collect any that match criteria
        var triggers = [];
        for (var i = 0; i < anchors.length; i++) {
            if (anchors[i].getAttribute("href") == '#'+targetID) {
                triggers.push(anchors[i]);
            }
        }

        return triggers;
    },

    // -----------------------------------------------------------------

    /**
     * collects all triggers and adds click events to each of them
     * @param  {object} modal
     * @return {array} 
     */
    triggers = function (modal) {

        // create new array
        var triggers = [];

        // if auto bind set true, include in trigger array
        if(modal.options.autoBind) {
            triggers = modal.anchors;
        }

        // loop through passed-in triggers and add to array
        for (var i in modal.options.triggers) {
            triggers.push(modal.options.triggers[i]);
        }

        // remove any duplicate triggers
        triggers = uniqueArray(triggers);

        // bind click action for all triggers
        for(var i in triggers) {
            bind(triggers[i],"click",function (e) {
                e.preventDefault();
                modal.toggle();
            });
        }

        return triggers;

    };

    // -----------------------------------------------------------------

    /**
     * the modality object
     * @param {dom object} modal
     * @param {object}     options
     * @param {function}   callback
     */
    var Modality = function (modal, options, callback) {

        // create local var to avoid scopr issues
        var base = this;

        // set initial attributes
        base.modal = modal;
        base.id = attr(base.modal, 'id');
        base.options = extend( {}, Modality.defaults, options);
        base.body = document.getElementsByTagName( 'body' )[0];

        // set up the modal in the dom
        base.wrapper = wrap(base);

        // set remaining attributes
        base.modal = document.getElementById(base.id);
        base.anchors = anchors(base.id);
        base.triggers = triggers(base);

        // open modal if auto open is set
        if(base.options.autoOpen) base.open();

        // run the callback function
        if (typeof callback == 'function') { callback(); }

        // add this modal to list of modals on page
        Modality.modals[base.id] = base;

        return base;

    };

    // -----------------------------------------------------------------

    Modality.prototype = {

        /**
         * closes the modal
         * @param  {function} callback
         * @return {instance} 
         */
        close: function (callback) {

            // remove classes to open the modal 
            removeClass(this.wrapper,this.options.openClass);
            removeClass(this.body,this.options.openClass);

            // run the callbacks
            if ( typeof this.options.onClose == 'function' ) { this.options.onClose(); }
            if ( typeof callback == 'function' ) { callback(); }

            return this;

        },

        /**
         * opens the modal
         * @param  {function} callback
         * @return {instance}
         */
        open: function (callback) {

            // add classes to open the modal
            addClass(this.wrapper,this.options.openClass);
            addClass(this.body,this.options.openClass);

            // bind keyup event to close modal
            if(this.options.closeOnEscape) {
                var modal = this;
                bind(document.body,"keyup",function (e) {
                    if(e.keyCode == 27){ modal.close(); }
                });
            }

            // run the callback
            if ( typeof this.options.onOpen == 'function' ) { this.options.onOpen(); }
            if ( typeof callback == 'function' ) { callback(); }

            return this;

        },

        /**
         * opens modal if closed and vice versa
         * @param  {function} callback
         * @return {instance}
         */
        toggle: function (callback) {
            (this.isOpen()) ? this.close(callback) : this.open(callback);
            return this;
        },

        /**
         * determines if the modal is open or not
         * @return {Boolean}
         */
        isOpen: function () {
            return (hasClass(this.wrapper, this.options.openClass)) ? true : false;
        }
    };

    // -----------------------------------------------------------------
    
    Modality.init = function ( query, options, fn ) {
        var modals = document.querySelectorAll(query);
        for( var i = 0; i < modals.length; i++ ) {
            new Modality(modals[i], options, fn);
        }
        return Modality.modals;
    }

    // -----------------------------------------------------------------

    Modality.defaults = {
        modalClass: "modality-modal",
        innerClass: "mm-wrap",
        openClass: "mm-show",
        ieClass: "mm-ghost",
        clickOffClose: true,
        closeOnEscape: true,
        autoOpen: false,
        autoBind: true,
        triggers: [],
        effect: "effect-1",
        onOpen: function(){},
        onClose: function(){}
    }

    Modality.modals = {};

    // -----------------------------------------------------------------
    
    return Modality;

})();