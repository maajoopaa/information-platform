import {Component, inject, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem} from '@angular/material/menu';
import {MatButton, MatIconButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {PostDto} from '../../api/models/post-dto';
import {CommentComponent} from '../comment-component/comment-component';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {commentsPost} from '../../api/fn/comments/comments-post';
import {AuthService} from '../../services/auth-service';
import {likesLikeIdDelete, likesPost, postsPostIdCommentsGet, postsPostIdLikesGet} from '../../api/functions';
import {CommentDto} from '../../api/models/comment-dto';
import {LikeDto} from '../../api/models/like-dto';

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
    MatCardSubtitle
  ],
  templateUrl: './post-component.html',
  styleUrl: './post-component.scss',
})
export class PostComponent implements OnChanges, OnDestroy{
  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';
  private intervalId: any;

  public isCommentsExpanded: boolean = false;
  public newCommentText: string = '';

  constructor(private auth: AuthService) {
  }

  @Input() post: PostDto | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['post'] && this.post) {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }

      this.intervalId = setInterval(() => {
        if(this.post) {
          this.fetchComments();
          this.fetchLikes();
        }
      }, 1000);
    }
  }

  public onCommentsButtonClick(){
    this.isCommentsExpanded = !this.isCommentsExpanded;
  }

  public fetchComments(){
    if(this.post){
      postsPostIdCommentsGet(this.http,this.rootUrl,{
        postId: this.post.id || ''
      }).subscribe({
        next: (res) => {
          if(this.post !==null){
            this.post.comments = res.body as CommentDto[];
          }
        },
        error: (error) => {
          console.error('Ошибка получения комментариев:', error);
        }
      })
    }
  }

  public fetchLikes(){
    if(this.post){
      postsPostIdLikesGet(this.http,this.rootUrl,{
        postId: this.post.id || ''
      }).subscribe({
        next: (res) => {
          if(this.post !== null){
            this.post.likes = res.body as LikeDto[];
          }
        },
        error: (error) => {
          console.error('Ошибка получения лайков:', error);
        }
      })
    }
  }

  public onSubmitCommentClick(){
    if(this.newCommentText == ''){
      return;
    }

    commentsPost(this.http,this.rootUrl,{
      body: {
        postId: this.post?.id,
        text: this.newCommentText
      }
    }).subscribe({
      next: (res) => {
        this.newCommentText = '';
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
      const currentUserInfo = this.auth.getAuthData();

      if(!currentUserInfo){
        return false;
      }

      return likes.find(x => x.createdBy?.id == currentUserInfo?.user?.id) === null;
    }

    return false;
  }

  public onLikeClick(){
    if(this.post){
      const currentUserInfo = this.auth.getAuthData();

      if(!currentUserInfo){
        return;
      }

      const likes = this.post.likes;

      if(likes){
        const existedLike = likes.find(x => x.createdBy?.id == currentUserInfo?.user?.id);
        if(existedLike){
          likesLikeIdDelete(this.http,this.rootUrl,{
            likeId: existedLike.id || ''
          })
            .subscribe({
              next: (res) => {
                console.log('Лайк убран:', res);
              },
              error: (error) => {
                console.error('Ошибка удаления лайка:', error);
              }
            })
        }else{
          likesPost(this.http,this.rootUrl,{
            body:{
              postId: this.post?.id,
            }
          }).subscribe({
            next: (res) => {
              console.log('Лайк добавлен:', res);
            },
            error: (error) => {
              console.error('Ошибка добавления лайка:', error);
            }
          })
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
