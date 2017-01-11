module.exports = function(browserNames, testCallback) {
  browser.getCapabilities()
    .then(function(capabilities) {
      var browserName = capabilities.get('browserName');
      var shouldTest = browserNames.indexOf(browserName) === -1;

      return shouldTest
        ? testCallback(it)
        : testCallback(xit);
    });
};