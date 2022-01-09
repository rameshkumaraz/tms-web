import { BaseModel } from './base.model';

export class Location extends BaseModel{
    name:string;

    address:string;

    desc:string;

    merchant: number;
}
