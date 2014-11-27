describe('Route spec', function() {
  var callback = function() {};

  describe('route constructor', function() {
    it('should set the required public properties and methods', function() {
      var routeObject = Pjax.Route('some-url', 'get', callback);

      expect(routeObject.pattern).toEqual('some-url');
      expect(routeObject.regex).toEqual(/some-url/);
      expect(routeObject.method).toEqual('get');
      expect(routeObject.handler).toEqual(callback);
    });

    it('should match route objects based on the url and id provided', function() {
      var routeObject = Pjax.Route('users/:id', 'get', callback);

      expect(routeObject.matches('/users/76', 'get')).toBe(true);
      expect(routeObject.matches('/users/sdfsdf', 'get')).toBe(false);
    });

    it('should match route objects based on alphabetical characters only', function() {
      var routeObject = Pjax.Route('users/:alpha', 'get', callback);

      expect(routeObject.matches('/users/32', 'get')).toBe(false);
      expect(routeObject.matches('/users/asfasdf', 'get')).toBe(true);
      expect(routeObject.matches('/users/asfasdf-khjasdf', 'get')).toBe(true);
    });

    it('should match route objects based on alphanumberical charactersonly', function() {
      var routeObject = Pjax.Route('users/:alphanum', 'get', callback);

      expect(routeObject.matches('/users/15', 'get')).toBe(true);
      expect(routeObject.matches('/users/kjsdf', 'get')).toBe(true);
      expect(routeObject.matches('/users/as56-sfdj1', 'get')).toBe(true);
    });

    it('should match the following generic case', function() {
      var routeObject = Pjax.Route(':alpha/:id', 'get', callback);

      expect(routeObject.matches('/users/15', 'get')).toBe(true);
    });

    it('should match the following nested case', function() {
      var routeObject = Pjax.Route(':alpha/:id/users/:id/:alphanum', 'get', callback);

      expect(routeObject.matches('/lkjsdf/23/users/765/lksdf-ksdf874', 'get')).toBe(true);
      expect(routeObject.matches('/lkjsdf/23/users/sdfsdf/lksdf-ksdf874', 'get')).toBe(false);
    });

    it('should define default options if none are provided', function() {
      var routeObject = Pjax.Route('lkjsflkj', 'get', callback);

      expect(routeObject.options).toEqual({when: 'after'});
    });
  });
});
