/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* -- AJAX Masonry Grid -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
(function(){




/* !-- Global Variables -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	var globals = {
		dataAttributes : {
			ajaxMethod    : "data-masonry-ajax-method",
			itemsToOutput : "data-masonry-items-to-output"
		},
		cssClasses : {
			grid           : "masonry-grid",
			masonryItem    : "masonry-grid-item",
			loading        : "masonry-grid-loading",
			loadMoreButton : "masonry-grid-load-more-button"
		}
	}




/* !-- Static Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	AjaxMasonryGrid.initAll = function() {
		var grids = document.querySelectorAll("." + globals.cssClasses.grid + "[" + globals.dataAttributes.ajaxMethod + "]"),
			ajaxMasonryGrid,
			i;
		
		for ( i = 0; i < grids.length; i++ ) {
			ajaxMasonryGrid = new window.ark.AjaxMasonryGrid(grids[i]);
		}
	};




/* !-- Constructor -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function AjaxMasonryGrid(__grid) {
		// Private Variables
		var _grid          = __grid,
			_gridList      = __grid.querySelector("ul"),
			_ajaxMethod    = _grid.getAttribute(globals.dataAttributes.ajaxMethod),
			_itemsToOutput = _grid.getAttribute(globals.dataAttributes.itemsToOutput) ? parseInt(_grid.getAttribute(globals.dataAttributes.itemsToOutput)) : 1,
			_masonry;
		
		
		__grid.removeAttribute(globals.dataAttributes.ajaxMethod);
		__grid.removeAttribute(globals.dataAttributes.itemsToOutput);
		
		
		// Getters and Setters
		this.getGrid            = function() { return _grid; };
		this.getGridList        = function() { return _gridList; };
		this.getMasonry         = function() { return _masonry; };
		this.getAjaxMethod      = function() { return _ajaxMethod; };
		this.getItemsToOutput   = function() { return _itemsToOutput; };
		this.getLoadMoreButtons = function() { return _grid.querySelectorAll("." + globals.cssClasses.loadMoreButton); };
		
		
		// Initializations
		_masonry = createMasonry(this);
		updateMasonryLayout(this);
		
		addLoadMoreButtonsBehaviors(this);
		
		//this.loadMoreItems(true);
	}




/* !-- Private Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	
	/* -- Creates the Masonry grid -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function createMasonry(__context) {
		return $(__context.getGridList()).masonry({
			itemSelector    : "li",
			percentPosition : true
		});
	}
	
	
	
	
	/* -- Adds click behavior on load more buttons -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function addLoadMoreButtonsBehaviors(__context) {
		var loadMoreButtons = __context.getLoadMoreButtons();
		
		for ( var i = 0; i < loadMoreButtons.length; i++ ) {
			if (loadMoreButtons[i].ark === undefined) {
				loadMoreButtons[i].ark = {};
			}
			loadMoreButtons[i].ark.ajaxMasonryGrid = { context: __context };
			
			loadMoreButtons[i].addEventListener("click", loadMoreButtonClicked);
		}
	}
	
	
	
	
	/* -- Load More button click event handler -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function loadMoreButtonClicked() {
		this.ark.ajaxMasonryGrid.context.loadMoreItems()
	}
	
	
	
	
	/* -- Handles the response -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function handleResponse(__context, __response, __prepend) {
		if ( __response ) {
			var returnedItems = jQuery("<div>" + __response + "</div>").find("li");
			
			for ( var i = 0; i < returnedItems.length; i++ ) {
				returnedItems[i].classList.add(globals.cssClasses.masonryItem);
			}
			
			if ( returnedItems.length <= __context.getItemsToOutput() ) {
				hideLoadButton(__context);
			}
			
			outputItems(__context, returnedItems.slice(0, __context.getItemsToOutput()), __prepend === true);
		} else {
			hideLoadButton(__context);
		}
	}
	
	
	
	
	/* -- Outputs the items in the Masonry grid -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function outputItems(__context, __items, __prepend) {
		__context.getMasonry()[__prepend === true ? "prepend" : "append"](__items).masonry(__prepend === true ? "prepended" : "appended", __items );
		updateMasonryLayout(__context);
	}
	
	
	
	
	/* -- Updates the Masonry layout -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function updateMasonryLayout(__context) {
		setTimeout(function(){
			__context.getMasonry().masonry("layout");
		}, 250);
	}
	
	
	
	
	/* -- Hides the laod button -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function hideLoadButton(__context) {
		var loadMoreButtons = __context.getLoadMoreButtons();
		
		for ( var i = 0; i < loadMoreButtons.length; i++ ) {
			loadMoreButtons[i].parentNode.removeChild(loadMoreButtons[i]);
		}
	}




/* !-- Public Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	AjaxMasonryGrid.prototype.loadMoreItems = function(__prepend) {
		if ( !this.getGrid().classList.contains(globals.cssClasses.loading) ) {
			var context = this;
			
			this.getGrid().classList.add(globals.cssClasses.loading);
			
			
			jQuery.post("/wp-admin/admin-ajax.php",
				{
					action        : this.getAjaxMethod(),
					offset        : this.getGrid().querySelectorAll("li." + globals.cssClasses.masonryItem).length,
					itemsToOutput : this.getItemsToOutput() +(1) // Adding an extra item to see if at least one is left
				},
				function(__response){
					handleResponse(context, __response, __prepend);
					context.getGrid().classList.remove(globals.cssClasses.loading);
				}
			);
		}
	};
	




/* -- Adds the object -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	if (!window.ark) window.ark = {};
	
	if (!window.ark.AjaxMasonryGrid)
		window.ark.AjaxMasonryGrid = AjaxMasonryGrid;
	
	
	
	
	document.addEventListener("DOMContentLoaded", function(){
		window.ark.AjaxMasonryGrid.initAll();
	});


}());