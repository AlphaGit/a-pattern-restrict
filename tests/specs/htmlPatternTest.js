var TestPage = require('../pageObjects/basicTestPage');

describe('HTML pattern attribute', function() {
  var page = null;
  beforeEach(function() {
    page = new TestPage();
    page.open('testPages/');
    page.navigateInAppTo('/htmlPattern');
  });

  it("should be read if ng-pattern-restrict does not have value", function() {
    page.setPattern('A');
    page.setText('A');
    page.setText('1');
    expect(page.getText()).toBe('A');
  });

  it("should be re-read if updated", function() {
    page.setPattern('A?');
    page.setText('A');

    page.setPattern('1?');
    page.setText('1');

    expect(page.getText()).toBe('1');
  });
}); // End: HTML pattern attribute