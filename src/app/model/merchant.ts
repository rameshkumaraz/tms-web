import { BaseModel } from './baseModel';
import { Terminal } from './terminal';

export class Merchant extends BaseModel{
    name: string;
    accessPin: string;
    loginPin: string;
    primaryIp: string;
    primaryPort: string;
    secondaryIp: string;
    secondaryPort: string;
    terminals: Array<Terminal>;
}
