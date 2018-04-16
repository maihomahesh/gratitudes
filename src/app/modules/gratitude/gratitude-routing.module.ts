import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewGratitudesComponent } from './new-gratitudes/new-gratitudes.component';
import { ArchiveComponent } from './archive/archive.component';
import { PageNotFoundComponent } from '../../shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'new-gratitudes', component: NewGratitudesComponent },
  { path: 'archive', component: ArchiveComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GratitudeRoutingModule { }
