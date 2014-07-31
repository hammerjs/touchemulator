Touch Emulator
========

Emulate touch input on your desktop. Tries to fire touch events as 
[specified by W3C](http://www.w3.org/TR/touch-events). Press the `shift` key to enable multi-touch!

- [Example with Hammer.js](http://rawgit.com/hammerjs/touchemulator/master/tests/manual/hammer.html)
- [Example with Leaflet Maps](http://rawgit.com/hammerjs/touchemulator/master/tests/manual/leaflet.html)
- [View webpage](http://hammerjs.github.io/touch-emulator)

## Install
Download the script from this repo, or just run `bower install hammer-touchemulator`.

## How to use
Include the javascript file, and call the `Emulator()` function before any other libraries that do something with the 
touch input. It will set some fake properties to spoof the touch detection of some libraries, and triggers `touchstart`, `touchmove` and `touchend` events on the mouse target.
 
````html
<script src="../../touch-emulator.js"></script>
<script> TouchEmulator(); </script>
````

````js
function log(ev) {
 console.log(ev);
}

document.body.addEventListener('touchstart', log, false);
document.body.addEventListener('touchmove', log, false);
document.body.addEventListener('touchend', log, false);
````

Also, the script includes polyfills for `document.createTouch` and `document.createTouchList`.

## How it works
It listens to the `mousedown`, `mousemove` and `mouseup` events, and translates them to touch events. If the mouseevent
has the `shiftKey` property to `true`, it enables multi-touch. 

The script also prevents all mouse events on the page, so only the touch events will be emitted to your page.
It prevents futher emitting of the following events. 
`mousedown`, `mouseenter`, `mouseleave`, `mousemove`, `mouseout`, `mouseover`, `mouseup`.

## Web platform tests
The script has been tested with the [w3c web platform tests](/tests/web-platform-tests/touch-events) and passes all tests,  except these;
- *assert_true: event is a TouchEvent event expected true got false*
  - We trigger an event of the type `Event`
- *assert_equals: touch list is of type TouchList expected "[object TouchList]" but got "[object Array]"*
- *assert_equals: touch is of type Touch expected "[object Touch]" but got "[object Object]"*

## Bookmarklet
````js
javascript:!function(a){var b=a.createElement("script");b.onload=function(){TouchEmulator()},b.src="//cdn.rawgit.com/hammerjs/touchemulator/0.0.2/touch-emulator.js",a.body.appendChild(b)}(document);
````

## Options
#### TouchEmulator.template = Function(touch)
Change the css properties of the rendered touches.

#### TouchEmulator.multiTouchOffset = 75
The distance between the two touch points when entering the *multi-touch zone*.


