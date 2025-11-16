import { Component } from '@angular/core';
import {MessageComponent} from '../message-component/message-component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-chat-component',
  imports: [
    MessageComponent,
    NgForOf,
  ],
  templateUrl: './chat-component.html',
  styleUrl: './chat-component.scss',
})
export class ChatComponent {
  messages = [
    { text: 'Привет! Как дела?', author: 'Иван Иванов', time: '12:00', isMy: false },
    { text: 'Привет! Все отлично, спасибо!', author: 'Я', time: '12:01', isMy: true },
    { text: 'Посмотри на этот новый пост', author: 'Иван Иванов', time: '12:02', isMy: false },
    { text: 'Уже смотрю, очень интересно!', author: 'Я', time: '12:03', isMy: true },
  ];
}
