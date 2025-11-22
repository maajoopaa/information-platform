import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
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
export class ChatComponent implements AfterViewChecked, OnChanges{
  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private shouldScrollToBottom = false;

  public newMessageText: string = '';
  constructor(private auth: AuthService) {
  }

  @Input() chat: ChatDto | null = null;

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnChanges() {
    if (this.chat) {
      setTimeout(() => this.scrollToBottom(), 0);
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

    this.addMessage();
  }

  private addMessage(){
    messagesPost(this.http,this.rootUrl,{
      body:{
        chatId: this.chat?.id,
        bodyHtml: this.newMessageText
      }
    }).subscribe({
      next: (res) => {
        this.newMessageText = '';
        if(this.chat?.messages){
          this.chat.messages = [...this.chat?.messages, res.body];
          this.chat.lastUsageAt = new Date().toISOString();
        }
        this.shouldScrollToBottom = true;
        console.log('Сообщение отправлено:', res);
      },
      error: (error) => {
        console.error('Ошибка отправки сообщения:', error);
      }
    })
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTo({
          top: element.scrollHeight,
          behavior: 'smooth'
        });
      }
    } catch (err) {
      console.error('Scroll to bottom error:', err);
    }
  }
}
