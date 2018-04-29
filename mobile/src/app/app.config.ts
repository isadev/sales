import { InjectionToken } from '@angular/core';

export class Configuration {
    public apiBaseUrl: string;
    public googleApiKey: string;
    public uploadsFile: string
}

export const AppConfig: Configuration = {
    apiBaseUrl: 'http://192.168.80.230:8081/',
    googleApiKey: 'AIzaSyDGwcpMDZDiG1iR6S8p9IHZhx57m3P2kUw',
    uploadsFile: 'files/uploads/'
}

export const APP_CONFIG = new InjectionToken<any>('app.config');
