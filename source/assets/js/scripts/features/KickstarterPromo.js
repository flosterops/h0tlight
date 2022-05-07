/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* -- Kickstarter Promo -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function(){

	/* !-- Global Variables -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	var _cssClasses = {
			module : "kickstarter-promo"
		},
		_dataAttributes = {
			initalized : "data-kickstarter-promo-initialized"
		};




	/* !-- Static Methods -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	/**
	* Initializes all unitialized modules
	*/
	KickstarterPromo.initAll = function() {
		var modules = document.querySelectorAll("." + _cssClasses.module + ":not([" + _dataAttributes.initalized + "='true'])"),
			i;


		for ( i = 0; i < modules.length; i++ ) {
			new KickstarterPromo(modules[i]);
		}
	};




	/* !-- Private Methods -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	/**
	* Constructor
	* 
	* @param {HTMLElement} __element - The module HTML element.
	*/
	function KickstarterPromo(__element) {
		if ( !__element || __element.getAttribute(_dataAttributes.initalized) === "true" )
			return;
		

		// Getters
		this.getElement = function() { return __element; };


		// Initializes the element
		__element.setAttribute(_dataAttributes.initalized, "true");










		var background = __element.querySelector(".background");

		if (background) {
			var sources = {
				poster : background.getAttribute("data-video-poster"),
				intro  : background.getAttribute("data-video-intro"),
				loop   : background.getAttribute("data-video-loop")
			};




			/* -- Outputs an image as background -- */
			/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
			function outputImage() {
				if ( sources.poster !== null ) {
					var image = document.createElement("img");
					image.addEventListener("load", function(){
						background.appendChild(this);
					});
					image.src = sources.poster;
				}
			}




			/* -- Outputs a video as background -- */
			/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
			function outputVideo() {
				var intro = document.createElement("video"),
					loop = document.createElement("video"),
					videoLoaded = { total: 0, successes: 0, errors: 0 },
					source;




				/* -- Video can't be loaded -- */
				/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
				function videoLoadError() {
					this.removeEventListener("error", videoLoadError);
					videoLoaded.errors++;
					videoLoaded.total++;
					launchVideoBackground();
				}




				/* -- Video loaded successfully -- */
				/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
				function videoLoadSuccess() {
					this.removeEventListener("canplaythrough", videoLoadSuccess);
					videoLoaded.successes++;
					videoLoaded.total++;
					launchVideoBackground();
				}




				/* -- Returns if a video is in the viewport -- */
				/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
				function getVideoIsInView(__ratio) {
					var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
						backgroundRect = background.getBoundingClientRect();

					if ( __ratio === undefined ) {
						__ratio = 0;
					}

					if (__ratio <= 0) {
						__ratio = 0;
					}

					return backgroundRect.top + backgroundRect.height * (1 - __ratio) > 0 &&
						backgroundRect.top + (backgroundRect.height * __ratio) <= windowHeight;
				}




				/* -- Verify if the video background shoul be launch -- */
				/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
				function launchVideoBackground() {
					if (videoLoaded.total == 2) {

						// A video didn't load, we show the poster image instead
						if ( videoLoaded.errors > 0 ) {
							outputImage();
						}

						// Intro and loop videos loaded successfully
						else {

							// Intro video ended its timeline
							function introEnded() {
								intro.removeEventListener("ended", introEnded);

								playLoopWhenInView();
								loop.style.setProperty("display", "block");


								setTimeout(function(){
									intro.style.setProperty("display", "none");
									intro.parentNode.removeChild(intro);
								}, 10);
							}


							// Plays the loop video when in viewport
							function playLoopWhenInView() {
								var isDesktopView = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) >= 1024;

								if ( getVideoIsInView() && isDesktopView ) {
									if (loop.paused) {
										loop.play();
									}
								} else if ( !loop.paused ) {
									loop.pause();
								}
							}


							// Plays the intro video when in view
							function playIntroWhenInView() {
								if ( getVideoIsInView(.75) ) {
									window.removeEventListener("scroll", playIntroWhenInView);
									window.removeEventListener("resize", playIntroWhenInView);

									window.addEventListener("scroll", playLoopWhenInView);
									window.addEventListener("resize", playLoopWhenInView);

									intro.addEventListener("ended", introEnded);
									intro.play();
								}
							}


							window.addEventListener("scroll", playIntroWhenInView);
							window.addEventListener("resize", playIntroWhenInView);

							playIntroWhenInView();
						}
					}
				}




				// Intro
				intro.style.setProperty("display", "block");
				intro.muted = true;
				source = document.createElement("source");

				intro.addEventListener("canplaythrough", videoLoadSuccess);
				source.addEventListener("error", videoLoadError);

				source.setAttribute("type", "video/mp4");
				source.setAttribute("src", sources.intro);

				intro.appendChild(source);


				// Loop
				loop.loop = true;
				loop.muted = true;
				loop.style.setProperty("display", "none");
				source = document.createElement("source");

				loop.addEventListener("canplaythrough", videoLoadSuccess);
				source.addEventListener("error", videoLoadError);
				loop.appendChild(source);

				source.setAttribute("type", "video/mp4");
				source.setAttribute("src", sources.loop);

				background.appendChild(intro);
				background.appendChild(loop);
			}




			/* -- Initializes the footer promo background -- */
			/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

			// Device isn't mobile; we try to load the video as a background
			if ( sources.intro !== null && sources.loop !== null && !ark.Device.isMobile() ) {
				outputVideo()
			}

			// Device is mobile; we display an image as a background
			else {
				outputImage();
			}
		}
	}




	/* !-- Adds the object -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	if ( !window.ark ) window.ark = {};
	window.ark.KickstarterPromo = KickstarterPromo;

	document.addEventListener("DOMContentLoaded", function(){
		KickstarterPromo.initAll();
	});

})();



// (function(){


// document.addEventListener("DOMContentLoaded", function(){
// 	var background = document.querySelector("#footer-promo .background");

// 	if (background) {
// 		var sources = {
// 			poster : background.getAttribute("data-video-poster"),
// 			intro  : background.getAttribute("data-video-intro"),
// 			loop   : background.getAttribute("data-video-loop")
// 		};




// 		/* -- Outputs an image as background -- */
// 		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// 		function outputImage() {
// 			if ( sources.poster !== null ) {
// 				var image = document.createElement("img");
// 				image.addEventListener("load", function(){
// 					background.appendChild(this);
// 				});
// 				image.src = sources.poster;
// 			}
// 		}




