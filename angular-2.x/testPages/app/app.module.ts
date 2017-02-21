import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent }  from './app.component';

import { APatternRestrict } from './../../src/a-pattern-restrict.js';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, APatternRestrict ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
