
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../app.config';
import { BaseModel } from '../../model/base.model';

export abstract class BaseService {

    appSettings = AppSettings;
    apiUrl: string

    constructor(private http: HttpClient, module: string) {
        console.log(module + " : "+ this.appSettings.ENDPOINTS[module])
        this.apiUrl = this.appSettings.API_CONTEXT + this.appSettings.ENDPOINTS[module].endpoint;
        console.log("BaseService API Url...", this.apiUrl);
    }

    getAll() {
        return this.http.get(this.apiUrl);
    }

    get(id: number) {
        return this.http.get(this.apiUrl + "/" + id);
    }

    getByCustomUrl(apiUrl: string) {
        return this.http.get(apiUrl);
    }

    create(model: BaseModel) {
        const headers = { 'content-type': 'application/json' };

        return this.http.post(this.apiUrl, JSON.stringify(model), { 'headers': headers });
    }

    update(model: BaseModel) {

        const headers = { 'content-type': 'application/json' };

        return this.http.put(this.apiUrl, JSON.stringify(model), { 'headers': headers });
    }

    delete(id: number) {
        return this.http.delete(this.apiUrl + "/" + id);
    }

    updateStatus(id: number, model: BaseModel){
        console.log('Model.....', model);
        const headers = { 'content-type': 'application/json' };
        return this.http.patch(this.apiUrl, JSON.stringify(model), { 'headers': headers });
    }
}
