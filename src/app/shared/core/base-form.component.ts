import { Component} from '@angular/core';
import { BaseComponent } from './base.component';

@Component({
    template: ''
})
export abstract class BaseFormComponent extends BaseComponent{
    onPageLoad() {
        throw new Error('Method not implemented.');
    }
    create(content: any) {
        throw new Error('Method not implemented.');
    }
    view(id: number, content: any) {
        throw new Error('Method not implemented.');
    }
    edit(id: number, content: any) {
        throw new Error('Method not implemented.');
    }
    delete(id: number) {
        throw new Error('Method not implemented.');
    }
    updateStatus(id: number, status: number) {
        throw new Error('Method not implemented.');
    }
}
