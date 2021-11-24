import { BaseModel } from './baseModel';
import { Merchant } from './merchant';
import { Role } from './role';

export class User extends BaseModel{

    firstName: string;

    lastName: string;

    email: string;

    password: string;

    canEdit: boolean;

    merchant: Merchant;

    role: Role;

    lastLogin: Date;
}