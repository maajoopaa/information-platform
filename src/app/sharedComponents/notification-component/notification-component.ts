import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

export type NotificationStatus = 'success' | 'warn' | 'error' | 'info';

@Component({
  selector: 'app-notification-component',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './notification-component.html',
  styleUrl: './notification-component.scss',
})
export class NotificationComponent {
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

  getStatusClasses(): string {
    switch (this.status) {
      case 'success':
        return 'bg-success text-white';
      case 'warn':
        return 'bg-warning text-dark';
      case 'error':
        return 'bg-danger text-white';
      case 'info':
      default:
        return 'bg-info text-dark';
    }
  }

  onClose() {
    this.closed.emit();
  }

}
