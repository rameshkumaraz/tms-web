import { BaseModel } from './base.model';
import { Merchant } from './merchant';
import { Role } from './role';

export class AdminUser extends BaseModel{

    firstName: string;

    lastName: string;

    email: string;

    dob: string;

    password: string;

    canEdit: boolean;

    role: Role;

    lastLogin: Date;
}