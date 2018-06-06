# V Scrollbox

A simple, customizable, pure javascript, cross-browser vertical scrollbox.

**See [demo.html](http://projects.martymagaan.com/v-scrollbox/demo.html) file to see it in action.**

## How to use

Link the css file in your HTML (replace *path-to* with appropriate path):

    <link rel="stylesheet" type="text/css" href="path-to/v-scrollbox.css">

Add the javascript file to the bottom of your HTML file before closing the body tag (replace *path-to* with appropriate path):

    <script src="path-to/v-scrollbox.js"></script>

Add *v-scrollbox* class to any elements you want to turn into a scrollbox,
and wrap the contents inside it with a *v-scrollbox-content* div, as shown below:

    <div id="myDiv" class="v-scrollbox">
      <div class="v-scrollbox-content">
        Place all content here
      </div>
    </div>

The *myDiv* element in the example above should have a set height.
The scrollbars will only appear if the content overflows past the height of the div.

You can customize the look of the scrollbar in the *v-scrollbox.css* file.

**For dynamically created content** you can use the global *initScrollBox()* function everytime dynamic 
content is added to activate scrollbars if the newly added content causes the need for scrollbars.

**Checkout the *demo.html* file for a basic usage example.**

## Compatibility

* Chrome 31+
* FireFox 17+
* IE 10+
* Safari 7+
* Opera 18+

Compatibility is based on wheel event compatibility.

*Important note concerning IE and Edge Browsers*

For IE and Edge, there is an obscure issue where mouse wheel events are not captured when using 
2-finger touchpad scrolling on Windows 10 devices that use a Precision touchpad. It does not seem 
like Microsoft will be fixing this issue as it only affects a small number of users. 
More details about it here: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7134034

## TO DO
* Make IE/Edge Windows 10 Precision touchpad fallback
* Add touchscreen scrolling capability