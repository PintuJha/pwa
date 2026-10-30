import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyFormatter',
    standalone: true
})
export class CurrencyFormatterPipe implements PipeTransform {

    transform(value: number | string, currencyType: string = 'INR'): string {
        if (value == null || value === '') return '';

        // Convert to number safely
        const numberValue = typeof value === 'string' ? Number(value) : value;

        if (isNaN(numberValue)) return String(value);

        let locale = 'en-IN'; // Indian number grouping
        switch (currencyType) {
            case 'USD':
                locale = 'en-US';
                break;
            case 'EUR':
                locale = 'en-GB';
                break;
            case 'INR':
            default:
                locale = 'en-IN';
                break;
        }

        // ✅ Always show EXACTLY 2 decimal places
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numberValue);
    }

    // Static usage
    static format(value: number | string, currencyType: string = 'INR'): string {
        const pipe = new CurrencyFormatterPipe();
        return pipe.transform(value, currencyType);
    }
}
