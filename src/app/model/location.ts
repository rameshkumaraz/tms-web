import { BaseModel } from './baseModel';

export class Location extends BaseModel{
    name:string;

    address:string;

    desc:string;

    merchant: number;
}
