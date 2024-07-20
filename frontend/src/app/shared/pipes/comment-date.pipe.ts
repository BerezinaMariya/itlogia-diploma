import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commentDate'
})
export class CommentDatePipe implements PipeTransform {

  transform(value: string): string {
    const date = new Date(value);
    const localeDate = date.toLocaleString('ru-Ru', { timeZone: 'UTC' });

    return localeDate.replace(/,/, '').slice(0, -3);
  }

}
