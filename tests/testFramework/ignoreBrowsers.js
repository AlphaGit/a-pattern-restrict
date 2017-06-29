module.exports = function(browserNamesToIgnore, testCallback) {
  browser.getCapabilities()
    .then(function(capabilities) {
      var browserName = capabilities.get('browserName');
      var shouldTest = browserNamesToIgnore.indexOf(browserName) === -1;

      return shouldTest
        ? testCallback(it)
        : testCallback(xit);
    });
};