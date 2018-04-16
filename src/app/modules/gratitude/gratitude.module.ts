import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GratitudeRoutingModule } from './gratitude-routing.module';
import { GratitudeService } from './gratitude.service';
import { MaterialModule } from '../../shared/modules/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { PipesModule } from '../../shared/modules/pipes.module';
import { GroupbyPipe } from '../../shared/pipes/groupby.pipe';

import { NewGratitudesComponent, DeleteGratitudeDialogComponent } from './new-gratitudes/new-gratitudes.component';
import { ArchiveComponent } from './archive/archive.component';

@NgModule({
  imports: [
    CommonModule,
    GratitudeRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    OrderModule,
    PipesModule
  ],
  declarations: [NewGratitudesComponent, DeleteGratitudeDialogComponent, ArchiveComponent],
  providers: [GratitudeService],
  entryComponents: [DeleteGratitudeDialogComponent]
})
export class GratitudeModule { }
