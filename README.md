# Modality
Simple, lightweight and versatile &ndash; Modality was designed to be the only modal window plugin you would ever need. 

## Overview
Modality was designed for the web-novice and web-master alike; Simple, lightweight and straight-forward, but at the same time versatile, extendable and infinitely customizable.

Modality is unique, it uses CSS to position itself horizontally AND vertically. This is esspecially helpful when designing for mobile; The modal and it's content will automatically resize to best fit any screen &ndash; all without a line of JavaScript.

Beyond what is needed to position your modal, Modality (by default) has no styling. You are in complete control of how your modal window will look.

Built with Javascript's module pattern, Modality can be extended to meet your requirements. You can also grab the instance of any modal and invoke it's methods manually.

## Features
* Easy to Use
* Adapts to Screen Size
* CSS3 Animations
* Easily Customizable
* Extendable Framework
* Multiple Instances
* Two Versions (jQuery & JavaScript-Only)
* Modern Browser Compatible
  * jQuery: IE 6+
  * JS-Only: IE 8+
* Lightweight
  * jQuery: 2KB
  * JS-Only: 3KB

## Getting Started
1\. Add this to the head.
```html
<link rel="stylesheet" href="path/to/your/modality.min.css">
```
2\. Add this before the closing body tag or in the head.
```html
<script src="path/to/your/modality.min.js"></script>
```
3\. Now create your modal dialog.
```html
<div id="yourModalId" class="yourModalClass">
  <!-- your content here -->
</div>
```
4\. Create a trigger to open/close the modal (*outside will open it, inside will close it*).
```html
<a href="#yourModalId">Open Modal</a>
<!-- OR -->
<button data-modality="#yourModalId">Open Modal</button>
```

