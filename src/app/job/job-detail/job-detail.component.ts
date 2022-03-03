import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { BaseComponent } from 'src/app/shared/core/base.component';
import { ApiResponse } from 'src/app/shared/model/api.response';
import { JobService } from '../job.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent extends BaseComponent {

  pageHeader = 'Event Details';
  page = 1;
  pageSize = 10;

  jobId: number;

  eventLogs: Array<any>;
  eventLogCount: number;

  constructor(private route: ActivatedRoute,
    private jobService: JobService,
    private spinner: NgxSpinnerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // { order: "popular" }
        this.jobId = params.id;
        this.onPageLoad();
      });
  }

  onPageLoad() {
    this.loadEvents();
  }

  loadEvents() {
    this.spinner.show();
    this.jobService.getEventLogs(this.jobId)
      .pipe(first())
      .subscribe(
        (resp: ApiResponse) => {
          console.log('Device Event Log Response', resp);
          this.eventLogs = resp.message;
          this.eventLogCount = this.eventLogs.length;
          this.spinner.hide();
        },
        error => {
          console.log('Device Event Log Response', error);
          this.spinner.hide();
        });
  }
}
