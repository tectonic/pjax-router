/**
 * Setup the module namespace and name. In this case, Tectonic.Pjax;
 *
 * @type object
 */
var Pjax = Pjax || {};

(function() {
  Pjax.Config = (function() {
    var config = {
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
      matchBehaviour: 'single'
    };

    /**
     * Some configuration may have some special requirements and/or validation for their values. This object
     * defines those special methods which will be called by Config.set().
     *
     * @type {object}
     */
    var setMethods = {
      /**
       * Sets the match behaviour for the router.
       *
       * @param {string} behaviour
       */
      matchBehaviour: function(behaviour) {
        if (behaviour != 'single' && behaviour != 'all') {
          throw new Error('Invalid value for router match behaviour. Available options are: single, all.');
        }

        config.matchBehaviour = behaviour;
      }
    };

    /**
     * Returns a single configuration setting.
     *
     * @param {string} setting
     * @returns {*}
     */
    var getConfig = function(setting) {
      return config[setting];
    };

    /**
     * Define or replace a given configuration setting value.
     *
     * @param {string} setting
     * @param {*} value
     */
    var setConfig = function(setting, value) {
      if (setMethods[setting]) {
        setMethods[setting](value);
      }
      else {
        if (!config[setting]) {
          throw new Error('Setting ['+setting+'] is not configurable.');
        }
        config[setting] = value;
      }
    };

    return {
      get: getConfig,
      set: setConfig
    };
  })();
})();

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

(function() {
  /**
   * The Request class neatly bundles up the information that was provided as part of the request
   * into an object that can be used to query for information.
   *
   * @module Pjax.Request
   * @type {class}
   */
  Pjax.Request = function(xhr, options) {
    /**
     * The original XHR object.
     *
     * @var {xhr}
     */
    this.xhr = xhr;

    /**
     * The original options object as provided by jquery-pjax.
     *
     * @var {object}
     */
    this.options = options;

    /**
     * The headers that were sent as part of the request.
     *
     * @var {object
     */
    this.headers = xhr.headers;
    this.data = options.data;
    this.method = Pjax.Utility.determineHttpVerb(xhr, options);
    this.url = options.url;
  };
})();

(function() {
  /**
   * The Response class stores the information that was returned via the response, including all headers,
   * the content, and formats the content if necessary (such as converting a json-encoded string into a
   * JSON object). It also provides some methods for querying the response. It also contains a reference
   * to the original request made to the server.
   *
   * @module Pjax.Response
   * @param {object} xhr
   * @param {Pjax.Request} request
   * @type {class}
   */
  Pjax.Response = function(xhr, request) {
    /**
     * Required for nested anonymous functions.
     *
     * @type {Pjax.Response}
     */
    var that = this;

    /**
     * The original XHR object.
     *
     * @var {xhr}
     */
    this.xhr = xhr;

    /**
     * The headers that were sent as part of the request.
     *
     * @var {object
     */
    this.headers = xhr.headers;

    /**
     * The original Request object.
     *
     * @type {Pjax.Request}
     */
    this.request = request;

    /**
     * The content that was part of the response. This could be a string in the case of
     * an HTML or XML response, or an object if the response was a JSON-encoded string.
     */
    this.content = this.isJSON() ? JSON.decode(xhr.response) : xhr.response;

    /**
     * Determines whether or not the response was of a JSON variety.
     *
     * @returns {boolean}
     */
    this.isJSON = function() {
      return xhr.response == 'json';
    };

    /**
     * Determines whether or not the response was an HTML response.
     *
     * @returns {boolean}
     */
    this.isHTML = function() {
      return !this.isJSON();
    };
  };
})();

(function() {
  /**
   * Create a new Route object, with the pattern method and callback handler defined.
   *
   * @module Pjax.Route
   * @param string pattern
   * @param string method
   * @param callback handler
   * @constructor
   */
  Pjax.Route = function(pattern, method, handler, options) {
    if (typeof pattern !== 'string') {
      throw new Error('You must provide the pattern argument as a string when registering a new Route object.');
    }
    if (typeof method !== 'string') {
      throw new Error('You must provide the method argument as a string when registering a new Route object.');
    }
    if (typeof handler !== 'function') {
      throw new Error('You must provide the handler argument as a function callback when registering a new Route object.');
    }

    options = options || {when: 'after'};

    /**
     * Converts a given pattern into a regular expression which can be used
     * for matching.
     *
     * @param string pattern
     * @return RegExp
     */
    var regexify = function(pattern) {
      var replacedPattern = pattern
        .replace(/:any/gi, '(.*)')
        .replace(/:id/gi, '([0-9]+)')
        .replace(/:alphanum/gi, '([a-z0-9\\-]+)')
        .replace(/:alpha/gi, '([a-z\\-]+)')
        .replace(/:(?=\/)+/gi, '([^/]+)');

      var fullPattern = replacedPattern+'\\/?$';

      return new RegExp(fullPattern);
    };

    /**
     * Match a given url and method against the registered routes.
     *
     * @param string url
     * @param string method
     * @returns false if no route matches, or the Route object if it passes.
     */
    var matches = function(url, method, when) {
      when = when || 'after';

      if (
        route.method == method &&
        route.options &&
        route.options.when == when
      ) {
        return route.regex.test(url);
      }

      return false;
    };

    // Our private properties
    var regex = regexify(pattern);

    // Return the object developers can work with
    var route = {
      pattern: pattern,
      regex: regex,
      method: method,
      handler: handler,
      options: options,

      matches: matches
    };

    return route;
  };
})();
(function() {
  /**
   * The router class manages the registration of various front-end routes.
   *
   * @module Pjax.Router
   */
  Pjax.Router = (function(){
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
     * @uses Pjax.Route
     */
    var add = function(pattern, method, handler, options) {
      routes.push(Pjax.Route(pattern, method, handler, options));
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

          if (Pjax.Config.get('matchBehaviour') == 'single') {
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

(function() {
  /**
   * Provides some utility methods for the Pjax library.
   *
   * @module Pjax.Utility
   */
  Pjax.Utility = (function() {
    /**
     * There are two ways in which a method can be derived. Because browsers don't fully support all the HTTP
     * verbs, and the fact that frameworks work around this by providing a _method property as part of form
     * submissions, we will look first for that _method property in the XHR post data. If it exists, we will
     * use that as the method. This helps to support requests like PUT/PATCH/DELETE.etc.
     *
     * @param {object} xhr
     */
    var determineHttpVerb = function(xhr, options) {
      var method = options.type;

      if (options.data && options.data._method) {
        method = options.data._method;
      }

      return method.toLowerCase();
    };

    return {
      determineHttpVerb: determineHttpVerb
    };
  })();
})();
