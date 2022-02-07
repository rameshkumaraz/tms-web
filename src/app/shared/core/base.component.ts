import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { faArchive, faBars, faChartArea, faEdit, faEye, faFileDownload, faFileExport, faFileImport, faFilter, faHome, faIndustry, faLongArrowAltDown, faLongArrowAltUp, faMapMarkerAlt, faMobileAlt, faPlus, faSearch, faTachometerAlt, faTh, faTimes, faTimesCircle, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { StatusEnum } from '../enum/status.enum';
import { ActionEnum } from '../enum/action.enum';
import { AppSettings } from '../../app.config';
import { JobsEnum } from '../enum/jobs.enum';
import { TriggerType } from '../enum/trigger-type.enum';
import { FormGroup } from '@angular/forms';

@Component({
    template: ''
})
export abstract class BaseComponent implements OnInit, OnDestroy {

    @Output() modelClosed = new EventEmitter();

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

    faHome = faHome;
    faUserCog = faUserCog;
    faMap = faMapMarkerAlt;
    faReport = faChartArea;
    faMobile = faMobileAlt;
    faMerchant = faIndustry;
    faDashboard = faTachometerAlt;

    statusKeys: Array<any>;

    mSub: Subscription;

    inFilterMode: boolean;

    searchForm: FormGroup;

    closeResult: string;

    constructor(private modalService: NgbModal) {
        this.statusKeys = Object.keys(this.statusEnum).filter((element) => {
            return isNaN(Number(element));
        });
    }

    abstract ngOnInit(): void;
    ngOnDestroy(): void {
        if (this.mSub)
            this.mSub.remove;
    };

    abstract onPageLoad();

    openModal(content, size, title) {
        if (this.modalService) {
            this.modalService.open(content, { size: size, ariaLabelledBy: title }).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    closeModal(event) {
        console.log('CloseModal event received', event);
        if (event.reload)
            this.onPageLoad();

        this.modalService.dismissAll();
    }

    close(reload: boolean) {
        console.log('close invoked');
        this.modelClosed.emit({ reload: reload });
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
}
