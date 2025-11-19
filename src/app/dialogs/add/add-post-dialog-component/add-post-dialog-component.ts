import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatHint} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-add-post-dialog-component',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatDialogActions,
    MatInput,
    MatButton,
    MatDialogClose,
    NgIf
  ],
  templateUrl: './add-post-dialog-component.html',
  styleUrl: './add-post-dialog-component.scss',
})
export class AddPostDialogComponent {
  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      bodyHtml: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  createPost(): void {
    if (this.postForm.valid) {
      const postData = {
        title: this.postForm.value.title,
        bodyHtml: this.postForm.value.bodyHtml,
      };

      this.dialogRef.close(postData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
