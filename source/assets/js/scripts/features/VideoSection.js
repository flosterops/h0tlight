/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* -- Video Section -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

(function(){




/* !-- Static Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	/* -- Initializes all unitialized objects -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	VideoSection.initAll = function() {
		var sections = document.querySelectorAll(".video-section:not([data-ark-video-section-initialized='true'])"),
			videoSection,
			i;

		for ( i = 0; i < sections.length; i++ ) {
			videoSection = new window.ark.VideoSection(sections[i]);
		}
	};




/* !-- Constructor -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function VideoSection(__section) {
		// Private Variables
		var _section = __section,
			_background = __section.querySelector(".background"),
			_sources = {
				video  : _background.getAttribute("data-video-source"),
				images : [
					{ size: 0,    src: _background.getAttribute("data-image-source-mobile") ? _background.getAttribute("data-image-source-mobile") : _background.getAttribute("data-image-source") },
					{ size: 768,  src: _background.getAttribute("data-image-source-tablet") ? _background.getAttribute("data-image-source-tablet") : _background.getAttribute("data-image-source") },
					{ size: 1024, src: _background.getAttribute("data-image-source") },
				]
			};



		// Public Properties
		this.currentSize = null;



		// Getters and Setters
		this.getSection         = function() { return _section; };
		this.getBackground      = function() { return _background; };
		this.getSources         = function() { return _sources; };
		this.getVideoSource     = function() { return _sources.video; };
		this.getImageSources    = function() { return _sources.images; };
		this.getBackgroundMedia = function() { return _background.querySelector("video, img"); }




		// Outputs a video or an image based on the device
		if ( _sources.video !== null && _sources.video.trim().length > 0 && !window.ark.Device.isMobile() ) {
			outputVideo(this);
		} else {
			outputImage(this);
		}
	}




/* !-- Private Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	/* -- Outputs a video -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function outputVideo(__context) {
		var media = document.createElement("video");
		media.autoplay = true;
		media.muted = true;
		media.loop = true;

		var source = document.createElement("source");
		source.setAttribute("type", "video/mp4");
		source.setAttribute("src", __context.getVideoSource());

		media.appendChild(source);


		media.addEventListener("load",       function() { resizeMediaInContainer(__context); });
		media.addEventListener("loadeddata", function() { resizeMediaInContainer(__context); });
		media.addEventListener("loadeddata", function() { playVideoWhenInView(__context); });

		__context.getBackground().appendChild(media);
		window.addEventListener("resize", function() { playVideoWhenInView(__context); });
		window.addEventListener("scroll", function() { playVideoWhenInView(__context); });
		window.addEventListener("resize", function() { resizeMediaInContainer(__context); });
	}



	/* -- Outputs an image -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function outputImage(__context) {
		// Removes the now obsolete background node
		__context.getBackground().parentNode.removeChild(__context.getBackground());

		window.addEventListener("resize", function() {
			changeBackroundSource(__context);
		});
		changeBackroundSource(__context);
	}




	/* -- Resizes the media in its container -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function resizeMediaInContainer(__context) {
		if (__context.getBackgroundMedia()) {
			var mediaSize = {
				width  : __context.getBackgroundMedia().videoWidth !== undefined ? __context.getBackgroundMedia().videoWidth : __context.getBackgroundMedia().naturalWidth,
				height : __context.getBackgroundMedia().videoHeight !== undefined ? __context.getBackgroundMedia().videoHeight : __context.getBackgroundMedia().naturalHeight
			},
			containerSize = {
				width  : __context.getBackground().getBoundingClientRect().width,
				height : __context.getBackground().getBoundingClientRect().height
			},
			newSize = {
				width  : containerSize.width,
				height : containerSize.width * mediaSize.height / mediaSize.width
			},
			orientation = "wide";


			if ( newSize.height < containerSize.height ) {
				newSize = {
					width  : containerSize.height,
					height : containerSize.height * mediaSize.width / mediaSize.height
				};
				orientation = "tall";
			}

			__context.getBackground().classList.add(orientation === "wide" ? "wide" : "tall");
			__context.getBackground().classList.remove(orientation === "wide" ? "tall" : "wide");
		}
	}




	/* -- Plays a video when in view -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function playVideoWhenInView(__context) {
		if ( __context.getBackgroundMedia().nodeName.toLowerCase() === "video" ) {
			var sectionRect = __context.getBackground().getBoundingClientRect();

			if ( sectionRect.top + sectionRect.height >= 0 ) {
				if (__context.getBackgroundMedia().paused) {
					__context.getBackgroundMedia().play();
				}
			} else {
				if (!__context.getBackgroundMedia().paused) {
					__context.getBackgroundMedia().pause();
				}
			}
		}
	}




	/* -- Changes the section background image -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function changeBackroundSource(__context) {
		var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
			imageSources = __context.getImageSources(),
			sourceItem = null;

		for ( var i = 0; i < imageSources.length; i++ ) {
			if ( imageSources[i].size <= windowWidth ) {
				sourceItem = imageSources[i];
			} else {
				break;
			}
		}

		if ( sourceItem.size != __context.currentSize ) {
			__context.currentSize = sourceItem.size;
			__context.getSection().parentNode.style.setProperty("background-image", "url(" + sourceItem.src + ")");
		}
	}




/* -- Adds the object -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	if (!window.ark) window.ark = {};

	if (!window.ark.VideoSection) {
		window.ark.VideoSection = VideoSection;
	}



	document.addEventListener("DOMContentLoaded", function(){
		window.ark.VideoSection.initAll();
	});


}());