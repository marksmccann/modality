# Modality
Robust, lightweight and versatile &ndash; Modality was designed to be the only modal window you would ever need. 

## Overview
With both a jQuery and javascript-only version of the modal, Modality will work for anyone.

Beyond what is needed to center your content, Modality has no styling. You are in complete control of how your modal window will look. 

Built with Javascript's Module pattern, Modality can be extended to meet your requirements. You can even get the instance of a modal and invoke it's methods on demand. 

## Features
* Both jQuery and javascript-only versions
* Works in all modern browsers 
  * jQuery: IE 6+
  * JS-Only: IE 8+
* Lightweight, under 2KB when compressed
* All styling defined by user
* Awesome CSS3 animations 
* Multiple instances on each page
* Infinitely flexible width and height

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
  <!-- content here -->
</div>
```
4\. Now you can call your modal with the hash (*outside modal will open it, inside will close it*).
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


## Template
```html
<!doctype html>
<html>
  <head>
    <title>Modality Example</title>
    <link rel="stylesheet" href="path/to/your/modality.min.css">
    <style>
      .yourModalClass {
        background-color: #ffffff;
        border: 1px solid #cccccc;
        padding: 1em;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <a href="#yourModalId">Open Modal</a>
    <div id="yourModalId" class="yourModalClass">
      <h2>Modality</h2>
      <p>Stupid simple, lightweight, customizable modal window plugin.</p>
      <a href="#yourModalId">Close Modal</a>
    </div>
    <script src="path/to/your/modality.min.js"></script>
    <script>
      Modality.init('#yourModalId');
    </script>
  </body>
</html>
```


## Options
Name | Default | Description
--- | --- | ---
openOnLoad | `false` | set true to open modal on page load
autoBind | `true` | set false if you want to bind triggers manually
effect | `"effect-1"` | CSS animation, options are listed below &ndash; leave blank for none
clickOffToClose | `true` | set false to prevent closing the modal when clicking off of it
closeOnEsc | `true` | set false to prevent closing modal when 'Esc' is pressed
onOpen | `function(){}` | add function to call when modal is opened
onClose | `function(){}` | add function to call when modal is closed

#### Implementation
```javascript
// jQuery --
$('.modal').modality({
  effect: "effect-2",
  onOpen: function () {
    console.log("Hello World");
  }
});

// JS-Only --
Modality.init('.modal', {
  effect: "effect-3",
  onClose: function () {
    console.log("Goodbye World");
  }
});
```


## Methods
Get the instance of a modal and call on it's methods manually

Name | Parameters | Returns | Description
--- | --- | --- | ---
`open()` | function (optional) | `instance` | opens the modal
`close()` | function (optional) | `instance` | closes the modal
`toggle()` | function (optional) | `instance` | opens the modal is closed and vice versa
`isOpen()` | none | `boolean` | tells you if the modal is open or not
`setTrigger()` | object | `instance` | sets a DOM object to open/close modal when clicked

#### Implementation
```javascript
// jQuery --
var inst = $.modality.lookup['yourModalId'];
inst.open(); // opens the modal

// JS-Only --
var inst = Modality.lookup['yourModalId'];
inst.close(); // closes the modal
```
## Extending Modality
If you need modality to do more than it already does, you can extend the object and add more functionality. Here is a basic template for how to do that.
```javascript

// jQuery --
(function($) {

  $.extend($.modality.prototype, {
    yourNewMethod: function() {
      // do something ...
    }
  });

})(jQuery);

// JS-Only --
(function (Modality) {

  Modality.prototype.yourNewMethod = function () {
    // do something ...
  }
 
})(Modality);
```

## License
```
The MIT License (MIT)

Copyright (c) 2014 Ilya Makarov, http://vodkabears.github.io

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
