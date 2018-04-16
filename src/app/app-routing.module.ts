import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewGratitudesComponent } from './modules/gratitude/new-gratitudes/new-gratitudes.component';
import { ArchiveComponent } from './modules/gratitude/archive/archive.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: NewGratitudesComponent },
  // { path: 'new-gratitudes', component: NewGratitudesComponent },
  // { path: 'archive', component: ArchiveComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
