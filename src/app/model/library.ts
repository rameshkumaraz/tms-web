import { BaseModel } from './baseModel';

export class Library extends BaseModel{

    name:string;

    type:string;

    libVersion:string;

    libBaseVersion:string;

    desc:string;

    bundleName:string;

    bundleSize:string;

    postAction:number;

    postActionDelay:number;

    app: number;
}
