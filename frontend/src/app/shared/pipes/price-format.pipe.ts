import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat'
})
export class PriceFormatPipe implements PipeTransform {
  transform(value: number): string {
    return value.toString().replace(/(\d)(?=(\d{3})+([\D]|$))/g, '$1 ');
  }

}
