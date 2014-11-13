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
  Tectonic.Pjax.Route = function(pattern, method, handler, options) {
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