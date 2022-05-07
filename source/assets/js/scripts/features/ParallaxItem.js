/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*
	ParallaxItem
		Automatically adds parallax effect on elements using the "ark-parallax-item" CSS class when the DOM loads.
		Using HTML data attributes adjusts the properties of each element.
		Properties passed via the JavaScript method will override data attributes.
		
		Automatic HTML Usage:
			<div class="ark-parallax-item"                                       
				data-ark-parallax-item-distance="200"                           // Total distance to travel for the parallax effect. 100 means the element will move up 50px and move down 50px from its center. Defaults to 100. [OPTIONAL]
				data-ark-parallax-item-animation-duration="2s"                  // The duration of the parallax effect, ie: "2s". Defaults to "0s". [OPTIONAL]
				data-ark-parallax-item-animation-timing-function="ease-in-out"  // CSS transition-timing-function for the parallax effect. Defaults to "linear". [OPTIONAL]
			>Parallax Item</div>
		
		
		JavaScript Usage:
			new ParallaxItem({
				element:            HTML_ELEMENT,  // HTML element of the item receiving the parallax effect. [MANDATORY]
				distance:           NUMBER,        // Total distance to travel for the parallax effect. 100 means the element will move up 50px and move down 50px from its center. Defaults to 100. [OPTIONAL]
				animation: {
					duration:       STRING,        // The duration of the parallax effect, ie: "2s". Defaults to "0s". [OPTIONAL]
					timingFunction: STRING         // CSS transition-timing-function for the parallax effect. Defaults to "linear". [OPTIONAL]
				}
			});
		
			Example:
				new ParallaxItem({
					element: document.getElementById("parallaxItem"),
					distance: 200,
					animation: {
						duration: "2s",
						timingFunction: "ease-in-out"
					}
				});
*/
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

