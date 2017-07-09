module.exports = function ValidationTestPage() {
  var textBox1 = null;
  var validStatusElement = null;

  function setText(textElement, text) {
    // .clear().sendKeys() will POST value="" and POST value=text
    // a workaround to this is Ctrl+A + text (will overwrite it), but
    // OSX does not support the COMMAND key emulation, so it doesn't work
    // See https://github.com/angular/protractor/issues/690
    return textElement.clear().sendKeys(text);
  }

  return {
    open: function(url) {
      browser.get(url);

      textBox1 = element(by.id('textbox1'));
      validStatusElement = element(by.id('ngValid'));
    },

    setText: function(text) {
      return setText(textBox1, text);
    },

    getText: function() {
      return textBox1.getAttribute('value');
    },

    getValidStatusPromise: function() {
      return validStatusElement.getText();
    },

    navigateInAppTo: function(testName) {
      return element(by.css('a[href*="' + testName + '"]')).click();
    }
  }
};