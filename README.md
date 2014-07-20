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

````html
<script src="modernizr.js"></script>
<script> 
	Modernizr.touch; // true! we tricked Modernizr.
</script>
````

