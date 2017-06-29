var TestPage = require('../pageObjects/autofocusTestPage');
var ignoreBrowsers = require('../testFramework/ignoreBrowsers');

describe('Focus', function() {
  var page = null;
  beforeEach(function() {
    page = new TestPage();
    page.open('testPages/autoFocus.html');
  });

  it('should not focus the elements it uses', function(done) {
    // SafariWebDriver interactions are not implemented, cannot sendKeys to page
    // https://code.google.com/p/selenium/issues/detail?id=4136
    ignoreBrowsers(['safari'], done, function(done) {
      page.sendKeys('ABC');

      expect(page.getText1()).toEqual('ABC');
      expect(page.getText2()).toEqual('');
      done();
    });
  });
}); // End: Focus