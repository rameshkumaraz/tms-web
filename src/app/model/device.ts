import { BaseModel } from './base.model';

export class Device extends BaseModel{
    serial:string;

    name:string;

    model:number;

    location: number;
}
