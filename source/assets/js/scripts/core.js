// Arketype Object
if (!window.ark) window.ark = {};



/* !-- Attaches the global page load event handler -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
document.addEventListener("DOMContentLoaded", function() {

	ark.registerNewsletter();
	ark.closeModal();
	ark.closeModalError();
	ark.closeLegalModal();
	ark.acceptLegalConsent();
	ark.openLegalModal();
	ark.hideRegisterButton();

	ark.stickyNav();
	ark.triggerMobileMenu();
	ark.faq();
	ark.newsList();
	ark.gearRotation();
	ark.showCurrentLang();
	ark.legal();
	ark.mediasGallery();
	ark.fullscreenVideo();
	ark.mainMenuTracking();

	ark.isIosUser();

	if($("body").hasClass("home")) {
		ark.dayNight();
	}

	ark.sliderTestimonials();

	/* Set class to body if user is on mobile device */
	ark.Device.isMobile() ? $("body").addClass("mobile") : $("body").removeClass("mobile");


	// Adds a smooth scrolling on in page anchored link
	(function() {
		var links = document.querySelectorAll("a[href^='#']:not([data-prevent-smooth-scroll])");
		for ( var i = 0; i < links.length; i++ ) {
			links[i].addEventListener("click", function(evt) {
				ark.smoothScrollToElement(document.querySelectorAll(this.getAttribute("href")));
				ark.Events.preventDefault(evt);
			}, false);
		}
	})();





	/* !-- Sliding Modal on Homepage -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	(function(){
		var random = Math.floor(Math.random() * $('.sliding-modal-item').length);
		/*

		$('.sliding-modal-item').hide().eq(random).show();

		setTimeout(function(){
			$("body.home").addClass("sliding-modal");
		}, 1000);

		*/


		$(".sliding-modal-item .close").click(function() {
			$("body.home").removeClass("sliding-modal");
		});

	})();

	ark.setUpScrollTracking();
});

ark.hideRegisterButton = function() {
	$(window).scroll(function() {
		if ($("#pre-register")) {
			var el = $("#pre-register");
			var top_of_object = el.offset().top;
			var bottom_of_object = el.offset().top + el.outerHeight();
			var top_of_window = $(window).scrollTop();
			var bottom_of_window = $(window).scrollTop() + $(window).height();
			if (top_of_window <= bottom_of_object && bottom_of_window >= top_of_object) {
			$('#pre-register-btn').hide();
			} else {
			$('#pre-register-btn').show();  
			}
		}
	})
}

ark.isIosUser = function() {
    $('#app-store-btn').click(function() {
		$("#app-store-btn").data("value", "1");
		$(".ios-message").css("display", "block");
    });
}

ark.closeModalError = function() {
	$("#close-button").click(function() {
        $('#modal-error').toggleClass('open');
        $('#modal-overlay').toggleClass('open');
	});
} 

ark.closeModal = function() {
	$("#close-button").click(function() {
        $('#modal-confirm').toggleClass('open');
        $('#modal-overlay').toggleClass('open');
	});
} 

ark.closeLegalModal = function() {
	$("#legal-close-button").click(function() {
        $('#legal-modal').toggleClass('open');
        $('#modal-overlay').toggleClass('open');
	});

} 

ark.openLegalModal = function () {
	$("#confirmation").click(function(e) {
		e.preventDefault();
		$("#legal-modal").toggleClass('open');
		$("#modal-overlay").toggleClass('open');	
	})
}

ark.acceptLegalConsent = function () {
	$("#legal-consent-btn").click(function() {
		$("#confirmation").prop('checked', true);
		$("#legal-modal").toggleClass('open');
		$("#modal-overlay").toggleClass('open');
	})
}

ark.registerNewsletter = function() {
	var params = new URLSearchParams(window.location.search);
	var token = params.get("token");
	if(token) {
		var data = JSON.stringify({
            "token": token
        });
        var xhr = new XMLHttpRequest();
        var url = "https://newsletter.trionworlds.com/api/subscribeDoubleOptIn";
		//new URL(window.location.origin) + "api/subscribeDoubleOptIn";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
				if(xhr.status === 200) {
                    GmgSession.sendRegistrationEvent('', 'Landing Page');
					var urlConfirmation = new URL(window.location.origin) + 'confirmation.html';
					window.open(urlConfirmation);	
				}
            } 
        }
    	xhr.send(data);		
	}	
}

