describe('Config spec', function() {
  var config = Pjax.Config;

  it('should throw an exception when match behaviour is set to an invalid value', function() {
    expect(function(){config.set('matchBehaviour', 'gawd')}).toThrow(new Error('Invalid value for router match behaviour. Available options are: single, all.'));
    expect(function(){config.set('matchBehaviour', 'single')}).not.toThrow();
    expect(function(){config.set('matchBehaviour', 'all')}).not.toThrow();
  });

  it('should return the values that were previously set', function() {
    expect(config.get('matchBehaviour')).toEqual('all');
  });

  it('should throw an error when trying to set a configuration setting that does not exist', function() {
    expect(function(){config.set('invalid', 'value')}).toThrow(new Error('Setting [invalid] is not configurable.'));
  });
});
