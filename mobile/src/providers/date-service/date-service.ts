import { Injectable } from '@angular/core';

@Injectable()
export class DateServiceProvider {

  constructor() {
  }

  getTranslate(locale:string = null) {
    if (locale == 'es') {
      return {
        'days_short_name': ['dom', 'lun', 'mar', 'mier', 'jue', 'vier', 'sab'],
        'days_name': ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
        'month_name': ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio,', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        'month_name_short': ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
      };
    }
    else {
      return {
        'days_short_name': ['sun', 'mon', 'tus', 'wed', 'thur', 'fri', 'sat'],
        'days_name': ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
        'month_name': ['january', 'febrary', 'march', 'april', 'may', 'june', 'july,', 'august', 'september', 'october', 'november', 'december'],
        'month_name_short': ['jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'aug', 'sept', 'oct', 'nov', 'dec']
      };
    }
  }

}
