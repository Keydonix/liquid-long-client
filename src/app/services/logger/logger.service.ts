import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private name: String = 'ErrorLogService';

  constructor() { }

  log(value: any, ...rest: any[]) {
    if (!environment.production) {
      console.log(value, ...rest);
    }
  }

  warn(value: any, ...rest: any[]) {
    console.warn(value, ...rest);
  }

  error(error: Error | string, ...rest: any[]) {
    console.error(error, ...rest);
  }

}
