"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var DEBUG = true;
var showDebugInfo = console.debug;
var APatternRestrict = (function () {
    function APatternRestrict(el) {
        this.el = el;
        // approach from http://stackoverflow.com/q/36106350/147507
        this.ngModelChange = new core_1.EventEmitter();
        DEBUG && showDebugInfo("Initializing");
        this.oldValue = el.nativeElement.value;
        if (!this.oldValue)
            this.oldValue = '';
        DEBUG && showDebugInfo("Original value: " + this.oldValue);
        this.detectGetCaretPositionMethods();
        this.detectSetCaretPositionMethods();
    }
    Object.defineProperty(APatternRestrict.prototype, "pattern", {
        get: function () {
            return this._pattern;
        },
        set: function (value) {
            try {
                this.regex = new RegExp(value);
                this._pattern = value;
                DEBUG && showDebugInfo("Pattern binding changed to: " + this._pattern);
            }
            catch (e) {
                throw "Invalid RegEx string parsed for ngPatternRestrict: " + value;
            }
        },
        enumerable: true,
        configurable: true
    });
    APatternRestrict.prototype.genericEventHandler = function (evt) {
        //HACK Chrome returns an empty string as value if user inputs a non-numeric string into a number type input
        // and this may happen with other non-text inputs soon enough. As such, if getting the string only gives us an
        // empty string, we don't have the chance of validating it against a regex. All we can do is assume it's wrong,
        // since the browser is rejecting it either way.
        var iElement = this.el.nativeElement;
        var newValue = iElement.value;
        var inputValidity = iElement.validity;
        if (newValue === '' && iElement.type !== 'text' && inputValidity && inputValidity.badInput) {
            DEBUG && showDebugInfo("Value cannot be verified. Should be invalid. Reverting back to: " + this.oldValue);
            evt.preventDefault();
            this.revertToPreviousValue();
        }
        else if (newValue === "" && this.getValueLengthThroughSelection(this.el) !== 0) {
            DEBUG && showDebugInfo("Invalid input. Reverting back to: " + this.oldValue);
            evt.preventDefault();
            this.revertToPreviousValue();
        }
        else if (this.regex.test(newValue)) {
            DEBUG && showDebugInfo("New value passed validation against " + this.regex + ": " + newValue);
            this.updateCurrentValue(newValue);
        }
        else {
            DEBUG && showDebugInfo("New value did NOT pass validation against " + this.regex + ": " + newValue + ", reverting back to: " + this.oldValue);
            evt.preventDefault();
            this.revertToPreviousValue();
        }
    };
    APatternRestrict.prototype.notThrows = function (testFn, shouldReturnTruthy) {
        if (shouldReturnTruthy === void 0) { shouldReturnTruthy = false; }
        try {
            return testFn() || !shouldReturnTruthy;
        }
        catch (e) {
            return false;
        }
    };
    APatternRestrict.prototype.detectGetCaretPositionMethods = function () {
        var inputElement = this.el.nativeElement;
        // Chrome will throw on input.selectionStart of input type=number
        // See http://stackoverflow.com/a/21959157/147507
        var selectionStartTester = function (inputElement) { return inputElement.selectionStart; };
        if (this.notThrows(selectionStartTester)) {
            this.getCaretPosition = this.getCaretPositionWithInputSelectionStart;
        }
        else {
            // IE 9- will use document.selection
            // TODO support IE 11+ with document.getSelection()
            var documentSelectionTester = function () { return document.selection; };
            if (this.notThrows(documentSelectionTester, true)) {
                this.getCaretPosition = this.getCaretPositionWithDocumentSelection;
            }
            else {
                this.getCaretPosition = this.getCaretPositionWithWindowSelection;
            }
        }
    };
    APatternRestrict.prototype.detectSetCaretPositionMethods = function () {
        var input = this.el.nativeElement;
        if (typeof input.setSelectionRange === 'function') {
            this.setCaretPosition = this.setCaretPositionWithSetSelectionRange;
        }
        else if (typeof input.createTextRange === 'function') {
            this.setCaretPosition = this.setCaretPositionWithCreateTextRange;
        }
        else {
            this.setCaretPosition = this.setCaretPositionWithWindowSelection;
        }
    };
    APatternRestrict.prototype.setCaretPositionWithSetSelectionRange = function (position) {
        this.el.nativeElement.setSelectionRange(position, position);
    };
    APatternRestrict.prototype.setCaretPositionWithWindowSelection = function (position) {
        var textRange = this.el.nativeElement.createTextRange();
        textRange.collapse(true);
        textRange.moveEnd('character', position);
        textRange.moveStart('character', position);
        textRange.select();
    };
    APatternRestrict.prototype.setCaretPositionWithCreateTextRange = function (position) {
        var s = window.getSelection();
        var selectionLength;
        do {
            selectionLength = (String(s).length);
            s.modify('extend', 'backward', 'line');
        } while (selectionLength !== String(s).length);
        while (position--) {
            s.modify('move', 'forward', 'character');
        }
    };
    APatternRestrict.prototype.getCaretPositionWithInputSelectionStart = function () {
        return this.el.nativeElement.selectionStart;
    };
    APatternRestrict.prototype.getCaretPositionWithDocumentSelection = function () {
        // create a selection range from where we are to the beggining
        // and measure how much we moved
        var range = document.selection.createRange();
        range.moveStart('character', this.el.nativeElement.value.length);
        return range.text.length;
    };
    APatternRestrict.prototype.getCaretPositionWithWindowSelection = function () {
        var s = window.getSelection();
        var originalSelectionLength = String(s).length;
        var selectionLength;
        var didReachZero = false;
        var detectedCaretPosition;
        var restorePositionCounter;
        do {
            selectionLength = String(s).length;
            s.modify('extend', 'backward', 'character');
            // we're undoing a selection, and starting a new one towards the beggining of the string
            if (String(s).length === 0) {
                didReachZero = true;
            }
        } while (selectionLength !== String(s).length);
        detectedCaretPosition = didReachZero ? selectionLength : selectionLength - originalSelectionLength;
        s.collapseToStart();
        restorePositionCounter = detectedCaretPosition;
        while (restorePositionCounter-- > 0) {
            s.modify('move', 'forward', 'character');
        }
        while (originalSelectionLength-- > 0) {
            s.modify('extend', 'forward', 'character');
        }
        return detectedCaretPosition;
    };
    APatternRestrict.prototype.revertToPreviousValue = function () {
        this.el.nativeElement.value = this.oldValue;
        if (typeof (this.caretPosition) !== 'undefined') {
            this.setCaretPosition(this.caretPosition);
        }
        this.ngModelChange.emit(this.oldValue);
    };
    APatternRestrict.prototype.updateCurrentValue = function (newValue) {
        this.oldValue = newValue;
        this.caretPosition = this.getCaretPosition();
    };
    // HACK: Opera 12 won't give us a wrong validity status although the input is invalid
    // we can select the whole text and check the selection size
    // Congratulations to IE 11 for doing the same but not returning the selection.
    APatternRestrict.prototype.getValueLengthThroughSelection = function (input) {
        // only do this on opera, since it'll mess up the caret position
        // and break Firefox functionality
        if (!/Opera/i.test(navigator.userAgent)) {
            return 0;
        }
        input.nativeElement.focus();
        document.execCommand('selectAll');
        var focusNode = window.getSelection().focusNode;
        return (focusNode || {}).selectionStart || 0;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], APatternRestrict.prototype, "pattern", null);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], APatternRestrict.prototype, "ngModelChange", void 0);
    __decorate([
        core_1.HostListener('input', ['$event']),
        core_1.HostListener('keyup', ['$event']),
        core_1.HostListener('click', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Event]), 
        __metadata('design:returntype', void 0)
    ], APatternRestrict.prototype, "genericEventHandler", null);
    APatternRestrict = __decorate([
        core_1.Directive({
            selector: '[ngModel][a-pattern-restrict]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], APatternRestrict);
    return APatternRestrict;
}());
exports.APatternRestrict = APatternRestrict;
;
//# sourceMappingURL=a-pattern-restrict.js.map