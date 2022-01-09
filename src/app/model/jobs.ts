import { BaseModel } from './base.model';

export class Job extends BaseModel{

    name:string;

    triggerType: string;
    
    jobType:string;
    
    desc:string;

    jobDate: Date;

    notifyType: string;

    app: number;
    
    library: number;

    location: number;

    device: number;
}