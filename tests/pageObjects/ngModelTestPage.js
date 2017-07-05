module.exports = function NgModelTestPage() {
  var textBox = null;
  var modelValue = null;

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

      textBox = element(by.id('textbox'));
      modelValue = element(by.id('modelValue'));
    },

    setText: function(text) {
      return setText(textBox, text);
    },

    getText: function() {
      return textBox.getAttribute('value');
    },

    getModelValue: function() {
      return modelValue.getAttribute('innerHTML');
    },

    navigateInAppTo: function(testName) {
      return element(by.css('a[href*="' + testName + '"]')).click();
    }
  }
};