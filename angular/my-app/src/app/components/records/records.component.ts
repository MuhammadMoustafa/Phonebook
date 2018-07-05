import { Component, OnInit } from '@angular/core';

import { Record } from './Record';
import { RecordService} from '../../services/record.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {

  records : Record[];
  selectedRecord: Record;

  constructor(private recordService: RecordService) {}

  ngOnInit() {
    this.getRecords();
  }

  getRecords(): void {
    this.recordService.getRecords().subscribe(records => this.records = records);
  }

  add(name: string, phonenumber: string): void {
    name = name.trim();
    if (!name && !phonenumber) { return; }
    this.recordService.addRecord({ name, phonenumber } as Record)
      .subscribe(record => {
        if(record) {this.records.push(record);}
      });
  }

  delete(record: Record): void {
    this.records = this.records.filter(r => r !== record);
    this.recordService.deleteRecord(record).subscribe();
  }

}
