import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { faArchive, faBars, faChartArea, faEdit, faEye, faFileDownload, faFileExport, faFileImport, faFilter, faHome, faIndustry, faLongArrowAltDown, faLongArrowAltUp, faMapMarkerAlt, faMobileAlt, faPlus, faSearch, faTachometerAlt, faTh, faTimes, faTimesCircle, faUserCog, faSearchPlus, faUserCircle, faCheckCircle, faBan } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { StatusEnum } from '../enum/status.enum';
import { ActionEnum } from '../enum/action.enum';
import { AppSettings } from '../../app.config';
import { JobsEnum } from '../enum/jobs.enum';
import { ComponentEnum } from '../enum/component.enum';
import { FormGroup } from '@angular/forms';
import { ModalService } from '../../shared/modal/modal.service';
import { AppInjector } from './app-injector';
import { AuthenticationService } from 'src/app/auth/services';
import compActionAccess from '../../../assets/config/component-action-access.json';

@Component({
    template: ''
})
export abstract class BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    @Output() modalClosed = new EventEmitter();

    authService: AuthenticationService;
    modalService: ModalService;

    static actionAccess = {};

    faBars = faBars;
    faPlus = faPlus;
    faEye = faEye;
    faEdit = faEdit;
    faArchive = faArchive;
    faTh = faTh;
    faSearch = faSearch;
    faFilter = faFilter;
    faTimes = faTimes;
    faDownload = faFileDownload;
    faImport = faFileImport;
    faExport = faFileExport;
    faUpArrow = faLongArrowAltUp;
    faDownArrow = faLongArrowAltDown;
    faSearchPlus = faSearchPlus;
    faTimesCircle = faTimesCircle;
    faUserCircle = faUserCircle;

    faHome = faHome;
    faUserCog = faUserCog;
    faMap = faMapMarkerAlt;
    faReport = faChartArea;
    faMobile = faMobileAlt;
    faMerchant = faIndustry;
    faDashboard = faTachometerAlt;
    faCheckCircle = faCheckCircle;
    faBan = faBan;

    confirmResource: any;
    confirmModel: any;

    statusKeys: Array<any>;

    mSub: Subscription;

    inFilterMode: boolean;

    searchForm: FormGroup;
    adSearchForm: FormGroup;

    closeResult: string;

    debounceTime = 750;

    constructor() {
        const injector = AppInjector.getInjector();
        this.authService = injector.get(AuthenticationService);
        this.modalService = injector.get(ModalService);
    }

    ngAfterViewInit(): void {
    }

    ngOnInit(): void {
        this.statusKeys = Object.keys(this.statusEnum).filter((element) => {
            return isNaN(Number(element));
        });
    };

    ngOnDestroy(): void {
        if (this.mSub)
            this.mSub.remove;
    };

    loadActionAccess(component: string){
        console.log('Component.....', component);
        console.log('Component Action Access.....', compActionAccess[component]);
        BaseComponent.actionAccess = compActionAccess[component];
        console.log('Action Access.....', BaseComponent.actionAccess);
    }

    abstract onPageLoad();

    abstract create(content: any);
    abstract view(id: number, content: any);
    abstract edit(id: number, content: any);
    abstract delete(id: number);
    abstract updateStatus(id: number, status: number);

    openConfirmation(content: any, resource:any, action: string, id: number, name:string){
        this.confirmResource = {
            id: id,
            name: name,
            title: action.charAt(0).toUpperCase() + action.slice(1),
            resource: resource,
            action: action
        };
        this.confirmModel = this.modalService.open(content, 'md', `${action} confirmation`);
    }

    closeConfirmation(confirm: boolean){
        console.log('Confirmation', confirm+"...."+JSON.stringify(this.confirmResource));
        if(confirm){
            if(this.confirmResource.action == this.actionEnum.delete)
                this.delete(this.confirmResource.id);
            else if(this.confirmResource.action == this.actionEnum.activate)
                this.updateStatus(this.confirmResource.id, 1);    
            else if(this.confirmResource.action == this.actionEnum.inActivate)
                this.updateStatus(this.confirmResource.id, 0);
        } 
        this.confirmModel.close();
        this.confirmResource = {};
    }

    openModal(content, size, title) {
        if (this.modalService) {
            this.modalService.open(content, size, title);
        }
    }

    closeModal(event) {
        console.log('CloseModal event received', event);
        if (event.reload)
            this.onPageLoad();

        this.modalService.closeAll();
    }

    close(reload: boolean) {
        console.log('close invoked');
        this.modalClosed.emit({ reload: reload });
    }

    cancel() {
        this.close(false);
    }

    getStatus(status: number): string {
        if (status === StatusEnum.INACTIVE) return "IN-ACTIVE";
        if (status === StatusEnum.ACTIVE) return "ACTIVE";
        if (status === StatusEnum.DELETED) return "DELETED";
    }

    canEdit(status: number): boolean {
        if (status === StatusEnum.ACTIVE) return true;
        return false;
    }

    canView(status: number): boolean {
        if (status === StatusEnum.ACTIVE || status === StatusEnum.INACTIVE) return true;
        return false;
    }

    canDelete(status: number): boolean {
        if (status === StatusEnum.ACTIVE) return true;
        return false;
    }

    get statusEnum(): typeof StatusEnum {
        return StatusEnum;
    }

    get actionEnum(): typeof ActionEnum {
        return ActionEnum;
    }

    get jobEnum(): typeof JobsEnum {
        return JobsEnum;
    }

    get componentEnum(): typeof ComponentEnum {
        return ComponentEnum;
    }

    getDeviceImagePath(fileName: string) {
        return AppSettings.DEVICE_IMAGE_CONTEXT + fileName;
    }

    getEventTypeText(type: any) {
        if (type == this.jobEnum.APP_INSTALL)
            return 'Install';
        else if (type == this.jobEnum.APP_PARAM_UPDATE)
            return 'Parameter Update';
        else if (type == this.jobEnum.DEVICE_DETAILS)
            return 'Device Details';
        else if (type == this.jobEnum.DEVICE_REBOOT)
            return 'Reboot';

    }

    hasActionAccess(){
        for(let key in BaseComponent.actionAccess){
            if(BaseComponent.actionAccess[key])
                return true;
        }
        return false;
    }

    hasAccess(action){
        // console.log(action +":"+JSON.stringify(BaseComponent.actionAccess));
        return (BaseComponent.actionAccess['all'] || BaseComponent.actionAccess[action]);
    }
}
