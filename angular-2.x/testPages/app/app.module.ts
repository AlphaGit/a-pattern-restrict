import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component';

import { AutoFocusComponent } from './autofocus/autofocus.component';
import { HtmlPatternComponent } from './htmlPattern/htmlPattern.component';
import { ImeInputComponent } from './imeInput/imeInput.component';
import { InputTypeNumberComponent } from './inputTypeNumber/inputTypeNumber.component';

import { APatternRestrict } from './../../src/a-pattern-restrict.js';

const appRoutes: Routes = [
  { path: 'autofocus', component: AutoFocusComponent },
  { path: 'htmlPattern', component: HtmlPatternComponent },
  { path: 'imeInput', component: ImeInputComponent },
  { path: 'inputTypeNumber', component: InputTypeNumberComponent }
];

@NgModule({
  imports:      [ BrowserModule, FormsModule, RouterModule.forRoot(appRoutes) ],
  declarations: [ AppComponent,

                  // Directive
                  APatternRestrict,

                  // Test components
                  AutoFocusComponent,
                  HtmlPatternComponent,
                  ImeInputComponent,
                  InputTypeNumberComponent
                ],
  bootstrap:    [ AppComponent ],
  exports:      [ RouterModule ]
})
export class AppModule { }
