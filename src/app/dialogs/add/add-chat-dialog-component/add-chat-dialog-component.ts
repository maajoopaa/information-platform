import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {UserDto} from '../../../api/models/user-dto';
import {MatChipGrid, MatChipRow, MatChipRemove, MatChipInput} from '@angular/material/chips';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {Observable, startWith} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-add-chat-dialog-component',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatDialogActions,
    MatInput,
    MatButton,
    MatDialogClose,
    NgIf,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatChipGrid,
    MatChipRow,
    MatChipRemove,
    NgForOf,
    MatIcon,
    AsyncPipe,
    MatCheckbox,
    MatChipInput
  ],
  templateUrl: './add-chat-dialog-component.html',
  styleUrl: './add-chat-dialog-component.scss',
})
export class AddChatDialogComponent implements OnInit{
  chatForm: FormGroup;
  userSearchControl = new FormControl();

  public selectedParticipants: UserDto[] = []
  public allUsers: UserDto[] = [];
  public filteredUsers: Observable<UserDto[]> | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDto[]
  ) {
    this.chatForm = this.fb.group({
      title: [''],
      isGroup: [false, [Validators.required]],
      participants: [[], [Validators.required]],
    });

    this.allUsers = data;
  }

  ngOnInit(): void {
    this.filteredUsers = this.userSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsers(value))
    );
  }

  private _filterUsers(value: string): UserDto[] {
    if (!value) {
      return this.allUsers;
    }

    const filterValue = value.toLowerCase();
    return this.allUsers.filter(user =>
      user.username?.toLowerCase().includes(filterValue)
    );
  }

  isUserSelected(user: UserDto): boolean {
    return this.selectedParticipants.some(u => u.id === user.id);
  }

  onUserSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedUser: UserDto = event.option.value;

    if (!this.isUserSelected(selectedUser)) {
      this.selectedParticipants.push(selectedUser);
      this.updateParticipantsForm();
    }

    this.userSearchControl.setValue('');
  }

  removeUser(user: UserDto): void {
    const index = this.selectedParticipants.indexOf(user);
    if (index >= 0) {
      this.selectedParticipants.splice(index, 1);
      this.updateParticipantsForm();
    }
  }

  private updateParticipantsForm(): void {
    this.chatForm.patchValue({
      participants: this.selectedParticipants.map(user => user.id)
    });
  }

  createChat(): void {
    if (this.chatForm.valid) {
      const chatData = {
        title: this.chatForm.value.title,
        isGroup: this.chatForm.value.isGroup,
        participants: this.selectedParticipants.map(x => x.id),
      };

      this.dialogRef.close(chatData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
