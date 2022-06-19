import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged} from 'rxjs/operators';
import { Role } from 'src/app/model/role';
import { BaseFormComponent } from 'src/app/shared/core/base-form.component';
import { ActionEnum } from 'src/app/shared/enum/action.enum';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { RoleService } from '../role.service';
import { PolicyService } from '../../policy/policy.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
  providers: [DecimalPipe]
})
export class RoleFormComponent extends BaseFormComponent {

  @Input() role;
  @Input() actionType;

  pageHeader = 'New Role';

  roleForm: FormGroup;
  // policyForm: FormGroup;
  formSubmitted = false;
  isFailed = false;
  errMsg: string;

  policies: Array<any>;
  selectedPolicies = [];

  filteredPolicies: Array<any>;

  constructor(private formBuilder: FormBuilder,
    private service: RoleService,
    private pService: PolicyService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {

    this.loadActionAccess(this.componentEnum.role.toString());

    this.roleForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      desc: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(250)]]
    });

    this.setDescValidator();

    this.loadPolicies();

    if (this.actionType == ActionEnum.view) {
      this.roleForm.disable();
      this.pageHeader = 'View Role';
    }

    if (this.actionType == ActionEnum.edit) {
      this.roleForm.enable();
      this.pageHeader = 'Update Role';
    }
  }

  async loadPolicies() {
    await this.pService.getAll().subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.policies = resp.message;
      this.policies.sort(function (a, b) {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });

      this.filteredPolicies = this.policies;

      if (this.actionType != ActionEnum.add) {
        this.onPageLoad();
      }

    },
      err => {
        console.log('Unable to load policies, please contact adminstrator', err);
        this.toastr.error('Unable to load policies, please contact adminstrator', "Roles");
        this.spinner.hide();
      });
  }

  search(event: any) {
    // console.log(event.target.value);
    this.filteredPolicies = this.policies.filter(policy => {
      const term = event.target.value.toLowerCase();
      return policy.name.toLowerCase().includes(term);
    });
    // console.log('Selected policies.....', this.selectedPolicies);
    this.filteredPolicies.forEach(p => {
      // console.log('Policy...', p);
      // console.log('Policy already slected...', this.selectedPolicies.indexOf(p.id, 0));
      if(this.selectedPolicies.indexOf(p.id, 0) > -1)
        p.checked = true;
    });
  }

  onPageLoad() {
    this.role.policies.forEach(p => {
      this.filteredPolicies.find(e => e.id === p.id).checked = true;
      this.selectedPolicies.push(p.id);
    });

    // console.log('Selected policies for update view....', selected);
    this.roleForm.setValue({
      name: this.role.name,
      desc: this.role.desc
    });
  }

  get f() { return this.roleForm['controls'] }

  setDescValidator() {
    this.f.desc.valueChanges.
      pipe(distinctUntilChanged()).
      subscribe(val => {
        if (val.length > 0 && val.length < 6) {
          this.f.desc.setValidators([Validators.minLength(5)]);
          this.f.desc.setValidators([Validators.minLength(250)]);
        } else {
          this.f.desc.clearValidators();
        }
        this.f.desc.updateValueAndValidity();
      });
  };

  filterPolicy(id: number){
    return this.policies.find(r => r.id == id);
  }

  selectPolicy(event: any) {
    // console.log(event.target.checked);
    // console.log('Selected policies ');
    if (event.target.checked) {
      this.selectedPolicies.push(+event.target.value);
    } else {
      const index = this.selectedPolicies.indexOf(+event.target.value, 0);
      if (index > -1) {
        this.selectedPolicies.splice(index, 1);
      }
      this.filterPolicy(+event.target.value).checked = false;
    }
    // console.log('Selected policies.....', this.selectedPolicies);
  }

  save() {
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.roleForm.invalid) {
      console.log('From invalid', this.roleForm);
      return;
    }
    this.spinner.show();
    let value = this.roleForm.value;

    value.policies = this.selectedPolicies;

    // console.log('Form value....', value);

    this.service.create(value).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Role has been created successfully.", "Roles");
      this.close(true);
    },
      err => {
        console.log('Unable to create role, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to create role, please contact adminstrator', "Roles");
        this.spinner.hide();
      });
  }

  update() {
    this.formSubmitted = true;
    // stop here if form is invalid
    if (this.roleForm.invalid) {
      console.log('From invalid', this.roleForm);
      return;
    }
    this.spinner.show();
    let roleToUpdate = <Role>this.roleForm.value;
    Object.assign(this.role, roleToUpdate);
    this.role.canEdit = !!this.role.canEdit;
    this.role.canView = !!this.role.canEdit;

    this.role.policies = this.selectedPolicies;

    // console.log('Form value....', this.role);

    this.service.update(this.role).subscribe((resp: ApiResponse) => {
      this.spinner.hide();
      this.toastr.success("Role has been updated successfully.", "Roles");
      this.close(true);
    },
      err => {
        console.log('Unable to update role, please contact adminstrator', err);
        this.errMsg = err.message;
        this.toastr.error('Unable to update role, please contact adminstrator', "Roles");
        this.spinner.hide();
      });
  }

  edit() {
    this.actionType = ActionEnum.edit;
    this.pageHeader = 'Update Role';
    this.roleForm.enable();
    this.f.name.disable();
  }

  delete() {
    this.service.delete(this.role.id).subscribe(data => {
      this.close(true);
      this.toastr.success('Role has been deleted successfully.', 'Roles');
    },
      err => {
        console.log('Unable to delete role, please contact administrator.', 'Roles');
        this.toastr.error('Unable to delete role, please contact administrator.', 'Roles');
      });
  }

  updateStatus(id: number, status: number) {
    this.spinner.show();
    let model = Object.assign({}, this.role);
    model.status = status;
    this.service.updateStatus(id, model).subscribe(data => {
      this.close(true);
      console.log('Role status has been updated successfully');
      this.toastr.success('Role status has been updated successfully', 'Role');
      this.onPageLoad();
      this.spinner.hide();
    },
      err => {
        console.log('Unable to update role status....', err);
        this.toastr.error('Unable to update role status, please contact adminstrator', 'Role');
        this.spinner.hide();
      });
  }

  // onAdd(event) {
  //   // console.log("Add...", event);
  //   this.selectedPolicies.push(event.id);
  //   console.log("Selected...", this.selectedPolicies);
  // }

  // onRemove(event) {
  //   console.log("Delete...", event);
  //   const index = this.selectedPolicies.indexOf(event.value.id, 0);
  //   if (index > -1) {
  //     this.selectedPolicies.splice(index, 1);
  //   }
  //   console.log("Deleted...", this.selectedPolicies);
  // }
}
