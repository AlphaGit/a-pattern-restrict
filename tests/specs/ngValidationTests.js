var TestPage = require('../pageObjects/validationTestPage');

describe('Focus', function() {
  var page = null;

  beforeEach(function() {
    page = new TestPage();
    page.open('testPages/');
    page.navigateInAppTo('/ngValidation');
  });

  // pending: for some reason, the valid state is not restored
  xit('should leave input always in a valid state', function() {
    //valid input
    page.setText('abc');
    expect(page.getValidStatusPromise()).toBe("true");

    //invalid input
    page.setText('def');
    expect(page.getValidStatusPromise()).toBe("true");
  });
}); // End: Focus