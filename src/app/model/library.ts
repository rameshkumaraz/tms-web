import { BaseModel } from './baseModel';

export class library extends BaseModel{

    name:string;

    type:string;

    libVersion:string;

    libBaseVersion:string;

    desc:string;

    postAction:number;

    postActionDelay:number;

    appId: number;
}
