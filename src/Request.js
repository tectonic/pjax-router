(function() {
  /**
   * The Request class neatly bundles up the information that was provided as part of the request
   * into an object that can be used to query for information.
   *
   * @module Tectonic.Pjax.Request
   * @type {class}
   */
  Tectonic.Pjax.Request = function(xhr) {
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
    this.data = xhr.formdata;
    this.method = Tectonic.Pjax.Utility.determineHttpVerb(xhr);
    this.url = xhr.url;
  };
});
