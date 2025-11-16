import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-message-component',
  imports: [
    NgIf
  ],
  templateUrl: './message-component.html',
  styleUrl: './message-component.scss',
})
export class MessageComponent {
  @Input() message: any;
  @Input() isMyMessage = false;
}
