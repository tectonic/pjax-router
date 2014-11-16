describe('Config spec', function() {
  var utility = Tectonic.Pjax.Utility;

  it('should determine the method to be get if provided as part of the xhr', function() {
    expect(utility.determineHttpVerb({method: 'get'})).toEqual('get');
  });

  it('should determine the method to be delete if provided as part of the form data', function() {
    expect(utility.determineHttpVerb({method: 'get', formdata: {_method: 'delete'}})).toEqual('delete');
  });

  it('should lowercase the method', function() {
    expect(utility.determineHttpVerb({method: 'POST'})).toEqual('post');
  });
});
