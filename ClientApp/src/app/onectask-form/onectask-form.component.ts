import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-onectask-form',
  templateUrl: './onectask-form.component.html',
  styleUrls: ['./onectask-form.component.scss']
})
export class OnectaskFormComponent implements OnInit {

  form: FormGroup;
  url : string;

  constructor(private dialogRef: MatDialogRef<OnectaskFormComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.url = data.url;
   }

  ngOnInit() {
    this.form = new FormGroup({
      URL : new FormControl("", Validators.required ),
      Metod : new FormControl("POST", Validators.required),
      Body : new FormControl("{param1:'1',param2:'2' }")
    });
  
    


  }

  Save() {
    if(this.form.valid) {
      const control : FormControl = this.form.get("URL") as FormControl;
      const API = control.value;
      control.patchValue(this.url+API);
      
      this.dialogRef.close(this.form.value);
    }
  }

  Close() {
    this.dialogRef.close();
  }

}
