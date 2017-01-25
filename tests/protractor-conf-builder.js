module.exports = {
  getDefaults: getConfigurationDefaults,
  getCapability: getCapability
};

var env = {};

function getConfigurationDefaults() {
  return {
    specs: ['specs/*.js'],
    baseUrl: 'http://localhost:9001/angular-2.x/',
    jasmineNodeOpts: {
      showColors: true,
      isVerbose: true,
      realtimeFailure: true,
      includeStackTrace: true,
      defaultTimeoutInterval: 30000
    }
  };
}

function getCapability(options) {
  var capability = extend(defaultsForCapability, options);

  var nameParts = [];
  nameParts.push('a-pattern-restrict build');
  nameParts.push(process.env.TRAVIS_BUILD_NUMBER);
  nameParts.push(options.testExtraDescriptor);
  nameParts.push(options.browserName);
  nameParts.push(options.version);
  
  capability.name =  nameParts.join(' ').trim();
  return capability;
}

/* private to this module */

function copyOwnProperties(dst, src) {
  for (var prop in src) {
    if (src.hasOwnProperty(prop)) {
      dst[prop] = src[prop];
    }
  }
}

function extend(baseObject, newProperties) {
  var extendedObject = {};
  copyOwnProperties(extendedObject, baseObject);
  copyOwnProperties(extendedObject, newProperties);
  return extendedObject;
}

var defaultsForCapability = {
  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  build: process.env.TRAVIS_BUILD_NUMBER,
  shardTestFiles: false,
  maxInstances: 5,
  seleniumVersion: '2.48.2'
};