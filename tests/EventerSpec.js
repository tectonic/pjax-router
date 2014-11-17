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

    jQuery(document).trigger('pjax:end', [{}, options]);

    expect(called).toBe(true);
  });

  it('should call the appropriate route call back for before filters', function() {
    var called = false;
    var callback = function() {
      called = true;
    };

    var options = {
      url: 'some-url',
      type: 'get'
    };

    router.get('some-url', callback, {when: 'before'});

    jQuery(document).trigger('pjax:start', [{}, options]);

    expect(called).toBe(true);
  });
});
