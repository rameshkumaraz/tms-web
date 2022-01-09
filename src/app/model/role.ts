import { BaseModel } from "./base.model";
import { Policy } from "./policy";

export class Role extends BaseModel{

    name:string;

    desc:string;

    canEdit: boolean;

    policies: Policy[];
}