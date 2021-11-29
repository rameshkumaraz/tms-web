import { BaseModel } from './baseModel';

export class Device extends BaseModel{
    serial:string;

    name:string;

    model:number;

    location: number;
}