(function(window){

/* !-- Global Variables -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	var parallaxItemCSSClass = "ark-parallax-item";




/* !-- Constructor -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function ParallaxItem() {
		// Private Variables
		var _element = arguments[0].element;
		
		
		// Public Properties
		this.distance = 100;
		this.animation = {
			duration: "0s",
			timingFunction: "linear"
		};
		
		
		// Getters and Setters
		this.getElement = function() { return _element; };
		
		
		// Redefines public properties using provided values. Passed arguments are prioritized over HTML data attributes.
			// Distance
			if ( arguments[0].distance !== undefined && !isNaN(arguments[0].distance) ) {
				this.distance = arguments[0].distance;
			} else if (_element.getAttribute("data-ark-parallax-item-distance") !== null && !isNaN(_element.getAttribute("data-ark-parallax-item-distance")) ) {
				this.distance = _element.getAttribute("data-ark-parallax-item-distance");
			}
			
			// Animation Duration
			if ( arguments[0].animation !== undefined &&  arguments[0].animation.duration !== undefined ) {
				this.animation.duration = arguments[0].animation.duration;
			} else if ( _element.getAttribute("data-ark-parallax-item-animation-duration") !== null ) {
				this.animation.duration = _element.getAttribute("data-ark-parallax-item-animation-duration");
			}
			
			// Animation Timing Function
			if ( arguments[0].animation !== undefined &&  arguments[0].animation.timingFunction !== undefined ) {
				this.animation.timingFunction = arguments[0].animation.timingFunction;
			} else if ( _element.getAttribute("data-ark-parallax-item-animation-timing-function") !== null ) {
				this.animation.timingFunction = _element.getAttribute("data-ark-parallax-item-animation-timing-function");
			}
			
			// Forcing position
			if ( arguments[0].forcePosition !== undefined &&  arguments[0].forcePosition !== undefined ) {
				this.forcePosition = arguments[0].forcePosition === true;
			} else if ( _element.getAttribute("data-ark-parallax-item-forcePosition") !== null ) {
				this.forcePosition = _element.getAttribute("data-ark-parallax-item-forcePosition").toLowerCase() === "true";
			}
		
		// Initializes the object
		init(this);
	}




/* !-- Private Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	
	/* -- Initializes the object -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function init(context) {
		// Adds the parallaxItemCSSClass to element if not already there (we use this in window.scroll to find elements that need positionning)
		if (!( new RegExp("\\b" + parallaxItemCSSClass + "\\b", "i") ).test(context.getElement().className)) {
			context.getElement().className = (context.getElement().className + " " + parallaxItemCSSClass).trim();
		}
		
		// Adds necessary CSS transition to element
		addTransitionToElement(context.getElement(), context.animation.duration, context.animation.timingFunction);
		
		// Adds the context to the HTML element
		if (!context.getElement().ark) {
			context.getElement().ark = {};
		}
		context.getElement().ark.parallaxItem = context;
		
		// Initial placement of the element
		setTimeout(function() {
			context.scroll(true);
		}, 1);
	}
	
	
	
	
	/* -- Sets element translation based on a ratio -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function setElementTranslationToRatio(context, ratio) {
		ratio = ratio - .5;
		
		if (ratio < -.5) ratio = -.5;
		if (ratio > .5) ratio = .5;
		
		addTranslationToElement(context.getElement(), Math.round(context.distance * ratio));
	}
	
	
	
	
	/* -- Adds CSS translation to element (positionning) -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function addTranslationToElement(element, translation) {
		element.style.setProperty("-webkit-transform", "translateY(" + String(translation) + "px)");
		element.style.setProperty("-moz-transform", "translateY(" + String(translation) + "px)");
		element.style.setProperty("transform", "translateY(" + String(translation) + "px)");
	}
	
	
	
	
	/* -- Adds CSS transition to element -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function addTransitionToElement(element, duration, timingFunction) {
		element.style.setProperty("-webkit-transition", "-webkit-transform " + (duration ? duration : "0s") + " " + (timingFunction ? timingFunction : "linear"));
		element.style.setProperty("-moz-transition", "-moz-transform " + (duration ? duration : "0s") + " " + (timingFunction ? timingFunction : "linear"));
		element.style.setProperty("transition", "transform " + (duration ? duration : "0s") + " " + (timingFunction ? timingFunction : "linear"));
	}




/* !-- Public Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	
	/* -- Scrolls the element -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	ParallaxItem.prototype.scroll = function(forcePositionning) {
		var windowHeight = window.innerHeight,
			itemRect = this.getElement().getBoundingClientRect(),
			ratio = (itemRect.top + itemRect.height) / (windowHeight + itemRect.height);
		
		// Item is visible
		if ( (ratio >= 0 && ratio <= 1) || forcePositionning === true || this.alwaysForcePosition === true ) {
			setElementTranslationToRatio(this, ratio);
		}
	};




/* -- Adds the object -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	if (!window.ark) window.ark = {};
	
	if (!window.ark.ParallaxItem)
		window.ark.ParallaxItem = ParallaxItem;
	
	
	// Adds parallax effect on currently accessible DOM elements
	if (!ark.Device.isMobile()) {
		window.addEventListener("DOMContentLoaded", function() {
			var parallaxItems = document.querySelectorAll("." + parallaxItemCSSClass),
				i;
			
			// Creates accessible parallax items
			for ( i = 0; i < parallaxItems.length; i++ ) {
				new ParallaxItem({element: parallaxItems[i]});
			}
			
			function applyParallax() {
				var _parallaxItems = document.querySelectorAll("." + parallaxItemCSSClass),
					_i
				for ( _i = 0; _i < _parallaxItems.length; _i++ ) {
					_parallaxItems[_i].ark.parallaxItem.scroll();
				}
			}
			
			// Adds window scroll and resize events
			window.addEventListener("scroll", applyParallax, false);
			window.addEventListener("resize", applyParallax, false);
		}, false);
	}


}(window));