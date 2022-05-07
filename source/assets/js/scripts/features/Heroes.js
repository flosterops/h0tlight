/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* -- Heroes -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

(function(){


	document.addEventListener("DOMContentLoaded", function(){
		var hr = (new Date()).getHours();
		var _selectedCharacter	= "veroline";
		var _state				= hr >= 6 && hr <= 18 ? "day" : "night";
		if(_state==="day") {
			$(".character-container").addClass("start-1");
		} else {
			$(".character-container").addClass("start-2");
		}
		
		/* -- Init Characters Carousel -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		var heroCarousel = $('#heroes-carousel');
			
			heroCarousel.on('init', function(event, slick, direction){
				$(".heroes-carousel-wrapper").css("opacity", "1");
			});
						
			heroCarousel.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				dots: false,
				infinite: true,
				speed: 500,
				fade: true,
				cssEase: 'linear',
				draggable: false,
				swipe: false,
				arrows: false
			});


		
		/* -- Trigger the Characters Selections -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		$("#heroes-selector a").click(function(e) {
			
			
			/* Prevent request if heroes already active */
			if(!$(this).hasClass("active")){
				
				/* Set Default Class Management  */
				$("#heroes-selector a").removeClass("active").addClass("inactive");
				$(this).addClass("active").removeClass("inactive");

				$(".name").removeClass("active").addClass("inactive");
				$(".text-container").removeClass("active").addClass("inactive");


				if($(this).hasClass("veroline")) {
					$(".name.veroline").removeClass("inactive").addClass("active");
					$(".text-container.desc-veroline").removeClass("inactive").addClass("active");
					$(".character-img").attr("class","character-img char-veroline");
				};

				if($(this).hasClass("pestipew")) {
					$(".name.pestipew").removeClass("inactive").addClass("active");
					$(".text-container.desc-pestipew").removeClass("inactive").addClass("active");
					$(".character-img").attr("class","character-img char-pestipew");	
				}
				if($(this).hasClass("makino")) {
					$(".name.makino").removeClass("inactive").addClass("active");
					$(".text-container.desc-makino").removeClass("inactive").addClass("active");
					$(".character-img").attr("class","character-img char-makino");	
				}

				//so all characters hidden and when not active you hide. Then day night and you show that
				//in a element can have data-X

			}
			e.preventDefault();

		});		
		
		
		
		
		
		/* -- Day & Night Indicator -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		$("#day-night-trigger a").click(function(e) {
			
			clickedState 		= $(this).attr("class"); 
			
			if(_state != clickedState) {
				
				_state = clickedState;
				
//				console.log("here")
				
				//Activated the button to the state cliked Day or Night
				$("#heroes, #day-night-trigger, #heroes-carousel").removeClass("night day").addClass(clickedState);
				$("#heroes-carousel .slide.slick-current ." + _state + " .skins a:first").trigger("click");
				
				// Set skin class
				$(".skins a").removeClass();
				$(".skins a:first-child").addClass("active");
				
			}
			
			e.preventDefault();
		});





		/* -- Skins buttons Selector-- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		
		$("#heroes-carousel .slide .skins a").click(function(e) {
			
//			console.log("clicked")
			
			var 
				state	  	= $("#day-night-trigger").attr("class");
				skin		= $(this).index() + 1;
				videoPath 	= _selectedCharacter + "_skin_" + _state + "-" + skin + ".mp4";
				mobileImg	= _selectedCharacter + "_skin_" + _state + "-" + skin + "-m.jpg";
				desktopImg	= _selectedCharacter + "_skin_" + _state + "-" + skin + ".jpg";
				
			$("#heroes-carousel .slide .skins a").removeClass("active");
			$(this).addClass("active");	
			
//			console.log(videoPath, desktopImg, mobileImg)		
			
			mediasSwitcher(videoPath, desktopImg, mobileImg);
			
			e.preventDefault();
		});
		
		

		/* -- Set the video -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		function mediasSwitcher(videoPath, desktopImg, mobileImg) {
			var gamigo_cdn = "https://webcdn.triongames.com/landingpages/heroesoftwilight";
			var heroesContainer 	= $(".heroes-carousel-wrapper"); /* Loading class */
			var mediasPlaceHolder	= $("#medias-placeholder"); /* Video place holder */
			
			var video = $('<video />', {
				src: gamigo_cdn + "/assets/videos/characters/" + videoPath,
				type: 'video/mp4',
				autoplay: 'autoplay',
				muted: 'muted',
				loop: 'loop ',
				controls: false
			});
			
			var imageDesktop = $('<img />', {
				src : gamigo_cdn + "/assets/videos/characters/" + desktopImg,
				class : "desktop"
			});
			
			var imageMobile = $('<img />', {
				src : gamigo_cdn + "/assets/videos/characters/" + mobileImg,
				class : "mobile"
			});
			
			/* Show loading */
			$(heroesContainer).addClass("loading");
			
			/* Append video to DOM */
			$(video).appendTo(mediasPlaceHolder).css("opacity", "0");
			
			/* Add event listener */
			$(video).bind("canplaythrough", canplayThroughEvent);
			
			
			function canplayThroughEvent() {
				/* Remove Add event listener */
				$(this).unbind("canplaythrough", canplayThroughEvent);
				
				/* Show the new video */
				$(this).css("opacity", "1");
				
				/* Tracking when video is shown */
				ark.track('heroes', 'view', _selectedCharacter+"-");
				
				/* Remove loading */
				$(heroesContainer).removeClass("loading");
				
				setTimeout(function() {
					$(mediasPlaceHolder).find('video').first().remove();
				}, 500)
			}
			
			
			/* Append image to DOM */
			imageDesktop.appendTo(mediasPlaceHolder).css("opacity", "0");
			imageMobile.appendTo(mediasPlaceHolder).css("opacity", "0");
			
			setTimeout(function() {
				$(heroesContainer).removeClass("loading");
				$(imageDesktop).css("opacity", "1");
				$(imageMobile).css("opacity", "1");
				$(mediasPlaceHolder).find('img.desktop').first().remove();
				$(mediasPlaceHolder).find('img.mobile').first().remove();
			}, 500)

		}
		
		
		
		/* -- Update Hero url -- */
		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		function updateURL(character) {
	      if (history.pushState) {
	          var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?hero=' + character;
	          window.history.pushState({path:newurl},'',newurl);
	      }
	    }
		
		
		
		
		/* Init the first characters on mobile */
		if(ark.locationQuery.hero) {
			$("#heroes-nav a").each(function(i) {
				if($(this).data("character") == ark.locationQuery.hero()) {
					$(this).trigger('click');
				}
			});
		} else {
			$("#heroes-nav a").first().trigger('click');
		}
		
		
		
	});
	
	
})();