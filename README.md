Touch Emulator
========

Emulate touch input on your desktop. Tries to fire touch events as 
[specified by W3C](http://www.w3.org/TR/touch-events). Press the `shift` key to enable multi-touch!

- [Example with Hammer.js](http://rawgit.com/hammerjs/touchemulator/master/tests/manual/hammer.html)
- [Example with Leaflet Maps](http://rawgit.com/hammerjs/touchemulator/master/tests/manual/leaflet.html)
- [View webpage](http://hammerjs.github.io/touch-emulator.html)

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

## Web platform tests
The script has been tested with the [w3c web platform tests](/tests/web-platform-tests/touch-events) and passes almost all except;
- *assert_true: The touchstart event must be dispatched before any mouse events. (If this fails, 
it might mean that the user agent does not implement W3C touch events at all.) expected true got false*
  - This is because we can only trigger touch events AFTER a mouse event has occured.
- *assert_true: event is a TouchEvent event expected true got false*
  - We trigger an event of the type `Event`
- *assert_equals: attribute of type TouchList expected "[object TouchList]" but got "[object Object]"*
  - Non native classes always return this type when calling `Object.prototype.toString.call(obj)`.
- *assert_equals: attribute of type TouchList expected "[object Touch]" but got "[object Object]"*
  - Non native classes always return this type when calling `Object.prototype.toString.call(obj)`.

## Config
#### TouchEmulator.template = Function(touch)
Change the css properties of the rendered touches.

#### TouchEmulator.multiTouchOffset = 75
The distance between the two touch points when entering the *multi-touch zone*.


