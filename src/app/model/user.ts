import { BaseModel } from './base.model';
import { Merchant } from './merchant';
import { Role } from './role';

export class User extends BaseModel{

    firstName: string;

    lastName: string;

    email: string;

    dob: string;

    password: string;

    canEdit: boolean;

    merchant: Merchant;

    role: Role;

    lastLogin: Date;
}