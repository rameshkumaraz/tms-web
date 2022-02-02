import { BaseModel } from './base.model';
import { Merchant } from '../model/merchant';
import { Application } from '../model/application';
import { Device } from '../model/device';

export class Parameter extends BaseModel{
    params:string;

    targetType: string;

    merchant: Merchant;

    app: Application;

    locations: Array<string>;

    devices: Array<string>;

    device: string;
}
