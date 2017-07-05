import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component';

import { AutoFocusComponent } from './autofocus/autofocus.component';
import { HtmlPatternComponent } from './htmlPattern/htmlPattern.component';
import { ImeInputComponent } from './imeInput/imeInput.component';

import { APatternRestrict } from './../../src/a-pattern-restrict.js';

const appRoutes: Routes = [
  { path: 'autofocus', component: AutoFocusComponent },
  { path: 'htmlPattern', component: HtmlPatternComponent },
  { path: 'imeInput', component: ImeInputComponent }
];

@NgModule({
  imports:      [ BrowserModule, FormsModule, RouterModule.forRoot(appRoutes) ],
  declarations: [ AppComponent,

                  // Directive
                  APatternRestrict,

                  // Test components
                  AutoFocusComponent,
                  HtmlPatternComponent,
                  ImeInputComponent
                ],
  bootstrap:    [ AppComponent ],
  exports:      [ RouterModule ]
})
export class AppModule { }
