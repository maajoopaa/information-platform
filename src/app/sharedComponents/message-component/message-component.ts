import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {MessageDto} from '../../api/models/message-dto';

@Component({
  selector: 'app-message-component',
  imports: [
    NgIf
  ],
  templateUrl: './message-component.html',
  styleUrl: './message-component.scss',
})
export class MessageComponent {
  @Input() message: MessageDto | null = null;
  @Input() isMyMessage = false;

  formatMessageTime(dateString: string): string {
    const messageDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return messageDate.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return messageDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}
