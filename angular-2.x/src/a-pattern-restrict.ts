import { Directive, Input, Output, HostListener, ElementRef, EventEmitter } from '@angular/core';

const DEBUG = true;

let showDebugInfo = console.debug;

@Directive({
  selector: '[ngModel][a-pattern-restrict]'
})
export class APatternRestrict {
  private oldValue: string;
  private caretPosition: number;
  private _pattern: string;
  private regex: RegExp;
  private getCaretPosition: Function;
  private setCaretPosition: Function;

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) {
    if (DEBUG) { showDebugInfo('Initializing'); }
    this.oldValue = el.nativeElement.value;
    if (!this.oldValue) { this.oldValue = ''; }
    if (DEBUG) { showDebugInfo(`Original value: ${this.oldValue}`); }

    this.detectGetCaretPositionMethods();
    this.detectSetCaretPositionMethods();
  }

  get pattern() {
    return this._pattern;
  }

  @Input()
  set pattern(value: string) {
    try {
      this.regex = new RegExp(value);
      this._pattern = value;
      if (DEBUG) { showDebugInfo(`Pattern binding changed to: ${this._pattern}`); }
    } catch (e) {
      throw `Invalid RegEx string parsed for ngPatternRestrict: ${value}`;
    }
  }

  // approach from http://stackoverflow.com/q/36106350/147507

  @HostListener('input', ['$event'])
  @HostListener('keyup', ['$event'])
  @HostListener('click', ['$event'])
  genericEventHandler(evt: Event) {
      // HACK Chrome returns an empty string as value if user inputs a non-numeric string into a number type input
      // and this may happen with other non-text inputs soon enough. As such, if getting the string only gives us an
      // empty string, we don't have the chance of validating it against a regex. All we can do is assume it's wrong,
      // since the browser is rejecting it either way.

      let iElement = <HTMLInputElement>this.el.nativeElement;
      let newValue = iElement.value;
      let inputValidity = iElement.validity;

      if (newValue === '' && iElement.type !== 'text' && inputValidity && inputValidity.badInput) {
        if (DEBUG) { showDebugInfo(`Value cannot be verified. Should be invalid. Reverting back to: ${this.oldValue}`); }
        evt.preventDefault();
        this.revertToPreviousValue();
      } else if (newValue === '' && this.getValueLengthThroughSelection(<ElementRef>this.el) !== 0) {
        if (DEBUG) { showDebugInfo(`Invalid input. Reverting back to: ${this.oldValue}`); }
        evt.preventDefault();
        this.revertToPreviousValue();
      } else if (this.regex.test(newValue)) {
        if (DEBUG) { showDebugInfo(`New value passed validation against ${this.regex}: ${newValue}`); }
        this.updateCurrentValue(newValue);
      } else {
        if (DEBUG) {
          showDebugInfo(`New value did NOT pass validation against ${this.regex}: ${newValue}, reverting back to: ${this.oldValue}`);
        }
        evt.preventDefault();
        this.revertToPreviousValue();
      }
  }

  private notThrows(testFn: Function, shouldReturnTruthy = false): boolean {
    try {
      return testFn() || !shouldReturnTruthy;
    } catch (e) {
      return false;
    }
  }

  private detectGetCaretPositionMethods(): void {
    let inputElement = this.el.nativeElement;

    // Chrome will throw on input.selectionStart of input type=number
    // See http://stackoverflow.com/a/21959157/147507
    let selectionStartTester = function() { return inputElement.selectionStart; };
    if (this.notThrows(selectionStartTester)) {
      this.getCaretPosition = this.getCaretPositionWithInputSelectionStart;
    } else {
      // IE 9- will use document.selection
      // TODO support IE 11+ with document.getSelection()
      let documentSelectionTester = function() { return (<any>document).selection; };
      if (this.notThrows(documentSelectionTester, true)) {
        this.getCaretPosition = this.getCaretPositionWithDocumentSelection;
      } else {
        this.getCaretPosition = this.getCaretPositionWithWindowSelection;
      }
    }
  }

  private detectSetCaretPositionMethods(): void {
    let input = <HTMLInputElement>this.el.nativeElement;
    if (typeof input.setSelectionRange === 'function') {
      this.setCaretPosition = this.setCaretPositionWithSetSelectionRange;
    } else if (typeof (<any>input).createTextRange === 'function') {
      this.setCaretPosition = this.setCaretPositionWithCreateTextRange;
    } else {
      this.setCaretPosition = this.setCaretPositionWithWindowSelection;
    }
  }


  private setCaretPositionWithSetSelectionRange(position: number): void {
    (<HTMLInputElement>this.el.nativeElement).setSelectionRange(position, position);
  }

  private setCaretPositionWithWindowSelection(position: number): void {
    let textRange = this.el.nativeElement.createTextRange();
    textRange.collapse(true);
    textRange.moveEnd('character', position);
    textRange.moveStart('character', position);
    textRange.select();
  }

  private setCaretPositionWithCreateTextRange(position: number): void {
    let s = window.getSelection();
    let selectionLength: Number;

    do {
      selectionLength = (String(s).length);
      (<any>s).modify('extend', 'backward', 'line');
    } while (selectionLength !== String(s).length);

    while (position--) {
      (<any>s).modify('move', 'forward', 'character');
    }
  }

  private getCaretPositionWithInputSelectionStart(): number {
    return (<HTMLInputElement>this.el.nativeElement).selectionStart;
  }

  private getCaretPositionWithDocumentSelection(): number {
    // create a selection range from where we are to the beggining
    // and measure how much we moved
    let range = (<any>document).selection.createRange();
    range.moveStart('character', this.el.nativeElement.value.length);
    return range.text.length;
  }

  private getCaretPositionWithWindowSelection(): number {
    let s = window.getSelection();
    let originalSelectionLength = String(s).length;
    let selectionLength: number;
    let didReachZero = false;
    let detectedCaretPosition: number;
    let restorePositionCounter: number;

    do {
      selectionLength = String(s).length;
      (<any>s).modify('extend', 'backward', 'character');
      // we're undoing a selection, and starting a new one towards the beggining of the string
      if (String(s).length === 0) {
        didReachZero = true;
      }
    } while (selectionLength !== String(s).length);

    detectedCaretPosition = didReachZero ? selectionLength : selectionLength - originalSelectionLength;
    s.collapseToStart();

    restorePositionCounter = detectedCaretPosition;
    while (restorePositionCounter-- > 0) {
      (<any>s).modify('move', 'forward', 'character');
    }
    while (originalSelectionLength-- > 0) {
      (<any>s).modify('extend', 'forward', 'character');
    }

    return detectedCaretPosition;
  }

  private revertToPreviousValue(): void {
    this.el.nativeElement.value = this.oldValue;

    if (typeof(this.caretPosition) !== 'undefined') {
      this.setCaretPosition(this.caretPosition);
    }

    this.ngModelChange.emit(this.oldValue);
  }

  private updateCurrentValue(newValue: string): void {
    this.oldValue = newValue;
    this.caretPosition = this.getCaretPosition();
  }

  // HACK: Opera 12 won't give us a wrong validity status although the input is invalid
  // we can select the whole text and check the selection size
  // Congratulations to IE 11 for doing the same but not returning the selection.
  private getValueLengthThroughSelection(input: ElementRef): number {
    // only do this on opera, since it'll mess up the caret position
    // and break Firefox functionality
    if (!/Opera/i.test(navigator.userAgent)) {
      return 0;
    }

    input.nativeElement.focus();
    document.execCommand('selectAll');
    let focusNode = window.getSelection().focusNode;
    return (<any>(focusNode || {})).selectionStart || 0;
  }
};
