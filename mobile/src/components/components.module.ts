import { NgModule } from '@angular/core';
import { MultistepProgressBarComponent } from './multistep-progress-bar/multistep-progress-bar';
import { PopOverMenuComponent } from './pop-over-menu/pop-over-menu';

@NgModule({
	declarations: [MultistepProgressBarComponent,
    PopOverMenuComponent],
	imports: [],
	exports: [MultistepProgressBarComponent,
    PopOverMenuComponent]
})
export class ComponentsModule {}
