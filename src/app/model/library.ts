import { BaseModel } from './baseModel';

export class Library extends BaseModel{

    name:string;

    type:string;

    libVersion:string;

    libBaseVersion:string;

    desc:string;

    postAction:number;

    postActionDelay:number;

    appId: number;
}
