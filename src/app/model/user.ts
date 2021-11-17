import { BaseModel } from './baseModel';
import { Role } from './role';

export class User extends BaseModel{

    firstName: string;

    lastName: string;

    email: string;

    password: string;

    canEdit: boolean;

    merchant: number;

    role: Role;

    lastLogin: Date;
}