/* !-- Smooth scroll -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.smoothScrollToElement = function(element) {
	if (element) {
		$("html, body").animate({ scrollTop: $(element).offset().top }, 500);
	}
};



/* Sticky Nav */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.stickyNav = function() {
	$("#menu").headroom({
		"offset": 0,
		"tolerance": 0,
		onTop : function() {
			$("body").addClass("menu-on-top");
		},
		onNotTop : function() {
			$("body").removeClass("menu-on-top");
		}
	});
}

/* Language selection show current */
ark.showCurrentLang = function() {
	var currentLang = ($("html")[0].lang).substring(0, 2);
	$("#lang-selection p").text(currentLang);
}

/* !-- Triggering mobile menu -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.triggerMobileMenu = function() {

	var trigger 	= $("#menu .trigger");
	var menuState	= "open";

	$(trigger).click(function(){

		$(this).toggleClass("is-active");
		$("html").toggleClass("lock");
		$("body").toggleClass("mobile-menu");

		if(menuState == "open") {

			ark.track('navigation', menuState,'hamburger-menu-');
			menuState = "close";
			$("#lightbox-overlay").on('touchmove', function(e) {

				e.preventDefault();

			}, false);

		} else {

			ark.track('navigation', menuState,'hamburger-menu-');
			menuState = "open";

			$("#lightbox-overlay").off('touchmove', function(e) {

			}, false);
		}

	});





	$(window).on('resize', function(){
		var win = $(this);

		if($("body").hasClass("mobile-menu") && win.width() >= 1024) {
			$("body").removeClass("mobile-menu");
			$("html").removeClass("lock");
		}
	});

}




/* !-- Collapse FAQ -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.faq = function() {

	$('.question').click(function(){
		var questionTrack = $(this).text();
		questionTrack = questionTrack.replace(/ /g, '-').toLowerCase();

		$(this).parent().toggleClass("opened");

		if($(this).parent().hasClass("opened")) {
			ark.track('support','click',questionTrack+'-');
		}

	});
};



/* !-- Medias Gallery -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.mediasGallery = function() {

	//Init gallery
	$(".ark-tabs-panel").each(function( index ) {

		var currentPanel	= $(this);
		var galeryItems		= $("img", this).length;

		/* Show total count of items */
		$(".button span", this).text(galeryItems)

		if(galeryItems < 5){
			$(".button", this).remove();
		}

		$("ul img", currentPanel).each(function( index ) {

			if(index <= 5) {
				$(this).parent().attr("rel", $(currentPanel).attr("id"))
				$(this).attr("src", $(this).data("src"));
				$(this).removeAttr("data-src");
			} else {
				$(this).parent().parent().css("display", "none");
			}
		});
	});


	$(".button.all").click(function() {

		var btnShowAll	= $(this);
		var activeTab	= $(this).parent().siblings("ul")
		var relGallery  = $(activeTab).parent().attr("id");

		$("img", activeTab).each(function( index ) {

			if($(this).data("src")) {
				/* Set image path */
				$(this).attr("src", $(this).data("src"));
				/* Set rel Attributes to the links */
				$(this).parent().attr("rel", relGallery);
				/* Remove Data src attribute */
				$(this).removeAttr("data-src");
				/* Display the images */
				$(this).parent().parent().css("display", "");
				/* Remove button after show all images */
				$(btnShowAll).remove();
			}

		});
	});

	$(".wrapper-images a").fancybox({
		maxWidth	: 1000,
		maxHeight	: 750,
		padding		: 1,
		width		: '70%',
		height		: '70%',
		autoSize	: false,
		closeClick	: false,
		openEffect	: 'none',
		closeEffect	: 'none',
		helpers : {
			overlay: {
				css: { 'background': 'rgba(14, 23, 33, 0.9)' }
			}
		}
	});

};




