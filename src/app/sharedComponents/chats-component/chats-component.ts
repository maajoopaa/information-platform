import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {NgForOf} from '@angular/common';
import {ChatComponent} from '../chat-component/chat-component';

@Component({
  selector: 'app-chats-component',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    NgForOf,
    ChatComponent
  ],
  templateUrl: './chats-component.html',
  styleUrl: './chats-component.scss',
})
export class ChatsComponent {
  public numbers: number[] = [1,1,1,1,1,1,1,1,1,1,1,1];
}
