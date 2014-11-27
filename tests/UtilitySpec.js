describe('Config spec', function() {
  var utility = Pjax.Utility;
  var xhr = {};

  it('should determine the method to be get if provided as part of the xhr', function() {
    var options = {url: 'http://someurl.com/', type: 'get'};
    expect(utility.determineHttpVerb(xhr, options)).toEqual('get');
  });

  it('should determine the method to be delete if provided as part of the form data', function() {
    var options = {url: 'http://someurl.com/', type: 'get', data: {_method: 'delete'}};
    expect(utility.determineHttpVerb(xhr, options)).toEqual('delete');
  });

  it('should lowercase the method', function() {
    var options = {url: 'http://someurl.com/', type: 'POST'};
    expect(utility.determineHttpVerb(xhr, options)).toEqual('post');
  });
});
