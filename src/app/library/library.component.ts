import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faPlus, faBars, faTh, faEye, faEdit, faArchive} from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ActionEnum } from '../shared/enum/action.enum';
import { ApiResponse } from '../shared/model/api.response';
import { LibraryService } from './library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  faBars = faBars;
  faPlus = faPlus;
  faEye = faEye;
  faEdit = faEdit;
  faArchive = faArchive;
  faTh = faTh;

  pageHeader: string;
  page = 1;
  pageSize = 5;

  libCount = 0;
  libs: Array<any>;

  constructor(
    private service: LibraryService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageHeader = 'Library';
    this.onLoad();
  }

  onLoad() {
    this.spinner.show();
    this.service.getAll()
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Library Response', resp);
          this.libs = resp.message;
          this.libCount = this.libs.length;
          this.spinner.hide();
        },
        error => {
          console.log('Library Response', error);
          this.spinner.hide();
        });
  }

  create() {
    console.log('Add new Library');
    this.router.navigate(['/lf', { actionType: ActionEnum.add}],{skipLocationChange: true});
  }

  view(id: number) {
    this.router.navigate(['/lf', { actionType: ActionEnum.view, id: id}],{skipLocationChange: true});
  }

  edit(id: number) {
    this.router.navigate(['/lf', { actionType: ActionEnum.edit, id: id}],{skipLocationChange: true});
  }

  delete(id: number) {
    this.service.delete(id).subscribe(data => {
      console.log('Library has been deleted successfully');
      this.toastr.success('Library has been deleted successfully', 'Library');
      this.router.navigate(['/library']);
    },
    err => {
      console.log('Device model delete error....', err);
      this.toastr.success('Unable to delete Library, please contact adminstrator', 'Library');
    });
  }

}
