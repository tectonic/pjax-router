describe('Router spec', function() {
  var router, callback;

  beforeEach(function() {
    router = Tectonic.Pjax.Router;
    callback = function() {};
  });

  it('should register get routes', function() {
    router.get('users', callback);

    var routes = router.getRoutes();

    expect(routes.length).toBe(1);
    expect(routes[0].pattern).toEqual('users');
    expect(routes[0].method).toEqual('get');
  });

  it('should register post routes', function() {
    router.post('cubs', callback);

    var routes = router.getRoutes();

    expect(routes.length).toBe(2);
    expect(routes[1].pattern).toEqual('cubs');
    expect(routes[1].method).toEqual('post');
  });

  it('should register put routes', function() {
    router.put('dogs', callback);

    var routes = router.getRoutes();

    expect(routes.length).toBe(3);
    expect(routes[2].pattern).toEqual('dogs');
    expect(routes[2].method).toEqual('put');
  });

  it('should register delete routes', function() {
    router.delete('cats', callback);

    var routes = router.getRoutes();

    expect(routes.length).toBe(4);
    expect(routes[3].pattern).toEqual('cats');
    expect(routes[3].method).toEqual('delete');
  });
});
