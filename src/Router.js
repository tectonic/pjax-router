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
    var deletion = function(pattern, handler) {
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
      "delete": deletion,
      match: match,

      getRoutes: getRoutes,
      setMatchBehaviour: setMatchBehaviour
    };
  })();
})();
