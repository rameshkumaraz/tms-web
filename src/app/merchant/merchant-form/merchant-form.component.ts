import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { countries } from '../../shared/model/country-data-store'
import { Merchant } from '../../model/merchant';
import { MerchantContact } from '../../model/merchant-contact';
import { MerchantService } from '../../merchant/merchant.service';
import { ApiResponse } from '../../shared/model/api.response';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { BaseFormComponent } from 'src/app/shared/core/base-form.component';

@Component({
  selector: 'app-merchant-form',
  templateUrl: './merchant-form.component.html',
  styleUrls: ['./merchant-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MerchantFormComponent extends BaseFormComponent {

  @Input() merchant;
  @Input() actionType;

  pageHeader = 'New Merchant';
  page = 1;
  pageSize = 10;

  merchantForm: FormGroup;
  formSubmitted = false;
  isFailed = false;

  // contactForm: FormGroup;
  // mFormSubmitted = false;
  // cFormSubmitted = false;
  // isMerchantFormValid = false;
  // isContactFormValid = false;

  countries: any = countries;

  // sub;

  urlRegEx =
    '[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}(.[a-z]{2,4})?\b(/[-a-zA-Z0-9@:%_+.~#?&//=]*)?';

  // phoneRegEx = '(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})';
  phoneRegEx = /^\+(?:[0-9] ?){6,14}[0-9]$/;

  constructor(private formBuilder: FormBuilder,
    private merchantService: MerchantService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {
    // this.sub = this.activatedroute.paramMap.subscribe(params => {
    //   console.log(params);
    //   this.actionType = params.get('actionType');
    //   this.merchId = params.get('id');
    // });
    // console.log(this.actionType);

    this.loadActionAccess(this.componentEnum.merchant.toString());

    this.merchantForm = this.formBuilder.group({
      merchant: this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(5), Validators.max(200)]],
        address1: ['', [Validators.required, Validators.minLength(5), Validators.max(200)]],
        address2: [''],
        city: ['', [Validators.required, Validators.minLength(3)]],
        state: ['', [Validators.required, Validators.minLength(3)]],
        country: ['', [Validators.required]],
        areaCode: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(this.phoneRegEx)]],
        website: ['', Validators.required]
        // website: ['', [Validators.required, Validators.pattern(this.urlRegEx)]]
      }),
      contact: this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        mobile: ['', [Validators.required, Validators.pattern(this.phoneRegEx)]],
        designation: ['', Validators.required]
      })
    });

    this.setAddressValidator();
    this.setPhoneValidator();

    if (this.actionType == ActionEnum.view) {
      this.merchantForm.disable();
      this.pageHeader = 'View Merchant';
    }

    if (this.actionType == ActionEnum.edit) {
      this.pageHeader = 'Update Merchant';
      // console.log('Controls....', this.merchantForm['controls'].merchant['controls']);
      this.merchantForm['controls'].merchant['controls'].name.disable();
      this.merchantForm['controls'].merchant['controls'].email.disable();
      this.merchantForm['controls'].merchant['controls'].website.disable();
    }

    if (this.actionType != ActionEnum.add) {
      this.onPageLoad();
    }

    // this.merchantForm = this.formBuilder.group({
    //   name: ['', [Validators.required, Validators.min(5), Validators.max(200)]],
    //   address: ['', [Validators.required, Validators.min(5), Validators.max(500)]],
    //   city: ['', [Validators.required, Validators.min(3)]],
    //   state: ['', [Validators.required, Validators.min(3)]],
    //   country: ['', [Validators.required]],
    //   areaCode: ['', [Validators.required, Validators.min(5)]],
    //   email:  ['', [Validators.required, Validators.email]],
    //   phone: ['', [Validators.required, Validators.pattern(this.phoneRegEx)]],
    //   website: ['', Validators.required]
    //   // website: ['', [Validators.required, Validators.pattern(this.urlRegEx)]]
    // });

    // this.contactForm = this.formBuilder.group({
    //   contact1: this.formBuilder.group({
    //     name1: ['', Validators.required],
    //     email1: ['', Validators.required],
    //     phone1: '', 
    //     mobile1: ['', Validators.required],
    //     designation1: ['', Validators.required]
    //   }),
    //   contact2: this.formBuilder.group({
    //     name2: '',
    //     email2: '',
    //     phone2: '',
    //     mobile2: '',
    //     designation2: ''
    //   }),
    // });

  }

  get mf() { return this.merchantForm['controls'].merchant['controls'] }
  get cf() { return this.merchantForm['controls'].contact['controls'] }

  onPageLoad() {
    this.merchantForm['controls'].merchant.setValue({
      name: this.merchant.name,
      address1: this.merchant.address1,
      address2: this.merchant.address2,
      city: this.merchant.city,
      state: this.merchant.state,
      country: this.merchant.country,
      areaCode: this.merchant.areaCode,
      email: this.merchant.email,
      phone: this.merchant.phone,
      website: this.merchant.website
    });

    if (this.merchant.contacts) {
      this.merchantForm['controls'].contact.setValue({
        name: this.merchant.contacts[0].name,
        email: this.merchant.contacts[0].email,
        phone: this.merchant.contacts[0].phone,
        mobile: this.merchant.contacts[0].mobile,
        designation: this.merchant.contacts[0].designation
      });

    }
  }

  save() {
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.merchantForm.invalid) {
      console.log('From invalid', this.merchantForm);
      return;
    }
    this.spinner.show();
    this.merchant = <Merchant>this.merchantForm['controls'].merchant.value;
    let contact = <MerchantContact>this.merchantForm['controls'].contact.value;
    this.merchant.contacts = [];
    this.merchant.contacts.push(contact);
    this.merchantService.create(this.merchant).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success('Merchant has been created successfully.', 'Merchant');
      this.close(true);
    },
      err => {
        console.log('Unable to create merchant, please contact adminstrator', err);
        this.toastr.error('Unable to create merchant, please contact adminstrator', 'Merchant');
        this.spinner.hide();
      });
  }

  update() {
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.merchantForm.invalid) {
      console.log('From invalid', this.merchantForm);
      return;
    }
    this.spinner.show();
    let merchantToUpdate = <Merchant>this.merchantForm['controls'].merchant.value;
    Object.assign(this.merchant, merchantToUpdate);
    let contactToUpdate = <MerchantContact>this.merchantForm['controls'].contact.value;
    Object.assign(this.merchant.contacts[0], contactToUpdate);
    this.merchant.canEdit = !!this.merchant.canEdit;
    this.merchant.canView = !!this.merchant.canEdit;
    this.merchant.contacts[0].canEdit = !!this.merchant.contacts[0].canEdit;
    this.merchant.contacts[0].canView = !!this.merchant.contacts[0].canView;

    this.merchantService.update(this.merchant).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Merchant has been updated successfully.", "Merchant");
      this.close(true);
    },
      err => {
        console.log('Unable to create merchant, please contact adminstrator', err);
        this.toastr.error('Unable to update merchant, please contact adminstrator', 'Merchant');
        this.spinner.hide();
      });
  }

  edit() {
    this.actionType = ActionEnum.edit;
    this.merchantForm.enable();
    this.pageHeader = 'Update Merchant';
    this.mf.name.disable();
    this.mf.email.disable();
    this.mf.website.disable();
  }

  setAddressValidator() {
    this.mf.address2.valueChanges.
      pipe(distinctUntilChanged()).
      subscribe(val => {
        //console.log('address2 value', val + ':' + val.length);
        if (val.length > 0 && val.length < 6) {
          this.mf.address2.setValidators([Validators.minLength(6)]);
          this.mf.address2.setValidators([Validators.minLength(200)]);
        } else {
          this.mf.address2.clearValidators();
        }
        this.mf.address2.updateValueAndValidity();
      });
  };

  setPhoneValidator() {
    this.cf.phone.valueChanges.
      pipe(distinctUntilChanged()).
      subscribe(val => {
        if (val.length > 0) {
          this.cf.phone.setValidators([Validators.pattern(this.phoneRegEx)]);
        } else {
          this.cf.phone.clearValidators();
        }
        this.cf.phone.updateValueAndValidity();
      });
  }

  delete() {
    this.spinner.show();
    this.merchantService.delete(this.merchant.id).subscribe(data => {
      this.close(true);
      this.toastr.success('Merchant has been deleted successfully.', 'Merchants');
    },
      err => {
        console.log('Unable to delete merchant, please contact administrator.', 'Merchants');
        this.toastr.error('Unable to delete merchant, please contact administrator.', 'Merchants');
        this.spinner.hide();
      });
  }

  updateStatus(id: number, status: number): void {
    this.spinner.show();
    let model = Object.assign({}, this.merchant);
    model.status = status;  
    this.merchantService.updateStatus(id, model).subscribe(data => {
      this.close(true);
      console.log('Merchant status has been updated successfully');
      this.toastr.success('Merchant status has been updated successfully', 'Merchant');
    },
      err => {
        console.log('Unable to update merchant status....', err);
        this.toastr.error('Unable to update merchant status, please contact adminstrator', 'Merchant');
        this.spinner.hide();
      });
  }
}