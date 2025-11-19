import {Component, inject, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-posts-component',
  imports: [
    PostComponent,
    NgForOf,
    MatButton,
    MatIcon,
  ],
  templateUrl: './posts-component.html',
  styleUrl: './posts-component.scss',
})
export class PostsComponent implements OnInit {
  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';

  public isCommentsExpanded: boolean = false;
  public posts: PostDto[] = [];

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    if(this.posts.length === 0){
      postsGet(this.http,this.rootUrl)
        .subscribe(res => {
          this.posts = res.body;
        })
    }
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
          postsPost(this.http,this.rootUrl,{
            body: {
              bodyHtml: res.bodyHtml,
              title: res.title
            }
          }).subscribe({
            next: (createdPost) => {
              console.log('Пост создан:', createdPost);
            },
            error: (error) => {
              console.error('Ошибка создания поста:', error);
            }
          })
        }
      })
  }
}
