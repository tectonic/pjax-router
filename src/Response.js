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
});
