import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {

  private pageHeader: string;

  constructor() { }

  ngOnInit(): void {
    this.pageHeader = 'Bank';
  }

}
