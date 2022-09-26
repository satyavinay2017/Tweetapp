import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): unknown {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 60)
        return 'Just now';
      const intervals : any = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hr: 3600,
        min: 60,
        sec: 1
      };
      let counter;
      for (const i of Object.keys(intervals)) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          if (counter === 1) {
            return counter + ' ' + i + ' ago'; // singular (1 day ago)
          } else {
            return counter + ' ' + i + 's ago'; // plural (2 days ago)
          }
      }
    }
    return value;
  }
}
