import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

export type NotificationStatus = 'success' | 'warn' | 'error' | 'info';

@Component({
  selector: 'app-notification-component',
  imports: [
    MatIcon,
  ],
  templateUrl: './notification-component.html',
  styleUrl: './notification-component.scss',
})
export class NotificationComponent implements OnInit {
  @Input() message: string = '';
  @Input() status: NotificationStatus = 'info';
  @Input() autoClose: boolean = true;
  @Input() duration: number = 5000;

  @Output() closed = new EventEmitter<void>();

  ngOnInit() {
    if (this.autoClose) {
      setTimeout(() => {
        this.onClose();
      }, this.duration);
    }
  }

  getStatusIcon(): string {
    switch (this.status) {
      case 'success': return 'check_circle';
      case 'warn': return 'warning';
      case 'error': return 'error';
      case 'info':
      default: return 'info';
    }
  }

  getAlertClasses(): string {
    switch (this.status) {
      case 'success':
        return 'alert-success';
      case 'warn':
        return 'alert-warning';
      case 'error':
        return 'alert-danger';
      case 'info':
      default:
        return 'alert-info';
    }
  }

  getStatusTitle(): string {
    switch (this.status) {
      case 'success': return 'Успешно!';
      case 'warn': return 'Внимание!';
      case 'error': return 'Ошибка!';
      case 'info':
      default: return 'Информация';
    }
  }

  onClose() {
    this.closed.emit();
  }

}
