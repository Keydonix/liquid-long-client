import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SucceedPageComponent } from './pages/succeed-page/succeed-page.component';
import { FailPageComponent } from './pages/fail-page/fail-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'succeed', component: SucceedPageComponent},
  {path: 'fail', component: FailPageComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
