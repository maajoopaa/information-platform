import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {PostComponent} from '../post-component/post-component';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {PostDto} from '../../api/models/post-dto';
import {postsGet} from '../../api/fn/posts/posts-get';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {AddPostDialogComponent} from '../../dialogs/add/add-post-dialog-component/add-post-dialog-component';
import {postsPost} from '../../api/fn/posts/posts-post';
import {CommentComponent} from '../comment-component/comment-component';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/select';
import {NotificationComponent, NotificationStatus} from '../notification-component/notification-component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-posts-component',
  imports: [
    PostComponent,
    NgForOf,
    MatButton,
    MatIcon,
    NgIf,
    CommentComponent,
    MatFormField,
    MatSelect,
    MatOption,
    MatIconButton,
    MatLabel,
    NotificationComponent,
  ],
  templateUrl: './posts-component.html',
  styleUrl: './posts-component.scss',
})
export class PostsComponent {
  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';

  public isCommentsExpanded: boolean = false;
  sortBy: 'date' | 'popularity' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';
  sortedPosts: PostDto[] = [];
  isShowNotification = false;
  notificationMessage = '';
  notificationStatus: NotificationStatus = 'info';

  constructor(private dialog: MatDialog,private router: Router) {
  }

  @Input() posts: PostDto[] = [];
  @Input() isCreateButtonEnabled: boolean = true;
  @Output() postCreated = new EventEmitter<PostDto>();

  ngOnInit(){
    this.sortedPosts = this.posts;
  }

  onCommentsButtonClick(){
    this.isCommentsExpanded = !this.isCommentsExpanded;
  }

  onAddPostButtonClick(){
    const dialogRef = this.dialog.open(AddPostDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: {}
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if(res){
          this.addPost(res.bodyHtml,res.title);
        }
      })
  }

  private addPost(bodyHtml: string, title: string){
    postsPost(this.http,this.rootUrl,{
      body: {
        bodyHtml: bodyHtml,
        title: title
      }
    }).subscribe({
      next: (res) => {
        if(res){
          this.posts = [...this.posts,res.body];
          this.sortedPosts = this.posts;
          this.postCreated.emit(res.body);
          this.showNotification('Пост успешно создан!',"success");
          console.log('Пост создан:', res);
        }
      },
      error: (error) => {
        if(error.status === 401){
          this.router.navigate(['login']);
          return;
        }
        this.showNotification(error.error,"error");
        console.error('Ошибка создания поста:', error);
      }
    })
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  getSortedPosts() {
    if (this.sortBy === 'date') {
      this.sortedPosts = [...this.posts].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (this.sortBy === 'popularity') {
      this.sortedPosts = [...this.posts].sort((a, b) => {
        const popularityA = (a.likes?.length || 0) + (a.comments?.length || 0);
        const popularityB = (b.likes?.length || 0) + (b.comments?.length || 0);
        return this.sortDirection === 'asc' ? popularityA - popularityB : popularityB - popularityA;
      });
    }

    return this.sortedPosts;
  }

  public onPostDeleted(postId:string){
    this.posts = this.posts.filter(post => post.id !== postId);
    this.sortedPosts = this.posts;
  }

  private showNotification(message: string, status: NotificationStatus) {
    this.notificationMessage = message;
    this.notificationStatus = status;
    this.isShowNotification = true;
  }

  onNotificationClosed() {
    this.isShowNotification = false;
  }
}
