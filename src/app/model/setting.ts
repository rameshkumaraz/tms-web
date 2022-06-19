import { BaseModel } from './base.model';
import { Merchant } from './merchant';
import { Role } from './role';

export class Setting extends BaseModel{

    key: string;

    value: string;

}