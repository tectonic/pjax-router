(function() {
  Pjax.Config = (function() {
    var config = {
      /**
       * It's possible for the router to work in one of two ways. Either:
       *
       * 1. It will search for a matched route and then immediately exit matching or
       * 2. It will run all matched callbacks for a given route.
       *
       * This is defined by setting the below property to 'single' or 'all'. The
       * default behaviour is for the router to stop as soon as it finds a match.
       *
       * @type {string}
       */
      matchBehaviour: 'single'
    };

    /**
     * Some configuration may have some special requirements and/or validation for their values. This object
     * defines those special methods which will be called by Config.set().
     *
     * @type {object}
     */
    var setMethods = {
      /**
       * Sets the match behaviour for the router.
       *
       * @param {string} behaviour
       */
      matchBehaviour: function(behaviour) {
        if (behaviour != 'single' && behaviour != 'all') {
          throw new Error('Invalid value for router match behaviour. Available options are: single, all.')
        }

        config.matchBehaviour = behaviour;
      }
    };

    /**
     * Returns a single configuration setting.
     *
     * @param {string} setting
     * @returns {*}
     */
    var getConfig = function(setting) {
      return config[setting];
    };

    /**
     * Define or replace a given configuration setting value.
     *
     * @param {string} setting
     * @param {*} value
     */
    var setConfig = function(setting, value) {
      if (setMethods[setting]) {
        setMethods[setting](value);
      }
      else {
        if (!config[setting]) {
          throw new Error('Setting ['+setting+'] is not configurable.');
        }
        config[setting] = value;
      }
    };

    return {
      get: getConfig,
      set: setConfig
    };
  })();
})();
