import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class DynamicFormService {

  constructor() {}

  abstract getAll();

  abstract getById(id: number);

  abstract create(dto: any);

  abstract update(dto: any);

  abstract delete(id: number);

}
