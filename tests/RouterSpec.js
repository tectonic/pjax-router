describe('Router spec', function() {
  var router = Pjax.Router;
  var callback = function() {};

  beforeEach(function() {
    router.clear();
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

    expect(routes.length).toBe(1);
    expect(routes[0].pattern).toEqual('cubs');
    expect(routes[0].method).toEqual('post');
  });

  it('should register put routes', function() {
    router.put('dogs', callback);

    var routes = router.getRoutes();

    expect(routes.length).toBe(1);
    expect(routes[0].pattern).toEqual('dogs');
    expect(routes[0].method).toEqual('put');
  });

  it('should register delete routes', function() {
    router.delete('cats', callback);

    var routes = router.getRoutes();

    expect(routes.length).toBe(1);
    expect(routes[0].pattern).toEqual('cats');
    expect(routes[0].method).toEqual('delete');
  });

  it('should match based on pattern requirements', function() {
    router.get('users', callback);
    router.post('cubs', callback);
    router.put('dogs', callback);
    router.delete('cats', callback);

    expect(router.match('users', 'get').length).toBe(1);
    expect(router.match('cubs', 'post').length).toBe(1);
    expect(router.match('dogs', 'put').length).toBe(1);
    expect(router.match('cats', 'delete').length).toBe(1);
  });

  it('should return an empty array when no matches are found', function() {
    router.delete('cats', callback);

    expect(router.match('ljsdfljsdf', 'get').length).toBe(0);
  });
});
