# Vertical Scrollbox

A simple, customizable, pure javascript, cross-browser vertical scrollbox.

## How to use

Link the css file in your HTML (replace *path-to* with appropriate path):

    <link rel="stylesheet" type="text/css" href="path-to/vertical-scrollbox.css">

Add the javascript file to the bottom of your HTML file before closing the body tag (replace *path-to* with appropriate path):

    <script src="path-to/vertical-scrollbox.js"></script>

Add *v-scrollbox* class to any elements you want to turn into a scrollbox,
and wrap the contents inside it with a *v-scrollbox-content* div, as shown below:

    <div id="myDiv" class="v-scrollbox">
      <div class="v-scrollbox-content">
        Place all content here
      </div>
    </div>

The *myDiv* element in the example above should have a set height.
The scrollbars will only appear if the content overflows past the height of the div.

You can customize the look of the scrollbar in the *vertical-scrollbox.css* file.

**Checkout the *demo.html* file for a basic usage example.**

## Compatibility

Chrome 31+, FireFox 17+, IE 10+, Safari 7+, Opera 18+

*Important note concerning IE and Edge Browsers*
For IE and Edge, this plugin falls back to an autohiding native overflow-y scroll due to an obscure issue where 
mouse wheel events are not captured when using 2-finger touchpad scrolling on Windows 10 devices that use a 
Precision touchpad. It does not seem like Microsoft will be fixing this issue as it only affects a small number of users. 
More details about it here: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7134034

If you don't care about this small percentage of users, and you wish to disable this fallback feature and just use
the regular custom scrollbar functionality of this plugin (which works on IE 9+ and Edge except in the case 
mentioned above), set the *useIEEdgeFallBack* variable to *false* in the js file.

## TO DO

* Better IE/Edge Windows 10 Precision touchpad fallback
* Add touchscreen scrolling capability