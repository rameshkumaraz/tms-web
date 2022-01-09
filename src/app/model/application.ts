import { BaseModel } from './base.model';

export class Application extends BaseModel{

    name:string;

    type:string;

    appVersion:string;
    
    desc:string;

    merchant: number;
}
