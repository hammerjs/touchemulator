Touch Emulator
========

Emulate touch input on your desktop. Tries to fire touch events as 
[specified by W3C](http://www.w3.org/TR/touch-events). Press the `shift` key to enable multi-touch!

## Install
Download the script from this repo, or just run `bower install hammer-touchemulator`.

## How to use
Include the javascript file, and call the `Emulator()` function before any other libraries that do something with the 
touch input. 
 
````html
<script src="../../touch-emulator.js"></script>
<script> TouchEmulator(); </script>
````

## Config
Little configuration is possible (and needed).

#### TouchEmulator.template = Function(touch)
Change the css properties of the rendered touches.

#### TouchEmulator.multiTouchOffset = 75
The distance between the two touch points when entering the *multi-touch zone*.


