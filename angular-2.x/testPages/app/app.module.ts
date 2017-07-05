import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component';

import { AutoFocusComponent } from './autofocus/autofocus.component';
import { HtmlPatternComponent } from './htmlPattern/htmlPattern.component';

import { APatternRestrict } from './../../src/a-pattern-restrict.js';

const appRoutes: Routes = [
  { path: 'autofocus', component: AutoFocusComponent },
  { path: 'htmlPattern', component: HtmlPatternComponent }
];

@NgModule({
  imports:      [ BrowserModule, FormsModule, RouterModule.forRoot(appRoutes) ],
  declarations: [ AppComponent, APatternRestrict, AutoFocusComponent, HtmlPatternComponent ],
  bootstrap:    [ AppComponent ],
  exports:      [ RouterModule ]
})
export class AppModule { }
