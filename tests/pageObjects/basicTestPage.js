module.exports = function BasicTestPage() {
  var patternTextBox = null;
  var textBox = null;
  var setPatternButton = null;

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

      patternTextBox = element(by.id('pattern'));
      textBox = element(by.id('textbox'));
      setPatternButton = element(by.id('btnSetPattern'));
    },

    setPattern: function(pattern) {
      setText(patternTextBox, pattern);
      return setPatternButton.click();
    },

    setText: function(text) {
      return setText(textBox, text);
    },

    getText: function() {
      return textBox.getAttribute('value');
    },

    navigateInAppTo: function(testName) {
      return element(by.css('a[href*="' + testName + '"]')).click();
    }
  }
};