module.exports = function AutoFocusTestPage() {
  var textBox1 = null;
  var textBox2 = null;

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
      textBox2 = element(by.id('textbox2'));
    },

    sendKeys: function(text) {
      return browser.actions().sendKeys(text).perform();
    },

    getText1: function() {
      return textBox1.getAttribute('value');
    },

    getText2: function() {
      return textBox2.getAttribute('value');
    }
  }
};