import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {PostComponent} from '../post-component/post-component';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {PostDto} from '../../api/models/post-dto';
import {postsGet} from '../../api/fn/posts/posts-get';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {AddPostDialogComponent} from '../../dialogs/add/add-post-dialog-component/add-post-dialog-component';
import {postsPost} from '../../api/fn/posts/posts-post';
import {CommentComponent} from '../comment-component/comment-component';

@Component({
  selector: 'app-posts-component',
  imports: [
    PostComponent,
    NgForOf,
    MatButton,
    MatIcon,
    NgIf,
    CommentComponent,
  ],
  templateUrl: './posts-component.html',
  styleUrl: './posts-component.scss',
})
export class PostsComponent {
  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';

  public isCommentsExpanded: boolean = false;

  constructor(private dialog: MatDialog) {
  }

  @Input() posts: PostDto[] = [];
  @Input() isCreateButtonEnabled: boolean = true;
  @Output() postCreated = new EventEmitter<PostDto>();

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
          this.postCreated.emit(res.body);
          console.log('Пост создан:', res);
        }
      },
      error: (error) => {
        console.error('Ошибка создания поста:', error);
      }
    })
  }

  public onPostDeleted(postId:string){
    this.posts = this.posts.filter(post => post.id !== postId);
  }
}
