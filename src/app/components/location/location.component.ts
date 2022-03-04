import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
})
export class LocationComponent implements OnInit {
  @Output() getLocation = new EventEmitter<string>();
  addZipForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addZipForm = this.fb.group({
      zipcode: [
        '',
        [
          Validators.required,
          Validators.maxLength(6),
          Validators.minLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    });
  }

  addLocation() {
    this.getLocation.emit(this.addZipForm.value.zipcode);
  }
}
