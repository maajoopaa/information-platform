import {Component, inject, Input} from '@angular/core';
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

@Component({
  selector: 'app-post-component',
  imports: [
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatIcon,
    MatMenu,
    MatIconButton,
    MatMenuItem,
    MatCardActions,
    MatButton,
    NgIf,
    CommentComponent,
    NgForOf,
    FormsModule
  ],
  templateUrl: './post-component.html',
  styleUrl: './post-component.scss',
})
export class PostComponent {
  private http = inject(HttpClient);
  private rootUrl = 'https://localhost:7053';

  public isCommentsExpanded: boolean = false;
  public newCommentText: string = '';

  @Input() post: PostDto | null = null;

  public onCommentsButtonClick(){
    this.isCommentsExpanded = !this.isCommentsExpanded;
  }

  public onSubmitCommentClick(){
    commentsPost(this.http,this.rootUrl,{
      body: {
        postId: this.post?.id,
        text: this.newCommentText
      }
    }).subscribe(res => {
      console.log(res);
    })
  }
}
