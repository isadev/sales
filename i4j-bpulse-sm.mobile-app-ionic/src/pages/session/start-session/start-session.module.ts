import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartSessionPage } from './start-session';

@NgModule({
  declarations: [
    StartSessionPage,
  ],
  imports: [
    IonicPageModule.forChild(StartSessionPage),
  ],
  providers:[
  ],
})
export class StartSessionPageModule {}
