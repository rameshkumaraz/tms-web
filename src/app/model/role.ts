import { BaseModel } from "./baseModel";
import { Policy } from "./policy";

export class Role extends BaseModel{

    name:string;

    desc:string;

    canEdit: boolean;

    policies: Policy[];
}