/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* -- Tabs -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

(function(){


/* !-- Constructor -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function Tabs(__tabsContainer) {
		// Private Variables
		var _context       = this,
			_tabsContainer = __tabsContainer,
			_nav           = _tabsContainer.querySelector(".ark-tabs-nav"),
			_navItems      = _nav.querySelectorAll("a"),
			_navSelect     = _nav.querySelector("select"),
			_panel         = _tabsContainer.querySelector(".ark-tabs-panels"),
			_panelItems    = _panel.querySelectorAll(".ark-tabs-panel");
		
		
		// Getters and Setters
		this.getNav        = function() { return _nav; };
		this.getNavSelect  = function() { return _navSelect; }
		this.getNavItems   = function() { return _navItems; };
		this.getPanel      = function() { return _panel; };
		this.getPanelItems = function() { return _panelItems; };
		
		
		// Adds the tab buttons behavior and creates the drop down
		if (_navSelect !== null) {
			window.ark.emptyElement(_navSelect);
			var option;
		}
		
		for ( var i = 0; i < _navItems.length; i++ ) {
			// Adds the tab buttons behavior
			if (!_navItems[i].ark) {
				_navItems[i].ark = {};
			}
			_navItems[i].ark.Tabs = { context: _context, tabId: i };
			_navItems[i].addEventListener("click", navItemClick);
			
			if (_navSelect !== null) {
				// Appends an option to the select
				option = document.createElement("option");
				option.setAttribute("value", String(i));
				option.appendChild(document.createTextNode(_navItems[i].textContent));
				
				_navSelect.appendChild(option);
			}
		}
		
		if (_navSelect !== null) {
			if (!_navSelect.ark) {
				_navSelect.ark = {};
			}
			_navSelect.ark.Tabs = { context: _context };
			_navSelect.addEventListener("change", navItemSelected);
		}
		
		
		// Selects the first tab
		this.selectTab(0);
	}




/* !-- Private Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	function navItemClick(__evt) {
		ark.Events.preventDefault(__evt);
		this.ark.Tabs.context.selectTab(this.ark.Tabs.tabId);
	}
	
	
	
	
	function navItemSelected(__evt) {
		this.ark.Tabs.context.selectTab(parseInt(this.value));
	}
	




/* !-- Public Methods -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	Tabs.prototype.selectTab = function(__tabId) {
		for ( var i = 0; i < this.getNavItems().length; i++ ) {
			this.getNavItems()[i].classList[i === __tabId ? "add" : "remove"]("current");
			this.getPanelItems()[i].classList[i === __tabId ? "add" : "remove"]("current");
		}
		
		if (this.getNavSelect()) {
			this.getNavSelect().selectedIndex = __tabId;
		}
	};
	




/* -- Adds the object -- */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	if (!window.ark) window.ark = {};
	
	if (!window.ark.Tabs) {
		window.ark.Tabs = Tabs;
	}
	
	
	
	
	/* -- Creates the Grid List items -- */
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	// Main Script
	var script = function(__isResetted) {
		var tabs = document.querySelectorAll(".ark-tabs");
		
		for ( var i = 0; i < tabs.length; i++ ) {
			new Tabs(tabs[i]);
		}
	}
	
	
	
	
	// Initializes the script
	document.addEventListener("DOMContentLoaded", function() {
		script();
		
		// Adds the script to the collection
		//window.ark.ScriptsCollection.add(script);
	});


}());