import {Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {MessageComponent} from '../message-component/message-component';
import {NgForOf, NgIf} from '@angular/common';
import {ChatDto} from '../../api/models/chat-dto';
import {AuthService} from '../../services/auth-service';
import {MessageDto} from '../../api/models/message-dto';
import {HttpClient} from '@angular/common/http';
import {messagesPost} from '../../api/fn/messages/messages-post';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {chatsChatIdMessagesGet} from '../../api/fn/chats/chats-chat-id-messages-get';

@Component({
  selector: 'app-chat-component',
  imports: [
    MessageComponent,
    NgForOf,
    FormsModule,
    NgIf,
    MatIcon,
  ],
  templateUrl: './chat-component.html',
  styleUrl: './chat-component.scss',
})
export class ChatComponent implements OnChanges, OnDestroy{
  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';
  private intervalId: any;

  public newMessageText: string = '';

  constructor(private auth: AuthService) {
  }

  @Input() chat: ChatDto | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chat'] && this.chat) {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      this.intervalId = setInterval(() => {
        if(this.chat) {
          this.fetchChatMessages(this.chat.id || '');
        }
      }, 1000);
    }
  }

  fetchChatMessages(chatId: string) {
    chatsChatIdMessagesGet(this.http, this.rootUrl, {
      chatId: chatId,
    }).subscribe(res => {
      const messages = res.body as MessageDto[];
      if (this.chat !== null) {
        this.chat.messages = messages;
      }
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public calculateMessageTitle(){
    if(this.chat){
      if(this.chat.isGroup){
        return this.chat.title;
      }

      const currentUserInfo = this.auth.getAuthData();

      const chatParticipants = this.chat.participants?.filter(x => x.id !== currentUserInfo?.user?.id);

      if(chatParticipants && chatParticipants.length > 0){
        return `${chatParticipants[0].firstName} ${chatParticipants[0].lastName}`;
      }
    }

    return '';
  }

  public isCurrentUserMessage(message: MessageDto){
    if(message){
      const currentUserInfo = this.auth.getAuthData();

      return message.createdBy?.id === currentUserInfo?.user?.id;
    }

    return false;
  }

  public onSendMessageClick(){
    if(this.newMessageText.length === 0){
      return;
    }

    messagesPost(this.http,this.rootUrl,{
      body:{
        chatId: this.chat?.id,
        bodyHtml: this.newMessageText
      }
    }).subscribe({
      next: (createdMessage) => {
        this.newMessageText = '';
        console.log('Сообщение отправлено:', createdMessage);
      },
      error: (error) => {
        console.error('Ошибка отправки сообщения:', error);
      }
    })
  }
}
