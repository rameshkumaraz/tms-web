import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../app.config';
import { AppService } from '../shared/service/app.service';
import { Job } from '../model/jobs';
import { BaseService } from '../shared/core/base.service';

@Injectable({
  providedIn: 'root'
})
export class JobService extends BaseService {

  constructor(private client: HttpClient,
    private appService: AppService) {
    super(client, 'job');
  }

  getByMerchant(id: number) {
    const apiUrl = AppSettings.API_CONTEXT + AppSettings.ENDPOINTS.job.endpoint +
      "/" + AppSettings.ENDPOINTS.job.path.merchant +
      "/" + id;
    return this.getByCustomUrl(apiUrl);
  }

  create(model: Job) {
    console.log("Merchant for create....", JSON.stringify(model));

    if (!model.location)
      delete model.location;
    if (!model.device)
      delete model.device;
    if (!model.library)
      delete model.library;
    if (!model.app)
      delete model.app;

    return super.create(model);
  }

  update(model: Job) {
    if (!model.location)
      delete model.location;
    if (!model.device)
      delete model.device;
    if (!model.library)
      delete model.library;
    if (!model.app)
      delete model.app;

    return super.update(model);
  }
}
