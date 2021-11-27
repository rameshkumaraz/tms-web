import { BaseModel } from './baseModel';

export class Application extends BaseModel{

    name:string;

    type:string;

    appVersion:string;
    
    desc:string;
}
