import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dictionaryValidatorPipe'
})

export class DictionaryValidatorPipe implements PipeTransform {

  transform(displayString: string): any {
    if(displayString != undefined){
      if (displayString.length > 0) {
        return displayString;
      }
      else {
        return "@Missing";
      }
    }else {
      return "@Missing";
    }
  }
}