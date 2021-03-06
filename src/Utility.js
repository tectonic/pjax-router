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
