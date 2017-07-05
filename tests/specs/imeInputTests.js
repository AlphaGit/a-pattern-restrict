/*
var ngModelTestPage = require('../pageObjects/ngModelTestPage');

describe('IME Inputs', function() {
  var page = null;
  beforeEach(function() {
    page = new ngModelTestPage();
    page.open('testPages/imeInput.html');
  });

  it('should allow numerical input', function() {
    page.setText('123');

    expect(page.getText()).toEqual('123');
  });

  it('should keep the model synchronized with the text, valid input', function() {
    page.setText('123');

    expect(page.getModelValue()).toEqual('123');
  });

  it('should keep the model synchronized with the text, invalid input', function() {
    page.setText('123');

    expect(page.getModelValue()).toEqual('123');

    page.setText('a');

    expect(page.getModelValue()).toEqual('123');
  });

  it('should keep the model synchronized with the text, invalid unicode input', function() {
    page.setText('123');

    expect(page.getModelValue()).toEqual('123');

    page.setText('這就是非英語文本。');

    expect(page.getModelValue()).toEqual('123');
  });
}); // End: IME Inputs
*/