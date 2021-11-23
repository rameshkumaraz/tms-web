import { BaseModel } from './baseModel';
import { MerchantContact } from './merchant-contact';

export class Merchant extends BaseModel{
    name:string;

    address1:string;

    address2:string;

    city:string;

    state:string;

    country:string;

    areaCode:string;

    email:string;

    phone:string;

    website:string;

    contacts:Array<MerchantContact>;
}
