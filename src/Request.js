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