5\. Instantiate the modal(s) in your javascript.
```javascript

// jQuery --
$('#yourModalId').modality();

// JS-Only --
Modality.init('#yourModalId');
```
[View Template](https://github.com/marksmccann/modality#template)


## Options
Name | Default | Description
--- | --- | ---
openOnLoad | `false` | set true to open modal on page load
autoBind | `true` | set false if you want to bind triggers manually
effect | `""` | CSS animation, effects listed below.
clickOffToClose | `true` | set false to prevent closing when clicking off of it
closeOnEsc | `true` | set false to prevent closing modal when 'Esc' is pressed
onOpen | `""` | add callback function when modal is opened
onClose | `""` | add callback function when modal is closed
userClass | `""` | you can add your own class to the container
modalClass* | `"modality-modal"` | the outer-most container for the modal
innerClass* | `"mm-wrap"` | the inner container for the modal
openClass* | `"mm-show"` | when modal is active/visible
**These classes match those in modality.css, if changed here, must also be changed there.*

```javascript

// jQuery --
$('.modal').modality({
  effect: "scale-up",
  onOpen: function () {
    console.log("Hello World");
  }
});

// JS-Only --
Modality.init('.modal', {
  effect: "slide-left",
  onClose: function () {
    console.log("Goodbye World");
  }
});

```

#### Effects
1. `"scale-up"`, `"scale-down"`
2. `"slide-left"`, `"slide-right"`
3. `"slide-up"`, `"slide-down"`
4. `"sticky-top"`, `"sticky-bottom"`
5. `"horizontal-flip"`, `"vertical-flip"`
6. `"spin-up"`, `"spin-down"`
7. `"fall-left"`, `"fall-right"`
8. `"swing-down"`, `"swing-up"`
9. `"swing-left"`, `"swing-right"`
10. `"front-flip"`, `"back-flip"`


## Methods

Name | Parameters | Returns | Description
--- | --- | --- | ---
`open()` | callback function (optional) | `instance` | opens the modal
`close()` | callback function (optional) | `instance` | closes the modal
`toggle()` | callback function (optional) | `instance` | opens the modal if closed and vice versa
`isOpen()` | none | `boolean` | tells you if the modal is open or not
`setTrigger()` | DOM Object | `instance` | sets a DOM object to open/close modal when clicked

Get the instance of a modal and call it's methods manually:

```javascript

// jQuery --
var inst = $.modality.instances['yourModalId'];
inst.open(); 

// JS-Only --
var inst = Modality.instances['yourModalId'];
inst.close(); // closes the modal

```
Get the instance when you first instantiate a modal. Modality will return an instance if one element is found, and an array if more than one is found:

```javascript

// jQuery --
var inst = $('#yourModalId').modality(); // one instance
inst.open(); 

var insts = $('.yourModalClass').modality(); // multiple instances
for( key in insts ){
    if( insts[key].isOpen() ) // do something ...
}

// JS-Only --
var inst = Modality.init('#yourModalId'); // one instance
inst.close();

var insts = Modality.init('.yourModalClass'); // multiple instances
for( key in insts ){
    if( insts[key].isOpen() ) // do something ...
}

```
You can also combine methods on a single line (chaining):

```javascript
// jQuery --
$('#yourModalId').modality().open(); 

// JS-Only --
Modality.init('#yourModalId').toggle(); 
```
**Make sure to return 'this' (the current instance) in your custom class methods if you want to maintain this chaining capability. See example under "Extending Modality".*


## Extending Modality
You can easily extend Modality and add more functionality. Here is a basic template for how to do that:

```javascript

// jQuery --
;(function($) {

    $.extend( $[ "modality" ].prototype, {
        newClassMethod: function () {
            // do something ...
            return this; // for chaining
        }
    });
 
    $.extend( $[ "modality" ], {
        newStaticMethod: function () { ... }
    });

})(jQuery);

// JS-Only --
;(function ( Modality ) {

    Modality.extend( Modality.prototype, {
        newClassMethod: function () {
            // do something ...
            return this; // for chaining
        }
    });
    
    Modality.extend( Modality, {
        newStaticMethod: function () { ... }
    });

})( Modality );
```

## AJAX
Modality does not have a built-in AJAX function. However, you can extend Modality with your own. Here's an example to help get you started.

```Javascript

// jQuery --
(function($) {
    $.extend( $.modality.prototype , {
        insert: function() {
            var inst = this; 
            $.ajax({
                url:"http://path/to/your/data.txt",
                success: function ( result ) {
                    inst.$element.html( result );
                }
            });
        }
    });
})(jQuery);

$.modality.lookup['yourModalId'].insert();

// JS-Only --
(function (Modality) {
    Modality.extend( Modality.prototype, {
        insert: function () {
            var inst = this;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
                    inst.element.innerHTML = xmlhttp.responseText;
                }
            }
            xmlhttp.open( 'get', 'http://path/to/your/data.txt', true );
            xmlhttp.send();
        }
    });
})(Modality);

Modality.lookup["yourModalId"].insert();

```
*In the examples above, a class method is added to Modality called 'insert'. When called on an instance, 'insert' will send a request to a url and will insert the response into the modal.*

## Template
Here is a basic template to help you get started:
```html
<!doctype html>
<html>
<head>
    <title>Modality Example</title>
    <link rel="stylesheet" href="css/modality.css">

    <!-- The styles for your modal -->
    <style>
    .yourModalClass {
        background-color: #ffffff;
        border: 1px solid #cccccc;
        padding: 0 1.5em 1em;
        border-radius: 5px;
        max-width: 500px;
    }
    </style>

</head>
<body>

    <!-- The trigger to open the modal -->
    <a href="#yourModalId">Open Modal</a>

    <!-- Your Modal, style it however you will! -->
    <div id="yourModalId" class="yourModalClass" style="display:none;">
        <h2>Modality</h2>
        <p>
            Simple, lightweight and versatile &ndash; Modality was 
            designed to be the only modal window you would ever need.
        </p>
        <a href="#yourModalId">Close Modal</a>
    </div>

    <!-- jQuery -->
    <!-- <script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
    <script src="js/modality.jquery.min.js"></script>
    <script>
    var modal1 = $('#yourModalId').modality({
        effect: 'slide-up'
    });
    </script> -->
    
    <!-- JS-Only -->
    <script src="js/modality.min.js"></script>
    <script>
    var modal1 = Modality.init('#yourModalId', {
        effect: 'slide-up'
    });
    </script>

</body>
</html>
```


## License
```
The MIT License (MIT)

Copyright (c) 2015 Mark McCann, http://www.markmccann.me

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
