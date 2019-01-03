import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputLeverageComponent } from './components/input-leverage/input-leverage.component';
import { InputQuantityComponent } from './components/input-quantity/input-quantity.component';
import { InputCostComponent } from './components/input-cost/input-cost.component';
import { InfoPanelComponent } from './components/info-panel/info-panel.component';
import { ConfirmPanelComponent } from './components/confirm-panel/confirm-panel.component';
import { FormsModule } from '@angular/forms';
import { SucceedPageComponent } from './pages/succeed-page/succeed-page.component';
import { FailPageComponent } from './pages/fail-page/fail-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

@NgModule({
  declarations: [
    AppComponent,
    InputLeverageComponent,
    InputQuantityComponent,
    InputCostComponent,
    InfoPanelComponent,
    ConfirmPanelComponent,

    MainPageComponent,
    SucceedPageComponent,
    FailPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
