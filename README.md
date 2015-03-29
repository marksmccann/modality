# Modality
Modality is a simple, lightweight and extremely versatile jQuery AND JavaScript plugin for modal windows.

## Features
* Free
* Easy to Use
* Mobile Friendly
* CSS3 Animations
* No Default Styling
* Easily Customizable
* Extendable Framework
* Multiple Instances
* Browser Friendly
  * jQuery: IE 6+
  * JavaScript: IE 8+
* Lightweight
  * jQuery: 2KB
  * JavaScript: 3KB

## Getting Started
1\. Add this to the head.
```html
<link rel="stylesheet" href="path/to/your/modality.min.css">
```
2\. Add a link to the plugin before the closing body tag. If you want to use the jQuery version of the plugin, add jQuery to your page and then link to this file instead: `modality.jquery.min.js`.
```html
<script src="path/to/your/modality.min.js"></script>
```
3\. Create your modal and give it an id.
```html
<div id="yourModalId">
    <!-- your content here -->
</div>
```
4\. Create triggers for your modal by adding `href="#yourModalId"` to an anchor OR `data-target="#yourModalId"` to a controller element, like a button. (*Outside will open it, Inside will close it*).
```html
<a href="#yourModalId">Open Modal</a>
<button data-target="#yourModalId">Open Modal</button>
```
5\. Initiate your modal(s) via JavaScript OR data attribute. For data attribute, add `data-modality="auto"` to every modal you want initialized.
```javascript
$('#yourModalId').modality(); // jQuery
Modality.init('#yourModalId'); // JavaScript
```
[View Template](https://github.com/marksmccann/modality#template)


## Settings
Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-effect=""`.

Name | Default | Description
--- | --- | ---
bind | `true` | set false to bind triggers manually
class | `""` | a user-defined class added to outer-most container
clickoff | `true` | set false to prevent closing when clicking off of it
effect | `""` | CSS3 animation, effects listed below
enabled | `true` | set false to disable modal
keyboard | `true` | closes modal when 'Esc' is pressed
open | `false` | set true to open modal on page load
onClose* | `""` | add callback function when modal is closed
onOpen* | `""` | add callback function when modal is opened
inner** | `"mm-wrap"` | class name on the inner container of each the modal
outer** | `"modality-modal"` | class name on the outer-most container of each the modal
visible** | `"mm-show"` | class that is added to modal to make it visible
**These settings cannot be set via data attributes*
***These class names match those in modality.css, if changed here, must also be changed there.*

#### Usage

```javascript
$('.modal').modality( {effect: "scale-up"} ); // jQuery
Modality.init( '.modal', {effect: "slide-left"} ); // JavaScript
```

#### Effects
These animations use CSS 3 and will not work for IE7-9.

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


## Styling
Modality is unique in that it uses CSS to position itself horizontally AND vertically. The modal and it's content will automatically resize to best fit any screen &ndash; all without a line of JavaScript.

*By design, Modality is not styled.* Since all the positioning and sizing is done for you, all you need to worry about is your modal's appearance while keeping a few things in mind:

#### Max-Width
Modality is only ever as wide as it's content or the user's viewport (unless you style it otherwise). But in most cases, it is still a good idea to add a `max-width` value to your modal so that it wont grow too wide on a desktop, but will still resize for a mobile device.
```css
.yourModalClass {
    max-width: 500px; 
}
```
#### Backdrop
Modality's backdrop/background-mask has a default styling of `rgba(0, 0, 0, 0.5)`. To override or change this, add a class to modality's container via the 'class' option in the settings. Then add your new background styles to that and Modality's 'visible' class, like this:
```javascript
$('#yourModalId').modality( {class:"yourNewClass"} ); // jQuery
Modality.init( '#yourModalId', {class:"yourNewClass"} ); // JavaScript
```
```css
.yourNewClass.mm-show {
    background: rgba( 255, 0, 0, 0.5 );
}
```
#### Percentage Width
If you want your modal to be a percentage of the window, first, add a class to Modality's container via the 'class' option in the settings. Then apply the percentage to Modality's 'inner' container via a decendant selector like so:
```javascript
$('#yourModalId').modality( {class:"yourNewClass"} ); // jQuery
Modality.init( '#yourModalId', {class:"yourNewClass"} ); // JavaScript
```
```css
.yourNewClass .mm-wrap {
    max-width: 75%;
}
```
#### Hide on Load
If your modal is visible for a second before Modality can hide it for you, manually hide it with an inline style. *Modality will remove that style after initialization.*
```html
<div id="yourModalId" style="display:none;"></div>
```
#### Example
In case you want some help styling your modal, here is a simple example.
```css
.yourModalClass {
    background-color: #ffffff;
    border: 1px solid #cccccc;
    padding: 1em 1.5em 1em;
    border-radius: 5px;
    max-width: 500px;
    position: relative;
}
```

## Advanced Usage

#### Methods

Name | Parameters | Returns | Description
--- | --- | --- | ---
open() | `function*` | `instance` | opens the modal
close() | `function*` | `instance` | closes the modal
toggle() | `function*` | `instance` | opens the modal if closed and vice versa
isOpen() | `none` | `boolean` | tells you if the modal is open or not
addTrigger() | `html element` | `instance` | adds toggle event to object
removeTrigger() | `html element` | `instance` | removes toggle event from object
enable() | `none` | `instance` | enables all triggers for the modal
disable() | `none` | `instance` | disables all triggers for the modal
**Optional callback function.*

#### Attributes

Name | type | Description
--- | --- | ---
id | `string` | the modal's ID
settings | `json` | the modal's current settings
defaults | `json` | the default modal settings
wrapper | `html element` | the modal's outer-most container `<div class="modality-modal">`
triggers | `array` | all the modal's triggers and their respective event handles
modal | `html element` | your modal `<div id="yourModalId">`

#### Retreiving an Instance
There are two ways to retrieve an instance. 

1\. The first and easiest way is when initializing the modal. If you are initializing more than one modal at a time, Modality will return an array of the modals initialized.

```javascript
var inst = $('#yourModalId').modality(); // jQuery
inst.open(); 

var inst = Modality.init('#yourModalId'); // JavaScript
inst.open();
```

2\. Second, you can retreive any instance at anytime with it's id:
```javascript
var inst = $.modality.instances['yourModalId']; // jQuery
inst.open(); 

var inst = Modality.instances['yourModalId']; // JavaScript
inst.open();
```

#### Chaining
You can chain most of Modality's methods together. If you want to replicate this capability with your own methods, make sure to return the instance `return this;`.

```javascript
// jQuery
$('#yourModalId').modality().addTrigger( $('#someId') ).show(); 

// JavaScript
var newTrigger = document.getElementById('someId');
Modality.init('#yourModalId').addTrigger( newTrigger ).show(); 
```

#### Extension
You can easily extend Modality to add your own methods for additional and customized functionality.

```javascript
// jQuery
;(function($) { 

    $.extend( $[ "modality" ].prototype, {
        newClassAttribute: "foo",
        newClassMethod: function () { ... }
    });
 
    $.extend( $[ "modality" ], {
        newStaticAttribute: "bar",
        newStaticMethod: function () { ... }
    });

})(jQuery);

// JavaScript
;(function ( Modality ) { 

    Modality.extend( Modality.prototype, {
        newClassAttribute: "foo",
        newClassMethod: function () { ... }
    });
    
    Modality.extend( Modality, {
        newStaticAttribute: "bar",
        newStaticMethod: function () { ... }
    });

})( Modality );
```

#### AJAX
Even though Modality does NOT have built-in AJAX functionality, you can easily add this ability via extension or callback. Follow the pattern above for extension, below is an example for callback.

```Javascript
// In these examples, a callback function is added to 
// the 'onOpen' setting that will insert the response  
// of an AJAX request into the modal as it is opened.

// jQuery
$('.yourModalClass').modality({
    onOpen: function() {
        var inst = this; 
        $.ajax({ 
            url: "http://path/to/your/data.txt",
            success: function ( result ) {
                inst.element.html( result );
            }
        });
    }
});

// JavaScript
Modality.init('.yourModalClass', {
    onOpen: function () {
        var inst = this, xmlhttp = new XMLHttpRequest();
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

## Template
Here is a basic template to help you get started.
```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Modality Example</title>
    <link rel="stylesheet" href="css/modality.css">

    <!-- Sample styles for your modal -->
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

    <!-- This opens your modal -->
    <a href="#yourModalId">Open Modal</a>

    <!-- Your Modal -->
    <div id="yourModalId" class="yourModalClass" style="display:none;">

        <!-- Sample Content -->
        <h2>Modality Rocks!</h2>
        <p>Modality was designed to be the only modal plugin you would ever need.</p>

        <!-- This closes your modal -->
        <a href="#yourModalId">Close Modal</a>

    </div>

    <!-- jQuery -->
    <!-- <script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
    <script src="js/modality.jquery.min.js"></script>
    <script>$('#yourModalId').modality( {effect:'slide-up'} );</script> -->

    <!-- JavaScript  -->
    <script src="js/modality.min.js"></script>
    <script>Modality.init( '#yourModalId', {effect:'slide-up'} );</script>
    
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
