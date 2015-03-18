# Modality
Simple, lightweight and versatile &ndash; Modality was designed to be the only modal window you would ever need. Built with both JavaScript and jQuery, this plugin is sure to be a perfect fit for any project. 

## Overview
Modality was designed for the web-novice and web-master alike; Simple, lightweight and straight-forward, but at the same time versatile, extendable and infinitely customizable.

Modality is unique, it uses CSS to position itself horizontally AND vertically. This is esspecially helpful when designing for mobile; The modal and it's content will automatically resize to best fit any screen &ndash; all without a line of JavaScript.

Beyond what is needed to position your modal, Modality (by default) has no styling. You are in complete control of how your modal window will look.

Built with Javascript's module pattern, Modality can be extended to meet your requirements. You can also grab the instance of any modal and invoke it's methods manually.

## Features
* Free
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


## Styling
**By default, your modal is not styled.** You are completely free to style the modal however you like. In fact, you do not even need to set a width or height and your modal will still always be perfectly centered &mdash; Modality will seamlessly adapt to whatever content you put inside of it.

```css
.yourModalClass {
    /* your styles here */
}
```
#### A Few Notes

1\. **Max-Width**: I would recommend adding at least a `max-width` value to your modal so that it will not be too large on a desktop, but will still resize for a mobile device.

```css
.yourModalClass {
    max-width: 500px; 
}
```

2\. **The Background Mask**: To style the background mask, add your own class via the 'userClass' option in the settings and add your new background styling to that, like this:

```css
.userClass.mm-show {
    background: rgba( 255, 0, 0, 0.5 ); 
}
```

3\. **Percentage Width**: If you want your modal to be a percentage of the window, add a class to the 'userClass' option in the settings and apply the percentage to the 'innerClass' setting via a decendant selector like so:

```css
.userClass .mm-wrap {
    max-width: 75%;
}
```

4\. **Hide on Load**: If your modal is visible for a second before Modality can hide it for you, manually hide it with an inline style like so: (*Don't worry, Modality will remove that style after initialization.*)

```html
<div id="yourModalId" class="yourModalClass" style="display:none;">
```


#### Example
In case you want some help getting started, here is an example:

```css
.yourModalClass {
    background-color: #ffffff;
    border: 1px solid #cccccc;
    padding: 1em 1.5em 1em;
    border-radius: 5px;
    max-width: 500px;
    position: relative;
}
.yourModalClass a[href="yourModalId"] {
    position: absolute;
    top: 5px;
    right: 8px;
    text-decoration: none;
    padding: 3px 8px;
    color: #333;
    font-family: sans-serif;
    font-size: 22px;
}
```

## Options
Name | Default | Description
--- | --- | ---
openOnLoad | `false` | set true to open modal on page load
autoBind | `true` | set false if you want to bind triggers manually
effect | `""` | CSS3 animation, effects listed below.
enabled | `true` | Set to false to disable modal.
clickOffToClose | `true` | set false to prevent closing when clicking off of it
closeOnEsc | `true` | set false to prevent closing modal when 'Esc' is pressed
innerClass* | `"mm-wrap"` | the inner container for the modal
modalClass* | `"modality-modal"` | the outer-most container for the modal
onOpen | `""` | add callback function when modal is opened
onClose | `""` | add callback function when modal is closed
openClass* | `"mm-show"` | when modal is active/visible
userClass | `""` | you can add your own class to the container
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
*These animations use CSS3, they will not work for IE7-9.*

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


## Attributes
A list of attributes in case you need to use them.

Name | type | Description
--- | --- | ---
`id` | `string` | the modal's ID
`settings` | `json` | the modals current settings
`defaults` | `json` | the default modal settings
`wrapper` | `DOM Object` | the outer-most container for modal
`triggers` | `array` | all the modal's triggers and their respective event handles
`modal` | `DOM Object` | your modal (#yourModalId)


## Methods
Modality allows you to retreive an instance and then invoke it's methods on demand.

Name | Parameters | Returns | Description
--- | --- | --- | ---
`open()` | callback function (optional) | `instance` | opens the modal
`close()` | callback function (optional) | `instance` | closes the modal
`toggle()` | callback function (optional) | `instance` | opens the modal if closed and vice versa
`isOpen()` | none | `boolean` | tells you if the modal is open or not
`addTrigger()` | DOM Object | `instance` | sets a DOM object to open/close modal when clicked
`removeTrigger()` | DOM Object | `instance` | removes event handler from a DOM object
`enable()` | DOM Object | `instance` | enables a disabled modal
`disable()` | DOM Object | `instance` | disables the modal

There are two ways to retrieve an instance: 

1a. The first and easiest way is when initializing the modal:

```javascript

// jQuery --
var inst = $('#yourModalId').modality();
inst.open(); 

// JS-Only --
var inst = Modality.init('#yourModalId');
inst.close();

```
1b. If you are initializing more than one modal, Modality will return an array of the modals initialized:

```javascript

// jQuery --
var insts = $('.yourModalClass').modality();
for( key in insts ){
    if( insts[key].isOpen() ) 
        // do something ...
}

// JS-Only --
var insts = Modality.init('.yourModalClass');
for( key in insts ){
    if( insts[key].isOpen() ) 
        // do something ...
}

```

2\. Second, you can retreive any instance with it's id:

```javascript

// jQuery --
var inst = $.modality.instances['yourModalId'];
inst.open(); 

// JS-Only --
var inst = Modality.instances['yourModalId'];
inst.close();

```

#### Chaining

```javascript
// jQuery --
$('#yourModalId').modality().open(); 

// JS-Only --
Modality.init('#yourModalId').toggle(); 

```
*Make sure to return 'this' (the current instance) in your custom class methods if you want to maintain this chaining capability. See example under "Extending Modality".*


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
Modality does not have a built-in AJAX function. However, there are multiple ways for you to add this functionality. Here is one example of something you could do:

#### Example
```Javascript

// jQuery --
$('.yourModalClass').modality({
    onOpen: function() {
        var inst = this; 
        $.ajax({ 
            url: "http://path/to/your/data.txt",
            success: function ( result ) {
                inst.$element.html( result );
            }
        });
    }
});

// JS-Only --
Modality.init('.yourModalClass', {
    onOpen: function () {
        var inst = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
                inst.element.innerHTML = xmlhttp.responseText;
            }
        }
        xmlhttp.open( 'get', "http://path/to/your/data.txt", true );
        xmlhttp.send();
    }
});

```
*In the examples above: a callback function is added to the 'onOpen' setting that will insert the response of an AJAX request into the modal as it is opened.*

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
