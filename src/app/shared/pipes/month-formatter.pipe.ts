import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'monthFormat' })
export class MonthFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const [year, month] = value.split('-');

    const months = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ];

    return `${year}-${months[+month - 1]}`;
  }
}