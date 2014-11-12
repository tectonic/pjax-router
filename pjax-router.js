var Tectonic = Tectonic || {Pjax: {}};

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
         * @param {object} xhr
         * @param {object} options
         */
        var requestCallback = function(xhr, options) {
            var matchedRoutes = Tectonic.Pjax.Router.match(xhr.url);

            for (var i = 0; i < matchedRoutes.length; i++) {
                handle(matchedRoutes[i].handler);
            }
        };

        // Setup our base event listeners
        listen('pjax:send', requestCallback);
        listen('pjax:complete', requestCallback);

        // Return our object with the public methods
        return {
            listen: listen
        };
    })();
})(jQuery);

var Tectonic = Tectonic || {Pjax: {}};

(function() {
  /**
   * Create a new Route object, with the pattern method and callback handler defined.
   *
   * @module Tectonic.Pjax.Route
   * @param string pattern
   * @param string method
   * @param callback handler
   * @constructor
   */
  Tectonic.Pjax.Route = function(pattern, method, handler) {
    if (typeof pattern !== 'string') {
      throw new Error('You must provide the pattern argument as a string when registering a new Route object.');
    }
    if (typeof method !== 'string') {
      throw new Error('You must provide the method argument as a string when registering a new Route object.');
    }
    if (typeof handler !== 'function') {
      throw new Error('You must provide the handler argument as a function callback when registering a new Route object.');
    }

    /**
     * Converts a given pattern into a regular expression which can be used
     * for matching.
     *
     * @param string pattern
     * @return RegExp
     */
    var regexify = function(pattern) {
      pattern = pattern
        .replace(/:any/gi, '(.*)')
        .replace(/:id/gi, '([0-9]+)')
        .replace(/:alphanum/gi, '([a-z0-9\\-]+)')
        .replace(/:alpha/gi, '([a-z\\-]+)')
        .replace(/:(?=\/)+/gi, '([^/]+)');

      return new RegExp(pattern);
    };

    /**
     * Match a given url and method against the registered routes.
     *
     * @param string url
     * @param string method
     * @returns false if no route matches, or the Route object if it passes.
     */
    var matches = function(url, method) {
      if (this.method == method) {
        return regex.test(url);
      }

      return false;
    };

    // Our private properties
    var regex = regexify(pattern);

    // Return the object developers can work with
    return {
      pattern: pattern,
      regex: regex,
      method: method,
      handler: handler,

      matches: matches
    };
  };
})();
var Tectonic = Tectonic || {Pjax: {}};

(function() {
  /**
   * The router class manages the registration of various front-end routes.
   *
   * @module Tectonic.Pjax.Router
   */
  Tectonic.Pjax.Router = (function(){
    /**
     * Stores the registered routes for matching later.
     *
     * @type {Array}
     */
    var routes = [];

    /**
     * It's possible for the router to work in one of two ways. Either:
     *
     * 1. It will search for a matched route and then immediately exit matching or
     * 2. It will run all matched callbacks for a given route.
     *
     * This is defined by setting the below property to 'single' or 'all'. The
     * default behaviour is for the router to stop as soon as it finds a match.
     *
     * @type {string}
     */
    var matchBehaviour = 'single';

    /**
     * Register a new get route.
     *
     * @param {string} pattern
     * @param {function} handler
     */
    var get = function(pattern, handler) {
      add(pattern, 'get', handler);
    };

    /**
     * Register a new post route.
     *
     * @param {string} pattern
     * @param {function} handler
     */
    var post = function(pattern, handler) {
      add(pattern, 'post', handler);
    };

    /**
     * Register a new delete route.
     *
     * @param {string} pattern
     * @param {function} handler
     */
    var del = function(pattern, handler) {
      add(pattern, 'delete', handler);
    };

    /**
     * Register a new put route.
     *
     * @param {string} pattern
     * @param {function} handler
     */
    var put = function(pattern, handler) {
      add(pattern, 'put', handler);
    };

    /**
     * You can register a resource that will respond to all method requests to a given
     * set of url patterns. When registering a resource (such as "users"), the following
     * routes will be registered:
     *
     *  - GET /users/
     *  - POST /users/
     *  - DELETE /users/:id
     *  - GET /users/:id
     *  - PUT /users/:id
     *  - POST /users/:id
     *
     * @param {string} name
     * @param {function} handler
     */
    var resource = function(name, handler) {
      var idPattern = name+'/:id';

      get(name, handler);
      post(name, handler);
      del(idPattern, handler);
      get(idPattern, handler);
      put(idPattern, handler);
      post(idPattern, handler);
    };

    /**
     * Match a given url and method against the registered routes.
     *
     * @param {string} url
     * @param {string} method
     * @returns {Array}
     */
    var match = function(url, method) {
      var matchedRoutes = [];

      for (var i = 0; i < routes.length; i++) {
        if (routes[i].matches(url, method)) {
          matchedRoutes.push(routes[i]);

          if (matchBehaviour == 'single') {
            break;
          }
        }
      }

      return matchedRoutes;
    };

    /**
     * Sets the match behaviour for the router.
     *
     * @param {string} behaviour
     */
    var setMatchBehaviour = function(behaviour) {
      if (behaviour != 'single' && behaviour != 'all') {
        throw new Error('Invalid value for router match behaviour. Available options are: single, all.')
      }

      matchBehaviour = behaviour;
    };

    /**
     * Add a new route to the routes array.
     *
     * @param {string} pattern
     * @param {string} method
     * @param {function} handler
     * @uses Tectonic.Pjax.Route
     */
    var add = function(pattern, method, handler) {
      routes.push(Tectonic.Pjax.Route(pattern, method, handler));
    };

    /**
     * Returns the routes registered with the router.
     *
     * @returns {Array}
     */
    var getRoutes = function() {
      return routes;
    };

    // Return the object that will be publicly available
    return {
      get: get,
      post: post,
      put: put,
      del: del, // alias for the delete
      "delete": del,
      match: match,

      getRoutes: getRoutes,
      setMatchBehaviour: setMatchBehaviour
    };
  })();
})();