// 		/* -- Outputs a video as background -- */
// 		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// 		function outputVideo() {
// 			var intro = document.createElement("video"),
// 				loop = document.createElement("video"),
// 				videoLoaded = { total: 0, successes: 0, errors: 0 },
// 				source;




// 			/* -- Video can't be loaded -- */
// 			/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// 			function videoLoadError() {
// 				this.removeEventListener("error", videoLoadError);
// 				videoLoaded.errors++;
// 				videoLoaded.total++;
// 				launchVideoBackground();
// 			}




// 			/* -- Video loaded successfully -- */
// 			/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// 			function videoLoadSuccess() {
// 				this.removeEventListener("canplaythrough", videoLoadSuccess);
// 				videoLoaded.successes++;
// 				videoLoaded.total++;
// 				launchVideoBackground();
// 			}




// 			/* -- Returns if a video is in the viewport -- */
// 			/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// 			function getVideoIsInView(__ratio) {
// 				var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
// 					backgroundRect = background.getBoundingClientRect();

// 				if ( __ratio === undefined ) {
// 					__ratio = 0;
// 				}

// 				if (__ratio <= 0) {
// 					__ratio = 0;
// 				}

// 				return backgroundRect.top + backgroundRect.height * (1 - __ratio) > 0 &&
// 					backgroundRect.top + (backgroundRect.height * __ratio) <= windowHeight;
// 			}




// 			/* -- Verify if the video background shoul be launch -- */
// 			/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// 			function launchVideoBackground() {
// 				if (videoLoaded.total == 2) {

// 					// A video didn't load, we show the poster image instead
// 					if ( videoLoaded.errors > 0 ) {
// 						outputImage();
// 					}

// 					// Intro and loop videos loaded successfully
// 					else {

// 						// Intro video ended its timeline
// 						function introEnded() {
// 							intro.removeEventListener("ended", introEnded);

// 							playLoopWhenInView();
// 							loop.style.setProperty("display", "block");


// 							setTimeout(function(){
// 								intro.style.setProperty("display", "none");
// 								intro.parentNode.removeChild(intro);
// 							}, 10);
// 						}


// 						// Plays the loop video when in viewport
// 						function playLoopWhenInView() {
// 							var isDesktopView = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) >= 1024;

// 							if ( getVideoIsInView() && isDesktopView ) {
// 								if (loop.paused) {
// 									loop.play();
// 								}
// 							} else if ( !loop.paused ) {
// 								loop.pause();
// 							}
// 						}


// 						// Plays the intro video when in view
// 						function playIntroWhenInView() {
// 							if ( getVideoIsInView(.75) ) {
// 								window.removeEventListener("scroll", playIntroWhenInView);
// 								window.removeEventListener("resize", playIntroWhenInView);

// 								window.addEventListener("scroll", playLoopWhenInView);
// 								window.addEventListener("resize", playLoopWhenInView);

// 								intro.addEventListener("ended", introEnded);
// 								intro.play();
// 							}
// 						}


// 						window.addEventListener("scroll", playIntroWhenInView);
// 						window.addEventListener("resize", playIntroWhenInView);

// 						playIntroWhenInView();
// 					}
// 				}
// 			}




// 			// Intro
// 			intro.style.setProperty("display", "block");
// 			intro.muted = true;
// 			source = document.createElement("source");

// 			intro.addEventListener("canplaythrough", videoLoadSuccess);
// 			source.addEventListener("error", videoLoadError);

// 			source.setAttribute("type", "video/mp4");
// 			source.setAttribute("src", sources.intro);

// 			intro.appendChild(source);


// 			// Loop
// 			loop.loop = true;
// 			loop.muted = true;
// 			loop.style.setProperty("display", "none");
// 			source = document.createElement("source");

// 			loop.addEventListener("canplaythrough", videoLoadSuccess);
// 			source.addEventListener("error", videoLoadError);
// 			loop.appendChild(source);

// 			source.setAttribute("type", "video/mp4");
// 			source.setAttribute("src", sources.loop);

// 			background.appendChild(intro);
// 			background.appendChild(loop);
// 		}




// 		/* -- Initializes the footer promo background -- */
// 		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

// 		// Device isn't mobile; we try to load the video as a background
// 		if ( sources.intro !== null && sources.loop !== null && !ark.Device.isMobile() ) {
// 			outputVideo()
// 		}

// 		// Device is mobile; we display an image as a background
// 		else {
// 			outputImage();
// 		}
// 	}
// });


// })();