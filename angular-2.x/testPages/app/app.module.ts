import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component';

import { HtmlPatternComponent } from './htmlPattern/htmlPattern.component';
import { ImeInputComponent } from './imeInput/imeInput.component';
import { InputTypeNumberComponent } from './inputTypeNumber/inputTypeNumber.component';
import { InputTypeTextComponent } from './inputTypeText/inputTypeText.component';

import { APatternRestrict } from './../../src/a-pattern-restrict.js';

const appRoutes: Routes = [
  { path: 'htmlPattern', component: HtmlPatternComponent },
  { path: 'imeInput', component: ImeInputComponent },
  { path: 'inputTypeNumber', component: InputTypeNumberComponent },
  { path: 'inputTypeText', component: InputTypeTextComponent }
];

@NgModule({
  imports:      [ BrowserModule, FormsModule, RouterModule.forRoot(appRoutes) ],
  declarations: [ AppComponent,

                  // Directive
                  APatternRestrict,

                  // Test components
                  HtmlPatternComponent,
                  ImeInputComponent,
                  InputTypeNumberComponent,
                  InputTypeTextComponent
                ],
  bootstrap:    [ AppComponent ],
  exports:      [ RouterModule ]
})
export class AppModule { }
