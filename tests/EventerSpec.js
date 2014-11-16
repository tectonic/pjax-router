describe('Eventer spec', function() {
  var router = Tectonic.Pjax.Router;

  beforeEach(function() {
    router.clear();
  });

  it('should call the appropriate route callbacks at the correct times', function() {
    var called = false;
    var callback = function() {
      called = true;
    };

    var options = {
      url: 'some-url',
      type: 'get'
    };

    router.get('some-url', callback);

    jQuery(document).trigger('pjax:complete', [{}, options]);

    expect(called).toBe(true);
  });
});
