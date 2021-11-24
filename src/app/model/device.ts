import { BaseModel } from './baseModel';

export class location extends BaseModel{
    serial:string;

    name:string;

    model:number;

    timezone:string;

    locationId: number;
}