/* !-- News List -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.newsList = function() {
	if($("section").hasClass("news")) {
		$("body.blog #news article").first().addClass("feature");
		$("#news .promo").insertAfter("article:eq(3)");
	}
};



/* Slider Testimonials */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.sliderTestimonials = function() {
	$('.slider-testimonials').slick({
		dots: true,
		infinite: false
	});
}




/* Lightbox for legal stuff */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.legal = function() {

	var content;
	var fixedLayer = $("#lightbox-overlay");

	/*$(".legal-lightbox a").click(function(){
		$.ajax({
			url: $(this).attr("href"),
			type: "GET",
			dataType: "html",
			success: function (data) {

				content = $(data).find('#content .page-width').html();

				$("#legal-lightbox .wrapper").append('<div class="scroller">' + content + '</div>');

				$(fixedLayer).bind("touchmove",function(e){
					e.preventDefault();
				});

				$("html").addClass("lock");

				$("#legal-lightbox").toggleClass("open");

				ark.DeleteCookiesButton.initAll();

				//If user call privacy policy from the contact form
				$("#contact-form").removeClass("open");

			}
		});

		return false;
	});

	/* Close lightbox */
	$("#legal-lightbox .close").click(function() {
		$(fixedLayer).unbind('touchmove');
		$("#legal-lightbox").toggleClass("open");
		$("html").removeClass("lock");
		$("#legal-lightbox .wrapper .scroller").remove();
		return false;
	});

}


