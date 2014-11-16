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
     * Register a new get route.
     *
     * @param {string} pattern
     * @param {function} handler
     * @param {object} options
     */
    var get = function(pattern, handler, options) {
      add(pattern, 'get', handler, options);
    };

    /**
     * Register a new post route.
     *
     * @param {string} pattern
     * @param {function} handler
     * @param {object} options
     */
    var post = function(pattern, handler, options) {
      add(pattern, 'post', handler, options);
    };

    /**
     * Register a new delete route.
     *
     * @param {string} pattern
     * @param {function} handler
     * @param {object} options
     */
    var del = function(pattern, handler, options) {
      add(pattern, 'delete', handler, options);
    };

    /**
     * Register a new put route.
     *
     * @param {string} pattern
     * @param {function} handler
     * @param {object} options
     */
    var put = function(pattern, handler, options) {
      add(pattern, 'put', handler, options);
    };

    /**
     * Add a new route to the routes array.
     *
     * @param {string} pattern
     * @param {string} method
     * @param {function} handler
     * @param {object} options
     * @uses Tectonic.Pjax.Route
     */
    var add = function(pattern, method, handler, options) {
      routes.push(Tectonic.Pjax.Route(pattern, method, handler, options));
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
    var resource = function(name, handler, options) {
      var idPattern = name+'/:id';

      get(name, handler, options);
      post(name, handler, options);
      del(idPattern, handler, options);
      get(idPattern, handler, options);
      put(idPattern, handler, options);
      post(idPattern, handler, options);
    };

    /**
     * Match a given url and method against the registered routes.
     *
     * @param {string} url
     * @param {string} method
     * @param {string} when
     * @returns {Array}
     */
    var match = function(url, method, when) {
      var matchedRoutes = [];

      for (var i = 0; i < routes.length; i++) {
        if (routes[i].matches(url, method, when)) {
          matchedRoutes.push(routes[i]);

          if (Tectonic.Pjax.Config.get('matchBehaviour') == 'single') {
            break;
          }
        }
      }

      return matchedRoutes;
    };

    /**
     * Resets the routes array.
     *
     * @return void
     */
    var clear = function() {
      routes = [];
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
      clear: clear,
      get: get,
      post: post,
      put: put,
      del: del, // alias for the delete
      "delete": del,
      match: match,

      getRoutes: getRoutes
    };
  })();
})();
