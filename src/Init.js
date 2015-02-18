(function() {
	// Once ready, call Pjax.init. This should generally be called once the dom is ready, not before.
	Pjax.init = function() {
		/**
		 * When the page first loads up, PJAX will not be firing, so we want to make a match against
		 * the current document/window URL, and pass this information to the correct handler which
		 * should be able to handle both.
		 */
		var matchedRoutes = Pjax.Router.match(window.location.href, 'get', 'after');

		for (var i = 0; i < matchedRoutes.length; i++) {
			var handlerParams = {
				xhr: null,
				options: null,
				route: matchedRoutes[i]
			};

			return handle(matchedRoutes[i].handler, handlerParams);
		}
	};
})();