/* !-- Gear rotations -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.gearRotation = function(){
	var previousScroll = 0;

	function getScrollTop() {
		return document.documentElement.scrollTop;
	}

	function getRotationFromMatrix(matrix) {

	}

	function setGearsRotation() {
		var gears = document.querySelectorAll(".spinnable-gear"),
			newScroll = getScrollTop(),
			gearRotation = 0,
			rotateClockwise = true,
			i;

		for ( i = 0; i < gears.length; i++ ) {
			gearRotation = !isNaN(gears[i].rotation) ? gears[i].rotation : 0;
			rotateClockwise = gears[i].getAttribute("data-rotation-orientation") === "counterclockwise" ? false : true;

			if ( newScroll > previousScroll ) {
				gearRotation = gearRotation + (rotateClockwise ? 1 : -1);
			} else if ( newScroll < previousScroll ) {
				gearRotation = gearRotation - (rotateClockwise ? 1 : -1);
			}

			gears[i].style.setProperty("-webkit-transform", "rotate(" + String(gearRotation) + "deg) translateZ(0)");
			gears[i].style.setProperty(   "-moz-transform", "rotate(" + String(gearRotation) + "deg) translateZ(0)");
			gears[i].style.setProperty(        "transform", "rotate(" + String(gearRotation) + "deg) translateZ(0)");

			gears[i].rotation = gearRotation;
		}

		previousScroll = newScroll;
	}

	window.addEventListener("load", function() {
		previousScroll = getScrollTop();
		setGearsRotation();
	});

	window.addEventListener("scroll", function() {
		setGearsRotation();
	});
};



/* !-- Track click for the main menu and the footer for Google analytics  -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.mainMenuTracking = function() {

	$("#menu-menu a, #menu-footer-menu a, .utils a").each(function( index ) {
		var label = $(this).text();
		label = label.replace(/ /g, '-').toLowerCase();

		$(this).click(function() {
			ark.track('navigation', 'click', label+"-");
		});

	});

};




/* !-- Track clicks  -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.track = function(category, action, labelParam) {

	if ( window.ark.Cookies.get("COOKIE_GATE_ACKNOWLEDGEMENT") === "true" ) {
		var lang	= ark.Locale.get().lang;
		var label	= labelParam + lang;

		//console.log('Track : ', 'send', 'event', category, action, label);
		try {
			window.ga('send', 'event', category, action, label);
		} catch(e) {
			//
		}
	}

};




/* !-- Day & Night Section -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.dayNight = function() {

	var hr = (new Date()).getHours();

	//Set Day of nigth depending the time of the day
	function activateByTime() {
		hr >= 6 && hr <= 18 ? $("#day-night").removeClass("night-active idle").addClass("day-active") : $("#day-night").removeClass("day-active idle").addClass("night-active");
		hr >= 6 && hr <= 18 ? $("#heroes").removeClass("night").addClass("day") : $("#heroes").removeClass("day").addClass("night");
		hr >= 6 && hr <= 18 ? $("#day-night-trigger").removeClass("night").addClass("day") : $("#day-night-trigger").removeClass("day").addClass("night");

	}

	if(!ark.Device.isMobile()) {
		activateByTime();
	} else {

		hr >= 6 && hr <= 18 ? $("#day-night").removeClass().addClass("idle day-mobile") : $("#day-night").removeClass().addClass("idle night-mobile");

		function showDayNightAnimation() {
			if(document.getElementById("day-night").getBoundingClientRect().top <=  window.innerHeight / 3) {
				activateByTime();
				window.removeEventListener("scroll", showDayNightAnimation);
				window.removeEventListener("load", showDayNightAnimation);
			}
		}

		window.addEventListener("scroll", showDayNightAnimation);
		window.addEventListener("load", showDayNightAnimation);
	}



	//Postion of the mouse
	$("#mousetrack").mousemove(function(event){

		var dnCenter		= $("#mousetrack").width() / 2 ;
		var relX 			= event.pageX - $(this).offset().left;
		var relY 			= event.pageY - $(this).offset().top;

		if(relX <= dnCenter) {
			//Mouse or click on the left side of the block
			$("#day-night").addClass("day-active");
			$("#day-night").removeClass("night-active night-mobile idle");
		} else {
			//Mouse or click on the RIGHT side of the block
			$("#day-night").addClass("night-active");
			$("#day-night").removeClass("day-active day-mobile idle");
		}

	});

	//Exit the Day & Nights section with the mouse
	$("#mousetrack").mouseleave(function(event) {
		hr >= 6 && hr <= 18 ? $("#day-night").removeClass().addClass("day-active") : $("#day-night").removeClass().addClass("night-active");
	});


};


/* !-- Homepage video lightbox -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
ark.fullscreenVideo = function(){

	$(".play-btn").click(function() {

		var videoPlaceHolder 	= $("#fullscreenplayer");
		var videoID				= $(this).data('videoid');
		var deviceWith			= $(window).width();

		$(videoPlaceHolder).toggleClass("open");
		$(videoPlaceHolder).append('<iframe width="16" height="9" id="videoTeaser" src="https://www.youtube.com/embed/' + videoID + '?enablejsapi=1&rel=0&autoplay=1&autohide=1&showinfo=0"  frameborder="0" allowfullscreen></iframe>');


		//resizeIframe();

		$('button', videoPlaceHolder).click(function(){
			$('iframe',videoPlaceHolder).remove();
			$(videoPlaceHolder).removeClass();
		});

		return false;

	});


	function resizeIframe() {
		// Find all YouTube videos
		var $allVideos = $("iframe[src^='//www.youtube.com']"),

			// The element that is fluid width
			$fluidEl = $("body");

		// Figure out and save aspect ratio for each video
		$allVideos.each(function() {

			$(this)
				.data('aspectRatio', this.height / this.width)

			// and remove the hard coded width/height
				.removeAttr('height')
				.removeAttr('width');

		});

		// When the window is resized
		$(window).resize(function() {

			var newWidth = $fluidEl.width();

			// Resize all videos according to their own aspect ratio
			$allVideos.each(function() {

				var $el = $(this);
				$el
					.width(newWidth)
					.height(newWidth * $el.data('aspectRatio'))
					.css({
					'margin-top' : -(newWidth * $el.data('aspectRatio')/2),
					'margin-left' : -(newWidth/2)
				});

			});

			// Kick off one resize to fix all videos on page load
		}).resize();
	}

};

ark.setUpScrollTracking = function(){
	var trackOnScrollElements = {
		trailer: {
			element: $('#trailer')[0],
			visible: false,
			token: 'yqyahl'
		},
		preregSection: {
			element: $('#pre-register')[0],
			visible: false,
			token: 'yyddo7'
		},
		features: {
			element: $('#features')[0],
			visible: false,
			token: '8f0cr8'
		},
		heroes: {
			element: $('#heroes-section')[0],
			visible: false,
			token: 'xxzz14'
		},
		footer: {
			element: $('#footer')[0],
			visible: false,
			token: 'xoe23v'
		}
	};
	$(document).on('scroll', function (e) {
		for(var key in trackOnScrollElements) {
			var element = trackOnScrollElements[key];
			if (!element || !element.element) {
				console.error(key+' not found');
				continue;
			}
			var isVisible = checkVisible(element.element);
			if (isVisible && !element.visible) {
				track(element.token)
			}
			element.visible = isVisible;
		}
	});

	function checkVisible(elm) {
		var rect = elm.getBoundingClientRect();
		var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
		return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
	}

	function track(token) {
		if(!Adjust || !token) {
			console.error('Can\'t track, something went wrong');
			return
		}
		Adjust.trackEvent({
			eventToken: token
		});
	}
};

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* !-- Tracking -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function(){

	/* !-- Global Variables -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	var _googleAnalyticsAccount = "UA-74647564-1",
		_googleAnalyticsInitialized = false;




	/* !-- Static Methods -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	/**
	 * Initializes Google Analytics
	 */
	Tracking.initGoogleAnalytics = function() {
		if ( _googleAnalyticsInitialized !== true && window.ark.Cookies.get("COOKIE_GATE_ACKNOWLEDGEMENT") === "true" ) {
			try {
				_googleAnalyticsInitialized = true;
				window.ga("create", _googleAnalyticsAccount, "auto");
				window.ga("send", "pageview");
			} catch(__) {
				//
			}
		}
	}





	/* !-- Constructor -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	/**
	 * Constructor
	 */
	function Tracking() {}





	/* !-- Adds the object -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	if (!window.ark) window.ark = {};
	window.ark.Tracking = Tracking;
})();




/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* -- Delete Cookies Buttons -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

(function() {
	/* -- Global Variables -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	var cookieName = "COOKIE_GATE_ACKNOWLEDGEMENT",
		_dataAttributes = {
			initialized : "data-delete-cookies-button-initialized"
		};




	/* -- Initializes the buttons -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	DeleteCookiesButton.initAll = function(){
		var buttons = document.querySelectorAll(".delete-cookies-button:not([" + _dataAttributes.initialized + "='true'])"),
			i;

		for ( i = 0; i < buttons.length; i++ ) {
			setButtonLabel(buttons[i]);
			buttons[i].setAttribute(_dataAttributes.initialized, "true");
			buttons[i].addEventListener("click", buttonClick);
		}
	};




	/* -- Constructor -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function DeleteCookiesButton() {}




	/* -- Returns if the cookies are allowed -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function getCookiesAllowed() {
		return window.ark.Cookies.get(cookieName) === "true";
	}




	/* -- Sets the button label -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function setButtonLabel(__button) {
		var _labels = {
			allowed  : __button.querySelector(".allowed"),
			declined : __button.querySelector(".declined")
		};

		// Cookies are alloed
		if ( getCookiesAllowed() === true ) {
			if ( _labels.allowed ) {
				_labels.allowed.style.setProperty("display", "inline");
			}
			if ( _labels.declined ) {
				_labels.declined.style.setProperty("display", "none");
			}
		}

		// Cookies are not allowed
		else {
			if ( _labels.allowed ) {
				_labels.allowed.style.setProperty("display", "none");
			}
			if ( _labels.declined ) {
				_labels.declined.style.setProperty("display", "inline");
			}
		}
	}




	/* -- Button click event handler -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function buttonClick() {
		// Cookies are allowed, so we shall delete them on click
		if ( getCookiesAllowed() ) {
			window.ark.Cookies.remove();
		}

		// Cookies are not allowed, so we shall allow them on click
		else {
			window.ark.Cookies.set(cookieName, "true", "10y");

			// Tries to close the cookies popup
			var popup = $("#cookie-gate");
			if (popup) {
				popup.removeClass("show")
			}
		}

		// Sets the button label
		setButtonLabel(this);
	}




	if ( !window.ark ) window.ark = {};
	window.ark.DeleteCookiesButton = DeleteCookiesButton;


	// Initializes the script
	document.addEventListener("DOMContentLoaded", function() {
		DeleteCookiesButton.initAll();
	});


})();