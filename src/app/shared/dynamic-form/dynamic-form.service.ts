import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../core/base.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService extends BaseService{

  constructor(private client: HttpClient,
    @Inject('module') private module: string) {
    super(client, module);
  }

  // abstract getAll();

  // abstract getById(id: number);

  // abstract create(dto: any);

  // abstract update(dto: any);

  // abstract delete(id: number);

}
