import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsComponent }      from './components/records/records.component';
import { DashboardComponent }   from './components/dashboard/dashboard.component';
import { RecordDetailComponent }  from './components/record-detail/record-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/records', pathMatch: 'full' },
  { path: 'detail/:id', component: RecordDetailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'records', component: RecordsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
