import { NgModule } from "@angular/core";
import { DictionaryValidatorPipe } from "./pipes/dictionary-validator.pipe";
import { MonthFormatPipe } from "./pipes/month-formatter.pipe";

@NgModule({
    imports: [],
    declarations: [DictionaryValidatorPipe,MonthFormatPipe],
    providers: [],

    exports: [DictionaryValidatorPipe,MonthFormatPipe]
})

export class SharedModule { }