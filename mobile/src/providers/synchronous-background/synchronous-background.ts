import { Injectable } from '@angular/core';
import { App, NavController, Platform } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';

@Injectable()
export class SynchronousBackgroundProvider {
  constructor(
    private app: App,
    private platform: Platform,
    private backgroundMode: BackgroundMode,
  ) { }

  public configure() {
    // a workaround for overrideBackButton, as the method from backgroundMode doesn't work
    this.platform.registerBackButtonAction(async () => {
      if (!this.getNavController().canGoBack()) {
        this.backgroundMode.moveToBackground();        
      }
    });

    this.backgroundMode.on('activate').subscribe(() => {
      console.log('moving to background');
    });

    this.backgroundMode.setDefaults({ silent: true });
    this.backgroundMode.enable();
  }

  private getNavController(): NavController {
    return this.app.getRootNav();
  }
}

