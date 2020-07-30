import { FieldValidation } from './field.validation';

export class FormField {
    name: string;
    label: string;
    desc: string;
    type: string;
    val: string;
    validation: FieldValidation;
    editable: boolean;
    width: string;
}
