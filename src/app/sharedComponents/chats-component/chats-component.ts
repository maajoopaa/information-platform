import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {NgForOf, NgIf} from '@angular/common';
import {ChatComponent} from '../chat-component/chat-component';
import {AuthService} from '../../services/auth-service';
import {HttpClient} from '@angular/common/http';
import {ChatDto} from '../../api/models/chat-dto';
import {usersUserIdChatsGet} from '../../api/fn/users/users-user-id-chats-get';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {AddChatDialogComponent} from '../../dialogs/add/add-chat-dialog-component/add-chat-dialog-component';
import {usersGet} from '../../api/fn/users/users-get';
import {UserDto} from '../../api/models/user-dto';
import {chatsPost} from '../../api/functions';

@Component({
  selector: 'app-chats-component',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    NgForOf,
    ChatComponent,
    NgIf,
    MatIcon,
    MatButton
  ],
  templateUrl: './chats-component.html',
  styleUrl: './chats-component.scss',
})
export class ChatsComponent implements OnInit {
  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';

  public chats: ChatDto[] = []
  public allUsers: UserDto[] = [];
  public selectedChat: ChatDto | null = null;
  constructor(private auth: AuthService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    const userInformation = this.auth.getAuthData();

    usersUserIdChatsGet(this.http,this.rootUrl,{userId: userInformation?.user?.id || ''})
      .subscribe(res => {
        this.chats = res.body;
      });

    usersGet(this.http,this.rootUrl)
      .subscribe(res => {
        this.allUsers = res.body;
      })
  }

  public calculateMessageTitle(id: string){
    const chat = this.chats.find(x => x.id === id);

    if(chat){
      if(chat.isGroup){
        return chat.title;
      }

      const currentUserInfo = this.auth.getAuthData();

      const chatParticipants = chat.participants?.filter(x => x.id !== currentUserInfo?.user?.id);

      if(chatParticipants && chatParticipants.length > 0){
        return `${chatParticipants[0].firstName} ${chatParticipants[0].lastName}`;
      }
    }

    return '';
  }

  public calculateMessageText(id: string) {
    const chat = this.chats.find(x => x.id === id);

    if (chat) {
      const currentUserInfo = this.auth.getAuthData();

      if (chat.messages && chat.messages.length > 0) {
        const lastMessage = chat.messages[chat.messages.length - 1];
        const messageText = lastMessage.createdBy?.id === currentUserInfo?.user?.id ?
          `Вы: ${lastMessage.bodyHtml}` : `${lastMessage?.createdBy?.firstName}: ${lastMessage.bodyHtml}`;

        return messageText.length > 30 ?
          messageText.slice(0, 30) + '...' : messageText;
      }
    }

    return '';
  }

  public calculateLastMessageDate(id: string){
    const chat = this.chats.find(x => x.id === id);

    if(chat){
      if(chat.messages && chat.messages.length > 0){
        return chat.messages[chat.messages.length-1].createdAt;
      }
    }

    return '';
  }

  formatMessageTime(dateString: string): string {
    try {
      const normalizedDateString = dateString.split('.')[0] + 'Z';
      const messageDate = new Date(normalizedDateString);

      if (isNaN(messageDate.getTime())) {
        console.error('Invalid date:', dateString);
        return '--:--';
      }

      const now = new Date();
      const diffMs = now.getTime() - messageDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins < 1 ? 'только что' : `${diffMins} мин назад`;
      } else if (diffHours < 24) {
        return messageDate.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        });
      } else if (diffDays === 1) {
        return `вчера в ${messageDate.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        })}`;
      } else {
        const options: Intl.DateTimeFormatOptions = {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        };

        if (diffDays > 365) {
          options.year = 'numeric';
        }

        return messageDate.toLocaleDateString('ru-RU', options);
      }
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return '--:--';
    }
  }

  onAddChatButtonClick(){
    const dialogRef = this.dialog.open(AddChatDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: this.allUsers
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if(res){
          this.addChat(res.title,res.isGroup,res.participants);
        }
      })
  }

  private addChat(title: string | null, isGroup: boolean, participants: string[]){
    chatsPost(this.http,this.rootUrl,{
      body: {
        title: title,
        isGroup: isGroup,
        participantIds: participants
      }
    }).subscribe({
      next: (res) => {
        this.chats = [...this.chats,res.body];
        console.log('Чат создан:', res);
      },
      error: (error) => {
        console.error('Ошибка создания чата:', error);
      }
    })
  }

  onChatClick(chat: ChatDto){
    this.selectedChat = chat;
  }
}
