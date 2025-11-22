import {Component, EventEmitter, inject, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {PostDto} from '../../api/models/post-dto';
import {CommentComponent} from '../comment-component/comment-component';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {commentsPost} from '../../api/fn/comments/comments-post';
import {AuthService} from '../../services/auth-service';
import {
  likesLikeIdDelete,
  likesPost,
  postsPostIdCommentsGet,
  postsPostIdDelete,
  postsPostIdLikesGet
} from '../../api/functions';
import {CommentDto} from '../../api/models/comment-dto';
import {LikeDto} from '../../api/models/like-dto';
import {RouterLink} from '@angular/router';
import {UserDto} from '../../api/models/user-dto';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog-component/confirm-dialog-component';

@Component({
  selector: 'app-post-component',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatMenu,
    MatIconButton,
    MatMenuItem,
    MatCardActions,
    MatButton,
    NgIf,
    CommentComponent,
    NgForOf,
    FormsModule,
    MatCardSubtitle,
    MatMenuTrigger,
    RouterLink
  ],
  templateUrl: './post-component.html',
  styleUrl: './post-component.scss',
})
export class PostComponent{
  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';

  public isCommentsExpanded: boolean = false;
  public newCommentText: string = '';
  public currentUser: UserDto | null = null;

  constructor(private auth: AuthService,private dialog: MatDialog) {
    const authData = this.auth.getAuthData();

    if(authData){
      this.currentUser = authData.user || null;
    }
  }

  @Input() post: PostDto | null = null;
  @Output() postDeleted: EventEmitter<string> = new EventEmitter<string>();

  public onCommentsButtonClick(){
    this.isCommentsExpanded = !this.isCommentsExpanded;
  }

  public onSubmitCommentClick(){
    if(this.newCommentText == ''){
      return;
    }

    this.addComment();
  }

  private addComment(){
    commentsPost(this.http,this.rootUrl,{
      body: {
        postId: this.post?.id,
        text: this.newCommentText
      }
    }).subscribe({
      next: (res) => {
        this.newCommentText = '';
        if(this.post?.comments){
          this.post.comments = [...this.post?.comments,res.body];
        }
        console.log('Комментарий создан:', res);
      },
      error: (error) => {
        console.error('Ошибка создания комментария:', error);
      }
    })
  }

  public isLikedByCurrentUser(){
    const likes = this.post?.likes;

    if(likes) {
      if(!this.currentUser){
        return false;
      }

      return likes.find(x => x?.createdBy?.id == this.currentUser?.id) === null;
    }

    return false;
  }

  public onLikeClick(){
    if(this.post){
      if(!this.currentUser){
        return;
      }

      const likes = this.post.likes;

      if(likes){
        const existedLike = likes.find(x => x.createdBy?.id == this.currentUser?.id);
        if(existedLike){
          this.deleteLike(existedLike.id || '');
        }else{
          this.addLike();
        }
      }
    }
  }

  private addLike(){
    likesPost(this.http,this.rootUrl,{
      body:{
        postId: this.post?.id,
      }
    }).subscribe({
      next: (res) => {
        if(this.post?.likes){
          this.post.likes = [...this.post?.likes,res.body];
        }
        console.log('Лайк добавлен:', res);
      },
      error: (error) => {
        console.error('Ошибка добавления лайка:', error);
      }
    })
  }

  public sortCommentsByCreatedDate(comments: CommentDto[]){
    return this.post?.comments?.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  private deleteLike(existedLikeId: string){
    likesLikeIdDelete(this.http,this.rootUrl,{
      likeId: existedLikeId
    })
      .subscribe({
        next: (res) => {
          if(this.post?.likes){
            const index = this.post.likes.findIndex(like => like?.id === existedLikeId);
            if (index !== -1) {
              this.post.likes.splice(index, 1);
            }
          }
          console.log('Лайк убран:', res);
        },
        error: (error) => {
          console.error('Ошибка удаления лайка:', error);
        }
      })
  }

  onDeleteClick() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: 'Вы уверены, что хотите удалить этот пост?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePost();
      }
    });
  }

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

  deletePost() {
    postsPostIdDelete(this.http,this.rootUrl,{
      postId: this.post?.id || ''
    }).subscribe({
      next: (res) => {
        if(res){
          this.postDeleted.emit(this.post?.id || '');
          console.log('Пост удален:', res);
        }
      },
      error: (error) => {
        console.error('Ошибка удаления поста:', error);
      }
    })
  }
}
