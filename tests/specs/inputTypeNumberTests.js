var TestPage = require('../pageObjects/basicTestPage');
var ignoreBrowsers = require('../testFramework/ignoreBrowsers');

describe('Input type=number', function() {
  var page = null;

  beforeEach(function() {
    page = new TestPage();
    page.open('testPages/');
    page.navigateInAppTo('/inputTypeNumber');
  });

  it('should retrieve the valid numeric input as its value', function() {
    page.setPattern('^[123]*$');
    page.setText('123');

    expect(page.getText()).toEqual('123');
  });

  it('should not return a value if the input is non-numeric', function() {
    page.setPattern('^\\d*$');
    page.setText('ABC');
    expect(page.getText()).toEqual('');
  });

  it('should revert back to the last known good value', function(done) {
    ignoreBrowsers(['safari'], done, function(done) {
      page.setPattern('^[123]*$');
      page.setText('123');

      expect(page.getText()).toEqual('123');

      page.setText('123ABC');
      expect(page.getText()).toEqual('123');

      done();
    });
  });

  it('should revert back to last valid value, when input cannot be verified', function(done) {
    ignoreBrowsers(['internet explorer', 'chrome', 'safari'], done, function(done) {
      page.setPattern('^\\d*$');

      page.setText('123');
      expect(page.getText()).toEqual('123');
      page.setText('ABC');
      expect(page.getText()).toEqual('123');

      done();
    });
  });

  it('should leave an empty value on invalid numeric input', function(done) {
    ignoreBrowsers(['internet explorer', 'chrome', 'safari'], done, function(done) {
      page.setPattern('^\\d*$');

      page.setText('123');
      expect(page.getText()).toEqual('123');
      page.setText('ABC');
      expect(page.getText()).toEqual('123');

      done();
    });
  });

  it('should revert back to the previously known valid value if the input is numeric', function(done) {
    page.setPattern('^[123]*$');

    setTimeout(function() {
      page.setText('123');
      expect(page.getText()).toEqual('123');

      setTimeout(function() {
        page.setText('9999');
        expect(page.getText()).toEqual('123');

        setTimeout(function() {
          done();
        }, 5 * 1000);
      });
    }, 5 * 1000);

  });
}); // End: Input type=number