(function($) {
  /**
   * The Eventer is used to hook into jquery-pjax events. It adds a wrapper around pjax events
   * and sets up callbacks based on the routes you register with the system. For example,
   * as requests are made, jquery-pjax fires events. These events are hooked into and every
   * time Eventer will search for one or more matching routes. If one is found, it'll execute the callback
   * for that registered route. If no routes are found/matched, it won't do anything.
   *
   * @module Pjax.Eventer
   * @listens pjax:send
   * @listens pjax:complete
   */
  Pjax.Eventer = (function() {
    /**
     * Setup a new listener for the required event, and register the callback.
     *
     * @param string event
     * @param function callback
     */
    var listen = function(event, callback) {
      $(document).on(event, callback);
    };

    /**
     * Execute the callback provided.
     *
     * @param callback
     * @returns {*}
     */
    var handle = function(callback, params) {
      return callback(params);
    };

    /**
     * This is the default handler for requests, and gets registered
     * for both the pjax:send and pjax:complete events with jquery-pjax.
     * It attempts to find a matching route for the given URL, and if found
     * will then execute the callback registered for that route.
     *
     * @param {string} when
     */
    var requestCallback = function(xhr, options, when) {
      var method = Pjax.Utility.determineHttpVerb(xhr, options);
      var matchedRoutes = Pjax.Router.match(options.url, method, when);

      for (var i = 0; i < matchedRoutes.length; i++) {
        // Object that we'll pass to the handler for the callback to deal with, if it needs to
        var handlerParams = {
          xhr: xhr,
          options: options,
          route: matchedRoutes[i]
        };

        return handle(matchedRoutes[i].handler, handlerParams);
      }
    };

    // Setup our base event listeners
    listen('pjax:start', function(event, xhr, options) {
      requestCallback(xhr, options, 'before');
    });

    listen('pjax:end', function(event, xhr, options) {
      requestCallback(xhr, options, 'after');
    });

    /**
     * When the page first loads up, PJAX will not be firing, so we want to make a match against
     * the current document/window URL, and pass this information to the correct handler which
     * should be able to handle both.
     */
    $(document).ready(function() {
      var matchedRoutes = Pjax.Router.match(window.location.href, 'get', 'after');

      for (var i = 0; i < matchedRoutes.length; i++) {
        var handlerParams = {
          xhr: null,
          options: null,
          route: matchedRoutes[i]
        };

        return handle(matchedRoutes[i].handler, handlerParams);
      }
    });

    // Return our object with the public methods
    return {
      listen: listen
    };
  })();
})(jQuery);
