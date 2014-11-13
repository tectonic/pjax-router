(function($) {
  /**
   * The Eventer is used to hook into jquery-pjax events. It adds a wrapper around pjax events
   * and sets up callbacks based on the routes you register with the system. For example,
   * as requests are made, jquery-pjax fires events. These events are hooked into and every
   * time Eventer will search for one or more matching routes. If one is found, it'll execute the callback
   * for that registered route. If no routes are found/matched, it won't do anything.
   *
   * @module Tectonic.Pjax.Eventer
   * @listens pjax:send
   * @listens pjax:complete
   */
  Tectonic.Pjax.Eventer = (function() {
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
    var handle = function(callback) {
      return callback();
    };

    /**
     * This is the default handler for requests, and gets registered
     * for both the pjax:send and pjax:complete events with jquery-pjax.
     * It attempts to find a matching route for the given URL, and if found
     * will then execute the callback registered for that route.
     *
     * @param {string} when
     */
    var requestCallback = function(when) {
      return function(xhr, options) {
        var matchedRoutes = Tectonic.Pjax.Router.match(xhr.url, xhr.method, when);

        for (var i = 0; i < matchedRoutes.length; i++) {
          handle(matchedRoutes[i].handler);
        }
      };
    };

    /**
     * There are two ways in which a method can be derived. Because browsers don't fully support all the HTTP
     * verbs, and the fact that frameworks work around this by providing a _method property as part of form
     * submissions, we will look first for that _method property in the XHR post data. If it exists, we will
     * use that as the method.
     *
     * @param {object} xhr
     */
    var determineMethod = function(xhr) {
      if (xhr.formdata._method) {
        return xhr.formdata._method;
      }

      return xhr.method.lowerCase();
    };

    // Setup our base event listeners
    listen('pjax:send', requestCallback('before'));
    listen('pjax:complete', requestCallback('after'));

    // Return our object with the public methods
    return {
        listen: listen
    };
  })();
})(jQuery);
