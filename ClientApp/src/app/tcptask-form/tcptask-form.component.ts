import { element } from 'protractor';
import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { ITCPTask, TCPTaskType } from '../tcp-sessions-form/ITCPStatus';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-tcptask-form',
  templateUrl: './tcptask-form.component.html',
  styleUrls: ['./tcptask-form.component.scss']
})
export class TcptaskFormComponent implements OnInit {

  form: FormGroup;
  tasktype : typeof TCPTaskType = TCPTaskType;
  tasktypes : number[];

  constructor(private dialogRef: MatDialogRef<TcptaskFormComponent>) {
    this.tasktypes = Object.keys(this.tasktype).filter(e => !isNaN(+e)).map(e=> +e);
  }

  ngOnInit() {
    this.form = new FormGroup({
      parametr : new FormControl("xxx CLS" ),
      taskType : new FormControl(TCPTaskType.wright, Validators.required)
    });
  
  }

  Save() {
    if(this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  Close() {
    this.dialogRef.close();
  }


}
