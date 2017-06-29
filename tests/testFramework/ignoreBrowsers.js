module.exports = function(browserNamesToIgnore, testDoneFn, testImplementationFn) {
  browser.getCapabilities()
    .then(function(capabilities) {
      var browserName = capabilities.get('browserName');
      var shouldTest = browserNamesToIgnore.indexOf(browserName) === -1;

      if (shouldTest) {
        testImplementationFn(testDoneFn);
      } else {
        testDoneFn();
      }
    });
};