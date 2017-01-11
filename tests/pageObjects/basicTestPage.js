module.exports = function BasicTestPage() {
  var htmlPatternTextBox = null;
  var patternTextBox = null;
  var textBox = null;

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

      htmlPatternTextBox = element(by.id('htmlPattern'));
      patternTextBox = element(by.id('pattern'));
      textBox = element(by.id('textbox'));
    },

    setHtmlPattern: function(pattern) {
      return setText(htmlPatternTextBox, pattern);
    },

    setPattern: function(pattern) {
      return setText(patternTextBox, pattern);
    },

    setText: function(text) {
      return setText(textBox, text);
    },

    getText: function() {
      return textBox.getAttribute('value');
    }
  }
};