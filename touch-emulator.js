(function(window, document, exportName, undefined) {
    var isMultiTouch = false;
    var multiTouchStartPos;
    var eventTarget;
    var touchElements = {};

    /**
     * Simple trick to fake touch event support
     * this is enough for most libraries like Modernizr and Hammer
     */
    function fakeTouchSupport() {
        if (!("ontouchstart" in window)) {
            window.ontouchstart = null;
            window.ontouchmove = null;
            window.ontouchcancel = null;
            window.ontouchend = null;

            document.documentElement.ontouchstart = null;
            document.documentElement.ontouchmove = null;
            document.documentElement.ontouchcancel = null;
            document.documentElement.ontouchend = null;
        }
    }

    /**
     * we don't have to emulate on a touch device
     * @returns {boolean}
     */
    function hasTouchSupport() {
        return ("ontouchstart" in window) || // touch events
               (window.Modernizr && window.Modernizr.touch) || // modernizr
               (navigator.msMaxTouchPoints || navigator.maxTouchPoints) > 2; // pointer events
    }

    /**
     * setup mouse events on the window
     */
    function setMouseEvents() {
        window.addEventListener("mousedown", onMouse('touchstart'), false);
        window.addEventListener("mousemove", onMouse('touchmove'), false);
        window.addEventListener("mouseup", onMouse('touchend'), false);
    }

    /**
     * only trigger touches when the left mousebutton has been pressed
     * @param touchType
     * @returns {Function}
     */
    function onMouse(touchType) {
        return function(ev) {
            if (ev.which !== 1) {
                return;
            }

            // The EventTarget on which the touch point started when it was first placed on the surface,
            // even if the touch point has since moved outside the interactive area of that element.
            // also, when the target doesnt exist anymore, we update it
            if (ev.type == 'mousedown' || !eventTarget || (eventTarget && !eventTarget.dispatchEvent)) {
                eventTarget = ev.target;
            }

            // shiftKey has been lost, so trigger a touchend
            if (isMultiTouch && !ev.shiftKey) {
                triggerTouch('touchend', ev);
                isMultiTouch = false;
            }

            triggerTouch(touchType, ev);

            // we're entering the multi-touch mode!
            if (!isMultiTouch && ev.shiftKey) {
                isMultiTouch = true;
                multiTouchStartPos = {
                    pageX: ev.pageX,
                    pageY: ev.pageY,
                    clientX: ev.clientX,
                    clientY: ev.clientY,
                    screenX: ev.screenX,
                    screenY: ev.screenY
                };
                triggerTouch('touchstart', ev);
            }

            // reset
            if (ev.type == 'mouseup') {
                multiTouchStartPos = null;
                isMultiTouch = false;
                eventTarget = null;
            }
        }
    }

    /**
     * trigger a touch event
     * @param eventName
     * @param mouseEv
     */
    function triggerTouch(eventName, mouseEv) {
        var touchEvent = document.createEvent('Event');
        touchEvent.initEvent(eventName, true, true);

        touchEvent.altKey = mouseEv.altKey;
        touchEvent.ctrlKey = mouseEv.ctrlKey;
        touchEvent.metaKey = mouseEv.metaKey;
        touchEvent.shiftKey = mouseEv.shiftKey;

        touchEvent.targetTouches = touchEvent.touches = getActiveTouches(mouseEv, eventName);
        touchEvent.changedTouches = getChangedTouches(mouseEv, eventName);

        eventTarget.dispatchEvent(touchEvent);
    }

    /**
     * create empty touchlist with the methods
     * @returns {Array}
     */
    function createEmptyTouchList() {
        var touchList = [];
        touchList.item = function(index) {
            return touchList[index];
        };

        // specified by Mozilla
        touchList.identifiedTouch = function(id) {
            return touchList[id + 1];
        };
        return touchList;
    }

    /**
     * create a touchList based on the mouse event
     * @param mouseEv
     * @returns {Array}
     */
    function createTouchList(mouseEv) {
        var touchList = createEmptyTouchList();

        if (isMultiTouch) {
            var f = TouchEmulator.multiTouchOffset;
            var deltaX = multiTouchStartPos.pageX - mouseEv.pageX;
            var deltaY = multiTouchStartPos.pageY - mouseEv.pageY;

            touchList.push(createTouchPoint(1, multiTouchStartPos, (deltaX*-1) - f, (deltaY*-1) + f));
            touchList.push(createTouchPoint(2, multiTouchStartPos, deltaX+f, deltaY-f));
        } else {
            touchList.push(createTouchPoint(1, mouseEv, 0, 0));
        }

        return touchList;
    }

    /**
     * create an touch point
     * @param identifier
     * @param position
     * @param deltaX
     * @param deltaY
     * @returns {Object} touchPoint
     */
    function createTouchPoint(identifier, position, deltaX, deltaY) {
        return {
            identifier: identifier,
            target: eventTarget,
            clientX: position.clientX + deltaX,
            clientY: position.clientY + deltaY,
            screenX : position.screenX + deltaX,
            screenY: position.screenY + deltaY,
            pageX: position.pageX + deltaX,
            pageY: position.pageY + deltaY
        };
    }

    /**
     * receive all active touches
     * @param mouseEv
     * @returns {Array}
     */
    function getActiveTouches(mouseEv, eventName) {
        if (mouseEv.type == 'mouseup') {
            return createEmptyTouchList();
        }

        var touchList = createTouchList(mouseEv);
        if(isMultiTouch && mouseEv.type != 'mouseup' && eventName == 'touchend') {
            touchList.splice(1,1);
        }
        return touchList;
    }

    /**
     * receive a filtered set of touches with only the changed pointers
     * @param mouseEv
     * @param eventName
     * @returns {Array}
     */
    function getChangedTouches(mouseEv, eventName) {
        var touchList = createTouchList(mouseEv);

        // we only want to return the added/removed item on multitouch
        // which is the second pointer, so remove the first pointer from the touchList
        //
        // but when the mouseEv.type is mouseup, we want to send all touches because then
        // no new input will be possible
        if(isMultiTouch && mouseEv.type != 'mouseup' &&
            (eventName == 'touchstart' || eventName == 'touchend')) {
            touchList.splice(0,1);
        }

        return touchList;
    }


    /**
     * setup touch events on the window
     * this means that the script is using itself!
     */
    function setTouchEvents() {
        window.addEventListener("touchstart", showTouches, false);
        window.addEventListener("touchmove", showTouches, false);
        window.addEventListener("touchend", showTouches, false);
        window.addEventListener("touchcancel", showTouches, false);
    }

    /**
     * show the touchpoints on the screen
     */
    function showTouches(ev) {
        var touch, i, el, styles;

        // first all visible touches
        for(i = 0; i < ev.touches.length; i++) {
            touch = ev.touches[i];
            el = touchElements[touch.identifier];
            if(!el) {
                el = touchElements[touch.identifier] = document.createElement("div");
                document.body.appendChild(el);
            }

            styles = TouchEmulator.template(touch);
            for(var prop in styles) {
                el.style[prop] = styles[prop];
            }
        }

        // remove all ended touches
        if(ev.type == 'touchend' || ev.type == 'touchcancel') {
            for(i = 0; i < ev.changedTouches.length; i++) {
                touch = ev.changedTouches[i];
                el = touchElements[touch.identifier];
                if(el) {
                    el.parentNode.removeChild(el);
                    delete touchElements[touch.identifier];
                }
            }
        }
    }

    /**
     * TouchEmulator initializer
     */
    function TouchEmulator() {
        if (hasTouchSupport()) {
            return;
        }

        fakeTouchSupport();
        setMouseEvents();
        setTouchEvents();
    }

    // start distance when entering the multitouch mode
    TouchEmulator.multiTouchOffset = 75;

    /**
     * css template for the touch rendering
     * @param touch
     * @returns object
     */
    TouchEmulator.template = function(touch) {
        var size = 30;
        var transform = 'translate('+ (touch.clientX-(size/2)) +'px, '+ (touch.clientY-(size/2)) +'px)';
        return {
            position: 'fixed',
            left: 0,
            top: 0,
            background: '#fff',
            border: 'solid 1px #999',
            opacity: .6,
            borderRadius: '100%',
            height: size + 'px',
            width: size + 'px',
            display: 'block',
            overflow: 'hidden',
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            mozUserSelect: 'none',
            userSelect: 'none',
            webkitTransform: transform,
            mozTransform: transform,
            transform: transform
        }
    };

    // export
    if (typeof define == "function" && define.amd) {
        define(function() {
            return TouchEmulator;
        });
    } else if (typeof module != "undefined" && module.exports) {
        module.exports = TouchEmulator;
    } else {
        window[exportName] = TouchEmulator;
    }
})(window, document, "TouchEmulator");
