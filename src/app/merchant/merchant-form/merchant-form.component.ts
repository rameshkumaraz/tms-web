import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { countries } from '../../shared/model/country-data-store'
import { Merchant } from '../../model/merchant';
import { MerchantContact } from '../../model/merchant-contact';
import { MerchantService } from '../../merchant/merchant.service';
import { ApiResponse } from '../../shared/model/api.response';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, first } from 'rxjs/operators';

@Component({
  selector: 'app-merchant-form',
  templateUrl: './merchant-form.component.html',
  styleUrls: ['./merchant-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MerchantFormComponent implements OnInit {

  actionType;
  merchId;

  pageHeader = 'New Merchant';
  page = 1;
  pageSize = 10;

  merchantForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  // contactForm: FormGroup;
  // mFormSubmitted = false;
  // cFormSubmitted = false;
  // isMerchantFormValid = false;
  // isContactFormValid = false;

  countries: any = countries;

  merchant = new Merchant();
  contact = new MerchantContact();

  sub;

  urlRegEx =
    '[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}(.[a-z]{2,4})?\b(/[-a-zA-Z0-9@:%_+.~#?&//=]*)?';

  // phoneRegEx = '(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})';
  phoneRegEx = /^\+(?:[0-9] ?){6,14}[0-9]$/;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private merchantService: MerchantService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.sub = this.activatedroute.paramMap.subscribe(params => {
      console.log(params);
      this.actionType = params.get('actionType');
      this.merchId = params.get('id');
    });
    console.log(this.actionType);

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

    if(this.actionType == 'view'){
      this.merchantForm.disable();
    }

    if (this.actionType != 'add') {
      this.loadMerchant();
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

  loadMerchant() {
    this.spinner.show();
    this.merchantService.getMerchant(this.merchId)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Merchant Response', resp);
          this.merchant = resp.message;
          if (!this.merchant) {
            this.toastr.error(this.errMsg);
          } else {
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
          this.spinner.hide();
        },
        err => {
          console.log('Unable to load merchants, please contact adminstrator', err);
          this.errMsg = err.message;
          this.toastr.error(this.errMsg);
          this.spinner.hide();
        });
  }

  save() {
    console.log('nextTab');
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.merchantForm.invalid) {
      console.log('From invalid', this.merchantForm);
      return;
    }
    this.spinner.show();
    this.merchant = <Merchant>this.merchantForm['controls'].merchant.value;
    this.contact = <MerchantContact>this.merchantForm['controls'].contact.value;
    this.merchant.contacts = [];
    this.merchant.contacts.push(this.contact);
    this.merchantService.createMerchant(this.merchant).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Merchant has been created successfully.");
      this.router.navigate(['/merchant']);
    },
      err => {
        console.log('Unable to create merchant, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error(this.errMsg);
        this.spinner.hide();
      });
  }

  update(){
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.merchantForm.invalid) {
      console.log('From invalid', this.merchantForm);
      return;
    }
    this.spinner.show();
    let merchantToUpdate = <Merchant>this.merchantForm['controls'].merchant.value;
    Object.assign(this.merchant, merchantToUpdate);
    let contactToUpdate  = <MerchantContact>this.merchantForm['controls'].contact.value;
    Object.assign(this.merchant.contacts[0], contactToUpdate);
    this.merchantService.updateMerchant(this.merchant).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Merchant has been updated successfully.", "Merchant");
      this.router.navigate(['/merchant']);
    },
      err => {
        console.log('Unable to create merchant, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error(this.errMsg);
        this.spinner.hide();
      });
  }

  edit() {
    this.actionType = 'edit';
    this.merchantForm.enable();
  }

  delete() {
    // this.actionType = 'edit';
  }

  cancel() {
    this.router.navigate(['/merchant']);
  }

  setAddressValidator() {
    this.mf.address2.valueChanges.
      pipe(distinctUntilChanged()).
      subscribe(val => {
        console.log('address2 value', val + ':' + val.length);
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

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}