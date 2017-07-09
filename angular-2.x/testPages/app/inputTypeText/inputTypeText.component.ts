import { Component } from '@angular/core';

@Component({
  selector: 'test-inputTypeText',
  templateUrl: 'app/inputTypeText/inputTypeText.component.html',
})
export class InputTypeTextComponent {
  private _restrictedPattern: string;
  private _patternToTest: string;

  get restrictedPattern() {
    return this._restrictedPattern;
  }

  set patternToTest(value: string) {
    this._patternToTest = value;
  }

  setPattern() {
    this._restrictedPattern = this._patternToTest;
  }
};
