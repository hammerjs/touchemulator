Emulator
========

Emulate touch input on your desktop. Fires touch events as [specified by W3](http://www.w3.org/TR/touch-events).

## How to use
Include the javascript file, and call the `Emulator()` function before any other libraries that do something with the 
touch input. 
 
````html
<script src="../../touch-emulator.js"></script>
<script> TouchEmulator(); </script>
````

Press the `shift` key to enable multi-touch!

## Config
Little configuration is possible (and needed).

#### TouchEmulator.template = Function(touch)
Change the css properties of the rendered touches.

#### TouchEmulator.multiTouchOffset = 75
The distance between the two touch points when entering the *multi-touch zone*.


